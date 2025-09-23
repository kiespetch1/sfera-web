"use client"

import { StepBlock } from "@/features/home/components/StepBlock"

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
        <h2 className="mb-20 pl-[110px] text-5xl font-semibold text-white">Как это работает?</h2>
        <div className="items start relative flex flex-col justify-start space-y-4 pl-[110px]">
          <StepBlock stepNumber="01" text="Вводишь дату, время и место рождения" />
          <StepBlock stepNumber="02" text="Получаешь карту с расшифровкой" />
          <StepBlock stepNumber="03" text="Подписываешься на ежедневные астропрогнозы" />
        </div>
      </div>
    </section>
  )
}
