import type { NextAuthConfig } from "next-auth"
import type { Provider } from "next-auth/providers"
import type { TokenSet } from "@auth/core/types"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "../prisma"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { z } from "zod"
import CryptoJS from "crypto-js"

interface VkUserInfoRequest {
  tokens: TokenSet
  provider: Provider
}

// PKCE helpers for VK ID
function generateCodeVerifier(): string {
  return CryptoJS.lib.WordArray.random(32).toString(CryptoJS.enc.Base64url)
}

function generateCodeChallenge(codeVerifier: string): string {
  return CryptoJS.SHA256(codeVerifier).toString(CryptoJS.enc.Base64url)
}

function generateDeviceId(): string {
  return CryptoJS.lib.WordArray.random(16).toString(CryptoJS.enc.Hex)
}

const YandexProvider: Provider = {
  id: "yandex",
  name: "Yandex",
  type: "oauth",
  clientId: process.env.AUTH_YANDEX_ID!,
  clientSecret: process.env.AUTH_YANDEX_SECRET!,
  authorization: {
    url: "https://oauth.yandex.ru/authorize",
    params: { scope: "login:email login:info", response_type: "code" },
  },
  token: "https://oauth.yandex.ru/token",
  userinfo: "https://login.yandex.ru/info?format=json",
  client: { token_endpoint_auth_method: "client_secret_post" },
  profile(profile) {
    return {
      id: profile.id,
      name: profile.real_name || profile.display_name || profile.login,
      email: profile.default_email || profile.emails?.[0],
      image: profile.default_avatar_id
        ? `https://avatars.yandex.net/get-yapic/${profile.default_avatar_id}/islands-200`
        : undefined,
    }
  },
}

const VKIDProvider: Provider = {
  id: "vkid",
  name: "VK ID",
  type: "oauth",
  clientId: process.env.AUTH_VKID_CLIENT_ID!,
  clientSecret: process.env.AUTH_VKID_CLIENT_SECRET,
  authorization: {
    url: "https://id.vk.com/authorize",
    params: {
      scope: "phone email",
      response_type: "code",
      code_challenge_method: "S256",
    },
  },
  token: {
    url: "https://id.vk.com/oauth2/auth",
    async request({ params, provider, checks }) {
      const body = new URLSearchParams({
        grant_type: "authorization_code",
        code: params.code!,
        redirect_uri: params.redirect_uri!,
        client_id: provider.clientId!,
        code_verifier: checks?.code_verifier || "",
        device_id: generateDeviceId(),
        state: params.state || "",
      })

      const response = await fetch("https://id.vk.com/oauth2/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(`VK ID token exchange failed: ${error.error_description || error.error}`)
      }

      const tokens = await response.json()
      return tokens
    },
  },
  userinfo: {
    url: "https://id.vk.com/oauth2/user_info",
    async request({ tokens }: VkUserInfoRequest) {
      const response = await fetch("https://id.vk.com/oauth2/user_info", {
        headers: {
          Authorization: `Bearer ${tokens.access_token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch VK ID user info")
      }

      const user = await response.json()
      return user.user
    },
  },
  profile(profile) {
    return {
      id: String(profile.user_id),
      name: `${profile.first_name} ${profile.last_name}`.trim(),
      email: profile.email || profile.phone || `${profile.user_id}@vk.id`,
      image: profile.avatar || null,
    }
  },
  checks: ["pkce", "state"],
  options: {
    clientAssertionType: undefined,
    pkce: {
      code_challenge_method: "S256",
    },
  },
}

const credentialsProvider = Credentials({
  name: "credentials",
  credentials: {
    email: { label: "Email", type: "email" },
    password: { label: "Password", type: "password" },
  },
  async authorize(credentials) {
    const parsedCredentials = z
      .object({ email: z.string().email(), password: z.string().min(6) })
      .safeParse(credentials)

    if (!parsedCredentials.success) return null

    const { email, password } = parsedCredentials.data

    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user || !user.password) return null

    const passwordMatch = await bcrypt.compare(password, user.password)

    if (!passwordMatch) return null

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      image: user.image,
    }
  },
})

const registerProvider = Credentials({
  id: "register",
  name: "register",
  credentials: {
    email: { label: "Email", type: "email" },
    password: { label: "Password", type: "password" },
    name: { label: "Name", type: "text" },
  },
  async authorize(credentials) {
    const parsedCredentials = z
      .object({ 
        email: z.string().email(), 
        password: z.string().min(6),
        name: z.string().min(2).optional()
      })
      .safeParse(credentials)

    if (!parsedCredentials.success) return null

    const { email, password, name } = parsedCredentials.data

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      throw new Error("Пользователь с таким email уже существует")
    }

    // Create new user
    const hashedPassword = await bcrypt.hash(password, 10)
    
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name || null,
      }
    })

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      image: user.image,
    }
  },
})

export const authConfig: NextAuthConfig = {
  adapter: PrismaAdapter(prisma),
  providers: [credentialsProvider, registerProvider, YandexProvider, VKIDProvider],
  pages: { signIn: "/auth/signin", error: "/auth/error" },
  callbacks: {
    authorized({ auth }) {
      return !!auth?.user
    },
    jwt({ token, user, account }) {
      if (user) {
        token.id = user.id
        token.provider = account?.provider
        token.email = user.email
        token.name = user.name
      }
      return token
    },
    session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.id as string
        session.user.provider = token.provider as string
        session.user.email = token.email as string
        session.user.name = token.name as string
      }
      return session
    },
  },
  session: {
    strategy: "jwt",  // Changed from "database" to "jwt" for better compatibility with credentials provider
    maxAge: 30 * 24 * 60 * 60, // 30 дней
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 дней
  },
}
