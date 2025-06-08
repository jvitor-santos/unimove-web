import Image from 'next/image'
import Logo from '@/../public/logo.png'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { SignUpPersonForm } from './sign-up-person-form'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { SignUpBusinessForm } from './sign-up-business-form'
export default function SignUp() {
  return (
    <div className="flex size-full min-h-dvh flex-col">
      <main className="flex size-full flex-1 items-center justify-center sm:p-5 p-0">
        <Tabs defaultValue="personal" className="w-full h-auto min-h-dvh sm:max-w-96 sm:min-h-auto">
          <Card className="flex justify-center h-auto w-full min-h-dvh sm:max-w-96 sm:min-h-auto rounded-none sm:rounded-[2px]">
            <Image
              alt="Logo"
              src={Logo}
              width={180}
              height={50}
              className="mx-auto"
            />

            <TabsList className="w-full h-auto sm:max-w-96 px-5 bg-transparent">
              <TabsTrigger value="personal">Pessoal</TabsTrigger>
              <TabsTrigger value="business">Para Empresas</TabsTrigger>
            </TabsList>

            <TabsContent value="personal" className="w-full h-auto">
              <CardHeader>
                <div>
                  <CardTitle>Criar conta:</CardTitle>
                  <CardDescription>
                    Inscreva-se para começar.
                  </CardDescription>
                </div>
              </CardHeader>

              <CardContent>
                <SignUpPersonForm />
              </CardContent>
            </TabsContent>

            <TabsContent value="business">
              <CardHeader>
                <div>
                  <CardTitle>Criar conta:</CardTitle>
                  <CardDescription>
                    Inscreva-se para começar.
                  </CardDescription>
                </div>
              </CardHeader>

              <CardContent>
                <SignUpBusinessForm />
              </CardContent>

            </TabsContent>
          </Card>
        </Tabs>
      </main>
    </div>
  )
}
