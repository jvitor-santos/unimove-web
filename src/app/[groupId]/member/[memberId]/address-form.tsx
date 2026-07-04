'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, BusFront, Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { getPostalCodeAPI } from '@/http/utils/get-postal-code-api'
import { UFs } from '@/utils/ufs'
import { useUpdateGroupUser } from '@/http/groups/update-group-user'
import { useUser } from '@/hooks/use-user'
import { useParams, useRouter } from 'next/navigation'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { useGetUserGroup } from '@/http/groups/get-user-group'
import { useCreateGroupUser } from '@/http/groups/create-group-user'
import { useGetGroup } from '@/http/groups/get-group'
import { useGetUser } from '@/http/user/get-user'

export const addressSchema = z.object({
  boardingStatus: z.boolean(),
  weeklyRoutine: z.array(z.string()).optional(),
  address: z.object({
    street: z.string().min(1, 'A rua é obrigatória.'),
    number: z.string().min(1, 'O número é obrigatório.'),
    neighborhood: z.string().min(1, 'O bairro é obrigatório.'),
    city: z.string().min(1, 'A cidade é obrigatória.'),
    state: z.string().min(1, 'O Estado obrigatório.'),
    additionalInformation: z.string().optional(),
    reference: z.string().optional(),
    zipCode: z.string().min(1, 'O CEP é obrigatório.'),
    location: z.string().optional(),
  }),
})

