"use client";

import { TransactionsGroupedReport } from "../serverActions/transaction";
import { BrandSummaryTable } from "./brand-summary-table";
import { NonProcessedSummaryTable } from "./non-processed-summary-table";
import { ProductTypeSummaryTable } from "./product-type-summary-table";

interface TransactionsDashboardCardsProps {
  transactions: TransactionsGroupedReport[];
}

export function TransactionsDashboardCards({
  transactions,
}: TransactionsDashboardCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-2">
      {/* Card 1: Transações por Tipo de Produto */}
      <ProductTypeSummaryTable transactions={transactions} />

      {/* Card 2: Transações por Bandeira */}
      <BrandSummaryTable transactions={transactions} />

      {/* Card 3: Transações Não Processadas */}
      <NonProcessedSummaryTable transactions={transactions} />
    </div>
  );
}
