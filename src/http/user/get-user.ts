import { doc, getDoc, onSnapshot } from 'firebase/firestore'
import { useQuery, UseQueryResult, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'

import { firestore } from '@/firebase/client'
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

    const user = {
      id: userSnapshot.id, 
      ...userSnapshot.data(), 
    } as any

    return user
  } catch (err) {
    console.log('🚀 ~ err:', err)

    throw new Error('....')
  }
}

export const useGetUser = (): UseQueryResult<any> => {
  const { currentUser } = useUser()
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!currentUser?.uid) return

    const route = `users/${currentUser.uid}`
    const userRef = doc(firestore, route)

    const unsubscribe = onSnapshot(userRef, (snapshot) => {
      if (snapshot.exists()) {
        const user = {
          id: snapshot.id,
          ...snapshot.data(),
        } as any

        queryClient.setQueryData(['user', currentUser.uid], user)
      } else {
        queryClient.setQueryData(['user', currentUser.uid], null)
      }
    })

    return () => unsubscribe()
  }, [currentUser?.uid, queryClient])

  return useQuery({
    queryKey: ['user', currentUser?.uid],
    queryFn: () => getUser({ uid: currentUser?.uid }),
    enabled: !!currentUser?.uid,
    staleTime: Infinity,
  })
}