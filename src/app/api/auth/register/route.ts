import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, password } = body

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Все поля обязательны для заполнения" }, { status: 400 })
    }

    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return NextResponse.json(
        { error: "Пользователь с таким email уже существует" },
        { status: 400 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({ data: { name, email, password: hashedPassword } })

    return NextResponse.json({ message: "Пользователь успешно зарегистрирован", userId: user.id })
  } catch (error: unknown) {
    console.error("Ошибка регистрации:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Ошибка регистрации" },
      { status: 500 }
    )
  }
}
