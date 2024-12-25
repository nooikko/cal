'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { NavbarLinks } from '@/types/navigation';
import { type ColumnDef, type RowSelectionState, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

type Personality = {
  id: string;
  name: string;
  settings: {
    id: string;
    maxContextLength: number;
    systemPrompt: string;
  };
};

export default function PersonalitiesPage() {
  const [personalities, setPersonalities] = useState<Personality[]>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    const fetchPersonalities = async () => {
      try {
        const response = await fetch('/api/personalities?pageSize=100');
        if (!response.ok) {
          throw new Error('Failed to fetch personalities');
        }
        const result = await response.json();
        setPersonalities(result.data.items);
      } catch (error) {
        console.error('Error fetching personalities:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPersonalities();
  }, []);

  const columns: ColumnDef<Personality>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label='Select all'
        />
      ),
      cell: ({ row }) => <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label='Select row' />,
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => {
        return (
          <Link href={`/settings/personalities/${row.original.id}`} className='hover:underline'>
            {row.getValue('name')}
          </Link>
        );
      },
    },
    {
      accessorKey: 'settings.maxContextLength',
      header: 'Max Context Length',
    },
  ];

  const table = useReactTable({
    data: personalities,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      rowSelection,
    },
  });

  const handleDelete = async () => {
    const selectedRows = table.getFilteredSelectedRowModel().rows.map((row) => row.original.id);

    if (selectedRows.length === 0) return;

    try {
      await Promise.all(
        selectedRows.map((id) =>
          fetch(`/api/personalities/${id}`, {
            method: 'DELETE',
          }),
        ),
      );

      setPersonalities((prev) => prev.filter((personality) => !selectedRows.includes(personality.id)));
      setRowSelection({});
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error('Error deleting personalities:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className='space-y-4'>
      <div className='flex justify-between items-center'>
        <h1 className='text-2xl font-bold'>Personalities</h1>
        <div className='space-x-2 flex items-center'>
          {Object.keys(rowSelection).length > 0 && (
            <Button variant='destructive' onClick={() => setDeleteDialogOpen(true)}>
              Delete Selected
            </Button>
          )}
          <Button asChild>
            <Link href={NavbarLinks.PERSONALITIES_NEW}>
              <Plus className='mr-2 h-4 w-4' /> Add New
            </Link>
          </Button>
        </div>
      </div>

      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className='h-24 text-center'>
                  No personalities found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Personalities</DialogTitle>
            <DialogDescription>Are you sure you want to delete the selected personalities? This action cannot be undone.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant='outline' onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant='destructive' onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
