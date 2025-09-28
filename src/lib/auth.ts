import { PrismaAdapter } from "@next-auth/prisma-adapter"
import CredentialsProvider from "next-auth/providers/credentials"
import prisma from "@/lib/prisma"
import { compare } from "bcryptjs"
import type { User as PrismaUser } from "@prisma/client"
import type { NextAuthOptions } from "next-auth"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),

  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Email", type: "text", placeholder: "your-email@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          throw new Error("Email and password are required")
        }

        const user = await prisma.user.findUnique({ where: { email: credentials.username } })

        const prismaUser = user as PrismaUser | null
        if (!prismaUser || !prismaUser.password) {
          throw new Error("No user found with the given email")
        }

        const isValid = await compare(credentials.password, prismaUser.password)
        if (!isValid) {
          throw new Error("Incorrect password")
        }

        return prismaUser
      },
    }),
  ],

  secret: process.env.NEXT_AUTH_SECRET,
  pages: { signIn: "/auth/signin" },
  session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 },
  debug: true,
}

import { getServerSession } from "next-auth"

export async function auth() {
  return await getServerSession(authOptions)
}
