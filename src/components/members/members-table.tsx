'use client'

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table'
import { ArrowUpDown, BusFront, Check, Loader2, Play, Square, User, UserRoundCog, UserMinus, X } from 'lucide-react'
import NextLink from 'next/link'
import { toast } from 'sonner'
import { useStartRoute } from '@/http/groups/start-route'
import { useFinishRoute } from '@/http/groups/finish-route'
import * as React from 'react'
import { useMemo, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useGetUser } from '@/http/user/get-user'
import { CreateInvitationDialog } from './create-invitation-dialog'
import { useGetUsersGroup } from '@/http/groups/get-users-group'
import { useParams } from 'next/navigation'
import { useGetGroup } from '@/http/groups/get-group'
import { useGetGroupUsersDetails } from '@/http/groups/get-users-groups-details'
import { ConfirmRemoveMemberDialog } from './confirm-remove-member-dialog'

export function MembersTable() {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const [userToRemove, setUserToRemove] = useState<{ id: string, name: string } | null>(null)

  const params = useParams()
  const groupId =
    typeof params.groupId === 'string'
      ? params.groupId
      : params.groupId?.[0]

  const { data } = useGetUser()
  const { data: group } = useGetGroup()
  const { data: members, isLoading } = useGetUsersGroup()
  const { data: membersDetails } = useGetGroupUsersDetails()

  const { mutateAsync: startRoute, isPending: isStartingRoute } = useStartRoute()
  const { mutateAsync: finishRoute, isPending: isFinishingRoute } = useFinishRoute()

  const membersList = useMemo(() => {
    return members ?? []
  }, [members])

  const isCurrentUserDriver = group?.drivers?.includes(data?.id) ?? false
  const isRouteActive = group?.isRouteActive ?? false

  const handleStartRoute = async () => {
    if (!groupId || !membersList) return

    const memberIdsToUpdate = membersList
      .filter((member: any) => {
        const isDriver = group?.drivers?.includes(member.id) ?? false
        if (isDriver) return false

        const boardingStatus = membersDetails?.find((m: any) => m.id === member.id)?.boardingStatus
        return boardingStatus !== true
      })
      .map((member: any) => member.id)

    try {
      await startRoute({ groupId, memberIdsToUpdate })
      toast.success('Rota iniciada com sucesso! Os passageiros pendentes foram atualizados para não embarcar.')
    } catch (err) {
      toast.error('Erro ao iniciar a rota.')
    }
  }

  const handleFinishRoute = async () => {
    if (!groupId || !membersDetails) return

    const memberIdsToReset = membersDetails.map((m: any) => m.id)

    try {
      await finishRoute({ groupId, memberIdsToReset })
      toast.success('Rota finalizada com sucesso! A presença de todos os passageiros foi reiniciada.')
    } catch (err) {
      toast.error('Erro ao finalizar a rota.')
    }
  }

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'userBoardingStatus',
      enableResizing: false,
      cell: ({ row }) => {
        const { id } = row.original
        const isDriver = group?.drivers?.includes(id) ?? false

        const boardingStatus = membersDetails?.find((member: any) => member.id === id)?.boardingStatus
 
        if (isDriver) {
          return <div className="flex h-auto justify-end"></div>
        }

        if (boardingStatus === undefined || boardingStatus === null) {
          return <div className="flex h-auto justify-end"></div>
        }

        return (
          <div className="flex h-auto justify-end">
            {boardingStatus ? (
              <Check size={16} className="text-green-500" />
            ) : (
              <X size={16} className="text-red-500" />
            )}
          </div>
        )
      },
      header: '',
      meta: {
        headerClassName: '',
      },
    },
    {
      accessorKey: 'userType',
      enableResizing: false,
      cell: ({ row }) => {
        const { id, } = row.original
        const isDriver = group?.drivers?.includes(id) ?? false

        return (
          <div className="flex h-auto justify-end">
            {isDriver ? <BusFront size={16} /> : <User size={16} />}
          </div>
        )
      },
      header: '',
      meta: {
        headerClassName: '',
      },
    },
    {
      accessorKey: 'displayName',
      enableResizing: false,
      header: ({ column }) => {
        return (
          <Button
            size="sm"
            variant="link"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="border-none p-0 text-muted-foreground hover:no-underline"
          >
            Nome
            <ArrowUpDown />
          </Button>
        )
      },
      cell: ({ row }) => {
        const { displayName } = row.original
        return <p>{displayName}</p>
      },
      meta: {
        headerClassName: '',
      },
    },
    {
      accessorKey: 'actions',
      enableResizing: false,
      cell: ({ row }) => {
        const { id, } = row.original
        const isAdmin = group?.ownerId === data?.id
        const isDriver = group?.drivers?.includes(data?.id) ?? false

        const isUser = isAdmin || isDriver || id === data.id

        return (
          <div className="flex h-auto justify-end gap-1">
            {isAdmin && id !== data?.id && (
              <Button size="sm" variant="ghost" className="text-red-500 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20" onClick={() => setUserToRemove({ id, name: row.original.displayName })}>
                <UserMinus size={18} />
              </Button>
            )}
            {isUser && (
              <Button size="sm" variant="ghost" asChild>
                <NextLink href={`/${groupId}/member/${id}`}>
                  <UserRoundCog size={18} />
                </NextLink>
              </Button>
            )}
          </div>
        )
      },
      header: '',
      meta: {
        headerClassName: '',
      },
    },
  ]

  const table = useReactTable({
    data: membersList,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  return (
    <div className="w-full">
      <div className="flex flex-col items-center gap-4 py-4">
        {data?.accountType === 'business' && (
          <CreateInvitationDialog />
        )}

        {isCurrentUserDriver && (
          isRouteActive ? (
            <Button
              onClick={handleFinishRoute}
              disabled={isFinishingRoute}
              className="w-full text-secondary-foreground flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700"
            >
              {isFinishingRoute ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Square className="size-4 fill-current" />
              )}
              Finalizar Rota
            </Button>
          ) : (
            <Button
              onClick={handleStartRoute}
              disabled={isStartingRoute}
              className="w-full text-secondary-foreground flex items-center justify-center gap-2 bg-primary hover:bg-primary/90"
            >
              {isStartingRoute ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Play className="size-4 fill-current" />
              )}
              Iniciar Rota
            </Button>
          )
        )}

        <Input
          placeholder="Buscar por nome..."
          value={(table.getColumn('displayName')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('displayName')?.setFilterValue(event.target.value)
          }
          className="w-full"
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className={header.column.columnDef.meta?.headerClassName}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {members === undefined || isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  <div className="flex items-center justify-center space-x-2">
                    <Loader2 className="size-4 animate-spin" />
                    <span>Carregando...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : members.length && table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={cell.column.columnDef.meta?.cellClassName}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  {data?.accountType === 'business' && <p>Nenhum membro encontrado.</p>}
                  {data?.accountType === 'personal' && <p>Nenhum membro encontrado. <br /> Entre em contato com a empresa responsável <br /> ou com o motorista.</p>}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {userToRemove && groupId && (
        <ConfirmRemoveMemberDialog
          isOpen={!!userToRemove}
          onClose={() => setUserToRemove(null)}
          groupId={groupId}
          userId={userToRemove.id}
          userName={userToRemove.name}
        />
      )}
    </div>
  )
}
