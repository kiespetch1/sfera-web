"use client"

import { useState } from "react"
import Logout from "@/assets/logout.svg"
import ProfileMenuItem from "./ProfileMenuItem"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function LogoutButton() {
  const [open, setOpen] = useState(false)

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
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
          <AlertDialogCancel>Отмена</AlertDialogCancel>
          <form action="/api/auth/signout" method="POST">
            <input type="hidden" name="callbackUrl" value="/auth/signin" />
            <button
              type="submit"
              className="inline-flex h-10 items-center justify-center rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
            >
              Выйти
            </button>
          </form>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}