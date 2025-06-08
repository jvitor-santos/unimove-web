'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { resetPassword } from '@/http/user/user-reset-password';
import { resetPasswordSchema } from "./reset-password-form-schema";
import { Separator } from '@/components/ui/separator';

export function ResetPasswordForm() {
  const { push } = useRouter()
  const [loading, setLoading] = useState(false)

  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: '',
    },
  })

  async function onSubmit(values: z.infer<typeof resetPasswordSchema>) {
    setLoading(true)

    await resetPassword(values)
      .then(() => {
        setTimeout(() => {
          push('/auth/sign-in')
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

          <p className="min-w-max text-xs text-muted-foreground col-span-1">
            Um email de redefinição será enviado.
          </p>

          <Button type="submit" disabled={loading} className='col-span-1 text-secondary-foreground'>
            {loading ? <Loader2 className="size-4 animate-spin" /> : 'Enviar'}
          </Button>

          <div className="flex h-auto items-center gap-2 col-span-1">
            <Separator className="shrink" />

            <span className="min-w-max text-xs text-muted-foreground">
              Já possui uma conta?
            </span>

            <Separator className="shrink" />
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={() => push('/auth/sign-in')}
            disabled={loading}
            className="col-span-1"
          >
            Entrar
          </Button>
        </div>
      </form>
    </Form>
  )
}
