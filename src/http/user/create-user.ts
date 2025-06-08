import { doc, setDoc } from 'firebase/firestore'

import { firestore } from '@/firebase/client'

type TCreateUserProps = {
  uid: string
  data: { 
    accountType?: string, 
    document?: {
      type?: string
      number?: number
      }, 
    displayName?: string | null; 
    email?: string | null,
    phone?: number | null
  }
}

export const createUser = async ({
  uid,
  data,
}: TCreateUserProps): Promise<void> => {
  const route = `users/${uid}`

  try {
    const userRef = doc(firestore, route)

    await setDoc(userRef, {
      ...data,
    })
  } catch (err) {
    console.log('🚀 ~ err:', err)

    throw new Error('....')
  }
}
