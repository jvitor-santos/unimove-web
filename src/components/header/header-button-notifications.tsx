'use client'

import { Bell } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useUser } from '@/hooks/use-user'

import { useRouter } from 'next/navigation'
import { useGetInvitations } from '@/http/user/get-invitations'

export function HeaderButtonNotifications() {
  const { push } = useRouter()

  const { currentUser } = useUser()
  const { data, isLoading } = useGetInvitations({ email: currentUser?.email })

  return (
    <Button
      onClick={() => push('/notifications')}
      type="button"
      size="sm"
      variant="ghost"
      className="rounded-[2px] relative"
      disabled={isLoading}
    >
      <Bell />
      {data && data?.length > 0 && (
        <div className='absolute w-5 h-5  bg-red-400 rounded-full -top-2 -right-1 flex items-center justify-center'>
          <span className='text-xs'>{data && data?.length <= 9 ? data.length : '+9'}</span>
        </div>
      )}
    </Button>
  )
}
