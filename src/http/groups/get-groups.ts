import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { collection, getDocs, query, where } from 'firebase/firestore'

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

  return useQuery({
    queryKey: ['groups', currentUser?.uid],
    queryFn: () => getGroups({ uid: currentUser?.uid }),
    enabled: !!currentUser?.uid,
    staleTime: 60 * 60 * 24,
  })
}
