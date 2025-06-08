'use client'

import { onAuthStateChanged, User } from 'firebase/auth'
import { createContext, Dispatch, ReactNode, SetStateAction, useEffect, useState } from 'react'

import { auth } from '@/firebase/client'
import { deleteCookie, setCookie } from 'cookies-next/client'

type TUserContext = {
  currentUser: User | null
  isUserLoading: boolean
  setIsUserLoading: Dispatch<SetStateAction<boolean>>
}

type TUserContextProvider = {
  children: ReactNode
}

export const UserContext = createContext<TUserContext>({} as TUserContext)

export function UserProvider({ children }: TUserContextProvider) {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [isUserLoading, setIsUserLoading] = useState(true)

  useEffect(() => {
    const unsubscriber = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user ?? null)

      if (user) {
        const tokenResult = await user.getIdTokenResult()
        const token = tokenResult.token
        
        setCookie('token', token)
        setIsUserLoading(false)
      } else {
        await auth.signOut()

        deleteCookie('token')
        setIsUserLoading(false)
      }
    })

    return () => unsubscriber()
  }, [])

  return (
    <UserContext.Provider
      value={{
        currentUser,
        isUserLoading,
        setIsUserLoading,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}
