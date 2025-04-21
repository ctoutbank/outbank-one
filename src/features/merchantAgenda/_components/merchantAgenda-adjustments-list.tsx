"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MoreHorizontal } from "lucide-react";
import { useState } from "react";
import type { MerchantAgendaAdjustmentList } from "../server/merchantAgendaAdjustment";

interface MerchantAgendaAdjustmentListProps {
  merchantAgendaAdjustmentList: MerchantAgendaAdjustmentList;
}

export default function MerchantAgendaAdjustmentList({
  merchantAgendaAdjustmentList,
}: MerchantAgendaAdjustmentListProps) {
  const columns = [
    { id: "merchantName", name: "Estabelecimento", defaultVisible: true },
    { id: "paymentDate", name: "Data de Lançamento", defaultVisible: true },
    { id: "amount", name: "Valor Bruto", defaultVisible: true },
    { id: "type", name: "Tipo de Lançamento", defaultVisible: true },
    { id: "title", name: "Título", defaultVisible: true },
    { id: "reason", name: "Razão", defaultVisible: true },
    { id: "adjustmentType", name: "Tipo", defaultVisible: true },
  ];

  const [visibleColumns, setVisibleColumns] = useState(
    columns.filter((column) => column.defaultVisible).map((column) => column.id)
  );

  const toggleColumn = (columnId: string) => {
    if (visibleColumns.includes(columnId)) {
      setVisibleColumns(visibleColumns.filter((id) => id !== columnId));
    } else {
      setVisibleColumns([...visibleColumns, columnId]);
    }
  };

  const formatCurrency = (value: number | null) => {
    if (value === null) return "-";
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  return (
    <div className="relative">
      <div className="flex justify-end mb-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {columns.map((column) => (
              <DropdownMenuCheckboxItem
                key={column.id}
                checked={visibleColumns.includes(column.id)}
                onCheckedChange={() => toggleColumn(column.id)}
              >
                {column.name}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="w-full">
        <div className="border rounded-lg overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {columns
                  .filter((column) => visibleColumns.includes(column.id))
                  .map((column) => (
                    <TableHead key={column.id} className="text-black">
                      {column.name}
                    </TableHead>
                  ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {merchantAgendaAdjustmentList?.merchantAgendaAdjustments.map(
                (item, index) => (
                  <TableRow key={index}>
                    {visibleColumns.includes("merchantName") && (
                      <TableCell className="text-muted-foreground">
                        {item.merchantName || "-"}
                      </TableCell>
                    )}
                    {visibleColumns.includes("paymentDate") && (
                      <TableCell className="text-muted-foreground">
                        {formatDate(item.paymentDate)}
                      </TableCell>
                    )}
                    {visibleColumns.includes("amount") && (
                      <TableCell className="text-muted-foreground">
                        {formatCurrency(item.amount)}
                      </TableCell>
                    )}
                    {visibleColumns.includes("type") && (
                      <TableCell className="text-muted-foreground">
                        {item.type || "-"}
                      </TableCell>
                    )}
                    {visibleColumns.includes("title") && (
                      <TableCell className="text-muted-foreground">
                        {item.title || "-"}
                      </TableCell>
                    )}
                    {visibleColumns.includes("reason") && (
                      <TableCell className="text-muted-foreground">
                        {item.reason || "-"}
                      </TableCell>
                    )}
                    {visibleColumns.includes("adjustmentType") && (
                      <TableCell className="text-muted-foreground">
                        {item.adjustmentType || "-"}
                      </TableCell>
                    )}
                  </TableRow>
                )
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
