'use client'

import { BusFront, User, Users } from "lucide-react"
import { Button } from "../ui/button"
import { useGetUser } from "@/http/user/get-user"
import { useRouter } from "next/navigation"

export function Footer() {
  const { push } = useRouter()
  const { data } = useGetUser()

  return (
    <footer className="flex h-auto w-full items-center justify-center bg-sidebar">
      <div className="flex justify-around h-auto w-full items-center gap-4 px-4 py-2">
        <Button onClick={() => push('/')} variant="ghost" className="flex flex-col items-center justify-center gap-1 h-auto min-w-24 text-xs">
          <Users size={24} /> Grupos
        </Button>

        {data?.accountType === 'business' && (
          <Button  onClick={() => push('/drivers')} variant="ghost" className="flex flex-col items-center justify-center gap-1 h-auto min-w-24 text-xs">
            <BusFront size={24} /> Motoristas
          </Button>
        )}

        <Button  onClick={() => push('/profile')} variant="ghost" className="flex flex-col items-center justify-center gap-1 h-auto min-w-24 text-xs">
          <User size={24} /> Perfil
        </Button>
      </div>
    </footer>
  )
}