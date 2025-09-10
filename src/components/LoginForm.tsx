"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { useForm } from "@tanstack/react-form"
import SferaGlobe from "@/assets/globe.svg"
import Input from "@/components/ui/Input"
import Button from "@/components/ui/Button"
import OAuthButton from "@/components/ui/OAuthButton"

type FormData = { name: string; email: string; password: string; confirmPassword: string }

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [isRegistering, setIsRegistering] = useState(false)
  const [serverError, setServerError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const router = useRouter()

  const form = useForm({
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
    onSubmit: async ({ value }) => {
      setIsLoading(true)
      setServerError("")
      setSuccessMessage("")

      if (isRegistering) {
        await handleRegister(value)
      } else {
        await handleLogin(value)
      }

      setIsLoading(false)
    },
  })

  const handleLogin = async (data: FormData) => {
    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      })

      if (result?.error) {
        setServerError("Неверный email или пароль")
      } else if (result?.ok) {
        // Refresh the router to get the new session
        router.refresh()
        // Then redirect to profile
        router.push("/profile")
      }
    } catch {
      setServerError("Произошла ошибка при входе")
    }
  }

  const handleRegister = async (data: FormData) => {
    if (data.password !== data.confirmPassword) {
      setServerError("Пароли не совпадают")
      return
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email, password: data.password, name: data.name }),
      })

      const responseData = await response.json()

      if (!response.ok) {
        setServerError(responseData.error || "Ошибка при регистрации")
      } else {
        setSuccessMessage("Регистрация успешна! Входим в систему...")
        
        // Automatically log in after successful registration
        const loginResult = await signIn("credentials", {
          email: data.email,
          password: data.password,
          redirect: false,
        })
        
        if (loginResult?.ok) {
          router.refresh()
          router.push("/profile")
        } else {
          setIsRegistering(false)
          form.reset()
          setSuccessMessage("Регистрация успешна! Теперь вы можете войти.")
        }
      }
    } catch {
      setServerError("Произошла ошибка при регистрации")
    }
  }

  const handleYandexLogin = async () => {
    setIsLoading(true)
    await signIn("yandex", { callbackUrl: "/profile" })
  }

  const handleVKLogin = async () => {
    setIsLoading(true)
    await signIn("vk", { callbackUrl: "/profile" })
  }

  const switchMode = () => {
    setIsRegistering(!isRegistering)
    setServerError("")
    setSuccessMessage("")
    form.reset()
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 relative overflow-hidden">
      {/* Background Globe - Top Left Quadrant */}
      <div className="pointer-events-none absolute inset-0">
        <SferaGlobe
          className="opacity-2 absolute h-auto w-[800px] max-w-[75vw]"
          style={{ 
            aspectRatio: "1/1",
            top: "-33%",
            left: "-20%"
          }}
        />
      </div>

      {/* Background Globe - Bottom Right Quadrant */}
      <div className="pointer-events-none absolute inset-0">
        <SferaGlobe
          className="opacity-2 absolute h-auto w-[800px] max-w-[75vw]"
          style={{ 
            aspectRatio: "1/1",
            bottom: "-33%",
            right: "-20%"
          }}
        />
      </div>

      <div className="absolute left-8 top-8 z-10">
        <div className="flex items-center">
          <div className="text-darkblue flex items-center gap-2 text-3xl font-semibold">
            <SferaGlobe className="h-8 w-8" />
            SFERA
          </div>
        </div>
      </div>

      <div className="flex min-h-screen items-center justify-center relative z-10">
        <div className="w-full max-w-md space-y-8 p-8">
          <div className="mb-8 text-center">
            <h2 className="text-4xl font-medium text-gray-900">
              {isRegistering ? "Регистрация" : "Вход в профиль"}
            </h2>
          </div>

          {/* Form */}
          <form
            onSubmit={e => {
              e.preventDefault()
              e.stopPropagation()
              void form.handleSubmit()
            }}>
            {isRegistering && (
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
            )}

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

            {/* Confirm Password Input (only for registration) */}
            {isRegistering && (
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
                    error={fieldApi.state.meta.errors?.join(", ")}
                  />
                )}
              </form.Field>
            )}

            {/* Error/Success messages */}
            {serverError && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                {serverError}
              </div>
            )}
            {successMessage && (
              <div className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-600">
                {successMessage}
              </div>
            )}

            {/* Forgot Password Link */}
            {!isRegistering && (
              <div className="text-left">
                <Button type="button" variant="link" className="mb-10 mt-3">
                  Восстановить пароль
                </Button>
              </div>
            )}

            {/* Submit Button */}
            <form.Subscribe selector={state => [state.canSubmit, state.isSubmitting]}>
              {([canSubmit]) => (
                <Button type="submit" fullWidth disabled={!canSubmit || isLoading} className="m-0">
                  {isLoading ? "Загрузка..." : isRegistering ? "Зарегистрироваться" : "Войти"}
                </Button>
              )}
            </form.Subscribe>

            {!isRegistering && (
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-gray-50 px-4 text-gray-500">или</span>
                </div>
              </div>
            )}

            {!isRegistering && (
              <div className="space-y-3">
                {/* Yandex Login */}
                <OAuthButton provider="yandex" onClick={handleYandexLogin} disabled={isLoading}>
                  Войти с Яндекс ID
                </OAuthButton>

                {/* VK Login */}
                <OAuthButton provider="vk" onClick={handleVKLogin} disabled={isLoading}>
                  <span className="mr-1">ID</span>
                  <span>Войти через VK ID</span>
                </OAuthButton>
              </div>
            )}

            {/* Support Text */}
            <div className="mt-6 text-center text-sm text-gray-600">
              Если вы ошиблись адресом почты при регистрации - обратитесь в{" "}
              <Button
                variant="link"
                onClick={() => window.open("https://t.me/sferasupp_bot", "_blank")}
                type="button">
                поддержку
              </Button>
            </div>

            {/* Registration/Login Link */}
            <div className="mt-4 text-center">
              <span className="text-sm text-gray-600">
                {isRegistering ? "Уже есть аккаунт? " : "Еще нет аккаунта? "}
              </span>
              <Button type="button" onClick={switchMode} variant="link" className="font-bold">
                {isRegistering ? "Войти" : "Зарегистрироваться"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
