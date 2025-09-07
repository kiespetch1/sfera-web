import type { NextAuthConfig } from "next-auth"
import type { Provider } from "next-auth/providers"
import type { TokenSet } from "@auth/core/types"

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

export const authConfig: NextAuthConfig = {
  providers: [YandexProvider, VKProvider],
  pages: { signIn: "/auth/signin", error: "/auth/error" },
  callbacks: {
    authorized({ auth }) {
      return !!auth?.user
    },
    jwt({ token, user, account }) {
      if (user) {
        token.id = user.id
        token.provider = account?.provider
      }
      return token
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.provider = token.provider as string
      }
      return session
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 дней
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 дней
  },
}
