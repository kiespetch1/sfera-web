import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { FC, SVGProps } from "react"

interface ProfileMenuItemProps {
  href: string
  icon: FC<SVGProps<SVGSVGElement>>
  text: string
}

export default function ProfileMenuItem({ href, icon: Icon, text }: ProfileMenuItemProps) {
  return (
    <Link
      href={href}
      className="border-darkblue bg-boldgray hover:bg-boldgray/40 group flex items-center justify-between rounded-2xl border p-4 transition-all">
      <div className="flex items-center gap-3">
        <Icon className="h-5 w-5" />
        <span className="text-base text-gray-800">{text}</span>
      </div>
      <ChevronRight className="h-4 w-4 text-gray-900 transition-colors group-hover:text-gray-600" />
    </Link>
  )
}
