"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { useForm } from "@tanstack/react-form"
import Input from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"


interface RegisterFormProps {
  onSwitchToLogin: () => void
}

export default function RegisterForm({ onSwitchToLogin }: RegisterFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [serverError, setServerError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const router = useRouter()

  const form = useForm({
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
    onSubmit: async ({ value }) => {
      setIsLoading(true)
      setServerError("")
      setSuccessMessage("")

      if (value.password !== value.confirmPassword) {
        setServerError("Пароли не совпадают")
        setIsLoading(false)
        return
      }

      try {
        // Register via API endpoint
        const registerResponse = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: value.name,
            email: value.email,
            password: value.password
          }),
        });

        const registerData = await registerResponse.json();

        if (!registerResponse.ok) {
          setServerError(registerData.error || "Ошибка при регистрации");
          return;
        }

        // After successful registration, sign in automatically
        const signInResult = await signIn("credentials", {
          username: value.email,
          password: value.password,
          redirect: false,
        });

        if (signInResult?.error) {
          setServerError("Регистрация успешна, но не удалось автоматически войти в систему");
        } else if (signInResult?.ok) {
          setSuccessMessage("Регистрация успешна! Входим в систему...");
          router.refresh();
          router.push("/profile");
        } else {
          setServerError("Ошибка при входе в систему");
        }
      } catch {
        setServerError("Произошла ошибка при регистрации")
      } finally {
        setIsLoading(false)
      }
    },
  })

  return (
    <div className="w-full max-w-md space-y-8">
      <div className="mb-8 text-center">
        <h2 className="text-4xl font-medium text-gray-900">Регистрация</h2>
      </div>

      <form
        onSubmit={e => {
          e.preventDefault()
          e.stopPropagation()
          void form.handleSubmit()
        }}>
        <form.Field
          name="name"
          validators={{
            onChange: ({ value }) =>
              value.length < 2 ? "Имя должно быть не менее 2 символов" : undefined,
          }}>
          {fieldApi => (
            <Input
              type="text"
              value={fieldApi.state.value}
              onBlur={fieldApi.handleBlur}
              onChange={e => fieldApi.handleChange(e.target.value)}
              placeholder="Ваше имя"
              error={fieldApi.state.meta.errors?.join(", ")}
            />
          )}
        </form.Field>

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
              className="mt-3"
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

        <form.Field
          name="confirmPassword"
          validators={{
            onChange: ({ value, fieldApi }) => {
              const password = fieldApi.form.getFieldValue("password")
              if (value !== password) return "Пароли не совпадают"
              return undefined
            },
          }}>
          {fieldApi => (
            <Input
              type="password"
              value={fieldApi.state.value}
              onBlur={fieldApi.handleBlur}
              onChange={e => fieldApi.handleChange(e.target.value)}
              placeholder="Подтвердите пароль"
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

        {successMessage && (
          <div className="mt-4 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-600">
            {successMessage}
          </div>
        )}

        <form.Subscribe selector={state => [state.canSubmit, state.isSubmitting]}>
          {([canSubmit]) => (
            <Button type="submit" fullWidth disabled={!canSubmit || isLoading} className="mt-6">
              {isLoading ? "Загрузка..." : "Зарегистрироваться"}
            </Button>
          )}
        </form.Subscribe>

        <div className="mt-6 text-center text-sm text-gray-600">
          Если вы ошиблись адресом почты при регистрации - обратитесь в{" "}
          <Button
            variant="link"
            onClick={() => window.open("https://t.me/sferasupp_bot", "_blank")}
            type="button">
            поддержку
          </Button>
        </div>

        <div className="mt-4 text-center">
          <span className="text-sm text-gray-600">Уже есть аккаунт? </span>
          <Button type="button" onClick={onSwitchToLogin} variant="link" className="font-bold">
            Войти
          </Button>
        </div>
      </form>
    </div>
  )
}