export function AddressForm() {
  const { push } = useRouter()
  const { currentUser } = useUser()
  const params = useParams()
  const groupId =
    typeof params.groupId === 'string'
      ? params.groupId
      : params.groupId?.[0]

  const memberId =
    typeof params.memberId === 'string'
      ? params.memberId
      : params.memberId?.[0]

  const isMyUserId = currentUser?.uid === memberId
  const { data: userProfile, isLoading: isLoadingUserProfile } = useGetUser()
  const isBusiness = userProfile?.accountType === 'business'
  const canEdit = !isBusiness && isMyUserId

  const { mutate: mutateCreate, isSuccess: isSuccessCreate } = useCreateGroupUser()
  const { mutate: mutateUpdate, isSuccess: isSuccessUpdate } = useUpdateGroupUser()
  const { data: userData, isLoading } = useGetUserGroup(groupId!, memberId!)
  const { data: group } = useGetGroup()

  const isDriver = group?.drivers?.includes(memberId!) ?? false

  const form = useForm<z.infer<typeof addressSchema>>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      boardingStatus: true,
      weeklyRoutine: [],
      address: {
        zipCode: '',
        street: '',
        number: '',
        neighborhood: '',
        city: '',
        state: '',
        additionalInformation: '',
        reference: '',
        location: '',
      },
    },
  })

  const watchZipCode = form.watch('address.zipCode')?.replace(/[^\d]/g, '')

  async function onSubmit(values: z.infer<typeof addressSchema>) {
    if (userData) {
      mutateUpdate({ uid: memberId, groupId: groupId, data: values })
    } else {
      mutateCreate({ uid: memberId, groupId: groupId, data: values })
    }
  }

  useEffect(() => {
    if (isSuccessCreate || isSuccessUpdate) {
      push(`/${groupId}`)
    }
  }, [isSuccessCreate, isSuccessUpdate])

  useEffect(() => {
    if (userData) {
      form.setValue('boardingStatus', userData.boardingStatus ?? true)
      form.setValue('weeklyRoutine', userData.weeklyRoutine ?? [])
      if (userData.address) {
        form.setValue('address.zipCode', userData.address.zipCode ?? '')
        form.setValue('address.street', userData.address.street ?? '')
        form.setValue('address.number', userData.address.number ?? '')
        form.setValue('address.neighborhood', userData.address.neighborhood ?? '')
        form.setValue('address.city', userData.address.city ?? '')
        form.setValue('address.state', userData.address.state ?? '')
        form.setValue('address.additionalInformation', userData.address.additionalInformation ?? '')
        form.setValue('address.reference', userData.address.reference ?? '')
        form.setValue('address.location', userData.address.location ?? '')
      }
    }
  }, [userData, form])

  useEffect(() => {
    if (watchZipCode?.length === 8) {
      getPostalCodeAPI(watchZipCode)
        .then((address) => {
          form.clearErrors()

          const addressFields = {
            ...(address.rua && { street: address.rua }),
            ...(address.bairro && { neighborhood: address.bairro }),
            ...(address.cidade && { city: address.cidade }),
            ...(address.estado && { state: address.estado }),
          }

          Object.entries(addressFields).forEach(([key, value]) => {
            form.setValue(
              `address.${key as keyof typeof addressFields}`,
              value,
            )
          })
        })
        .catch((error: any) => {
          console.error('Erro ao buscar o zipCode:', error)
        })
    }
  }, [form, watchZipCode])

  return (
    <div className="flex flex-col gap-4 w-full">
      <Button
        variant="ghost"
        className="w-fit pl-0 text-muted-foreground hover:text-foreground flex items-center gap-2"
        onClick={() => push(`/${groupId}`)}
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar para a lista de membros
      </Button>

      {isLoading || isLoadingUserProfile || !currentUser ? (
        <div className="w-full h-auto py-8 px-4 flex justify-center">
          <span>Carregando...</span>
        </div>
      ) : isDriver ? (
        <div className="flex h-auto w-full flex-col gap-4 rounded-[2px] border border-l-4 border-l-primary p-6 bg-muted/20">
          <h2 className="text-lg font-normal flex items-center gap-2">
            <BusFront className="h-5 w-5 text-primary" />
            {isMyUserId ? 'Sua Conta de Motorista' : 'Conta de Motorista'}
          </h2>
          <p className="text-sm text-muted-foreground">
            {isMyUserId
              ? 'Você é o motorista deste grupo. Como motorista, você não precisa inserir seus dados de localização ou confirmar presença para embarque.'
              : 'Este usuário é o motorista deste grupo. Motoristas não possuem dados de localização ou status de embarque.'}
          </p>
        </div>
      ) : (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex h-auto w-full flex-col gap-4"
          >
            <div className="flex h-auto w-full flex-col gap-4">
              <div className="flex h-auto w-full flex-col gap-4 rounded-[2px] border border-l-4 border-l-primary p-4">
                {!isBusiness && (
                  <>
                    <div className="flex h-auto w-full flex-col">
                      <h2 className="text-lg font-extralight">Confirme sua Presença:</h2>

                      <h3 className="text-sm font-extralight text-muted-foreground">
                        Use este switch para nos informar se você irá embarcar na van. Por favor, ative-o (ligado/azul) se você vai embarcar ou desative-o (desligado/cinza) se não for. Sua confirmação é importante para organizarmos a rota e garantirmos que ninguém fique para trás.
                      </h3>
                    </div>

                    <div className='felx h-auto w-full flex-col'>
                      <FormField
                        control={form.control}
                        name="boardingStatus"
                        render={({ field }) => (
                          <FormItem className="col-span-10 flex flex-row items-center gap-4">
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                disabled={!canEdit}
                              />
                            </FormControl>

                            <div className="space-y-0.5">
                              <FormLabel className="text-base">

                              </FormLabel>
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="flex h-auto w-full flex-col mt-4 gap-2">
                      <h2 className="text-lg font-extralight">Rotina Semanal de Viagens:</h2>
                      <h3 className="text-sm font-extralight text-muted-foreground">
                        Selecione os dias da semana em que você normalmente utiliza a van. Isso ajudará no cálculo de vagas disponíveis.
                      </h3>
                      <div className="flex flex-wrap gap-4 mt-2 mb-4">
                        {['seg', 'ter', 'qua', 'qui', 'sex'].map((day) => {
                          const dayNames: Record<string, string> = {
                            seg: 'Segunda',
                            ter: 'Terça',
                            qua: 'Quarta',
                            qui: 'Quinta',
                            sex: 'Sexta',
                          }
                          const currentValue = form.watch('weeklyRoutine') ?? []
                          const isChecked = currentValue.includes(day)

                          return (
                            <label key={day} className="flex items-center gap-2 cursor-pointer text-sm">
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={(e) => {
                                  const checked = e.target.checked
                                  if (checked) {
                                    form.setValue('weeklyRoutine', [...currentValue, day])
                                  } else {
                                    form.setValue('weeklyRoutine', currentValue.filter((d: string) => d !== day))
                                  }
                                }}
                                disabled={!canEdit}
                                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary bg-background dark:bg-zinc-900"
                              />
                              {dayNames[day]}
                            </label>
                          )
                        })}
                      </div>
                    </div>

                    <Separator />
                  </>
                )}

                <div className="flex h-auto w-full flex-col">
                  <h2 className="text-lg font-extralight">Origem:</h2>

                  <h3 className="text-sm font-extralight text-muted-foreground">
                    Mantenha o endereço de origem sempre atualizado.
                    Essas informações são usadas para localização.
                  </h3>
                </div>

                <div className="grid grid-cols-1 grid-rows-2 gap-4">
                  <FormField
                    control={form.control}
                    name="address.zipCode"
                    render={({ field }) => (
                      <FormItem className="col-span-1">
                        <FormLabel>CEP: *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Informe o CEP:"
                            type="text"
                            {...field}
                            disabled={!canEdit}
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="address.street"
                    render={({ field }) => (
                      <FormItem className="col-span-1">
                        <FormLabel>Endereço: *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Informe endereço:"
                            type="text"
                            {...field}
                            disabled={!canEdit}
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="address.number"
                    render={({ field }) => (
                      <FormItem className="col-span-1">
                        <FormLabel>Número: *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Informe o número:"
                            type="text"
                            {...field}
                            disabled={!canEdit}
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="address.neighborhood"
                    render={({ field }) => (
                      <FormItem className="col-span-1">
                        <FormLabel>Bairro: *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Informe o bairro:"
                            type="text"
                            {...field}
                            disabled={!canEdit}
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="address.city"
                    render={({ field }) => (
                      <FormItem className="col-span-1">
                        <FormLabel>Cidade: *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Informe a cidade:"
                            type="text"
                            {...field}
                            disabled={!canEdit}
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="address.state"
                    render={({ field }) => (
                      <FormItem className="col-span-1">
                        <FormLabel>Estado: *</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                          disabled={!canEdit}
                        >
                          <FormControl>
                            <SelectTrigger className='w-full'>
                              <SelectValue placeholder="Selecione o estado" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {UFs.map((item) => (
                              <SelectItem key={item.id} value={item.sigla}>
                                {item.nome}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="address.additionalInformation"
                    render={({ field }) => (
                      <FormItem className="col-span-1">
                        <FormLabel>Complemento:</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Informe o complemento:"
                            type="text"
                            {...field}
                            disabled={!canEdit}
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="address.reference"
                    render={({ field }) => (
                      <FormItem className="col-span-1">
                        <FormLabel>Referência:</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Informe a referência:"
                            type="text"
                            {...field}
                            disabled={!canEdit}
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="address.location"
                    render={({ field }) => (
                      <FormItem className="col-span-1">
                        <FormLabel>Localização:</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Informe a localização:"
                            type="text"
                            {...field}
                            disabled={!canEdit}
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {canEdit && (
                <Button type="submit" className="w-full text-secondary-foreground">
                  Atualizar
                </Button>
              )}
            </div>
          </form>
        </Form>
      )}
    </div>
  )
}
