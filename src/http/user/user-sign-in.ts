import { AuthError, signInWithEmailAndPassword, UserCredential } from 'firebase/auth'

import { auth } from '@/firebase/client'
import { AuthErrorCustom } from '@/lib/auth/auth-error-custom'

import { setCookie } from 'cookies-next/client'

export type TUserSignInProps = {
  email: string
  password: string
}

export const signIn = async ({
  email,
  password,
}: TUserSignInProps): Promise<void> => {
 

  try {
    const res: UserCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password,
    )

    const token = await res?.user?.getIdToken()
    const { uid } = res?.user

    setCookie('token', token)
    setCookie('uid', uid)
  } catch (err) {
    console.error('🚀 ~ err:', err)

    if ((err as AuthError)?.code) {
      const { code, message } = err as AuthError

      throw new AuthErrorCustom(code, message)
    }

    throw new AuthErrorCustom('unknown/error', 'Erro desconhecido.')
  }
}
