"use client";
import { Button } from "@/components/ui/button";
import { exportToExcel } from "@/utils/export-to-excel";
import axios from "axios";
import { Download } from "lucide-react";
import { useState } from "react";

interface TerminalsExcelExportButtonProps {
  filters: Record<string, string | undefined>;
  globalStyles?: any;
  sheetName: string;
  fileName: string;
}

export function TerminalsExcelExportButton({
  filters,
  globalStyles,
  sheetName,
  fileName,

}: TerminalsExcelExportButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  function traduzirStatus(status: string | null): string {
    if (!status) return "";
    switch (status.toUpperCase()) {
      case "ACTIVE":
        return "Ativo";
      case "INACTIVE":
        return "Inativo";
      case "DEACTIVATED":
        return "Desativado";
      default:
        return status;
    }
  }

  async function handleExport() {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
      const res = await axios.get(`/api/export-terminals?${params.toString()}`);
      const data = res.data.terminals.map((terminal: any) => ({
        "Data de Inclusão": terminal.dtinsert,
        "Data de Desativação": terminal.inactivationDate
          ? terminal.inactivationDate instanceof Date
            ? terminal.inactivationDate.toLocaleString()
            : terminal.inactivationDate
          : "",
        "Número Lógico": terminal.logicalNumber || "",
        "Número Serial": terminal.serialNumber || "",
        Estabelecimento: terminal.merchantName || "",
        "CNPJ/CPF": terminal.merchantDocumentId || "",
        ISO: terminal.customerName || "",
        Modelo: terminal.model || "",
        Provedor: terminal.manufacturer || "",
        "Data da última Transação": terminal.dtUltimaTransacao
          ? terminal.dtUltimaTransacao instanceof Date
            ? terminal.dtUltimaTransacao.toLocaleString()
            : terminal.dtUltimaTransacao
          : "",
        Status: traduzirStatus(terminal.status),
        Versão: terminal.versao || "",
      }));
      await exportToExcel({
        data,
        globalStyles,
        sheetName,
        fileName,
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex items-center">
      <Button
        onClick={handleExport}
        disabled={isLoading}
        variant="outline"
        className="flex items-center gap-2"
      >
        <Download className="h-4 w-4" />
        {isLoading ? "Carregando..." : "Exportar"}
      </Button>
    </div>
  );
}
