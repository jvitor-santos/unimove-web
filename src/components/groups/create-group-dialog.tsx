'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Plus } from 'lucide-react'
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
import { useCreateGroup } from '@/http/groups/create-group'

export const dialogFormSchema = z.object({
  name: z.string().min(1, 'O nome do grupo é obrigatório.'),
})

export function CreateGroupDialog() {
  const [isOpen, setIsOpen] = useState(false)

  const { currentUser } = useUser()
  const { mutate, isSuccess } = useCreateGroup()

  const form = useForm<z.infer<typeof dialogFormSchema>>({
    resolver: zodResolver(dialogFormSchema),
    defaultValues: {
      name: '',
    },
  })

  function onSubmit(values: z.infer<typeof dialogFormSchema>) {
    mutate({ uid: currentUser?.uid, data: values })
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
          Criar Turma
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <DialogHeader>
              <DialogTitle className='text-left'>Adicionar novo grupo:</DialogTitle>
              <DialogDescription className='text-left'>
                Crie um novo grupo para organizar alunos e motorista 
                de forma eficiente. Preencha as informações necessárias
                e comece a gerenciar as operações deste local.
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do grupo:</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Digite o nome do grupo:"
                        type="text"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button type="submit" className='w-full text-secondary-foreground'>Criar</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
