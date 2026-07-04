import { collection, getDocs } from 'firebase/firestore'
import { useQuery, UseQueryResult } from '@tanstack/react-query'

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

  return useQuery({
    queryKey: ['group-users', groupId],
    queryFn: () => getGroupUsersDetails({ groupId }),
    enabled: !!groupId,
    staleTime: 1000 * 5,
  })
}