import { useMutation, useQueryClient } from '@tanstack/react-query'
import { addDoc, collection } from 'firebase/firestore'

import { firestore } from '@/firebase/client'

type TCreateGroupProps = {
  uid?: string | null
  data: {
    name: string
  }
}

export const createGroup = async ({
  uid,
  data,
}: TCreateGroupProps): Promise<void> => {
  if (!uid) {
    throw new Error('....')
  }

  const route = `groups`

  try {
    const groupRef = collection(firestore, route)

    await addDoc(groupRef, {
      ...data,
      ownerId: uid,
      users: [uid],
    })
  } catch (err) {
    console.log('🚀 ~ err:', err)

    throw new Error('....')
  }
}

export const useCreateGroup = () => {
  const queryClient = useQueryClient()

  const mutate = useMutation({
    mutationFn: createGroup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] })
    },
  })

  return mutate
}
