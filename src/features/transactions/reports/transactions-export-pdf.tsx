"use client";

import { Button } from "@/components/ui/button";
import { File } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

export default function TransactionsExportPdf() {
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);

  const onGetExporTransactions = async () => {
    setIsLoading(true);
    try {
      // Extrair todos os parâmetros do URL
      const page = 1; // Começa com a primeira página
      const pageSize = 10000; // Busca um número grande de registros
      const search = searchParams?.get("search") || "";
      const status = searchParams?.get("status") || undefined;
      const merchant = searchParams?.get("merchant") || undefined;
      const dateFrom = searchParams?.get("dateFrom") || undefined;
      const dateTo = searchParams?.get("dateTo") || undefined;
      const productType = searchParams?.get("productType") || undefined;

      console.log("Exportando transações para PDF...");

      // Construir a URL com os parâmetros de consulta
      const queryParams = new URLSearchParams();
      if (search) queryParams.append("search", search);
      if (status) queryParams.append("status", status);
      if (merchant) queryParams.append("merchant", merchant);
      if (dateFrom) queryParams.append("dateFrom", dateFrom);
      if (dateTo) queryParams.append("dateTo", dateTo);
      if (productType) queryParams.append("productType", productType);
      queryParams.append("page", page.toString());
      queryParams.append("pageSize", pageSize.toString());

      // Preparar os dados para enviar para a API
      const response = await fetch(`/api/export-pdf?${queryParams.toString()}`);

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
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button onClick={onGetExporTransactions} disabled={isLoading}>
        <File className="w-4 h-4 mr-2" />
        {isLoading ? "Exportando..." : "Exportar PDF"}
      </Button>
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white p-4 rounded-md shadow-lg">
            <span className="text-sm font-medium">Exportando PDF...</span>
          </div>
        </div>
      )}
    </>
  );
}
