"use client";
import { Download } from "lucide-react";
import ExcelJS from "exceljs";
import { Fill, Font, Alignment } from "exceljs";

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
}

export default function ExcelExport<T>({
  data,
  globalStyles,
  sheetName,
  fileName,
}: ExcelExportProps<T>) {
  const downloadExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(sheetName);

    if (data.length === 0) return;

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

    data.forEach((rowData) => {
      const rowValues = headers.map((header) => (rowData as any)[header] ?? ""); // 🔹 Garante que não tenha células vazias
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

    worksheet.eachRow((row, rowNumber) => {
      row.eachCell({ includeEmpty: true }, (cell) => {
        cell.border = {
          top: { style: "thin" },
          bottom: { style: "thin" },
          left: { style: "thin" },
          right: { style: "thin" },
        };
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();
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
  };

  return (
    <div className="flex justify-end">
      <button
        onClick={downloadExcel}
        className="flex items-center gap-2 p-2 text-black rounded"
      >
        <Download size={16} />
        Baixar Excel
      </button>
    </div>
  );
}
