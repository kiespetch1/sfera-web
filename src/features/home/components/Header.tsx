"use client"

import { useState } from "react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/Button"
import { User, Menu, X } from "lucide-react"
import SferaGlobe from "@/assets/globe.svg"

export default function Header() {
  const { data: session } = useSession()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleAuthAction = () => {
    if (session?.user) {
      window.location.href = "/profile"
    } else {
      window.location.href = "/auth/signin"
    }
  }

  return (
    <header className="bg-darkblue rounded-b-3xl border-b border-white/10 py-4 backdrop-blur-sm md:py-6">
      <nav className="mx-10 flex items-center justify-between">
        <Link href="/public" className="flex items-center space-x-2">
          <SferaGlobe className="h-10 w-10" color="#fff" />
          <span className="text-3xl font-semibold tracking-wider text-white">SFERA</span>
        </Link>

        <div className="flex items-center space-x-8">
          <div className="hidden items-center space-x-8 md:flex">
            <Link
              href="#how-it-works"
              className="text-sm text-white/80 transition-colors hover:text-white">
              Как это работает
            </Link>
            <Link href="#faq" className="text-sm text-white/80 transition-colors hover:text-white">
              FAQ
            </Link>
          </div>

          {/* Кнопка авторизации */}
          <div className="flex items-center space-x-4">
            <Button
              onClick={handleAuthAction}
              variant="secondary"
              size="lg"
              className="bg-boldgray text-mainblue flex cursor-pointer items-center space-x-2 rounded-full px-6 py-3 hover:bg-white">
              <User className="h-5 w-5" />
              <span className="hidden font-semibold sm:inline">Личный кабинет</span>
            </Button>

            {/* Mobile menu button */}
            <button
              className="p-2 text-white md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile навигация */}
      {isMobileMenuOpen && (
        <div className="mt-4 space-y-4 pb-4 md:hidden">
          <Link
            href="#how-it-works"
            className="block py-2 text-sm text-white/80 transition-colors hover:text-white"
            onClick={() => setIsMobileMenuOpen(false)}>
            Как это работает
          </Link>
          <Link
            href="#faq"
            className="block py-2 text-sm text-white/80 transition-colors hover:text-white"
            onClick={() => setIsMobileMenuOpen(false)}>
            FAQ
          </Link>
        </div>
      )}
    </header>
  )
}
