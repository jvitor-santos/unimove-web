'use client'

import { HeaderButtonUser } from "./header-button-user";
import { HeaderButtonSignOut } from "./header-button-sign-out";
import { HeaderButtonNotifications } from "./header-button-notifications";

export function Header() {
  return (
    <header className="flex h-auto w-full items-center justify-center bg-sidebar">
      <div className="flex justify-between h-auto w-full items-center gap-2 p-4">
        <HeaderButtonUser />
        <HeaderButtonNotifications />
        <HeaderButtonSignOut />
      </div>
    </header>
  )
}