'use client'

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Button } from "@/components/ui/button";
import { useGetGroup } from "@/http/user/get-group";
import { formatRolesInvitations, formatStatusInvitations } from "@/utils/format-invitations";
import { formatDate } from "@/utils/formatting/format-date";
import { Separator } from "@/components/ui/separator";
import { useUpdateInvitation } from "@/http/user/update-invitation";
import { useGetUser } from "@/http/user/get-user";
import { useUser } from "@/hooks/use-user";

interface NotificationsCardProps {
  data: any
}

export function NotificationsCard({ data }: NotificationsCardProps) {
  const { currentUser } = useUser()
  const { data: group, isLoading } = useGetGroup(data.groupId)
  const formattedDate = formatDate({ type: 'short', timestamp: data?.created_at })
  
  const { mutate } = useUpdateInvitation()

  function onClick(status: string) {
    mutate({ groupId: data?.groupId, invitationId: data.id, status, userId: currentUser?.uid, role: data?.role })
  }

  return (
    <Card>
      <CardHeader className="relative">
        <span className="absolute text-sm -top-4 right-4">{formattedDate}</span>
        <CardTitle>Convite para o Grupo:</CardTitle>
        <CardDescription>Você foi convidado para participar de um grupo. Veja os detalhes abaixo:</CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-2">
        <p className="text-sm">Status:  <span className={`${formatStatusInvitations[data.status].color} font-bold text-base`}>{formatStatusInvitations[data.status].title}</span></p>
        <Separator />
        <p className="text-sm">Nome do Grupo: <span className="text-base">{group?.name}</span></p>
        <Separator />
        <p className="text-sm">Tipo de Convite: <span className="text-base">{formatRolesInvitations[data.role].title}</span></p>
      </CardContent>

      <CardFooter className="w-full h-auto gap-4 flex justify-center">
        <Button className="text-secondary-foreground bg-red-400" onClick={() => onClick('rejected')}>Recusar</Button>
        <Button className="text-secondary-foreground" onClick={() => onClick('accepted')}>Aceitar</Button>
      </CardFooter>
    </Card>
  )
}