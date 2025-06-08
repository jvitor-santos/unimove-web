import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { collection, getDocs, query, where } from 'firebase/firestore'

import { firestore } from '@/firebase/client'
import { useParams } from 'next/navigation'

type TGetUsersProps = {
  groupId?: string | null
}

type TGetUsersResponse = {
  id: string
  name: string
}[]

export const getUsersGroup = async ({
  groupId,
}: TGetUsersProps): Promise<TGetUsersResponse> => {
  if (!groupId) {
    throw new Error('....')
  }

  const route = `users`

  try {
    const usersRef = collection(firestore, route)

    const filters = [where('groups', 'array-contains', groupId)]
    const usersQuery = query(usersRef, ...filters)

    const usersSnapshot = await getDocs(usersQuery)

    const users = usersSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as any[]

    return users
  } catch (err) {
    console.log('🚀 ~ err:', err)

    throw new Error('....')
  }
}

export const useGetUsersGroup = (): UseQueryResult<TGetUsersResponse> => {
  const params = useParams()
  const groupId =
    typeof params.groupId === 'string'
      ? params.groupId
      : params.groupId?.[0]

  return useQuery({
    queryKey: ['users-group', groupId],
    queryFn: () => getUsersGroup({ groupId: groupId }),
    enabled: !!groupId,
    staleTime: 60 * 60 * 24,
  })
}
