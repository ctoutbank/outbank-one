import { getTransactionStatusLabel } from "@/lib/lookuptables/lookuptables-transactions";
import { TransactionsGroupedReport } from "../serverActions/transaction";
import {
  SummaryTableItem,
  TransactionSummaryTable,
} from "./transaction-summary-table";

interface NonProcessedSummaryTableProps {
  transactions: TransactionsGroupedReport[];
}

export function NonProcessedSummaryTable({
  transactions,
}: NonProcessedSummaryTableProps) {
  // Filtrar apenas transações não processadas: DENIED, PENDING, CANCELED
  const nonProcessedStatuses = ["DENIED", "PENDING", "CANCELED"];
  const filteredTransactions = transactions.filter((t) =>
    nonProcessedStatuses.includes(t.transaction_status)
  );

  // Agrupar transações por status
  const transactionsByStatus = filteredTransactions.reduce(
    (acc, curr) => {
      if (!acc[curr.transaction_status]) {
        acc[curr.transaction_status] = {
          status: curr.transaction_status,
          count: 0,
          totalAmount: 0,
        };
      }

      acc[curr.transaction_status].count += Number(curr.count);
      acc[curr.transaction_status].totalAmount += Number(curr.total_amount);

      return acc;
    },
    {} as Record<
      string,
      {
        status: string;
        count: number;
        totalAmount: number;
      }
    >
  );

  // Calcular totais gerais
  const totalGeral = Object.values(transactionsByStatus).reduce(
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
  const items: SummaryTableItem[] = Object.values(transactionsByStatus).map(
    (item) => ({
      id: `nonprocessed-${item.status}`,
      label: getTransactionStatusLabel(item.status) || item.status,
      count: item.count,
      totalAmount: item.totalAmount,
    })
  );

  return (
    <TransactionSummaryTable
      items={items}
      total={totalGeral}
      labelHeader="Não processadas"
      headerbg="bg-zinc-500 text-white"
      headersViews={[{ label: "Não processadas", value: "NON_PROCESSED" }]}
    />
  );
}
