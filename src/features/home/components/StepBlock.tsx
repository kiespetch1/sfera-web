import React from "react"
import Number01 from "@/assets/numbers/01.svg"
import Number02 from "@/assets/numbers/02.svg"
import Number03 from "@/assets/numbers/03.svg"
import { RhombusDivider } from "@/features/home/components/RhombusDivider"

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
    <div className="mb-8 flex w-full flex-col items-start justify-start">
      <div className="mb-1 h-[100px] w-[150px] sm:h-[120px] sm:w-[180px] md:h-[136px] md:w-[202px] lg:h-[160px] lg:w-[240px]">
        <NumberComponent className="h-full w-full" />
      </div>

      <RhombusDivider />

      <p className="mb-4 text-xl font-light tracking-wide text-white/90 md:text-2xl">{text}</p>
    </div>
  )
}
