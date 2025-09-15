"use client"

import { useEffect } from "react"
import { useSession } from "next-auth/react"
import Header from "@/components/layout/Header"
import HeroSection from "@/components/sections/HeroSection"
import { HowItWorksSection } from "@/components/sections/HowItWorksSection"
import { BackgroundEllipses } from "@/components/layout/BackgroundEllipses"

export default function HomePage() {
  const { data: session } = useSession()

  useEffect(() => {
    // Добавляем класс homepage к body при монтировании
    document.body.classList.add('homepage')

    // Убираем класс при размонтировании
    return () => {
      document.body.classList.remove('homepage')
    }
  }, [])

  const handleGetChart = () => {
    if (session?.user) {
      // Пользователь авторизован - переходим к созданию карты
      window.location.href = "/chart/create"
    } else {
      // Пользователь не авторизован - переходим к авторизации
      window.location.href = "/auth/signin"
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <BackgroundEllipses />
      <Header />
      <HeroSection onGetChart={handleGetChart} />
      <HowItWorksSection />
    </div>
  )
}
