import {
  getTransactionProductTypeLabel,
  transactionProductTypeList,
} from "@/lib/lookuptables/lookuptables-transactions";
import { TransactionsGroupedReport } from "../serverActions/transaction";
import {
  SummaryTableItem,
  TransactionSummaryTable,
} from "./transaction-summary-table";

interface ProductTypeSummaryTableProps {
  transactions: TransactionsGroupedReport[];
}

export function ProductTypeSummaryTable({
  transactions,
}: ProductTypeSummaryTableProps) {
  // Inicializar um objeto com todos os tipos de produto da tabela de pesquisa
  const initialTransactionsByType = transactionProductTypeList.reduce(
    (acc, { value }) => {
      acc[value] = {
        productType: value,
        count: 0,
        totalAmount: 0,
      };
      return acc;
    },
    {} as Record<
      string,
      {
        productType: string;
        count: number;
        totalAmount: number;
      }
    >
  );

  // Agrupar transações por tipo
  const transactionsByType = transactions.reduce((acc, curr) => {
    if (
      curr.transaction_status === "AUTHORIZED" ||
      curr.transaction_status === "PENDING"
    ) {
      // O tipo de produto já existe no acumulador porque inicializamos com todos
      acc[curr.product_type].count += Number(curr.count);
      acc[curr.product_type].totalAmount += Number(curr.total_amount);
    }

    return acc;
  }, initialTransactionsByType);

  // Calcular totais gerais
  const totalGeral = Object.values(transactionsByType).reduce(
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
  const items: SummaryTableItem[] = Object.values(transactionsByType).map(
    (item) => ({
      id: `type-${item.productType}`,
      label:
        getTransactionProductTypeLabel(item.productType) || item.productType,
      count: item.count,
      totalAmount: item.totalAmount,
    })
  );

  return (
    <TransactionSummaryTable
      items={items}
      total={totalGeral}
      labelHeader="Vendas"
      headerbg="bg-zinc-600 text-white"
      headersViews={[{ label: "Vendas", value: "SALES" }]}
    />
  );
}
