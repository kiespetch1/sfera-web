import React from "react"

interface OAuthButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  provider: "yandex" | "vk"
  children: React.ReactNode
}

export default function OAuthButton({ provider, children, className = "", ...props }: OAuthButtonProps) {
  const providerStyles = {
    yandex: {
      button: "bg-black hover:bg-gray-900",
      icon: (
        <div className="mr-3 flex h-5 w-5 items-center justify-center rounded-full bg-red-500">
          <span className="text-xs font-bold text-white">Я</span>
        </div>
      ),
    },
    vk: {
      button: "bg-blue-600 hover:bg-blue-700",
      icon: (
        <div className="mr-3 flex h-5 w-5 items-center justify-center rounded-sm bg-white">
          <span className="text-xs font-bold text-blue-600">VK</span>
        </div>
      ),
    },
  }

  const style = providerStyles[provider]

  return (
    <button
      type="button"
      className={`flex w-full items-center justify-center rounded-lg px-4 py-3 font-medium text-white transition-colors duration-200 disabled:cursor-not-allowed disabled:bg-gray-400 ${style.button} ${className}`}
      {...props}>
      {style.icon}
      {children}
    </button>
  )
}