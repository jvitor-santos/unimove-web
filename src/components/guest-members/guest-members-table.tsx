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
import { ArrowUpDown, Loader2, Trash } from 'lucide-react'
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
import { useGetInvitations } from '@/http/invitations/get-invitations'
import { useParams } from 'next/navigation'
import { useUser } from '@/hooks/use-user'
import { formatRolesInvitations, formatStatusInvitations } from '@/utils/format-invitations'
import { DeleteInvitationDialogAlert } from './delete-invitation-dialog-alert'

export function GuestMembersTable() {
  const params = useParams()
  const groupId =
    typeof params.groupId === 'string'
      ? params.groupId
      : params.groupId?.[0]

  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})

  const { currentUser } = useUser()

  const { data } = useGetUser()
  const { data: invitations, isLoading } = useGetInvitations({
    groupId,
    ownerId: currentUser?.uid,
  })

  const invitationsList = useMemo(() => {
    return invitations ?? []
  }, [invitations])

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'email',
      enableResizing: false,
      header: ({ column }) => {
        return (
          <Button
            size="sm"
            variant="link"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="border-none p-0 text-muted-foreground hover:no-underline"
          >
            Email
            <ArrowUpDown />
          </Button>
        )
      },
      cell: ({ row }) => {
        const { email, status, role } = row.original

        const IconComponent = formatRolesInvitations[role].icon;

        return (
          <div className='w-auto h-auto flex flex-col gap-2'>
            <p>{email}</p>
            <p className='line-clamp-1 text-xs text-muted-foreground flex gap-1 items-center'>
              <IconComponent size={14}/> <span>{formatRolesInvitations[role].title}</span> - <span className={`${formatStatusInvitations[status].color} font-bold`}>{formatStatusInvitations[status].title}</span>
            </p>
          </div>
        )
      },
      meta: {
        headerClassName: '',
      },
    },
    {
      accessorKey: 'actions',
      enableResizing: false,
      cell: ({ row }) => {
        const { id } = row.original
       
        return (
          <div className="flex h-auto justify-end">
            <DeleteInvitationDialogAlert id={id} />
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
    data: invitationsList,
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
        <Input
          placeholder="Buscar grupo por email..."
          value={(table.getColumn('email')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('email')?.setFilterValue(event.target.value)
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
            {invitationsList === undefined || isLoading ? (
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
            ) : invitationsList.length && table.getRowModel().rows?.length ? (
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
                  {data?.accountType === 'business' && <p>Nenhum convite encontrado.</p>}
                  {data?.accountType === 'personal' && <p>Nenhum convite encontrado. <br /> Entre em contato com a empresa responsável <br /> ou com o motorista.</p>}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
