import Link from "next/link"
import TelegramIcon from "@/assets/telegram.svg"
import VkIcon from "@/assets/vk.svg"

export const Footer = () => {
  return (
    <footer className="relative mt-24 text-white/70">
      <div className="relative flex h-[87px] w-full flex-col justify-between gap-8 bg-[radial-gradient(65.23%_523.68%_at_67.45%_-182.63%,#0C0620_0%,#000000_100%)] px-14 py-8 md:flex-row md:items-center md:gap-0 md:px-[110px]">
        <div className="flex flex-col space-y-1 text-sm">
          <Link href="/privacy" className="transition-colors hover:text-white">
            Политика конфиденциальности
          </Link>
          <Link href="/terms" className="transition-colors hover:text-white">
            Условия подписки
          </Link>
        </div>

        <div className="flex items-center gap-x-10 self-start md:self-auto">
          <Link
            href="https://t.me/sferasupp_bot"
            aria-label="Telegram"
            className="group"
            target="_blank"
            rel="noreferrer">
            <TelegramIcon />
          </Link>
          <Link
            href="https://vk.com"
            aria-label="VK"
            className="group"
            target="_blank"
            rel="noreferrer">
            <VkIcon />
          </Link>
        </div>
      </div>
    </footer>
  )
}
