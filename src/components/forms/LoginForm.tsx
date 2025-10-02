"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { useForm } from "@tanstack/react-form"
import Input from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"

interface LoginFormProps {
  onSwitchToRegister: () => void
}

export default function LoginForm({ onSwitchToRegister }: LoginFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [serverError, setServerError] = useState("")
  const router = useRouter()

  const form = useForm({
    defaultValues: { email: "", password: "" },
    onSubmit: async ({ value }) => {
      setIsLoading(true)
      setServerError("")

      try {
        const result = await signIn("credentials", {
          username: value.email,
          password: value.password,
          redirect: false,
        })

        if (result?.error) {
          setServerError("Неверная эл. почта или пароль")
        } else if (result?.ok) {
          router.refresh()
          router.push("/profile")
        }
      } catch {
        setServerError("Произошла ошибка при входе")
      } finally {
        setIsLoading(false)
      }
    },
  })

  return (
    <div className="w-full max-w-md space-y-8">
      <div className="mb-8 text-center">
        <h2 className="text-4xl font-medium text-gray-900">Вход в профиль</h2>
      </div>

      <form
        onSubmit={e => {
          e.preventDefault()
          e.stopPropagation()
          void form.handleSubmit()
        }}>
        <form.Field
          name="email"
          validators={{
            onChange: ({ value }) => {
              if (!value) return "Электронная почта обязательна для заполнения"
              if (!value.includes("@")) return "Некорректная почта"
              return undefined
            },
          }}>
          {fieldApi => (
            <Input
              type="email"
              value={fieldApi.state.value}
              onBlur={fieldApi.handleBlur}
              onChange={e => fieldApi.handleChange(e.target.value)}
              placeholder="Ваша электронная почта"
              error={fieldApi.state.meta.errors?.join(", ")}
            />
          )}
        </form.Field>

        <form.Field
          name="password"
          validators={{
            onChange: ({ value }) =>
              value.length < 6 ? "Пароль должен быть не менее 6 символов" : undefined,
          }}>
          {fieldApi => (
            <Input
              type="password"
              value={fieldApi.state.value}
              onBlur={fieldApi.handleBlur}
              onChange={e => fieldApi.handleChange(e.target.value)}
              placeholder="Ваш пароль"
              className="mt-3"
              error={fieldApi.state.meta.errors?.join(", ")}
            />
          )}
        </form.Field>

        {serverError && (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
            {serverError}
          </div>
        )}

        <div className="text-left">
          <Button type="button" variant="link" size="text" className="mb-10 mt-3">
            Восстановить пароль
          </Button>
        </div>

        <form.Subscribe selector={state => [state.canSubmit, state.isSubmitting]}>
          {([canSubmit]) => (
            <Button
              variant="default"
              type="submit"
              size="2xl"
              fullWidth
              bold
              disabled={!canSubmit || isLoading}
              className="m-0">
              {isLoading ? "..." : "Войти"}
            </Button>
          )}
        </form.Subscribe>

        <div className="mt-6 text-center text-sm text-gray-600">
          Если вы ошиблись адресом почты при регистрации - обратитесь в{" "}
          <Button
            variant="link"
            size="text"
            onClick={() => window.open("https://t.me/sferasupp_bot", "_blank")}
            type="button">
            поддержку
          </Button>
        </div>

        <div className="mt-4 text-center">
          <span className="text-sm text-gray-600">Еще нет аккаунта? </span>
          <Button
            type="button"
            onClick={onSwitchToRegister}
            variant="link"
            size="text"
            className="font-bold">
            Зарегистрироваться
          </Button>
        </div>
      </form>
    </div>
  )
}
