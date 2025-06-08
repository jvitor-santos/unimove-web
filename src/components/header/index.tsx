'use client'

import { HeaderButtonUser } from "./header-button-user";
import { HeaderButtonSignOut } from "./header-button-sign-out";

export function Header() {
  return (
    <header className="flex h-auto w-full items-center justify-center bg-sidebar">
      <div className="flex justify-between h-auto w-full items-center gap-4 max-w-2xl p-4">
        <HeaderButtonUser />
        <HeaderButtonSignOut />
      </div>
    </header>
  )
}