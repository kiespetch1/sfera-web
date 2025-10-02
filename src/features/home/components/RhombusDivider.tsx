import React from "react"
import { cn } from "@/lib/utils"

interface RhombusDividerProps {
  length?: number
  className?: string
}

export const RhombusDivider: React.FC<RhombusDividerProps> = ({ length = 222, className }) => {
  return (
    <div className={cn("relative mb-6", className)} style={{ width: `${length}px` }}>
      <div className="h-px w-full bg-white" />

      <div className="absolute -right-1 top-1/2 -translate-y-1/2">
        <div className="h-2 w-2 rotate-45 transform bg-white" />
      </div>
    </div>
  )
}
