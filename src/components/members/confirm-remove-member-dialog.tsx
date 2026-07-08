'use client'

import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useRemoveGroupUser } from '@/http/groups/remove-group-user'
import { useGetUser } from '@/http/user/get-user'

type ConfirmRemoveMemberDialogProps = {
  isOpen: boolean
  onClose: () => void
  groupId: string
  userId: string
  userName: string
}

export function ConfirmRemoveMemberDialog({ isOpen, onClose, groupId, userId, userName }: ConfirmRemoveMemberDialogProps) {
  const router = useRouter()
  const { data: currentUser } = useGetUser()
  const { mutateAsync: removeUser, isPending } = useRemoveGroupUser()

  const isLeaving = currentUser?.id === userId

  const handleRemove = async () => {
    try {
      await removeUser({ groupId, userId })
      
      if (isLeaving) {
        toast.success('Você saiu do grupo com sucesso!')
        onClose()
        router.push('/')
      } else {
        toast.success('Membro removido com sucesso!')
        onClose()
      }
    } catch (error) {
      toast.error(isLeaving ? 'Erro ao sair do grupo.' : 'Erro ao remover membro.')
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-left">
            {isLeaving ? 'Sair do Grupo' : 'Remover Membro'}
          </DialogTitle>
          <DialogDescription className="text-left">
            {isLeaving 
              ? 'Tem certeza que deseja sair deste grupo? Você perderá acesso às informações e rotas do grupo.'
              : `Tem certeza que deseja remover ${userName} do grupo? O usuário perderá o acesso a este grupo.`
            }
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose} disabled={isPending}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={handleRemove} disabled={isPending}>
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : (isLeaving ? 'Sair' : 'Remover')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
