import type { NextAuthConfig } from "next-auth"
import type { Provider } from "next-auth/providers"
import type { TokenSet } from "@auth/core/types"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "../prisma"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { z } from "zod"

interface VkUserInfoRequest {
  tokens: TokenSet
  provider: Provider
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

const VKProvider: Provider = {
  id: "vk",
  name: "VKontakte",
  type: "oauth",
  clientId: process.env.AUTH_VK_ID!,
  clientSecret: process.env.AUTH_VK_SECRET!,
  authorization: {
    url: "https://oauth.vk.com/authorize",
    params: { scope: "email", display: "page", v: "5.131" },
  },
  token: "https://oauth.vk.com/access_token",
  userinfo: {
    url: "https://api.vk.com/method/users.get",
    async request({ tokens }: VkUserInfoRequest) {
      const response = await fetch(
        `https://api.vk.com/method/users.get?fields=photo_200,email&access_token=${tokens.access_token}&v=5.131`
      )
      const data = await response.json()
      return data.response[0]
    },
  },
  profile(profile) {
    return {
      id: String(profile.id),
      name: `${profile.first_name} ${profile.last_name}`,
      email: profile.email || `${profile.id}@vk.local`, // VK не всегда возвращает email
      image: profile.photo_200,
    }
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

export const authConfig: NextAuthConfig = {
  adapter: PrismaAdapter(prisma),
  providers: [credentialsProvider, YandexProvider, VKProvider],
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
