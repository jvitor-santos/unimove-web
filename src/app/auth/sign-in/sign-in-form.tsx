'use client'

import { useState } from 'react';
import NextLink from 'next/link'
import { useRouter } from 'next/navigation';

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { signIn } from '@/http/user/user-sign-in';
import { signInSchema } from "./sign-in-form-schema";
import { Separator } from '@/components/ui/separator';

export function SignInForm() {
  const { push } = useRouter()
  const [loading, setLoading] = useState(false)

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  async function onSubmit(values: z.infer<typeof signInSchema>) {
    setLoading(true)

    await signIn(values)
      .then(() => {
        setTimeout(() => {
          push('/')
        }, 500)
      })
      .catch((err) => {
        console.log("🚀 ~ onSubmit ~ err:", err)

        setLoading(false)
      })
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="h-auto w-full flex flex-col gap-4"
      >
        <div className="h-auto w-full grid grid-cols-1 gap-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="col-span-1">
                <FormLabel>Email:</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Informe seu email:"
                    type="text"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="col-span-1">
                <FormLabel>Senha:</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Informe sua senha:"
                    type="password"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          <NextLink href={'/auth/reset-password'} className="min-w-max text-right text-xs text-muted-foreground hover:underline col-span-1">
            Esqueceu sua senha?
          </NextLink>

          <Button type="submit" disabled={loading} className='col-span-1 text-secondary-foreground'>
            {loading ? <Loader2 className="size-4 animate-spin" /> : 'Entrar'}
          </Button>

          <div className="flex h-auto items-center gap-2 col-span-1">
            <Separator className="shrink" />

            <span className="min-w-max text-xs text-muted-foreground">
              Não tem uma conta?
            </span>

            <Separator className="shrink" />
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={() => push('/auth/sign-up')}
            disabled={loading}
            className="col-span-1"
          >
            Criar conta
          </Button>
        </div>
      </form>
    </Form>
  )
}
