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
} from "@/components/ui/alert-dialog"

export default function LogoutButton() {
  const [open, setOpen] = useState(false)

  const handleLogout = async () => {
    setOpen(false)
    await signOut({
      callbackUrl: "/auth/signin",
      redirect: true
    })
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <ProfileMenuItem icon={Logout} text="Выход" onClick={() => setOpen(true)} />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Вы уверены, что хотите выйти?</AlertDialogTitle>
          <AlertDialogDescription>
            Вы будете перенаправлены на страницу входа. Для повторного доступа к профилю потребуется
            войти в систему снова.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Отмена</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleLogout}
            className="bg-red-600 text-white hover:bg-red-700"
          >
            Выйти
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
