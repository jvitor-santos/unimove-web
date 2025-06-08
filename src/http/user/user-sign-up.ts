import { AuthError, createUserWithEmailAndPassword, UserCredential } from 'firebase/auth'

import { auth } from '@/firebase/client'
import { AuthErrorCustom } from '@/lib/auth/auth-error-custom'

import { setCookie } from 'cookies-next/client'
import { createUser } from './create-user'

export type TUserSignUpProps = {
  accountType: string
  document: {
    type: string
    number: number
  }
  displayName: string
  email: string
  password: string
  phone: number
}

export const signUp = async ({
  accountType,
  document,
  displayName,
  email,
  password,
  phone,
}: TUserSignUpProps): Promise<void> => {
  try {
    const res: UserCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    )

    const token = await res?.user?.getIdToken()
    const { uid } = res?.user

    await createUser({ uid, data: { accountType, document, displayName, email, phone } })

    setCookie('token', token)
  } catch (err) {
    console.error('🚀 ~ err:', err)

    if ((err as AuthError)?.code) {
      const { code, message } = err as AuthError

      throw new AuthErrorCustom(code, message)
    }

    throw new AuthErrorCustom('unknown/error', 'Erro desconhecido.')
  }
}
