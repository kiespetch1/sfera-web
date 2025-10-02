import React from "react"
import { RhombusDivider } from "@/features/home/components/RhombusDivider"

interface QuestionBlockProps {
  question: string
  answer: string
  dividerLength?: number
}

export const QuestionBlock: React.FC<QuestionBlockProps> = ({
  question,
  answer,
  dividerLength = 330,
}) => {
  const formattedAnswer = answer.replace(/\\n/g, "\n")

  return (
    <div className="flex flex-col justify-center">
      <h3 className="pb-6 text-2xl text-white">{question}</h3>
      <RhombusDivider length={dividerLength} />
      <p className="whitespace-pre-line pb-6 pr-[110px] text-xl text-white">{formattedAnswer}</p>
    </div>
  )
}
