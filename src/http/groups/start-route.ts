import { doc, writeBatch } from 'firebase/firestore'
import { firestore } from '@/firebase/client'
import { useMutation, useQueryClient } from '@tanstack/react-query'

type TStartRouteProps = {
  groupId: string
  memberIdsToUpdate: string[]
}

export const startRoute = async ({
  groupId,
  memberIdsToUpdate,
}: TStartRouteProps): Promise<void> => {
  if (!groupId) {
    throw new Error('Group ID is required to start route.')
  }

  try {
    const batch = writeBatch(firestore)

    // Set the route as active in the group document
    const groupRef = doc(firestore, `groups/${groupId}`)
    batch.update(groupRef, { isRouteActive: true })

    // Set all pending passengers to false
    memberIdsToUpdate.forEach((userId) => {
      const userRef = doc(firestore, `groups/${groupId}/users/${userId}`)
      batch.set(userRef, { boardingStatus: false }, { merge: true })
    })

    await batch.commit()
  } catch (err) {
    console.error('🚀 ~ Error starting route:', err)
    throw new Error('Failed to start route.')
  }
}

export const useStartRoute = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: startRoute,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['group', variables.groupId] })
      queryClient.invalidateQueries({ queryKey: ['group-users', variables.groupId] })
      queryClient.invalidateQueries({ queryKey: ['group-user', variables.groupId] })
    },
  })
}
