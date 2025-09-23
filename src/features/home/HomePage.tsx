"use client"

import { useSession } from "next-auth/react"
import Header from "@/features/home/components/Header"
import HeroSection from "@/features/home/sections/HeroSection"
import { HowItWorksSection } from "@/features/home/sections/HowItWorksSection"
import { BackgroundEllipses } from "@/features/home/components/BackgroundEllipses"

export const HomePage = () => {
  const { data: session } = useSession()

  const handleGetChart = () => {
    if (session?.user) {
      window.location.href = "/chart/create"
    } else {
      window.location.href = "/auth/signin"
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-darkblue">
      <BackgroundEllipses />
      <Header />
      <HeroSection onGetChart={handleGetChart} />
      <HowItWorksSection />
    </div>
  )
}
