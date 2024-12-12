"use client";

import { Button } from "@/components/ui/button";
import exportExcel from "@/lib/export-xlsx";

export default function TransactionsExport(transactions: any) {
  const onGetExporTransactions = async () => {
    console.log(transactions);
    console.log("exporting");
    exportExcel("Transações", "Transações", transactions);
  };

  return (
    <Button
      variant="outline"
      className="gap-2 mr-2"
      onClick={() => onGetExporTransactions()}
    >
      Exportar
    </Button>
  );
}
