"use client";

import ExcelExport from "@/components/excelExport";
import { Button } from "@/components/ui/button";
import { getMerchantAgendaExcelData } from "@/features/merchantAgenda/server/merchantAgenda";
import { Fill, Font } from "exceljs";
import { Download, Loader2 } from "lucide-react";
import { useState } from "react";
import { createRoot } from "react-dom/client";

interface MerchantAgendaExcelExportProps {
  dateFrom?: string;
  dateTo?: string;
}

export default function MerchantAgendaExcelExport({
  dateFrom,
  dateTo,
}: MerchantAgendaExcelExportProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleExport = async () => {
    setIsLoading(true);
    try {
      const data = await getMerchantAgendaExcelData(
        dateFrom ||
          new Date(new Date().setMonth(new Date().getMonth() - 1))
            .toISOString()
            .split("T")[0],
        dateTo || new Date().toISOString().split("T")[0]
      );

      const formattedData = data.map((data) => ({
        Merchant: data.merchant,
        CNPJ: data.cnpj,
        NSU: data.nsu,
        SaleDate: data.saleDate,
        Type: data.type,
        Brand: data.brand,
        Installments: data.installments,
        InstallmentNumber: data.installmentNumber,
        InstallmentValue: data.installmentValue,
        TransactionMdr: data.transactionMdr,
        TransactionMdrFee: data.transactionMdrFee,
        TransactionFee: data.transactionFee,
        SettlementAmount: data.settlementAmount,
        ExpectedDate: data.expectedDate,
        ReceivableAmount: data.receivableAmount,
        SettlementDate: data.settlementDate,
      }));

      // Create a temporary ExcelExport component to handle the download
      const tempExcelExport = (
        <ExcelExport
          data={formattedData}
          globalStyles={globalStyles}
          sheetName="Conciliação de recebíveis"
          fileName={`CONCILIAÇÃO DE RECEBÍVEIS ${dateTo || ""}`}
        />
      );

      // Trigger the download
      const downloadButton = document.createElement("div");
      document.body.appendChild(downloadButton);

      // Usa o createRoot ao invés de ReactDOM.render
      const root = createRoot(downloadButton);
      root.render(tempExcelExport);

      // Aguarda o próximo *tick* para garantir que o botão foi renderizado
      setTimeout(() => {
        const button = downloadButton.querySelector("button");
        button?.click();

        // Desmonta o componente e remove o elemento
        root.unmount();
        document.body.removeChild(downloadButton);
      }, 0);

      return formattedData;
    } finally {
      setIsLoading(false);
    }
  };

  const globalStyles = {
    header: {
      fill: {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "808080" },
      } as Fill,
      font: { color: { argb: "FFFFFF" }, bold: true } as Font,
    },
    row: {
      font: { color: { argb: "000000" } } as Font,
    },
  };

  return (
    <div>
      {isLoading ? (
        <div>
          <Button
            disabled={true}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Loader2 className="h-4 w-4 animate-spin" />
            Exportar
          </Button>
        </div>
      ) : (
        <Button
          onClick={handleExport}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          Exportar
        </Button>
      )}
    </div>
  );
}
