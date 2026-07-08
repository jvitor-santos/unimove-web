import { useQuery, UseQueryResult, useQueryClient } from '@tanstack/react-query'
import { collection, getDocs, query, where, onSnapshot } from 'firebase/firestore'
import { useEffect } from 'react'

import { firestore } from '@/firebase/client'
import { useUser } from '@/hooks/use-user'

type TGetGroupsProps = {
  uid?: string | null
}

type TGetGroupsResponse = {
  id: string
  ownerId: string
  name: string
  users: string[]
}[]

export const getGroups = async ({
  uid,
}: TGetGroupsProps): Promise<TGetGroupsResponse> => {
  if (!uid) {
    throw new Error('....')
  }

  const route = `groups`

  try {
    const groupsRef = collection(firestore, route)

    const filters = [where('users', 'array-contains', uid)]
    const groupsQuery = query(groupsRef, ...filters)

    const groupsSnapshot = await getDocs(groupsQuery)

    const groups = groupsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as any[]

    return groups
  } catch (err) {
    console.log('🚀 ~ err:', err)

    throw new Error('....')
  }
}

export const useGetGroups = (): UseQueryResult<TGetGroupsResponse> => {
  const { currentUser } = useUser()
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!currentUser?.uid) return

    const route = `groups`
    const groupsRef = collection(firestore, route)

    const filters = [where('users', 'array-contains', currentUser.uid)]
    const groupsQuery = query(groupsRef, ...filters)

    const unsubscribe = onSnapshot(groupsQuery, (snapshot) => {
      const groups = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as TGetGroupsResponse

      queryClient.setQueryData(['groups', currentUser.uid], groups)
    })

    return () => unsubscribe()
  }, [currentUser?.uid, queryClient])

  return useQuery({
    queryKey: ['groups', currentUser?.uid],
    queryFn: () => getGroups({ uid: currentUser?.uid }),
    enabled: !!currentUser?.uid,
    staleTime: Infinity,
  })
}
