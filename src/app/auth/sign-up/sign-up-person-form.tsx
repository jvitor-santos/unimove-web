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

import { signUp } from '@/http/user/user-sign-up';
import { signUpPersonSchema } from "./sign-up-person-form-schema";
import { Separator } from '@/components/ui/separator';

export function SignUpPersonForm() {
  const { push } = useRouter()
  const [loading, setLoading] = useState(false)

  const form = useForm<z.infer<typeof signUpPersonSchema>>({
    resolver: zodResolver(signUpPersonSchema),
    defaultValues: {
      cpf: '',
      displayName: '',
      phone: '',
      email: '',
      password: '',
      confirmpPassword: '',
    },
  })

  const formatCPF = (value: string) => {
    const digits = value.replace(/\D/g, "");
    return digits
      .replace(/^(\d{3})(\d)/, "$1.$2")
      .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d{1,2})/, "$1.$2.$3-$4")
      .slice(0, 14);
  }

  function formatPhone(value: string) {
    const digits = value.replace(/\D/g, "");

    if (digits.length <= 10) {
      return digits
        .replace(/^(\d{2})(\d)/, "($1) $2")
        .replace(/(\d{4})(\d)/, "$1-$2")
        .slice(0, 14);
    } else {
      return digits
        .replace(/^(\d{2})(\d)/, "($1) $2")
        .replace(/(\d{5})(\d)/, "$1-$2")
        .slice(0, 15);
    }
  }

  const cpf = form.watch("cpf");
  const phone = form.watch("phone")

  async function onSubmit(values: z.infer<typeof signUpPersonSchema>) {
    setLoading(true)

    const data = {
      accountType: 'personal',
      document: {
        type: 'CPF',
        number: Number(values.cpf),
      },
      displayName: values.displayName,
      email: values.email,
      password: values.password,
      phone: Number(values.phone),
    }

    await signUp(data)
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
          <div className="flex flex-col w-full h-auto gap-1">
            <h2 className="font-bold">Dados pessois:</h2>
            <Separator />
          </div>

          <FormField
            control={form.control}
            name="displayName"
            render={({ field }) => (
              <FormItem className="col-span-1">
                <FormLabel>Nome:</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Informe seu nome:"
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
            name="cpf"
            render={({ field }) => (
              <FormItem className="col-span-1">
                <FormLabel>CPF:</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Informe seu CPF:"
                    type="text"
                    {...field}
                    value={cpf}
                    onChange={(e) => form.setValue("cpf", formatCPF(e.target.value))}
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem className="col-span-1">
                <FormLabel>Telefone:</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Informe o telefone:"
                    type="text"
                    {...field}
                    value={phone}
                    onChange={(e) => form.setValue("phone", formatPhone(e.target.value))}
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          <div className="flex flex-col w-full h-auto gap-1">
            <h2 className="font-bold">Acesso:</h2>
            <Separator />
          </div>

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

          <FormField
            control={form.control}
            name="confirmpPassword"
            render={({ field }) => (
              <FormItem className="col-span-1">
                <FormLabel>Confirmar Senha:</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Confirme sua senha:"
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
            {loading ? <Loader2 className="size-4 animate-spin" /> : 'Criar'}
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
