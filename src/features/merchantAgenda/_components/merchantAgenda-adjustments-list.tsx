"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { MerchantAgendaAdjustmentList } from "../server/merchantAgendaAdjustment";

interface MerchantAgendaAdjustmentListProps {
  merchantAgendaAdjustmentList?: MerchantAgendaAdjustmentList;
}

export default function MerchantAgendaAdjustmentList({
  merchantAgendaAdjustmentList,
}: MerchantAgendaAdjustmentListProps) {
  const columns = [
    { id: "merchantName", name: "Estabelecimento" },
    { id: "paymentDate", name: "Data de Lançamento" },
    { id: "amount", name: "Valor Bruto" },
    { id: "type", name: "Tipo de Lançamento" },
    { id: "title", name: "Título" },
    { id: "reason", name: "Razão" },
    { id: "adjustmentType", name: "Tipo" },
  ];

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
      <div className="w-full">
        <div className="border rounded-lg overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column) => (
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
                    <TableCell className="text-muted-foreground">
                      {item.merchantName || "-"}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(item.paymentDate)}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatCurrency(item.amount)}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {item.type || "-"}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {item.title || "-"}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {item.reason || "-"}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {item.adjustmentType || "-"}
                    </TableCell>
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
