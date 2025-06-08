import { doc, updateDoc } from 'firebase/firestore'

import { firestore } from '@/firebase/client'
import { useMutation, useQueryClient } from '@tanstack/react-query'

type TCreateUserProps = {
  uid?: string
  data: { 
    accountType?: string, 
    document?: {
      type?: string
      number?: number
      }, 
    displayName?: string | null; 
    phone?: number | null
  }
}

export const updateUser = async ({
  uid,
  data,
}: TCreateUserProps): Promise<void> => {
  if (!uid) {
    throw new Error('....')
  }

  const route = `users/${uid}`


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

export const useUpdateUser = () => {
  const queryClient = useQueryClient()

  const mutate = useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] })
    },
  })

  return mutate
}