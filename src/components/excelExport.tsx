"use client";
import { Button } from "@/components/ui/button";
import ExcelJS, { Alignment, Fill, Font } from "exceljs";
import { Download } from "lucide-react";
import { toast } from "sonner";

interface ExcelExportProps<T> {
  data: T[];
  globalStyles?: {
    header?: {
      fill?: Fill;
      font?: Font;
      alignment?: Alignment;
    };
    row?: {
      fill?: Fill;
      font?: Font;
      alignment?: Alignment;
    };
  };
  sheetName: string;
  fileName: string;
  onClick?: () => void;
  onlyIcon?: boolean;
  hasDateFilter?: boolean;
}

export default function ExcelExport<T>({
  data,
  globalStyles,
  sheetName,
  fileName,
  onClick,
  onlyIcon = false,
  hasDateFilter = false,
}: ExcelExportProps<T>) {
  const downloadExcel = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      console.log("Download Excel started");


      // Verificar se há filtro de data
      if (!hasDateFilter) {
        toast.error("Filtre por uma data primeiro para exportar os dados.");
        return;
      }

      if (onClick !== undefined) {
        onClick();
      }

      if (data.length === 0) {
        console.warn("No data provided for Excel export");
        toast.error("Não há dados para exportar.");
        return;
      }

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet(sheetName);

      const headers = Object.keys(data[0] as object);

      const headerRow = worksheet.addRow(headers);

      if (globalStyles?.header) {
        headerRow.eachCell((cell) => {
          cell.fill = globalStyles.header?.fill || ({} as Fill);
          cell.font = globalStyles.header?.font || ({} as Font);
          cell.alignment = globalStyles.header?.alignment || ({} as Alignment);
        });
      }

      headerRow.eachCell((cell) => {
        cell.border = {
          left: { style: "thin" },
          right: { style: "thin" },
        };
      });

      data.forEach((rowData, index) => {
        const rowValues = headers.map(
          (header) => (rowData as any)[header] ?? ""
        );
        console.log(`Processing row ${index + 1}:`, rowValues);
        const row = worksheet.addRow(rowValues);

        if (globalStyles?.row) {
          row.eachCell((cell) => {
            cell.font = globalStyles.row?.font || {};
            cell.alignment = globalStyles.row?.alignment || {};
          });
        }

        const rowStyles = (rowData as any).style?.row;
        if (rowStyles) {
          row.eachCell((cell) => {
            cell.font = rowStyles.font || {};
            cell.fill = rowStyles.fill || {};
            cell.alignment = rowStyles.alignment || {};
          });
        }
      });

      worksheet.columns.forEach((column) => {
        if (column) {
          let maxLength = 0;
          column.eachCell?.({ includeEmpty: true }, (cell) => {
            const cellValue = cell.value ? cell.value.toString() : "";
            maxLength = Math.max(maxLength, cellValue.length);
          });
          column.width = maxLength + 5;
        }
      });

      worksheet.eachRow((row) => {
        row.eachCell({ includeEmpty: true }, (cell) => {
          cell.border = {
            top: { style: "thin" },
            bottom: { style: "thin" },
            left: { style: "thin" },
            right: { style: "thin" },
          };
        });
      });

      console.log("Generating Excel buffer...");
      const buffer = await workbook.xlsx.writeBuffer();
      console.log("Buffer generated successfully");

      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      console.log("Download initiated");
    } catch (error) {
      console.error("Error generating Excel file:", error);
      toast.error("Erro ao gerar o arquivo Excel. Tente novamente.");
    }
  };

  return (
    <div className="flex justify-end">
      {onlyIcon ? (
        <Button
          variant="ghost"
          size="icon"
          onClick={downloadExcel}
          className="h-8 w-8 p-0"
        >
          <Download className="h-4 w-4" />
        </Button>
      ) : (
        <Button
          onClick={downloadExcel}
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
