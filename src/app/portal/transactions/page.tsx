import BaseBody from "@/components/layout/base-body";
import BaseHeader from "@/components/layout/base-header";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getTransactions } from "@/features/transactions/serverActions/transaction";
import TransactionsExport from "./transactions-export";

export default async function Transactions() {
  const transactionList = await getTransactions();

  return (
    <>
      <BaseHeader breadcrumbItems={[]} />
      <BaseBody
        title="Transações"
        subtitle={`visualização de todas as transações`}
      >
        <TransactionsExport transactions={transactionList.transactions} />
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data</TableHead>
              <TableHead>Estabelecimento</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactionList.transactions.map((transaction) => (
              <TableRow key={transaction.slug}>
                <TableCell>
                  {transaction.dtInsert
                    ? new Date(transaction.dtInsert).toLocaleString()
                    : "N/A"}
                </TableCell>
                <TableCell>{transaction.merchantName}</TableCell>
                <TableCell>{transaction.totalAmount}</TableCell>
                <TableCell>{transaction.transactionStatus}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </BaseBody>
    </>
  );
}
