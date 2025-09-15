"use client"

import { useState } from "react"
import { signOut } from "next-auth/react"
import Logout from "@/assets/logout.svg"
import ProfileMenuItem from "./ProfileMenuItem"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function LogoutButton() {
  const [isLoading, setIsLoading] = useState(false)

  const handleLogout = async () => {
    setIsLoading(true)
    await signOut({ callbackUrl: "/auth/signin" })
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <div>
          <ProfileMenuItem href="#" icon={Logout} text="Выход" />
        </div>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Вы уверены, что хотите выйти?</AlertDialogTitle>
          <AlertDialogDescription>
            Вы будете перенаправлены на страницу входа. Для повторного доступа к профилю потребуется
            войти в систему снова.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Отмена</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleLogout}
            disabled={isLoading}
            className="bg-red-600 text-white hover:bg-red-700">
            {isLoading ? "Выход..." : "Выйти"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
