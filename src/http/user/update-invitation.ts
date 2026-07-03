import { arrayUnion, doc, updateDoc } from 'firebase/firestore'
import { firestore } from '@/firebase/client'
import { useMutation, useQueryClient } from '@tanstack/react-query'

type TUpdateInvitationProps = {
  userId?: string
  invitationId?: string
  status?: string
  groupId?: string
  role?: string
}

export const updateInvitation = async ({
  userId,
  invitationId,
  status,
  groupId,
  role,
}: TUpdateInvitationProps): Promise<void> => {
  if (!invitationId || !userId || !groupId || !role) {
    throw new Error('Invitation ID is required.')
  }

  const route = `invitations/${invitationId}`

  try {
    const groupRef = doc(firestore, route)

    await updateDoc(groupRef, { status, updated_at: new Date(), })

    if (status === 'accepted') {
      const groupRoute = `groups/${groupId}`

      const groupRef = doc(firestore, groupRoute)
      await updateDoc(groupRef, {
        ...(role === "driver" && { drivers: arrayUnion(userId) }),
         users: arrayUnion(userId),
      })

      const userRoute = `users/${userId}`
      const userRef = doc(firestore, userRoute)
      await updateDoc(userRef, {
        groups: arrayUnion(groupId),
      })
    }
  } catch (err) {
    console.error('Error updating invitation or adding user to group:', err)
    throw new Error('Failed to update invitation or add user to group.')
  }
}

export const useUpdateInvitation = () => {
  const queryClient = useQueryClient()

  const mutate = useMutation({
    mutationFn: updateInvitation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invitations-user'] })
      queryClient.invalidateQueries({ queryKey: ['groups'] })
    },
    onError: (error: any) => {
      console.error('Mutation failed:', error)
    }
  })

  return mutate
}
