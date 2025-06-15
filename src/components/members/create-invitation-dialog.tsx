'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useUser } from '@/hooks/use-user'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { TCreateInvitationProps, useCreateInvitation } from '@/http/invitations/create-invitation'
import { useParams } from 'next/navigation'

export const dialogFormSchema = z.object({
  email: z
    .string()
    .min(1, 'O email é obrigatório.')
    .email('O formato do email é inválido.'),
  role: z.string().nonempty({ message: "O tipo de membro é obrigatório." }),
})

export function CreateInvitationDialog() {
    const params = useParams()
    const groupId =
      typeof params.groupId === 'string'
        ? params.groupId
        : params.groupId?.[0]
        
  const [isOpen, setIsOpen] = useState(false)

  const { currentUser } = useUser()
  const { mutate, isSuccess } = useCreateInvitation()

  const form = useForm<z.infer<typeof dialogFormSchema>>({
    resolver: zodResolver(dialogFormSchema),
    defaultValues: {
      email: '',
    },
  })

  function onSubmit(values: z.infer<typeof dialogFormSchema>) {
    const data = {
      ...values,
      ownerId: currentUser?.uid,
      groupId: groupId,
    }
   
    mutate(data as TCreateInvitationProps)
  }

  useEffect(() => {
    if (isSuccess) {
      form.reset()
      setIsOpen(false)
    }
  }, [form, isSuccess])

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full text-secondary-foreground">
          Adicionar membro
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <DialogHeader>
              <DialogTitle className='text-left'>Adicionar membro:</DialogTitle>
              <DialogDescription className='text-left'>
                Adicione alunos e motoristas ao seu grupo para otimizar a organização. Preencha as informações necessárias e comece a gerenciar os membros deste grupo.
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email:</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Informe o email do novo membro:"
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
                name="role"
                render={({ field }) => (
                  <FormItem className='w-full'>
                    <FormLabel>Tipo de membro:</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl className='w-full'>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo de membro:" />
                        </SelectTrigger>
                      </FormControl>
    
                      <SelectContent>
                        <SelectItem value="passenger">Passageiro</SelectItem>
                        <SelectItem value="driver">Motorista</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button type="submit" className='w-full text-secondary-foreground'>Convidar</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
