"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useSearchParams } from "next/navigation"

interface SignInResponse {
  error?: string
  ok?: boolean
  status?: number
  url?: string
}

function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

interface SignInFormProps {
  onSuccess: (callbackUrl: string) => void
}

export default function SignInForm({ onSuccess }: SignInFormProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/"

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)

    if (!email.trim()) {
      setError('Поле "Эл. почта" обязательно.')
      return
    }
    if (!password) {
      setError('Поле "Пароль" обязательно.')
      return
    }
    if (!validateEmail(email)) {
      setError("Invalid email format")
      return
    }

    try {
      const result = (await signIn("credentials", {
        redirect: false,
        username: email,
        password,
        callbackUrl,
      })) as SignInResponse

      if (result.error) {
        setError(result.error)
      } else if (result.ok) {
        onSuccess(callbackUrl)
      } else {
        setError("Unknown error occurred")
      }
    } catch (err: unknown) {
      console.error("Exception during signIn:", err)
      setError("An error occurred during sign in")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card bg-base-200 max-w-s w-full p-6 shadow-md">
      <h2 className="mb-4 text-center text-2xl font-bold">Авторизация</h2>
      {error && <div className="mb-4 text-center text-red-500">{error}</div>}

      <div className="mb-4">
        <label htmlFor="email" className="label">
          Эл. почта
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="input input-bordered w-full"
          placeholder="email@example.com"
          required
        />
      </div>

      <div className="mb-4">
        <label htmlFor="password" className="label">
          Пароль
        </label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="input input-bordered w-full"
          required
        />
      </div>

      <button type="submit" className="btn btn-primary w-full">
        Войти
      </button>
    </form>
  )
}
