import { doc, getDoc } from 'firebase/firestore'

import { firestore } from '@/firebase/client'
import { useQuery, UseQueryResult } from '@tanstack/react-query'

import { useUser } from '@/hooks/use-user'

type TGetUserProps = {
  uid?: string
}

type TGetUserResponse = any

export const getUser = async ({
  uid,
}: TGetUserProps): Promise<TGetUserResponse> => {
  if (!uid) {
    return
  }

  const route = `users/${uid}`

  try {
    const userRef = doc(firestore, route)

    const userSnapshot = await getDoc(userRef)

    if (!userSnapshot.exists()) {
      return null
    }

    const user = userSnapshot.data() as any

    return user
  } catch (err) {
    console.log('🚀 ~ err:', err)

    throw new Error('....')
  }
}

export const useGetUser = (): UseQueryResult<any> => {
  const { currentUser } = useUser()

  return useQuery({
    queryKey: ['user', currentUser?.uid],
    queryFn: () => getUser({ uid: currentUser?.uid }),
    enabled: !!currentUser?.uid,
    staleTime: 60 * 60 * 24,
  })
}