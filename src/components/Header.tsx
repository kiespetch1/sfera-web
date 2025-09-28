"use client";

import Link from "next/link";
import {signIn, signOut, useSession} from "next-auth/react";

export default function Header() {
    const {data: session, status} = useSession();

    return (
        <header className="navbar bg-base-200">
            <div className="flex pr-2">
                <Link href="/" className="btn btn-ghost normal-case text-xl">
                    Данные о логистике
                </Link>
            </div>

            <div className="flex-none ml-auto">
                {status === "loading" ? (
                    <span>Loading...</span>
                ) : session ? (
                    <div className="flex items-center gap-2">
                        <span className="text-sm">
                            Вы вошли как: {session.user?.name || session.user?.email}
                        </span>
                        <button
                            onClick={() => signOut({redirect: true, callbackUrl: '/'})}
                            className="btn btn-primary"
                        >
                            Выйти
                        </button>
                    </div>
                ) : (
                    <button onClick={() => signIn()} className="btn btn-primary">
                        Войти
                    </button>
                )}
            </div>
        </header>
    );
}