import { doc, updateDoc } from 'firebase/firestore'

import { firestore } from '@/firebase/client'

type TUpdateGroupProps = {
  data: any
  groupId: string
}

export const updateGroup = async ({
  data,
  groupId,
}: TUpdateGroupProps): Promise<void> => {
  if (!groupId) {
    throw new Error('....')
  }

  const route = `groups/${groupId}`

  try {
    const groupRef = doc(firestore, route)

    await updateDoc(groupRef, {
      ...data,
    })
  } catch (err) {
    console.log('🚀 ~ err:', err)

    throw new Error('....')
  }
}
