import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const registerSchema = z.object({
  email: z.email("Некорректный email"),
  password: z.string().min(6, "Пароль должен быть не менее 6 символов"),
  name: z.string().min(2, "Имя должно быть не менее 2 символов").optional(),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const validation = registerSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json({ error: validation.error.issues[0].message }, { status: 400 })
    }

    const { email, password, name } = validation.data

    const existingUser = await prisma.user.findUnique({ where: { email } })

    if (existingUser) {
      return NextResponse.json(
        { error: "Пользователь с таким email уже существует" },
        { status: 409 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({ data: { email, password: hashedPassword, name } })

    return NextResponse.json(
      { message: "Регистрация успешна", user: { id: user.id, email: user.email, name: user.name } },
      { status: 201 }
    )
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Ошибка при регистрации" }, { status: 500 })
  }
}
