import React from "react"

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string
}

export default function Input({ error, className = "", ...props }: InputProps) {
  return (
    <div>
      <input
        className={`bg-darkblue/[0.04] border-darkblue/75 w-full rounded-lg border px-4 py-3 text-gray-900 placeholder-gray-500 outline-none transition-colors focus:border-transparent focus:ring-2 focus:ring-blue-500 ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  )
}