import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteDoc, doc, getDoc, updateDoc, arrayRemove } from 'firebase/firestore'

import { firestore } from '@/firebase/client'

type TDeleteGroupProps = {
  groupId: string
}

export const deleteGroup = async ({
  groupId,
}: TDeleteGroupProps): Promise<void> => {
  const route = `groups/${groupId}`

  try {
    const groupRef = doc(firestore, route)
    const groupSnap = await getDoc(groupRef)

    if (groupSnap.exists()) {
      const groupData = groupSnap.data()
      const users: string[] = groupData?.users || []
      
      // Remove the group from all users' profiles
      const updatePromises = users.map(userId => {
        const userRef = doc(firestore, `users/${userId}`)
        return updateDoc(userRef, {
          groups: arrayRemove(groupId)
        })
      })
      await Promise.all(updatePromises)
    }

    await deleteDoc(groupRef)
  } catch (err) {
    console.log('🚀 ~ err:', err)

    throw new Error('Failed to delete group.')
  }
}

export const useDeleteGroup = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteGroup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] })
    },
  })
}
