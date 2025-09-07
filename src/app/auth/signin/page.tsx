"use client"

import { signIn } from "next-auth/react"
import { useState } from "react"
import SferaGlobe from "@/assets/globe.svg"

export default function SignInPage() {
  const [isLoading, setIsLoading] = useState<{ yandex: boolean; vk: boolean }>({
    yandex: false,
    vk: false,
  })

  const handleSignIn = async (provider: "yandex" | "vk") => {
    setIsLoading(prev => ({ ...prev, [provider]: true }))
    try {
      await signIn(provider, { callbackUrl: "/profile" })
    } catch (error) {
      console.error("Sign in error:", error)
      setIsLoading(prev => ({ ...prev, [provider]: false }))
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gray-50">
      {/* Background SVG */}
      <div className="pointer-events-none absolute inset-0">
        <SferaGlobe
          className="absolute left-1/2 top-1/2 h-auto w-[150vw] -translate-x-1/2 opacity-5"
          style={{ aspectRatio: "1/1" }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="rounded-3xl bg-white p-8 shadow-xl">
            {/* Logo and Title */}
            <div className="mb-8 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center">
                <SferaGlobe className="h-16 w-16 text-darkblue" />
              </div>
              <h1 className="text-3xl font-bold text-darkblue">SFERA</h1>
              <p className="mt-2 text-gray-600">Войдите в свой аккаунт</p>
            </div>

            {/* OAuth Buttons */}
            <div className="space-y-3">
              <button
                onClick={() => handleSignIn("yandex")}
                disabled={isLoading.yandex || isLoading.vk}
                className="group relative w-full overflow-hidden rounded-2xl border border-darkblue bg-white px-4 py-3 font-medium text-darkblue transition-all hover:bg-darkblue hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                <div className="flex items-center justify-center gap-3">
                  {isLoading.yandex ? (
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-darkblue border-t-transparent" />
                  ) : (
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 15.403h-1.97V9.376c0-1.853-.677-2.778-2.032-2.778-.636 0-1.139.212-1.51.636-.37.424-.556 1.017-.556 1.778v6.39h-1.97V7.806h1.875v1.13h.032c.265-.445.636-.792 1.113-1.04a3.49 3.49 0 011.526-.37c2.238 0 3.492 1.343 3.492 4.029v3.848z"/>
                    </svg>
                  )}
                  <span>Войти через Яндекс ID</span>
                </div>
              </button>

              <button
                onClick={() => handleSignIn("vk")}
                disabled={isLoading.yandex || isLoading.vk}
                className="group relative w-full overflow-hidden rounded-2xl border border-darkblue bg-white px-4 py-3 font-medium text-darkblue transition-all hover:bg-darkblue hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                <div className="flex items-center justify-center gap-3">
                  {isLoading.vk ? (
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-darkblue border-t-transparent" />
                  ) : (
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12.785 16.241s.288-.032.436-.194c.136-.148.132-.426.132-.426s-.02-1.304.576-1.496c.588-.19 1.341 1.26 2.14 1.818.605.422 1.064.33 1.064.33l2.137-.03s1.117-.071.587-.964c-.043-.073-.308-.661-1.588-1.87-1.34-1.264-1.16-1.059.453-3.246.983-1.332 1.376-2.145 1.253-2.493-.117-.332-.84-.244-.84-.244l-2.406.015s-.178-.025-.31.056c-.13.079-.212.262-.212.262s-.382 1.03-.89 1.907c-1.07 1.85-1.499 1.948-1.674 1.832-.407-.267-.305-1.075-.305-1.648 0-1.793.267-2.54-.521-2.733-.262-.065-.454-.107-1.123-.114-.858-.009-1.585.003-1.996.208-.274.136-.485.44-.356.457.159.022.519.099.71.363.246.341.237 1.107.237 1.107s.142 2.11-.33 2.371c-.325.18-.77-.187-1.725-1.865-.489-.859-.859-1.81-.859-1.81s-.07-.176-.198-.272c-.154-.115-.37-.151-.37-.151l-2.286.015s-.343.01-.469.161c-.112.135-.009.414-.009.414s1.792 4.257 3.817 6.403c1.858 1.967 3.968 1.839 3.968 1.839h.957z"/>
                    </svg>
                  )}
                  <span>Войти через VK ID</span>
                </div>
              </button>
            </div>

            {/* Terms */}
            <p className="mt-6 text-center text-xs text-gray-500">
              Продолжая, вы соглашаетесь с{" "}
              <a href="#" className="text-darkblue hover:underline">
                Условиями использования
              </a>{" "}
              и{" "}
              <a href="#" className="text-darkblue hover:underline">
                Политикой конфиденциальности
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}