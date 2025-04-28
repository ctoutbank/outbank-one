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
import type { MerchantAgendaAnticipationList } from "../server/merchantAgendaAntecipation";

interface MerchantAgendaAnticipationListProps {
  merchantAgendaAnticipationList?: MerchantAgendaAnticipationList;
}

export default function MerchantAgendaAnticipationList({
  merchantAgendaAnticipationList,
}: MerchantAgendaAnticipationListProps) {
  const columns = [
    { id: "merchantName", name: "Estabelecimento", defaultVisible: true },
    { id: "rrn", name: "NSU / ID", defaultVisible: false },
    { id: "transactionDate", name: "Data da Venda", defaultVisible: true },
    { id: "type", name: "Tipo", defaultVisible: true },
    { id: "brand", name: "Bandeira", defaultVisible: true },
    { id: "installmentNumber", name: "Parcela", defaultVisible: true },
    {
      id: "installmentAmount",
      name: "Valor Bruto da Parcela",
      defaultVisible: false,
    },
    { id: "transactionMdr", name: "MDR (%)", defaultVisible: false },
    { id: "transactionMdrFee", name: "MDR (R$)", defaultVisible: false },
    {
      id: "settlementAmount",
      name: "Valor Líquido da Parcela",
      defaultVisible: true,
    },
    {
      id: "expectedSettlementDate",
      name: "Data Prevista de Liquidação",
      defaultVisible: false,
    },
    { id: "anticipatedAmount", name: "Valor Antecipado", defaultVisible: true },
    {
      id: "anticipationDayNumber",
      name: "Dias Antecipados",
      defaultVisible: true,
    },
    {
      id: "anticipationMonthFee",
      name: "Taxa % relativa",
      defaultVisible: false,
    },
    {
      id: "anticipationFee",
      name: "Desconto de Antecipação",
      defaultVisible: false,
    },
    {
      id: "netAmount",
      name: "Valor Líquido Antecipado",
      defaultVisible: false,
    },
    { id: "anticipationCode", name: "ID do Pedido", defaultVisible: false },
    { id: "settlementDate", name: "Data de Liquidação", defaultVisible: false },
    {
      id: "effectivePaymentDate",
      name: "Data Efetiva do Pagamento",
      defaultVisible: false,
    },
    {
      id: "settlementUniqueNumber",
      name: "Número do Pagamento",
      defaultVisible: false,
    },
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

  const formatPercentage = (value: number | null) => {
    if (value === null) return "-";
    return `${value.toFixed(2)}%`;
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
              {merchantAgendaAnticipationList?.merchantAgendaAnticipations.map(
                (item, index) => (
                  <TableRow key={index}>
                    {visibleColumns.includes("merchantName") && (
                      <TableCell className="text-muted-foreground">
                        {item.merchantName || "-"}
                      </TableCell>
                    )}
                    {visibleColumns.includes("rrn") && (
                      <TableCell className="text-muted-foreground">
                        {item.rrn || "-"}
                      </TableCell>
                    )}
                    {visibleColumns.includes("transactionDate") && (
                      <TableCell className="text-muted-foreground">
                        {formatDate(item.transactionDate)}
                      </TableCell>
                    )}
                    {visibleColumns.includes("type") && (
                      <TableCell className="text-muted-foreground">
                        {item.type || "-"}
                      </TableCell>
                    )}
                    {visibleColumns.includes("brand") && (
                      <TableCell className="text-muted-foreground">
                        {item.brand || "-"}
                      </TableCell>
                    )}
                    {visibleColumns.includes("installmentNumber") && (
                      <TableCell className="text-muted-foreground">
                        {item.installmentNumber || "-"}
                      </TableCell>
                    )}
                    {visibleColumns.includes("installmentAmount") && (
                      <TableCell className="text-muted-foreground">
                        {formatCurrency(item.installmentAmount)}
                      </TableCell>
                    )}
                    {visibleColumns.includes("transactionMdr") && (
                      <TableCell className="text-muted-foreground">
                        {formatPercentage(item.transactionMdr)}
                      </TableCell>
                    )}
                    {visibleColumns.includes("transactionMdrFee") && (
                      <TableCell className="text-muted-foreground">
                        {formatCurrency(item.transactionMdrFee)}
                      </TableCell>
                    )}
                    {visibleColumns.includes("settlementAmount") && (
                      <TableCell className="text-muted-foreground">
                        {formatCurrency(item.settlementAmount)}
                      </TableCell>
                    )}
                    {visibleColumns.includes("expectedSettlementDate") && (
                      <TableCell className="text-muted-foreground">
                        {formatDate(item.expectedSettlementDate)}
                      </TableCell>
                    )}
                    {visibleColumns.includes("anticipatedAmount") && (
                      <TableCell className="text-muted-foreground">
                        {formatCurrency(item.anticipatedAmount)}
                      </TableCell>
                    )}
                    {visibleColumns.includes("anticipationDayNumber") && (
                      <TableCell className="text-muted-foreground">
                        {item.anticipationDayNumber || "-"}
                      </TableCell>
                    )}
                    {visibleColumns.includes("anticipationMonthFee") && (
                      <TableCell className="text-muted-foreground">
                        {formatPercentage(item.anticipationMonthFee)}
                      </TableCell>
                    )}
                    {visibleColumns.includes("anticipationFee") && (
                      <TableCell className="text-muted-foreground">
                        {formatCurrency(item.anticipationFee)}
                      </TableCell>
                    )}
                    {visibleColumns.includes("netAmount") && (
                      <TableCell className="text-muted-foreground">
                        {formatCurrency(item.netAmount)}
                      </TableCell>
                    )}
                    {visibleColumns.includes("anticipationCode") && (
                      <TableCell className="text-muted-foreground">
                        {item.anticipationCode || "-"}
                      </TableCell>
                    )}
                    {visibleColumns.includes("settlementDate") && (
                      <TableCell className="text-muted-foreground">
                        {formatDate(item.settlementDate)}
                      </TableCell>
                    )}
                    {visibleColumns.includes("effectivePaymentDate") && (
                      <TableCell className="text-muted-foreground">
                        {formatDate(item.effectivePaymentDate)}
                      </TableCell>
                    )}
                    {visibleColumns.includes("settlementUniqueNumber") && (
                      <TableCell className="text-muted-foreground">
                        {item.settlementUniqueNumber || "-"}
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
