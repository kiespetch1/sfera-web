"use client"

import { useSession } from "next-auth/react"
import Header from "@/features/home/components/Header"
import HeroSection from "@/features/home/sections/HeroSection"
import { HowItWorksSection } from "@/features/home/sections/HowItWorksSection"
import { BackgroundEllipses } from "@/features/home/components/BackgroundEllipses"
import { WhySferaSection } from "@/features/home/sections/WhySferaSection"
import { FaqSection } from "@/features/home/sections/FaqSection"
import { Footer } from "@/features/home/components/Footer"

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
    <div className="bg-darkblue relative min-h-screen overflow-hidden">
      <BackgroundEllipses />
      <Header />
      <HeroSection onGetChart={handleGetChart} />
      <HowItWorksSection />
      <WhySferaSection />
      <FaqSection />
      <Footer />
    </div>
  )
}
