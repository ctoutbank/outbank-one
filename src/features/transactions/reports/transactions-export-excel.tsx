"use client";

import { Button } from "@/components/ui/button";
import exportExcel from "@/lib/export-xlsx";
import { getTransactions } from "@/features/transactions/serverActions/transaction";
import { useSearchParams } from "next/navigation";

export default function TransactionsExport() {
  const searchParams = useSearchParams();

  const onGetExporTransactions = async () => {
    // Extrair todos os parâmetros do URL
    const page = 1; // Começa com a primeira página
    const pageSize = 10000; // Busca um número grande de registros
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || undefined;
    const merchant = searchParams.get("merchant") || undefined;
    const dateFrom = searchParams.get("dateFrom") || undefined;
    const dateTo = searchParams.get("dateTo") || undefined;
    const productType = searchParams.get("productType") || undefined;

    // Faz consulta direta ao banco de dados com os filtros aplicados
    const transactionList = await getTransactions(
      search,
      page,
      pageSize,
      status,
      merchant,
      dateFrom,
      dateTo,
      productType
    );

    console.log("Exportando transações...");
    exportExcel("Transações", "Transações", transactionList.transactions);
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
