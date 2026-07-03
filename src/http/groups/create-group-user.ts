import { useMutation, useQueryClient } from '@tanstack/react-query'
import { collection, doc, setDoc } from 'firebase/firestore'

import { firestore } from '@/firebase/client'
import { useParams } from 'next/navigation'

export const createGroup = async ({
  uid,
  groupId,
  data,
}: any): Promise<void> => {
  if (!uid || !groupId) {
    throw new Error('....')
  }

  const route = `groups/${groupId}/users/${uid}`

  try {
    const groupRef = doc(firestore, route)

    await setDoc(groupRef, {
      ...data,
    },)
  } catch (err) {
    console.log('🚀 ~ err:', err)

    throw new Error('....')
  }
}

export const useCreateGroupUser = () => {
  const queryClient = useQueryClient()
  const params = useParams()
  const groupId =
    typeof params.groupId === 'string'
      ? params.groupId
      : params.groupId?.[0]

  const mutate = useMutation({
    mutationFn: createGroup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`group-user`, groupId] })
      queryClient.invalidateQueries({ queryKey: [`group-users`, groupId] })
      queryClient.invalidateQueries({ queryKey: [`users-group`, groupId] })
    },
  })

  return mutate
}
