"use client"

import { useEffect, useState } from "react"

export const BackgroundEllipses = () => {
  const [heroPosition, setHeroPosition] = useState({ top: 0, left: 0 })
  const [worksPosition, setWorksPosition] = useState({ top: 0, left: 0 })

  useEffect(() => {
    const updatePositions = () => {
      // Находим HeroSection
      const heroSection = document.querySelector('[data-section="hero"]') as HTMLElement
      if (heroSection) {
        setHeroPosition({
          top: heroSection.offsetTop - 645,
          left: -1400
        })
      }

      // Находим HowItWorksSection
      const worksSection = document.querySelector('[data-section="works"]') as HTMLElement
      if (worksSection) {
        setWorksPosition({
          top: worksSection.offsetTop + worksSection.offsetHeight / 2 - 1044, // центрируем вертикально
          left: window.innerWidth - 688, // позиционируем справа
        })
      }
    }

    // Обновляем позиции при загрузке и изменении размера окна
    updatePositions()
    window.addEventListener("resize", updatePositions)

    return () => {
      window.removeEventListener("resize", updatePositions)
    }
  }, [])

  return (
    <>
      {/* Эллипс для HeroSection */}
      <div
        className="pointer-events-none absolute z-0"
        style={{
          width: "2088px",
          height: "2088px",
          top: `${heroPosition.top}px`,
          left: `${heroPosition.left}px`,
          background:
            "radial-gradient(50% 50% at 50% 50%, rgba(154, 110, 255, 0.16) 0%, rgba(12, 6, 32, 0) 100%)",
        }}
      />

      {/* Эллипс для HowItWorksSection */}
      <div
        className="pointer-events-none absolute z-0"
        style={{
          width: "2088px",
          height: "2088px",
          top: `${worksPosition.top}px`,
          left: `${worksPosition.left}px`,
          background:
            "radial-gradient(50% 50% at 50% 50%, rgba(154, 110, 255, 0.12) 0%, rgba(12, 6, 32, 0) 100%)",
        }}
      />
    </>
  )
}
