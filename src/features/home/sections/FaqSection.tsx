import React from "react"
import { QuestionBlock } from "@/features/home/components/QuestionBlock"

export const FaqSection = () => {
  return (
    <section id="faq" className="flex flex-col justify-center pl-[110px]">
      <h1 className="mb-12 self-start text-5xl font-semibold text-white">Частые вопросы</h1>
      <div className="flex flex-col justify-center space-y-12">
        <QuestionBlock
          question="Насколько точны прогнозы?"
          answer="Наши прогнозы составлены на основе точных астрологических расчётов с учётом вашего времени и места рождения. Однако важно помнить, что астрология — это инструмент самопознания, а не строгая наука.\nТочность восприятия прогноза зависит от вашей открытости и личного контекста."
          dividerLength={330}
        />
        <QuestionBlock
          question="Могу ли я получить карту повторно?"
          answer="Да, вы можете повторно получить свою натальную карту в личном кабинете или запросить её через форму восстановления. Все ваши данные сохраняются, и доступ к карте всегда открыт после регистрации."
          dividerLength={330}
        />
        <QuestionBlock
          question="Как отменить подписку?"
          answer="Вы можете отменить подписку в любой момент в личном кабинете или написав в поддержку. После отмены доступ к ежедневным прогнозам сохраняется до конца оплаченного периода."
          dividerLength={330}
        />
      </div>
    </section>
  )
}
