import { getBrandLabel } from "@/lib/lookuptables/lookuptables-transactions";
import { useState } from "react";
import { TransactionsGroupedReport } from "../serverActions/transaction";
import {
  SummaryTableItem,
  TransactionSummaryTable,
} from "./transaction-summary-table";

interface BrandSummaryTableProps {
  transactions: TransactionsGroupedReport[];
}

export function BrandSummaryTable({ transactions }: BrandSummaryTableProps) {
  // Estado para controlar o tipo de produto selecionado
  const [productType, setProductType] = useState<string>("DEBIT");

  // Filtrar por tipo de produto se especificado
  const filteredTransactions = productType
    ? transactions.filter((t) => t.product_type === productType)
    : transactions;

  // Agrupar transações por bandeira
  const transactionsByBrand = filteredTransactions.reduce(
    (acc, curr) => {
      if (!acc[curr.brand]) {
        acc[curr.brand] = {
          brand: curr.brand,
          count: 0,
          totalAmount: 0,
        };
      }

      if (
        curr.transaction_status === "AUTHORIZED" ||
        curr.transaction_status === "PENDING"
      ) {
        acc[curr.brand].count += Number(curr.count);
        acc[curr.brand].totalAmount += Number(curr.total_amount);
      }

      return acc;
    },
    {} as Record<
      string,
      {
        brand: string;
        count: number;
        totalAmount: number;
      }
    >
  );

  // Calcular totais gerais
  const totalGeral = Object.values(transactionsByBrand).reduce(
    (acc, curr) => ({
      quantidade: acc.quantidade + curr.count,
      valorTotal: acc.valorTotal + curr.totalAmount,
    }),
    {
      quantidade: 0,
      valorTotal: 0,
    }
  );

  // Converter para o formato do componente TransactionSummaryTable
  const items: SummaryTableItem[] = Object.values(transactionsByBrand).map(
    (item) => ({
      id: `brand-${item.brand}`,
      label: getBrandLabel(item.brand) || item.brand,
      count: item.count,
      totalAmount: item.totalAmount,
    })
  );

  // Manipulador para alteração na seleção do cabeçalho
  const handleHeaderViewChange = (value: string) => {
    setProductType(value);
  };

  return (
    <TransactionSummaryTable
      items={items}
      total={totalGeral}
      headerbg="bg-zinc-800 text-white"
      headersViews={[
        { label: "Débito por Bandeira", value: "DEBIT" },
        { label: "Crédito por Bandeira", value: "CREDIT" },
        { label: "Crédito Pré-pago por Bandeira", value: "PREPAID_CREDIT" },
        { label: "Débito Pré-pago por Bandeira", value: "PREPAID_DEBIT" },
        { label: "PIX", value: "PIX" },
        { label: "Voucher", value: "VOUCHER" },
      ]}
      onHeaderViewChange={handleHeaderViewChange}
    />
  );
}
