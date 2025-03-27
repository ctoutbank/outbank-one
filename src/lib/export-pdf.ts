import jsPDF from "jspdf";
import "jspdf-autotable";

interface TableColumn {
  header: string;
  key: string;
  width?: number;
}

interface ExportPDFOptions {
  title?: string;
  columns?: TableColumn[];
  data: any[];
}

function generateColumns(data: any[]): TableColumn[] {
  if (!data || data.length === 0) {
    return [];
  }

  const firstItem = data[0];
  return Object.keys(firstItem).map((key) => ({
    header:
      key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, " $1"),
    key: key,
  }));
}

export async function exportToPDF(
  options: ExportPDFOptions
): Promise<Uint8Array> {
  const { title, data } = options;
  const columns = options.columns || generateColumns(data);

  // Criar um novo documento PDF
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  // Adicionar título se fornecido
  if (title) {
    doc.setFontSize(16);
    doc.text(title, doc.internal.pageSize.getWidth() / 2, 20, {
      align: "center",
    });
  }

  // Preparar dados para a tabela
  const headers = columns.map((col) => col.header);
  const rows = data.map((item) =>
    columns.map((col) => item[col.key]?.toString() || "")
  );

  // Configurar e desenhar a tabela
  const docWithAutoTable = doc as any;
  docWithAutoTable.autoTable({
    head: [headers],
    body: rows,
    startY: title ? 30 : 20,
    headStyles: {
      fillColor: [66, 66, 66],
      textColor: 255,
      fontStyle: "bold",
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245],
    },
    styles: {
      fontSize: 10,
      cellPadding: 5,
      overflow: "linebreak",
      cellWidth: "auto",
    },
    margin: { top: 20 },
  });

  // Adicionar rodapé com data e hora
  const docWithPages = doc as any;
  const pageCount = docWithPages.internal.pages.length;
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text(
      `Gerado em: ${new Date().toLocaleString()}`,
      doc.internal.pageSize.getWidth() / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: "center" }
    );
  }

  // Retornar o PDF como array de bytes
  return new Uint8Array(doc.output("arraybuffer"));
}
