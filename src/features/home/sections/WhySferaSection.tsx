import AstralCards from "@/assets/astralcards.svg"

export const WhySferaSection = () => {
  return (
    <>
      <div className="flex w-full flex-col items-center justify-center">
        <h2 className="mb-20 self-start pl-[110px] text-5xl font-semibold text-white">
          Почему SFERA?
        </h2>
        <AstralCards
          role="img"
          aria-label="Колода астрологических карт"
          className="h-auto w-full max-w-[1072px]"
        />
        <div className="flex w-full flex-col items-center space-y-8 py-12">
          <div className="flex h-[116.7px] w-[40vw] items-center justify-center rounded-[26px] bg-[linear-gradient(116.5deg,#CAB4FF_-315.28%,rgba(27,10,82,0.3)_100%)] p-11 text-center text-2xl text-white">
            Индивидуальные расчёты
          </div>
          <div className="flex h-[116.7px] w-[40vw] items-center justify-center rounded-[26px] bg-[linear-gradient(116.5deg,#CAB4FF_-315.28%,rgba(27,10,82,0.3)_100%)] p-11 text-center text-2xl text-white">
            Актуальные прогнозы каждый день
          </div>
          <div className="flex h-[116.7px] w-[40vw] items-center justify-center rounded-[26px] bg-[linear-gradient(116.5deg,#CAB4FF_-315.28%,rgba(27,10,82,0.3)_100%)] p-11 text-center text-2xl text-white">
            Эзотерическая база и профессиональные астрологи
          </div>
        </div>
      </div>
    </>
  )
}
