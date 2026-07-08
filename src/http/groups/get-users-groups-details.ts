import { collection, getDocs, onSnapshot } from 'firebase/firestore'
import { useQuery, UseQueryResult, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'

import { firestore } from '@/firebase/client'
import { useParams } from 'next/navigation'

type TGetGroupUsersProps = {
  groupId?: string | null
}

export const getGroupUsersDetails = async ({
  groupId,
}: TGetGroupUsersProps): Promise<any> => {
  if (!groupId) {
    throw new Error('Group ID is required to fetch users.')
  }

  const route = `groups/${groupId}/users`

  try {
    const usersRef = collection(firestore, route)
    const usersSnapshot = await getDocs(usersRef)

    const users = usersSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as any

    return users
  } catch (err) {
    console.log('🚀 ~ Error fetching group users:', err)
    throw new Error('Failed to fetch group users.')
  }
}

export const useGetGroupUsersDetails = (): UseQueryResult<any> => {
  const params = useParams()
  const groupId =
    typeof params.groupId === 'string'
      ? params.groupId
      : params.groupId?.[0]

  const queryClient = useQueryClient()

  useEffect(() => {
    if (!groupId) return

    const route = `groups/${groupId}/users`
    const usersRef = collection(firestore, route)

    const unsubscribe = onSnapshot(usersRef, (snapshot) => {
      const users = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as any

      queryClient.setQueryData(['group-users', groupId], users)
    })

    return () => unsubscribe()
  }, [groupId, queryClient])

  return useQuery({
    queryKey: ['group-users', groupId],
    queryFn: () => getGroupUsersDetails({ groupId }),
    enabled: !!groupId,
    staleTime: Infinity,
  })
}