import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { collection, getDocs, query, where } from 'firebase/firestore'

import { firestore } from '@/firebase/client'
import { useParams } from 'next/navigation'

type TGetInvitationsProps = {
  ownerId?: string | null
  groupId?: string | null
}

type TGetInvitationsResponse = {
  id: string
  email: string
  status: string
  role: string
}[]

export const getInvitations = async ({
  ownerId,
  groupId,
}: TGetInvitationsProps): Promise<TGetInvitationsResponse> => {
  if (!ownerId || !groupId) {
    throw new Error('....')
  }

  const route = `invitations`

  try {
    const invitationsRef = collection(firestore, route)

    const filters = [
      where('groupId', '==', groupId),
      where('ownerId', '==', ownerId),
    ]
    const invitationsQuery = query(invitationsRef, ...filters)

    const invitationsSnapshot = await getDocs(invitationsQuery)

    const invitations = invitationsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as any[]

    return invitations
  } catch (err) {
    console.log('🚀 ~ err:', err)

    throw new Error('....')
  }
}

export const useGetInvitations = ({
  groupId,
  ownerId,
}: TGetInvitationsProps): UseQueryResult<TGetInvitationsResponse> => {
  return useQuery({
    queryKey: ['invitations', groupId],
    queryFn: () => getInvitations({ groupId, ownerId }),
    enabled: !!groupId,
    staleTime: 60 * 60 * 24,
  })
}