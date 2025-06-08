import Image from 'next/image'
import Logo from '@/../public/logo.png'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ResetPasswordForm } from './reset-password-form'

export default function ResetPassword() {
  return (
    <div className="flex size-full min-h-dvh flex-col">
      <main className="flex size-full flex-1 items-center justify-center sm:p-5 p-0">
        <Card className="flex justify-center h-auto w-full min-h-dvh sm:max-w-96 sm:min-h-auto rounded-none sm:rounded-[2px]">
          <CardHeader>
            <Image
              alt="Logo"
              src={Logo}
              width={180}
              height={50}
              className="mx-auto mb-4"
            />

            <div>
              <CardTitle>Recuperar senha:</CardTitle>
              <CardDescription>
                Digite seu e-mail para redefinir sua senha.
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent>
            <ResetPasswordForm />
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
