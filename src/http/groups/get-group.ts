import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { doc, getDoc } from 'firebase/firestore'
import { useParams } from 'next/navigation'

import { firestore } from '@/firebase/client'

type TGetGroupProps = {
  uid?: string | null
  groupId?: string | null
}

type TGetGroupResponse = {
  id: string
  name: string
  users: string[]
}

export const getGroup = async ({
  uid,
  groupId,
}: TGetGroupProps): Promise<TGetGroupResponse> => {
  if (!uid || !groupId) {
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

export const useGetGroup = (): UseQueryResult<TGetGroupResponse> => {
  const params = useParams()
  const groupId =
    typeof params.groupId === 'string'
      ? params.groupId
      : params.groupId?.[0]

  return useQuery({
    queryKey: ['group', groupId],
    queryFn: () => getGroup({ groupId }),
    enabled: !!groupId,
    staleTime: 60 * 60 * 24,
  })
}
