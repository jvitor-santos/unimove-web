'use client'

import { Trash2 } from 'lucide-react'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { useDeleteInvitation } from '@/http/invitations/delete-invitation'

type TDeleteInvitationDialogAlertProps = {
  id: string
}

export function DeleteInvitationDialogAlert({
  id,
}: TDeleteInvitationDialogAlertProps) {
  const { mutate, isPending } = useDeleteInvitation()

  function handleDeleteCategory() {
    mutate({ id })
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button size="sm" variant="outline" className="w-full text-secondary-foreground">
          <Trash2 />
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className='text-left'>Excluir convite:</AlertDialogTitle>
          <AlertDialogDescription className='text-left'>
            Ao confirmar, o convite será removida do sistema e não poderá ser
            recuperada.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cencelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleDeleteCategory} disabled={isPending} className='text-secondary-foreground bg-red-400'>
            Confirmar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
