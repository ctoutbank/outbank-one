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
import { ChevronDown } from "lucide-react";
import { Transaction } from "../serverActions/transaction";

interface TransactionsListProps {
  transactions: Transaction[];
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
      FAILED: "Falhou",
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

    const date = typeof dateStr === "string" ? new Date(dateStr) : dateStr;

    // Converter de UTC para o fuso horário de São Paulo

    return date.toLocaleString("pt-BR", {
      timeZone: "America/Sao_Paulo",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
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
            <TableHead>
              Data
              <ChevronDown className="ml-2 h-4 w-4 inline" />
            </TableHead>
            <TableHead>
              Estabelecimento
              <ChevronDown className="ml-2 h-4 w-4 inline" />
            </TableHead>
            <TableHead>
              Tipo
              <ChevronDown className="ml-2 h-4 w-4 inline" />
            </TableHead>
            <TableHead>
              Valor
              <ChevronDown className="ml-2 h-4 w-4 inline" />
            </TableHead>
            <TableHead>
              Status
              <ChevronDown className="ml-2 h-4 w-4 inline" />
            </TableHead>
            <TableHead>
              Bandeira
              <ChevronDown className="ml-2 h-4 w-4 inline" />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction) => (
            <TableRow key={transaction.slug}>
              <TableCell>{formatDate(transaction.dtInsert)}</TableCell>
              <TableCell>{transaction.merchantName || "N/A"}</TableCell>
              <TableCell>
                {translateProductType(transaction.productType)}
              </TableCell>
              <TableCell>{formatCurrency(transaction.totalAmount)}</TableCell>
              <TableCell>
                <Badge
                  variant={getStatusBadgeVariant(transaction.transactionStatus)}
                >
                  {translateStatus(transaction.transactionStatus)}
                </Badge>
              </TableCell>
              <TableCell>{transaction.brand || "Não Identificada"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
