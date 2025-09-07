import Link from "next/link";
import { Home, User, ClipboardList, BarChart3 } from "lucide-react";

export default function HomePage() {
  const navigationLinks = [
    {
      href: "/",
      title: "Главная",
      description: "Главная страница приложения",
      className: "bg-blue-500 hover:bg-blue-600 text-white",
      icon: Home
    },
    {
      href: "/profile",
      title: "Профиль / Вход", 
      description: "Личный кабинет пользователя",
      className: "bg-green-500 hover:bg-green-600 text-white",
      icon: User
    },
    {
      href: "/survey",
      title: "Заполнить анкету",
      description: "Форма для заполнения анкеты",
      className: "bg-purple-500 hover:bg-purple-600 text-white",
      icon: ClipboardList
    },
    {
      href: "/results",
      title: "Результаты анкеты",
      description: "Просмотр результатов анкетирования",
      className: "bg-orange-500 hover:bg-orange-600 text-white",
      icon: BarChart3
    }
  ];

  return (
    <div className="font-sans min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-8">
      <main className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-4">
            Sfera
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
             Список страниц
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {navigationLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`${link.className} rounded-lg p-6 transition-all duration-200 hover:scale-105 hover:shadow-lg group`}
              >
                <div className="text-center">
                  <Icon className="w-8 h-8 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                  <h3 className="text-xl font-semibold mb-2 group-hover:translate-y-[-2px] transition-transform">
                    {link.title}
                  </h3>
                  <p className="text-sm opacity-90">
                    {link.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Выберите раздел для начала работы
          </p>
        </div>
      </main>
    </div>
  );
}
