'use client';

import { useEffect, useState, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchSensors, Sensor as SensorType } from '@/actions/sensors';
import { useSensorStatusStore } from '@/store';
import { setupSocket, SensorStatus } from '@/lib/socketSetup';
import { ColumnDef, flexRender, getCoreRowModel, useReactTable, getSortedRowModel, SortingState, getPaginationRowModel } from '@tanstack/react-table';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, MoreHorizontal } from 'lucide-react';

export function SensorsTable() {
  const queryClient = useQueryClient();
  const { data: sensors, isLoading } = useQuery({
    queryKey: ['sensors'],
    queryFn: ()=>fetchSensors()
  });

  const { updateStatus } = useSensorStatusStore();
  const [sorting, setSorting] = useState<SortingState>([]);

  const updateSensorStatus = useCallback(
    (id: number, currentStatus: SensorStatus) => {
      updateStatus(id, currentStatus);

      // Optimistically update React Query cache
      queryClient.setQueryData<SensorType[]>(['sensors'], (oldSensors = []) => oldSensors.map((sensor) => (sensor.id === id ? { ...sensor, currentStatus } : sensor)));
    },
    [updateStatus, queryClient]
  );

  useEffect(() => {
    const socket = setupSocket(updateSensorStatus);

    return () => {
      socket.disconnect();
    };
  }, [updateSensorStatus]);

  const copyToClipboard = useCallback((text: string) => {
    navigator.clipboard.writeText(text);
  }, []);

  const columns: ColumnDef<SensorType>[] = [
    {
      accessorKey: 'id',
      header: 'ID'
    },
    {
      accessorKey: 'name',
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
            Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      }
    },
    {
      accessorKey: 'serialNumber',
      header: 'Serial Number'
    },
    {
      accessorKey: 'firmwareVersion',
      header: 'Firmware Version'
    },
    {
      accessorKey: 'currentStatus',
      header: 'Status',
      cell: ({ row }) => {
        const sensor = row.original;
        const sensorStatuses = useSensorStatusStore((state) => state.sensorStatuses);
        return sensorStatuses[sensor.id] || sensor.currentStatus;
      }
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const sensor = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => copyToClipboard(sensor.serialNumber.toString())}>Copy serial number</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>View sensor details</DropdownMenuItem>
              <DropdownMenuItem>Update firmware</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      }
    }
  ];

  const table = useReactTable({
    data: sensors || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting
    }
  });

  if (isLoading) return <div>Loading sensors...</div>;

  return (
    <div>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}</TableHead>
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
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
          Previous
        </Button>
        <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
          Next
        </Button>
      </div>
    </div>
  );
}
