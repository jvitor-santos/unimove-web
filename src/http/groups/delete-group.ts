import { deleteDoc, doc } from 'firebase/firestore'

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

    await deleteDoc(groupRef)
  } catch (err) {
    console.log('🚀 ~ err:', err)

    throw new Error('....')
  }
}
