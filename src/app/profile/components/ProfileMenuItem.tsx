import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { FC, SVGProps } from "react"

interface ProfileMenuItemProps {
  href?: string
  icon: FC<SVGProps<SVGSVGElement>>
  text: string
  onClick?: () => void
}

export default function ProfileMenuItem({ href, icon: Icon, text, onClick }: ProfileMenuItemProps) {
  const className =
    "border-darkblue bg-boldgray hover:bg-boldgray/40 group flex w-full items-center justify-between rounded-2xl border p-4 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mainblue/30"

  const content = (
    <>
      <div className="flex items-center gap-3">
        <Icon className="h-5 w-5" color="#000" />
        <span className="text-base text-gray-800">{text}</span>
      </div>
      <ChevronRight className="h-4 w-4 text-gray-900 transition-colors group-hover:text-gray-600" />
    </>
  )

  if (href) {
    return (
      <Link href={href} className={className}>
        {content}
      </Link>
    )
  }

  return (
    <button type="button" onClick={onClick} className={className}>
      {content}
    </button>
  )
}
