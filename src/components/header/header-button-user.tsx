'use client'

import NextLink from 'next/link'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

import { formatFirstAndSecondNames } from '@/utils/formatting/format-first-and-second-names'
import { formatInitials } from '@/utils/formatting/format-initials'

import { Skeleton } from '@/components/ui/skeleton'
import { useGetUser } from '@/http/user/get-user'

export function HeaderButtonUser() {
  const { data: currentUser, isLoading: isUserLoading } = useGetUser()

  const name = formatFirstAndSecondNames(currentUser?.displayName ?? '')
 
  const acronym = formatInitials(currentUser?.displayName ?? '')
  const email = currentUser?.email ?? ''

  return (
    <>
      {!isUserLoading && currentUser ? (
        <NextLink href="#" className="flex size-auto items-center gap-2 transition-opacity hover:opacity-80 focus:outline-none">
          <Avatar className="size-9 rounded-full">
            <AvatarImage alt="" src="" />
            <AvatarFallback className="rounded-full">
              {acronym}
            </AvatarFallback>
          </Avatar>

          <div className="size-auto flex-col items-start flex">
            <p className="line-clamp-1 text-sm">
              <span>Olá,</span> {name}
            </p>
            <span className="line-clamp-1 text-xs text-muted-foreground">
              {email}
            </span>
          </div>
        </NextLink>
      ) : (
        <div className="flex size-auto items-center gap-2">
          <Skeleton className="size-9 rounded-full bg-gray-200" />

          <div className="flex size-auto flex-col items-start gap-y-0.5">
            <Skeleton className="h-3.5 w-32 rounded-[2px] bg-gray-200" />
            <Skeleton className="h-3 w-36 rounded-[2px] bg-gray-200" />
          </div>
        </div>
      )}
    </>
  )
}
