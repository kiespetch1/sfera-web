import React from "react"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "link"
  fullWidth?: boolean
  children: React.ReactNode
}

export default function Button({
  variant = "primary",
  fullWidth = false,
  className = "",
  children,
  ...props
}: ButtonProps) {
  const baseClasses = "transition-colors duration-200 font-bold"

  const variantClasses = {
    primary:
      "bg-indigo text-white rounded-lg px-4 py-3 hover:bg-indigo-900 text-xl disabled:cursor-not-allowed disabled:bg-gray-400",
    secondary:
      "bg-black text-white rounded-lg px-4 py-3 hover:bg-gray-900 disabled:cursor-not-allowed disabled:bg-gray-400",
    link: "text-indigo font-medium cursor-pointer text-sm hover:text-indigo-900",
  }

  const widthClass = fullWidth ? "w-full" : ""

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${widthClass} ${className}`}
      {...props}>
      {children}
    </button>
  )
}
