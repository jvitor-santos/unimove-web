import { doc, writeBatch, deleteField } from 'firebase/firestore'
import { firestore } from '@/firebase/client'
import { useMutation, useQueryClient } from '@tanstack/react-query'

type TFinishRouteProps = {
  groupId: string
  memberIdsToReset: string[]
}

export const finishRoute = async ({
  groupId,
  memberIdsToReset,
}: TFinishRouteProps): Promise<void> => {
  if (!groupId) {
    throw new Error('Group ID is required to finish route.')
  }

  try {
    const batch = writeBatch(firestore)

    // Set the route as inactive in the group document
    const groupRef = doc(firestore, `groups/${groupId}`)
    batch.update(groupRef, { isRouteActive: false })

    // Remove the boardingStatus field from all users who have details in the group
    memberIdsToReset.forEach((userId) => {
      const userRef = doc(firestore, `groups/${groupId}/users/${userId}`)
      batch.update(userRef, { boardingStatus: deleteField() })
    })

    await batch.commit()
  } catch (err) {
    console.error('🚀 ~ Error finishing route:', err)
    throw new Error('Failed to finish route.')
  }
}

export const useFinishRoute = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: finishRoute,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['group', variables.groupId] })
      queryClient.invalidateQueries({ queryKey: ['group-users', variables.groupId] })
      queryClient.invalidateQueries({ queryKey: ['group-user', variables.groupId] })
    },
  })
}
