"use client"

import { StepBlock } from "@/components/sections/StepBlock"

export const HowItWorksSection = () => {
  return (
    <section data-section="works" className="relative">
      <h2 className="pl-[110px] text-5xl font-semibold text-white">Как это работает?</h2>
      <div className="items start relative z-10 flex flex-col justify-start pl-[110px]">
        <StepBlock stepNumber="01" text="Вводишь дату, время и место рождения" />
        <StepBlock stepNumber="02" text="Получаешь карту с расшифровкой" />
        <StepBlock stepNumber="03" text="Подписываешься на ежедневные астропрогнозы" />
      </div>
    </section>
  )
}
