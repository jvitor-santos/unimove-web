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
import { ArrowUpDown, Loader2, Users } from 'lucide-react'
import NextLink from 'next/link'
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
import { useGetGroups } from '@/http/groups/get-groups'
import { useGetUser } from '@/http/user/get-user'

export function DriversTable() {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})

  const { data } = useGetUser()
  const { data: groups, isLoading } = useGetGroups()

  const groupsList = useMemo(() => {
    return groups ?? []
  }, [groups])

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'name',
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
        const { name } = row.original
        return <p>{name}</p>
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
        return (
          <div className="flex h-auto justify-end">
            <Button size="sm" variant="outline" asChild>
              <NextLink href={`/${id}`}>
                <Users />
              </NextLink>
            </Button>
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
    data: groupsList,
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
          placeholder="Buscar grupo por nome..."
          value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('name')?.setFilterValue(event.target.value)
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
            {groups === undefined || isLoading ? (
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
            ) : groups.length && table.getRowModel().rows?.length ? (
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
                  {data?.accountType === 'business' && <p>Nenhum grupo encontrado.</p>}
                  {data?.accountType === 'personal' && <p>Nenhum grupo encontrado. <br /> Entre em contato com a empresa responsável <br /> ou com o motorista.</p>}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
