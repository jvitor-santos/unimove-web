'use client'

import { useEffect } from 'react';

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { profileBusinessSchema } from "./profile-business-form-schema";
import { Separator } from '@/components/ui/separator';
import { useUpdateUser } from '@/http/user/update-user';
import { useUser } from '@/hooks/use-user';
import { useGetUser } from '@/http/user/get-user';

export function ProfileBusinessForm() {
  const { currentUser } = useUser()

  const form = useForm<z.infer<typeof profileBusinessSchema>>({
    resolver: zodResolver(profileBusinessSchema),
    defaultValues: {
      cnpj: '',
      displayName: '',
      phone: '',
    },
  })

  const { data } = useGetUser()
  const { mutate, isPending } = useUpdateUser()

  const formatCNPJ = (value: string) => {
    const digits = value.replace(/\D/g, "");
    return digits
      .replace(/^(\d{2})(\d)/, "$1.$2")
      .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/^(\d{2})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3/$4")
      .replace(/^(\d{2})\.(\d{3})\.(\d{3})\/(\d{4})(\d{1,2})/, "$1.$2.$3/$4-$5")
      .slice(0, 18);
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

  console.log(form.formState.errors)

  const cnpj = form.watch("cnpj");
  const phone = form.watch("phone")

  async function onSubmit(values: z.infer<typeof profileBusinessSchema>) {
    const data = {
      document: {
        type: 'CNPJ',
        number: Number(values.cnpj),
      },
      displayName: values.displayName,
      phone: Number(values.phone),
    }

    mutate({ uid: currentUser?.uid, data })
  }

  useEffect(() => {
    form.setValue('displayName', data?.displayName || '')
    form.setValue('cnpj', data?.document?.number ? formatCNPJ(String(data?.document?.number)) : '')
    form.setValue('phone', data?.phone ? formatPhone(String(data?.phone)) : '')
  }, [data?.displayName])

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
            name="cnpj"
            render={({ field }) => (
              <FormItem className="col-span-1">
                <FormLabel>CPF:</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Informe seu CPF:"
                    type="text"
                    {...field}
                    value={cnpj}
                    onChange={(e) => form.setValue("cnpj", formatCNPJ(e.target.value))}
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

          <Button type="submit" disabled={isPending} className='col-span-1 text-secondary-foreground'>
            {isPending ? <Loader2 className="size-4 animate-spin" /> : 'Atualizar'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
