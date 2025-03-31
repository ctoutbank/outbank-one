import { PDFPage, rgb } from "pdf-lib";

interface TableConfig {
  tableWidth: number;
  startX: number;
  rowHeight: number;
  colWidth: number;
  itemsPerPage: number;
}

interface TableHeader {
  id: string;
  label: string;
  width: number;
}

export const drawPageHeader = (
  page: PDFPage,
  title: string,
  pageNumber: number,
  totalPages: number
) => {
  const { height } = page.getSize();

  page.drawText(title, {
    x: 50,
    y: height - 50,
    size: 14,
  });

  page.drawText(`Página ${pageNumber} de ${totalPages}`, {
    x: 50,
    y: height - 70,
    size: 10,
  });
};

export const drawTableHeader = (
  page: PDFPage,
  headers: TableHeader[],
  config: TableConfig,
  startY: number
) => {
  const { startX, rowHeight, tableWidth } = config;

  // Desenhar fundo do cabeçalho
  page.drawRectangle({
    x: startX,
    y: startY - rowHeight,
    width: tableWidth,
    height: rowHeight,
    color: rgb(0.9, 0.9, 0.9),
    borderColor: rgb(0, 0, 0),
    borderWidth: 1,
  });

  // Desenhar títulos das colunas
  let currentX = startX;
  headers.forEach((header) => {
    page.drawText(header.label, {
      x: currentX + 10,
      y: startY - rowHeight + 10,
      size: 12,
    });
    currentX += header.width;
  });
};

export const drawTableRow = (
  page: PDFPage,
  row: Record<string, string>,
  headers: TableHeader[],
  config: TableConfig,
  rowY: number
) => {
  const { startX, rowHeight, tableWidth } = config;

  // Desenhar fundo e borda da linha
  page.drawRectangle({
    x: startX,
    y: rowY,
    width: tableWidth,
    height: rowHeight,
    borderColor: rgb(0, 0, 0),
    borderWidth: 0.5,
  });

  // Desenhar conteúdo da linha
  let currentX = startX;
  headers.forEach((header) => {
    page.drawText(String(row[header.id] || ""), {
      x: currentX + 10,
      y: rowY + 10,
      size: 10,
    });
    currentX += header.width;
  });
};

export const calculatePagination = (
  totalItems: number,
  itemsPerPage: number
) => {
  return Math.ceil(totalItems / itemsPerPage);
};

export const getPageItems = (
  items: any[],
  pageIndex: number,
  itemsPerPage: number
) => {
  const startItem = pageIndex * itemsPerPage;
  const endItem = Math.min(startItem + itemsPerPage, items.length);
  return items.slice(startItem, endItem);
};
