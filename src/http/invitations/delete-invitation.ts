import { deleteDoc, doc } from 'firebase/firestore'

import { firestore } from '@/firebase/client'
import { useMutation, useQueryClient } from '@tanstack/react-query'

type TDeleteInvitationProps = {
  id: string
}

export const deleteInvitation = async ({
  id,
}: TDeleteInvitationProps): Promise<void> => {
  const route = `invitations/${id}`

  try {
    const invitationRef = doc(firestore, route)

    await deleteDoc(invitationRef)
  } catch (err) {
    console.log('🚀 ~ err:', err)

    throw new Error('....')
  }
}

export const useDeleteInvitation = () => {
  const queryClient = useQueryClient()

  const mutate = useMutation({
    mutationFn: deleteInvitation,
    onSuccess: (_) => {
      queryClient.invalidateQueries({
        queryKey: ['invitations'],
      })
    },
    onError: (error) => {
      console.error('Erro ao deletar convite:', error)
    },
  })

  return mutate
}