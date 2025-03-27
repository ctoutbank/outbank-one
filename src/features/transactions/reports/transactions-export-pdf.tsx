"use client";

import { useSearchParams } from "next/navigation";
import { getTransactions } from "../serverActions/transaction";
import { Button } from "@/components/ui/button";
import { File } from "lucide-react";
import { exportToPDF } from "@/lib/export-pdf";

export default function TransactionsExportPdf() {
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

    console.log("Exportando transações para PDF...");

    try {
      // Preparar os dados para enviar para a API
      const response = await fetch("/api/export-pdf");

      if (!response.ok) {
        throw new Error(`Erro na resposta: ${response.status}`);
      }

      // Obter o blob do PDF da resposta
      const blob = await response.blob();

      // Criar URL para o blob
      const url = window.URL.createObjectURL(blob);

      // Criar um elemento de link para download
      const a = document.createElement("a");
      a.href = url;
      a.download = "transacoes.pdf";

      // Adicionar ao documento, clicar e remover
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      // Liberar a URL do objeto
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      alert("Erro ao gerar o PDF. Verifique o console para mais detalhes.");
    }
  };
  return (
    <Button onClick={onGetExporTransactions}>
      <File className="w-4 h-4" />
      Exportar PDF
    </Button>
  );
}
