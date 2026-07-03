import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { collection, getDocs, query, where } from 'firebase/firestore'

import { firestore } from '@/firebase/client'

type TGetInvitationsProps = {
  email?: string | null
}

type TGetInvitationsResponse = {
  id: string
  email: string
  status: string
  role: string
}[]

export const getInvitations = async ({
  email,
}: TGetInvitationsProps): Promise<TGetInvitationsResponse> => {
  if (!email) {
    throw new Error('....')
  }

  const route = `invitations`

  try {
    const invitationsRef = collection(firestore, route)

    const filters = [
      where('email', '==', email),
      where('status', '==', 'pending')
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
  email,
}: TGetInvitationsProps): UseQueryResult<TGetInvitationsResponse> => {
  return useQuery({
    queryKey: ['invitations-user', { email }],
    queryFn: () => getInvitations({ email }),
    enabled: !!email,
    staleTime: 0,
  })
}