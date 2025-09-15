import Info from "@/assets/info.svg"
import Group from "@/assets/group.svg"
import Question from "@/assets/question.svg"
import Pencil from "@/assets/pencil.svg"
import Message from "@/assets/message.svg"
import SferaGlobe from "@/assets/globe.svg"
import DefaultUser from "@/assets/defaultuser.svg"
import Header from "@/shared/ui/Header"
import ProfileMenuItem from "./components/ProfileMenuItem"
import LogoutButton from "./components/LogoutButton"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function ProfilePage() {
  const session = await auth()

  if (!session) {
    redirect("/auth/signin")
  }
  const userInfo = [
    { href: "/profile/info", icon: Info, text: "Информация" },
    { href: "/profile/about", icon: Group, text: "О нас" },
    { href: "/profile/questions", icon: Question, text: "Остались вопросы?" },
  ]

  const otherItems = [{ href: "https://t.me/sferasupp_bot", icon: Message, text: "Поддержка" }]

  return (
    <div className="relative min-h-screen overflow-hidden bg-gray-50">
      <div className="pointer-events-none absolute inset-0">
        <SferaGlobe
          className="opacity-2 absolute left-1/2 top-1/2 h-auto w-[150vw] -translate-x-1/2"
          style={{ aspectRatio: "1/1" }}
        />
      </div>

      <div className="relative z-10">
        <Header />

        <div className="mx-auto max-w-2xl">
          <section className="px-5 py-10 text-center">
            <div className="relative mx-auto mb-4 flex h-20 w-20 items-center justify-center">
              <DefaultUser className="h-19 w-19" />
            </div>
            <h1 className="text-darkblue mb-1 text-2xl font-semibold">
              {session.user?.name || session.user?.email || "Пользователь"}
            </h1>
            <div className="flex items-center justify-center gap-2 text-base text-gray-600">
              Пользователь
              <Pencil className="text-darkblue h-4 w-4" />
            </div>
          </section>

          {/* User Information Section */}
          <section className="px-5 pb-8">
            <h2 className="mb-4 text-2xl font-semibold text-gray-800">
              Пользовательская информация
            </h2>
            <div className="flex flex-col gap-2">
              {userInfo.map(item => (
                <ProfileMenuItem
                  key={item.href}
                  href={item.href}
                  icon={item.icon}
                  text={item.text}
                />
              ))}
            </div>
          </section>

          {/* Divider */}
          <div className="mx-5 mb-6 h-px bg-gray-200"></div>

          <section className="px-5 pb-8">
            <h2 className="text-darkblue mb-4 text-2xl font-semibold">Остальное</h2>
            <div className="flex flex-col gap-2">
              {otherItems.map(item => (
                <ProfileMenuItem
                  key={item.href}
                  href={item.href}
                  icon={item.icon}
                  text={item.text}
                />
              ))}
              <LogoutButton />
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
