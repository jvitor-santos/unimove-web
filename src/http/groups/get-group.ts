import { useQuery, UseQueryResult, useQueryClient } from '@tanstack/react-query'
import { doc, getDoc, onSnapshot } from 'firebase/firestore'
import { useParams } from 'next/navigation'
import { useEffect } from 'react'

import { firestore } from '@/firebase/client'

type TGetGroupProps = {
  groupId?: string | null
}

type TGetGroupResponse = {
  id: string
  name: string
  users: string[]
  drivers: string[]
  ownerId: string
  isRouteActive?: boolean
  capacity?: number
}

export const getGroup = async ({
  groupId,
}: TGetGroupProps): Promise<TGetGroupResponse> => {
  if (!groupId) {
    throw new Error('....')
  }

  const route = `groups/${groupId}`

  try {
    const groupRef = doc(firestore, route)

    const groupSnapshot = await getDoc(groupRef)

    if (!groupSnapshot.exists()) {
      throw new Error('....')
    }

    const group = {
      id: groupSnapshot.id,
      ...groupSnapshot.data(),
    } as any

    return group
  } catch (err) {
    console.log('🚀 ~ err:', err)

    throw new Error('....')
  }
}

export const useGetGroup = (): UseQueryResult<TGetGroupResponse> => {
  const params = useParams()
  const groupId =
    typeof params.groupId === 'string'
      ? params.groupId
      : params.groupId?.[0]
  
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!groupId) return

    const route = `groups/${groupId}`
    const groupRef = doc(firestore, route)

    const unsubscribe = onSnapshot(groupRef, (snapshot) => {
      if (snapshot.exists()) {
        const group = {
          id: snapshot.id,
          ...snapshot.data(),
        } as TGetGroupResponse

        queryClient.setQueryData(['group', groupId], group)
      } else {
        queryClient.setQueryData(['group', groupId], null)
      }
    })

    return () => unsubscribe()
  }, [groupId, queryClient])

  return useQuery({
    queryKey: ['group', groupId],
    queryFn: () => getGroup({ groupId }),
    enabled: !!groupId,
    staleTime: Infinity,
  })
}
