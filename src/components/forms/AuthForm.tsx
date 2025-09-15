"use client"

import React, { useState } from "react"
import SferaGlobe from "@/assets/globe.svg"
import LoginForm from "@/components/forms/LoginForm"
import RegisterForm from "@/components/forms/RegisterForm"

export default function AuthForm() {
  const [isRegistering, setIsRegistering] = useState(false)

  return (
    <div className="relative min-h-screen overflow-hidden bg-gray-50 px-4">
      <div className="pointer-events-none absolute inset-0">
        <SferaGlobe
          className="opacity-2 absolute h-auto w-[800px] max-w-[75vw]"
          style={{ aspectRatio: "1/1", top: "-33%", left: "-20%" }}
        />
      </div>

      <div className="pointer-events-none absolute inset-0">
        <SferaGlobe
          className="opacity-2 absolute h-auto w-[800px] max-w-[75vw]"
          style={{ aspectRatio: "1/1", bottom: "-33%", right: "-20%" }}
        />
      </div>

      {/* Logo */}
      <div className="absolute left-8 top-8 z-10">
        <div className="flex items-center">
          <div className="text-darkblue flex items-center gap-2 text-3xl font-semibold">
            <SferaGlobe className="h-8 w-8" />
            SFERA
          </div>
        </div>
      </div>

      <div className="relative z-10 flex min-h-screen items-center justify-center">
        <div className="w-full max-w-md p-8">
          {isRegistering ? (
            <RegisterForm onSwitchToLogin={() => setIsRegistering(false)} />
          ) : (
            <LoginForm onSwitchToRegister={() => setIsRegistering(true)} />
          )}
        </div>
      </div>
    </div>
  )
}
