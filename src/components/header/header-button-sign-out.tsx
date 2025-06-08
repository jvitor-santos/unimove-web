'use client'

import { LogOut } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useUser } from '@/hooks/use-user'

import { auth } from '@/firebase/client'
import { deleteCookie } from 'cookies-next/client'
import { useRouter } from 'next/navigation'

export function HeaderButtonSignOut() {
   const { push } = useRouter()
   
  const { setIsUserLoading } = useUser()

   async function signOut() {
    setIsUserLoading(true)
    
    await auth.signOut()
    deleteCookie('token')
    push('/auth/sign-in')
  }

  return (
    <Button
      onClick={signOut}
      type="button"
      size="sm"
      variant="ghost"
      className="rounded-[2px]"
    >
      <LogOut />
    </Button>
  )
}
