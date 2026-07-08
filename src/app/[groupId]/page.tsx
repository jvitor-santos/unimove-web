'use client'

import * as React from 'react'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { toast } from 'sonner'
import { Loader2, LogOut, Trash2 } from 'lucide-react'

import { Footer } from "@/components/footer"
import { GuestMembersTable } from "@/components/guest-members/guest-members-table"
import { Header } from "@/components/header"
import { MembersTable } from "@/components/members/members-table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useGetUser } from "@/http/user/get-user"
import { useGetGroup } from "@/http/groups/get-group"
import { useUpdateGroup } from "@/http/groups/update-group"
import { WeeklySeatsDashboard } from "@/components/group/weekly-seats-dashboard"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ConfirmDeleteGroupDialog } from '@/components/groups/confirm-delete-group-dialog'
import { ConfirmRemoveMemberDialog } from '@/components/members/confirm-remove-member-dialog'

export default function Group() {
  const params = useParams()
  const groupId = typeof params.groupId === 'string' ? params.groupId : params.groupId?.[0]

  const { data: currentUser } = useGetUser()
  const { data: group } = useGetGroup()
  const { mutateAsync: updateGroup, isPending: isUpdatingCapacity } = useUpdateGroup()

  const [capacityInput, setCapacityInput] = useState<string>('')
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isLeaveDialogOpen, setIsLeaveDialogOpen] = useState(false)

  useEffect(() => {
    if (group?.capacity !== undefined) {
      setCapacityInput(String(group.capacity))
    } else {
      setCapacityInput('15')
    }
  }, [group?.capacity])

  const isDriver = group?.drivers?.includes(currentUser?.id) ?? false
  const isOwner = group?.ownerId === currentUser?.id
  const isCurrentUserDriverOrOwner = isDriver || isOwner

  const handleSaveCapacity = async () => {
    if (!groupId) return
    const numericCapacity = Number(capacityInput)
    if (isNaN(numericCapacity) || numericCapacity <= 0) {
      toast.error('Por favor, informe uma capacidade válida (maior que 0).')
      return
    }

    try {
      await updateGroup({
        groupId,
        data: {
          capacity: numericCapacity,
        },
      })
      toast.success('Capacidade da van atualizada com sucesso!')
    } catch (err) {
      toast.error('Erro ao atualizar capacidade da van.')
    }
  }
  
  return (
    <div className="flex flex-col h-dvh">
      <Header />

      <main className="flex-1 flex flex-col items-center min-h-0">
        <div className="w-full h-full">
          <ScrollArea className="h-full p-4">
            
            {/* Group Actions */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-[4px] border border-muted bg-muted/5 mb-4">
              <div className="flex flex-col gap-1">
                <span className="text-sm font-medium">Ações do Grupo</span>
                <span className="text-xs text-muted-foreground">Opções disponíveis para o grupo atual.</span>
              </div>
              <div className="flex items-center gap-2">
                {!isOwner && (
                  <Button variant="outline" className="text-red-500 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20" onClick={() => setIsLeaveDialogOpen(true)}>
                    <LogOut className="w-4 h-4 mr-2" /> Sair do Grupo
                  </Button>
                )}
                {isOwner && (
                  <Button variant="destructive" onClick={() => setIsDeleteDialogOpen(true)}>
                    <Trash2 className="w-4 h-4 mr-2" /> Apagar Grupo
                  </Button>
                )}
              </div>
            </div>

            {/* Driver/Owner capacity configuration panel */}
            {isCurrentUserDriverOrOwner && (
              <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-[4px] border border-muted bg-muted/5 mb-4">
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium">Configuração da Van</span>
                  <span className="text-xs text-muted-foreground">Defina a capacidade de assentos disponíveis para transporte.</span>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={capacityInput}
                    onChange={(e) => setCapacityInput(e.target.value)}
                    className="w-24 h-9"
                    min={1}
                    disabled={isUpdatingCapacity}
                  />
                  <Button 
                    onClick={handleSaveCapacity} 
                    disabled={isUpdatingCapacity}
                    size="sm"
                    className="h-9 text-secondary-foreground"
                  >
                    {isUpdatingCapacity ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      'Salvar'
                    )}
                  </Button>
                </div>
              </div>
            )}

            {/* Weekly seat occupancy dashboard */}
            <WeeklySeatsDashboard />

            {currentUser?.accountType === "business" && (
              <Tabs defaultValue="members" className="w-full h-auto">
                <TabsList className="w-full h-auto bg-transparent p-0">
                  <TabsTrigger value="members">Membros</TabsTrigger>
                  <TabsTrigger value="invitations">Convites</TabsTrigger>
                </TabsList>

                <TabsContent value="members" className="w-full h-auto">
                  <MembersTable />
                </TabsContent>

                <TabsContent value="invitations">
                  <GuestMembersTable />
                </TabsContent>
              </Tabs>
            )}

            {currentUser?.accountType === "personal" && (
              <MembersTable />
            )}
          </ScrollArea>
        </div>
      </main>

      <Footer />

      {isDeleteDialogOpen && groupId && (
        <ConfirmDeleteGroupDialog
          isOpen={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
          groupId={groupId}
        />
      )}

      {isLeaveDialogOpen && groupId && currentUser && (
        <ConfirmRemoveMemberDialog
          isOpen={isLeaveDialogOpen}
          onClose={() => setIsLeaveDialogOpen(false)}
          groupId={groupId}
          userId={currentUser.id}
          userName={currentUser.displayName}
        />
      )}
    </div>
  );
}
