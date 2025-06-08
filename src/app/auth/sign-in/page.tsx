import Image from 'next/image'
import Logo from '@/../public/logo.png'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { SignInForm } from './sign-in-form'

export default function SignIn() {
  return (
    <div className="flex size-full min-h-dvh flex-col">
      <main className="flex size-full flex-1 items-center justify-center sm:p-5 p-0">
        <Card className="flex justify-center h-auto w-full min-h-dvh sm:max-w-96 sm:min-h-auto">
          <CardHeader>
            <Image
              alt="Logo"
              src={Logo}
              width={180}
              height={50}
              className="mx-auto mb-4"
            />

            <div>
              <CardTitle>Acessar conta:</CardTitle>
              <CardDescription>
                Entre com suas credenciais para acessar sua conta.
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent>
            <SignInForm />
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
