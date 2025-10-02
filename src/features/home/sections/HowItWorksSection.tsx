"use client"

import { StepBlock } from "@/features/home/components/StepBlock"
import ZodiacSymbols from "@/assets/zodiacsymbols.svg"

export const HowItWorksSection = () => {
  return (
    <section data-section="works" className="relative">
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(to bottom, transparent 0%, rgba(12, 6, 32, 0.56) 20%, rgba(12, 6, 32, 0.56) 80%, transparent 100%)",
        }}
      />

      <div className="relative z-10 py-20">
        <h2 className="pl-[110px] text-5xl font-semibold text-white">Как это работает?</h2>
        <div className="relative flex items-start">
          <div className="mt-20 flex max-w-[40%] flex-1 flex-col justify-start space-y-4 pl-[110px]">
            <StepBlock stepNumber="01" text="Вводишь дату, время и место рождения" />
            <StepBlock stepNumber="02" text="Получаешь карту с расшифровкой" />
            <StepBlock stepNumber="03" text="Подписываешься на ежедневные астропрогнозы" />
          </div>
          <div className="flex flex-1 justify-center">
            <ZodiacSymbols role="img" aria-label="Серебряные символы зодиака" />
          </div>
        </div>
      </div>
    </section>
  )
}
