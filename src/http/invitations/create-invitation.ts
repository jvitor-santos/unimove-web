import { useMutation, useQueryClient } from '@tanstack/react-query'
import { addDoc, collection } from 'firebase/firestore'

import { firestore } from '@/firebase/client'

export type TCreateInvitationProps = {
  email: string
  groupId?: string 
  role: 'passenger' | 'driver' 
  ownerId?: string 
}

export const createInvitation = async ({
  email,
  groupId,
  role,
  ownerId,
}: TCreateInvitationProps): Promise<void> => {
  if (!email || !groupId || !role || !ownerId) {
    throw new Error('....')
  }

  const route = 'invitations'

  try {
    const invitesRef = collection(firestore, route)

    await addDoc(invitesRef, {
      email,          
      groupId,        
      role,               
      status: 'pending',         
      created_at: new Date(),    
      ownerId,
    })
  } catch (err) {
    console.log('🚀 ~ err:', err)

    throw new Error('....')
  }
}

export const useCreateInvitation = () => {
  const queryClient = useQueryClient()

  const mutate = useMutation({
    mutationFn: createInvitation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invitations'] })
    },
  })

  return mutate
}
