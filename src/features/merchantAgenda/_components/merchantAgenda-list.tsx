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
import type { MerchantAgendaList } from "../server/merchantAgenda";

interface MerchantAgendaListProps {
  merchantAgendaList?: MerchantAgendaList;
}

export default function MerchantAgendaList({
  merchantAgendaList,
}: MerchantAgendaListProps) {
  const columns = [
    { id: "merchant", name: "Estabelecimento", defaultVisible: true },
    { id: "terminal", name: "Terminal", defaultVisible: false },
    { id: "rnn", name: "NSU / ID", defaultVisible: false },
    { id: "saleDate", name: "Data da Venda", defaultVisible: true },
    { id: "type", name: "Tipo", defaultVisible: false },
    { id: "brand", name: "Bandeira", defaultVisible: true },
    { id: "installment", name: "Parcela", defaultVisible: true },
    { id: "grossAmount", name: "R$ Bruto Parcela", defaultVisible: true },
    { id: "feePercentage", name: "Taxa (%)", defaultVisible: true },
    { id: "feeAmount", name: "Taxa (R$)", defaultVisible: true },
    { id: "netAmount", name: "R$ Líquido Parcela", defaultVisible: true },
    {
      id: "expectedSettlementDate",
      name: "Data Prevista de Liquidação",
      defaultVisible: true,
    },
    { id: "settledAmount", name: "R$ Total Liquidação", defaultVisible: true },
    { id: "settlementDate", name: "Data de Liquidação", defaultVisible: false },
    {
      id: "effectivePaymentDate",
      name: "Data Efetiva do Pagamento",
      defaultVisible: true,
    },
    { id: "paymentNumber", name: "Nº Pagamento", defaultVisible: false },
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

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const formatDate = (dateString: string) => {
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
      <div className="border rounded-lg">
        <div className="overflow-x-auto">
          <Table className="w-full">
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
              {merchantAgendaList?.merchantAgenda.map(
                (merchantAgenda, index) => (
                  <TableRow key={index}>
                    {visibleColumns.includes("merchant") && (
                      <TableCell className="text-muted-foreground">
                        {merchantAgenda.merchant}
                      </TableCell>
                    )}
                    {visibleColumns.includes("terminal") && (
                      <TableCell className="text-muted-foreground">
                        {"-"}
                      </TableCell>
                    )}
                    {visibleColumns.includes("rnn") && (
                      <TableCell className="text-muted-foreground">
                        {merchantAgenda.rnn}
                      </TableCell>
                    )}
                    {visibleColumns.includes("saleDate") && (
                      <TableCell className="text-muted-foreground">
                        {formatDate(merchantAgenda.saleDate.toString())}
                      </TableCell>
                    )}
                    {visibleColumns.includes("type") && (
                      <TableCell className="text-muted-foreground">
                        {merchantAgenda.type}
                      </TableCell>
                    )}
                    {visibleColumns.includes("brand") && (
                      <TableCell className="text-muted-foreground">
                        {merchantAgenda.brand}
                      </TableCell>
                    )}
                    {visibleColumns.includes("installment") && (
                      <TableCell className="text-muted-foreground">
                        {merchantAgenda.installmentNumber +
                          "/" +
                          merchantAgenda.installments}{" "}
                      </TableCell>
                    )}
                    {visibleColumns.includes("grossAmount") && (
                      <TableCell className="text-muted-foreground">
                        {formatCurrency(merchantAgenda.grossAmount)}
                      </TableCell>
                    )}
                    {visibleColumns.includes("feePercentage") && (
                      <TableCell className="text-muted-foreground">
                        {merchantAgenda.feePercentage.toFixed(2)}%
                      </TableCell>
                    )}
                    {visibleColumns.includes("feeAmount") && (
                      <TableCell className="text-muted-foreground">
                        {formatCurrency(merchantAgenda.feeAmount)}
                      </TableCell>
                    )}
                    {visibleColumns.includes("netAmount") && (
                      <TableCell className="text-muted-foreground">
                        {formatCurrency(merchantAgenda.netAmount)}
                      </TableCell>
                    )}
                    {visibleColumns.includes("expectedSettlementDate") && (
                      <TableCell className="text-muted-foreground">
                        {formatDate(
                          merchantAgenda.expectedSettlementDate.toString()
                        )}
                      </TableCell>
                    )}
                    {visibleColumns.includes("settledAmount") && (
                      <TableCell className="text-muted-foreground">
                        {formatCurrency(merchantAgenda.settledAmount)}
                      </TableCell>
                    )}
                    {visibleColumns.includes("settlementDate") && (
                      <TableCell className="text-muted-foreground">
                        {formatDate(merchantAgenda.settlementDate.toString())}
                      </TableCell>
                    )}
                    {visibleColumns.includes("effectivePaymentDate") && (
                      <TableCell className="text-muted-foreground">
                        {formatDate(
                          merchantAgenda.effectivePaymentDate.toString()
                        )}
                      </TableCell>
                    )}
                    {visibleColumns.includes("paymentNumber") && (
                      <TableCell className="text-muted-foreground">
                        {merchantAgenda.paymentNumber}
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
