'use client';

import { useState } from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type Column = {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (value: any, row: any) => React.ReactNode;
};

type GenericTableProps = {
  columns: Column[];
  data: any[];
  selectable?: boolean;
  onRowAction?: (action: string, row: any) => void;
};

export default function GenericTable({
  columns,
  data,
  selectable = false,
  onRowAction,
}: GenericTableProps) {
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());

  const toggleSelection = (index: number) => {
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const toggleAllSelection = () => {
    setSelectedItems(prev => (prev.size === data.length ? new Set() : new Set(data.map((_, i) => i))));
  };

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            {selectable && (
              <TableHead className="w-12">
                <Checkbox 
                  checked={selectedItems.size === data.length} 
                  onCheckedChange={toggleAllSelection} 
                />
              </TableHead>
            )}
            {columns.map((column, index) => (
              <TableHead key={index}>
                {column.label}
              </TableHead>
            ))}
            {onRowAction && <TableHead>Ações</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, rowIndex) => (
            <TableRow key={rowIndex}>
              {selectable && (
                <TableCell>
                  <Checkbox 
                    checked={selectedItems.has(rowIndex)} 
                    onCheckedChange={() => toggleSelection(rowIndex)} 
                  />
                </TableCell>
              )}
              {columns.map((column, colIndex) => (
                <TableCell key={colIndex}>
                  {column.render ? column.render(row[column.key], row) : row[column.key]}
                </TableCell>
              ))}
              {onRowAction && (
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onRowAction('more', row)}
                  >
                    ...
                  </Button>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
