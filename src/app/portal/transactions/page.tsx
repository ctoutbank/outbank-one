import BaseBody from "@/components/layout/base-body";
import BaseHeader from "@/components/layout/base-header";
import {
  Breadcrumb,
  BreadcrumbLink,
  BreadcrumbItem,
  BreadcrumbSeparator,
  BreadcrumbPage,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getTransactions } from "@/server/db/transaction";

export default async function Transactions() {
  const transactionList = await getTransactions();
  const { transactions, totalCount } = transactionList;
  return (
    <>
      <BaseHeader breadcrumbItems={[]} />
      <BaseBody
        title="Transações"
        subtitle={`visualização de todas as transações`}
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Merchant</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction) => (
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
