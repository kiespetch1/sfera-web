"use client"

import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/Button"

interface HeroSectionProps {
  onGetChart?: () => void
}

export default function HeroSection({ onGetChart }: HeroSectionProps) {
  const handleGetChart = () => {
    if (onGetChart) {
      onGetChart()
    } else {
      window.location.href = "/auth/signin"
    }
  }

  return (
    <main
      data-section="hero"
      className="relative mb-24 flex min-h-[80vh] flex-col items-center justify-center space-y-6 text-center">
      <div>
        <h1 className="relative z-10 mb-2 text-4xl font-semibold text-white md:text-6xl">
          Открой свою натальную
        </h1>
        <h1 className="relative z-10 mb-12 text-4xl font-semibold text-white md:text-6xl">
          карту за 1₽
        </h1>
      </div>

      {/* Кнопка получить карту */}
      <Button
        onClick={handleGetChart}
        size="3xl-wide"
        className="text-mainblue relative z-10 flex transform items-center space-x-2 rounded-full border-0 px-12 py-4 text-xl font-light transition-all hover:scale-105 hover:shadow-lg hover:shadow-yellow-500/20"
        style={{ background: "radial-gradient(circle, #FFF2D7 0%, #FFDC8F 50%, #FFD16E 100%)" }}>
        <span>Получить карту</span>
        <ArrowRight className="h-5 w-5" />
      </Button>

      {/* Подзаголовок */}
      <p className="relative z-10 mt-16 max-w-2xl text-2xl/9 text-white">
        Глубокое самопознание через космос. Построй свою натальную карту и получай прогнозы каждый
        день.
      </p>
    </main>
  )
}
