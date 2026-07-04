import { doc, updateDoc } from 'firebase/firestore'

import { firestore } from '@/firebase/client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useParams } from 'next/navigation'

export const updateGroupUser = async ({
  uid,
  groupId,
  data,
}: any): Promise<void> => {
  if (!uid || !groupId) {
    throw new Error('....')
  }

  const route = `groups/${groupId}/users/${uid}`

  try {
    const userRef = doc(firestore, route)

    await updateDoc(userRef, {
      ...data,
    })
  } catch (err) {
    console.log('🚀 ~ err:', err)

    throw new Error('....')
  }
}

export const useUpdateGroupUser = () => {
  const queryClient = useQueryClient()
  const params = useParams()
  const groupId =
    typeof params.groupId === 'string'
      ? params.groupId
      : params.groupId?.[0]

  const mutate = useMutation({
    mutationFn: updateGroupUser,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['group-user', variables.groupId] })
      queryClient.invalidateQueries({ queryKey: ['group-users', variables.groupId] })
      queryClient.invalidateQueries({ queryKey: ['users-group', variables.groupId] })
      queryClient.invalidateQueries({ queryKey: ['user-data', variables.groupId, variables.uid] })
    },
  })

  return mutate
}