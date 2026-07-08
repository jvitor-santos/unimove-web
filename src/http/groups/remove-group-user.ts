import { useMutation, useQueryClient } from '@tanstack/react-query'
import { arrayRemove, doc, updateDoc, deleteDoc } from 'firebase/firestore'

import { firestore } from '@/firebase/client'

type TRemoveGroupUserProps = {
  groupId: string
  userId: string
}

export const removeGroupUser = async ({
  groupId,
  userId,
}: TRemoveGroupUserProps): Promise<void> => {
  if (!groupId || !userId) {
    throw new Error('Group ID and User ID are required.')
  }

  try {
    // 1. Remove user from group's arrays
    const groupRef = doc(firestore, `groups/${groupId}`)
    await updateDoc(groupRef, {
      users: arrayRemove(userId),
      drivers: arrayRemove(userId),
    })

    // 2. Remove group from user's groups array
    const userRef = doc(firestore, `users/${userId}`)
    await updateDoc(userRef, {
      groups: arrayRemove(groupId),
    })

    // 3. Delete the user document in the group's subcollection
    const groupUserRef = doc(firestore, `groups/${groupId}/users/${userId}`)
    await deleteDoc(groupUserRef)

  } catch (err) {
    console.error('Error removing user from group:', err)
    throw new Error('Failed to remove user from group.')
  }
}

export const useRemoveGroupUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: removeGroupUser,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['groups'] })
      queryClient.invalidateQueries({ queryKey: ['group', variables.groupId] })
      queryClient.invalidateQueries({ queryKey: ['group-user', variables.groupId] })
      queryClient.invalidateQueries({ queryKey: ['group-users', variables.groupId] })
      queryClient.invalidateQueries({ queryKey: ['users-group', variables.groupId] })
    },
  })
}
