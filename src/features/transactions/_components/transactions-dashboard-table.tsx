import { formatCurrency } from "@/lib/utils";
import { TransactionsGroupedReport } from "../serverActions/transaction";

interface TransactionsDashboardTableProps {
  transactions: TransactionsGroupedReport[];
}

export function TransactionsDashboardTable({
  transactions,
}: TransactionsDashboardTableProps) {
  // Agrupar transações por tipo e bandeira
  console.log(transactions);
  const transactionsAgrupadas = transactions.reduce(
    (acc, curr) => {
      const chave = `${curr.product_type}-${curr.brand}`;
      if (!acc[chave]) {
        acc[chave] = {
          productType: curr.product_type,
          brand: curr.brand,
          count: 0,
          totalAmount: 0,
          countDenied: 0,
          totalAmountDenied: 0,
        };
      }

      if (
        curr.transaction_status === "AUTHORIZED" ||
        curr.transaction_status === "PENDING"
      ) {
        acc[chave].count += Number(curr.count);
        acc[chave].totalAmount += Number(curr.total_amount);
      } else if (
        curr.transaction_status === "DENIED" ||
        curr.transaction_status === "CANCELED"
      ) {
        acc[chave].countDenied += Number(curr.count);
        acc[chave].totalAmountDenied += Number(curr.total_amount);
      }

      return acc;
    },
    {} as Record<
      string,
      {
        productType: string;
        brand: string;
        count: number;
        totalAmount: number;
        countDenied: number;
        totalAmountDenied: number;
      }
    >
  );

  // Calcular totais gerais
  const totalGeral = Object.values(transactionsAgrupadas).reduce(
    (acc, curr) => ({
      quantidade: acc.quantidade + curr.count,
      valorTotal: acc.valorTotal + curr.totalAmount,
      quantidadeNegada: acc.quantidadeNegada + curr.countDenied,
      valorTotalNegado: acc.valorTotalNegado + curr.totalAmountDenied,
    }),
    {
      quantidade: 0,
      valorTotal: 0,
      quantidadeNegada: 0,
      valorTotalNegado: 0,
    }
  );

  // Calcular totais por tipo
  const totalPorTipo = Object.values(transactionsAgrupadas).reduce(
    (acc, curr) => {
      if (!acc[curr.productType]) {
        acc[curr.productType] = {
          quantidade: 0,
          valorTotal: 0,
          quantidadeNegada: 0,
          valorTotalNegado: 0,
        };
      }

      acc[curr.productType].quantidade += curr.count;
      acc[curr.productType].valorTotal += curr.totalAmount;
      acc[curr.productType].quantidadeNegada += curr.countDenied;
      acc[curr.productType].valorTotalNegado += curr.totalAmountDenied;

      return acc;
    },
    {} as Record<string, typeof totalGeral>
  );

  return (
    <div className="rounded-lg border mt-2">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="h-8 px-3 text-left align-middle font-medium text-xs">
                Tipo
              </th>
              <th className="h-8 px-3 text-left align-middle font-medium text-xs">
                Bandeira
              </th>
              <th className="h-8 px-3 text-right align-middle font-medium text-xs">
                Trans.
              </th>
              <th className="h-8 px-3 text-right align-middle font-medium text-xs">
                % Trans.
              </th>
              <th className="h-8 px-3 text-right align-middle font-medium text-xs">
                Valor
              </th>
              <th className="h-8 px-3 text-right align-middle font-medium text-xs">
                % Valor
              </th>
              <th className="h-8 px-3 text-right align-middle font-medium text-xs">
                Negadas
              </th>
              <th className="h-8 px-3 text-right align-middle font-medium text-xs">
                Vlr. Negado
              </th>
            </tr>
          </thead>
          <tbody className="text-xs">
            {Object.values(transactionsAgrupadas).map((transaction) => (
              <tr
                key={`${transaction.brand}-${transaction.productType}`}
                className="border-b hover:bg-muted/30"
              >
                <td className="px-3 py-2">{transaction.productType}</td>
                <td className="px-3 py-2">{transaction.brand}</td>
                <td className="px-3 py-2 text-right">{transaction.count}</td>
                <td className="px-3 py-2 text-right">
                  {((transaction.count / totalGeral.quantidade) * 100).toFixed(
                    1
                  )}
                  %
                </td>
                <td className="px-3 py-2 text-right">
                  {formatCurrency(transaction.totalAmount)}
                </td>
                <td className="px-3 py-2 text-right">
                  {(
                    (transaction.totalAmount / totalGeral.valorTotal) *
                    100
                  ).toFixed(1)}
                  %
                </td>
                <td className="px-3 py-2 text-right">
                  {transaction.countDenied}
                </td>
                <td className="px-3 py-2 text-right">
                  {formatCurrency(transaction.totalAmountDenied)}
                </td>
              </tr>
            ))}
            {/* Totais por tipo */}
            {Object.entries(totalPorTipo).map(([tipo, dados]) => (
              <tr
                key={`total-${tipo}`}
                className="border-b bg-muted/30 font-medium text-xs"
              >
                <td className="px-3 py-2">Total {tipo}</td>
                <td className="px-3 py-2"></td>
                <td className="px-3 py-2 text-right">{dados.quantidade}</td>
                <td className="px-3 py-2 text-right">
                  {((dados.quantidade / totalGeral.quantidade) * 100).toFixed()}
                  %
                </td>
                <td className="px-3 py-2 text-right">
                  {formatCurrency(dados.valorTotal)}
                </td>
                <td className="px-3 py-2 text-right">
                  {((dados.valorTotal / totalGeral.valorTotal) * 100).toFixed(
                    1
                  )}
                  %
                </td>
                <td className="px-3 py-2 text-right">
                  {dados.quantidadeNegada}
                </td>
                <td className="px-3 py-2 text-right">
                  {formatCurrency(dados.valorTotalNegado)}
                </td>
              </tr>
            ))}
            {/* Total Geral */}
            <tr className="border-b bg-primary/10 font-medium text-xs">
              <td className="px-3 py-2">TOTAL GERAL</td>
              <td className="px-3 py-2"></td>
              <td className="px-3 py-2 text-right">{totalGeral.quantidade}</td>
              <td className="px-3 py-2 text-right">100%</td>
              <td className="px-3 py-2 text-right">
                {formatCurrency(totalGeral.valorTotal)}
              </td>
              <td className="px-3 py-2 text-right">100%</td>
              <td className="px-3 py-2 text-right">
                {totalGeral.quantidadeNegada}
              </td>
              <td className="px-3 py-2 text-right">
                {formatCurrency(totalGeral.valorTotalNegado)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
