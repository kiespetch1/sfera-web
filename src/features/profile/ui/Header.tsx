"use client"

import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { usePathname } from "next/navigation"
import SferaGlobe from "@/assets/globe.svg"

export default function Header() {
  const pathname = usePathname()

  const navigationItems = [
    { href: "/", label: "Главная" },
    { href: "/services", label: "Мои сервисы" },
    { href: "/profile", label: "Профиль" },
  ]

  return (
    <header className="border-darkblue flex w-full items-center justify-between rounded-3xl border-b bg-white px-10 py-4">
      <div className="text-darkblue flex items-center gap-2 text-3xl font-semibold">
        <SferaGlobe className="h-8 w-8" color="#0C0620" />
        SFERA
      </div>

      <nav className="hidden gap-6 md:flex">
        {navigationItems.map(item => (
          <Link
            key={item.href}
            href={item.href}
            className={`text-base transition-colors ${
              pathname === item.href
                ? "text-mainblue font-medium"
                : "text-gray-600 hover:text-gray-800"
            }`}>
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-gray-300 transition-colors hover:border-gray-400">
        <ChevronRight className="h-3 w-3 text-gray-600" />
      </div>
    </header>
  )
}
