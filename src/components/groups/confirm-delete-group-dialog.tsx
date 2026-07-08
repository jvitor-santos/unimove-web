'use client'

import { useState } from 'react'
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
import { useDeleteGroup } from '@/http/groups/delete-group'

type ConfirmDeleteGroupDialogProps = {
  isOpen: boolean
  onClose: () => void
  groupId: string
}

export function ConfirmDeleteGroupDialog({ isOpen, onClose, groupId }: ConfirmDeleteGroupDialogProps) {
  const router = useRouter()
  const { mutateAsync: deleteGroup, isPending } = useDeleteGroup()

  const handleDelete = async () => {
    try {
      await deleteGroup({ groupId })
      toast.success('Grupo apagado com sucesso!')
      onClose()
      router.push('/')
    } catch (error) {
      toast.error('Erro ao apagar o grupo.')
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-left">Apagar Grupo</DialogTitle>
          <DialogDescription className="text-left">
            Tem certeza que deseja apagar este grupo? Esta ação não pode ser desfeita e removerá o grupo de todos os membros.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose} disabled={isPending}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={isPending}>
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Apagar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
