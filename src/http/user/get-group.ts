import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { doc, getDoc } from 'firebase/firestore'

import { firestore } from '@/firebase/client'

type TGetGroupProps = {
  groupId?: string | null
}

type TGetGroupResponse = {
  id: string
  name: string
  users: string[]
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

    const group = groupSnapshot.data() as any

    return group
  } catch (err) {
    console.log('🚀 ~ err:', err)

    throw new Error('....')
  }
}

export const useGetGroup = (groupId: string): UseQueryResult<TGetGroupResponse> => {
  return useQuery({
    queryKey: ['group-user'],
    queryFn: () => getGroup({ groupId }),
    enabled: !!groupId,
    staleTime: 60 * 60 * 24,
  })
}
