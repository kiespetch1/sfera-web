import React from "react"
import Number01 from "@/assets/numbers/01.svg"
import Number02 from "@/assets/numbers/02.svg"
import Number03 from "@/assets/numbers/03.svg"

interface StepBlockProps {
  stepNumber: string
  text: string
}

const numberComponents: Record<string, React.FC<{ className?: string }>> = {
  "01": Number01,
  "02": Number02,
  "03": Number03,
}

export const StepBlock: React.FC<StepBlockProps> = ({ stepNumber, text }) => {
  const NumberComponent = numberComponents[stepNumber]

  return (
    <div className="flex w-full flex-col items-start justify-start">
      <div className="relative h-28 w-32 pt-14 md:h-32 md:w-40">
        <NumberComponent />
      </div>

      <div className="relative mb-4 w-[222px]">
        <div className="h-[1px] w-full bg-white" />

        <div className="absolute -right-1 top-1/2 -translate-y-1/2">
          <div className="h-2 w-2 rotate-45 transform bg-white" />
        </div>
      </div>

      <p className="text-xl font-light tracking-wide text-white/90 md:text-2xl">{text}</p>
    </div>
  )
}
