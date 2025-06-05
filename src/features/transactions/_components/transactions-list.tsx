"use client";

import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { convertUTCToSaoPaulo } from "@/lib/datetime-utils";
import { getTerminalTypeLabel } from "@/lib/lookuptables/lookuptables-terminals";
import {
  getCardPaymentMethodLabel,
  getProcessingTypeLabel,
} from "@/lib/lookuptables/lookuptables-transactions";
import { formatCNPJ } from "@/lib/utils";
import { TransactionsListRecord } from "../serverActions/transaction";

interface TransactionsListProps {
  transactions: TransactionsListRecord[];
}

export default function TransactionsList({
  transactions,
}: TransactionsListProps) {
  const getStatusBadgeVariant = (status: string | null) => {
    if (!status) return "secondary";

    if (status.includes("AUTHORIZED") || status.includes("APPROVED")) {
      return "success";
    } else if (status.includes("PENDING")) {
      return "pending";
    } else if (status.includes("DENIED") || status.includes("REJECTED")) {
      return "destructive";
    } else if (status.includes("CANCELED")) {
      return "outline";
    } else if (status.includes("EXPIRED")) {
      return "secondary";
    } else if (status.includes("PRE_AUTHORIZED")) {
      return "default";
    }
    return "secondary";
  };

  const translateStatus = (status: string | null) => {
    if (!status) return "N/A";

    const statusMap: Record<string, string> = {
      CANCELED: "Cancelada",
      EXPIRED: "Expirada",
      PENDING: "Pendente",
      DENIED: "Negada",
      PRE_AUTHORIZED: "Pré-autorizada",
      AUTHORIZED: "Autorizada",
      APPROVED: "Aprovada",
      REJECTED: "Rejeitada",
      ERROR: "Falhou",
    };

    for (const [key, value] of Object.entries(statusMap)) {
      if (status.includes(key)) {
        return value;
      }
    }

    return status;
  };

  const formatCurrency = (value: number | string | null) => {
    if (value === null) return "R$ 0,00";

    const numValue = typeof value === "string" ? parseFloat(value) : value;
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(numValue);
  };

  const formatDate = (dateStr: string | Date | null) => {
    if (!dateStr) return "N/A";
    return convertUTCToSaoPaulo(dateStr as string, true);
  };

  const translateProductType = (productType: string | null) => {
    if (!productType) return "N/A";

    const productTypeMap: Record<string, string> = {
      DEBIT: "Débito",
      CREDIT: "Crédito",
      VOUCHER: "Voucher",
      PIX: "PIX",
      PREPAID_CREDIT: "Crédito Pré-pago",
      PREPAID_DEBIT: "Débito Pré-pago",
    };

    return productTypeMap[productType] || productType;
  };

  return (
    <div className="border rounded-lg mt-2">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Data</TableHead>
            <TableHead>Estabelecimento</TableHead>
            <TableHead>Terminal</TableHead>
            <TableHead>Processamento</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Bandeira</TableHead>
            <TableHead>Valor</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction) => (
            <TableRow key={transaction.slug}>
              <TableCell>
                <div className="flex flex-col">
                  {formatDate(transaction.dtInsert).split(" ")[0]}
                  <span className="text-xs text-gray-500">
                    {formatDate(transaction.dtInsert).split(" ")[1]}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  {transaction.merchantName || "N/A"}
                  <span className="text-xs text-gray-500">
                    {transaction.merchantCNPJ
                      ? formatCNPJ(transaction.merchantCNPJ)
                      : ""}
                  </span>
                </div>
              </TableCell>
              <TableCell className="">
                <div className="flex flex-col">
                  {getTerminalTypeLabel(transaction.terminalType || "") || "-"}
                  <span className="text-xs text-gray-500">
                    {transaction.terminalLogicalNumber || "-"}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  {getCardPaymentMethodLabel(transaction.method || "") || "-"}
                  <span className="text-xs text-gray-500">
                    {getProcessingTypeLabel(transaction.salesChannel || "") ||
                      "-"}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                {translateProductType(transaction.productType)}
              </TableCell>
              <TableCell>{transaction.brand || "-"}</TableCell>
              <TableCell>{formatCurrency(transaction.amount)}</TableCell>
              <TableCell>
                <Badge
                  variant={getStatusBadgeVariant(transaction.transactionStatus)}
                >
                  {translateStatus(transaction.transactionStatus)}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
