import { getBrandLabel } from "@/lib/lookuptables/lookuptables-transactions";
import { TransactionsGroupedReport } from "../server/closing";
import {
  SummaryTableItem,
  TransactionSummaryTable,
} from "./transaction-summary-table";

interface BrandSummaryTableProps {
  transactions: TransactionsGroupedReport[];
}

export function BrandSummaryTable({ transactions }: BrandSummaryTableProps) {
  const productTypes = [
    { label: "Débito por Bandeira", value: "DEBIT" },
    { label: "Crédito por Bandeira", value: "CREDIT" },
  ];

  return (
    <div className="flex flex-col gap-6">
      {productTypes.map(({ label, value }) => {
        // Filtrar por tipo de produto
        const filteredTransactions = transactions.filter(
          (t) => t.product_type === value
        );

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

        const totalGeral = Object.values(transactionsByBrand).reduce(
          (acc, curr) => ({
            quantidade: acc.quantidade + curr.count,
            valorTotal: acc.valorTotal + curr.totalAmount,
          }),
          { quantidade: 0, valorTotal: 0 }
        );

        const items: SummaryTableItem[] = Object.values(
          transactionsByBrand
        ).map((item) => ({
          id: `brand-${value}-${item.brand}`,
          label: getBrandLabel(item.brand) || item.brand,
          count: item.count,
          totalAmount: item.totalAmount,
        }));

        return (
          <TransactionSummaryTable
            key={value}
            items={items}
            total={totalGeral}
            labelHeader={label}
            headerbg="bg-zinc-800 text-white"
          />
        );
      })}
    </div>
  );
}
