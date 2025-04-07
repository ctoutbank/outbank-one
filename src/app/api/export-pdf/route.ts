// app/api/relatorio/route.ts
import { getTransactions } from "@/features/transactions/serverActions/transaction";
import {
  calculatePagination,
  drawPageHeader,
  drawTableHeader,
  drawTableRow,
  getPageItems,
} from "@/lib/pdf-utils";
import { NextResponse } from "next/server";
import { PDFDocument } from "pdf-lib";

export async function GET(request: Request) {
  // Obter parâmetros da URL
  const { searchParams } = new URL(request.url);
  const pageNumber = parseInt(searchParams.get("page") || "1", 10);
  const pageSize = parseInt(searchParams.get("pageSize") || "100", 10);
  const status = searchParams.get("status") || undefined;
  const merchant = searchParams.get("merchant") || undefined;
  const dateFrom = searchParams.get("dateFrom") || undefined;
  const dateTo = searchParams.get("dateTo") || undefined;
  const productType = searchParams.get("productType") || undefined;

  const transactions = await getTransactions(
    pageNumber,
    pageSize,
    status,
    merchant,
    dateFrom,
    dateTo,
    productType
  );

  const pdfDoc = await PDFDocument.create();

  // Configurações da tabela
  const tableConfig = {
    tableWidth: 500,
    startX: 50,
    rowHeight: 30,
    colWidth: 500 / 3,
    itemsPerPage: 10,
  };

  // Definição dos cabeçalhos da tabela
  const tableHeaders = [
    { id: "id", label: "ID", width: tableConfig.colWidth },
    { id: "descricao", label: "Descrição", width: tableConfig.colWidth },
    { id: "valor", label: "Valor", width: tableConfig.colWidth },
  ];

  // Verificar se transactions existe e é um array, caso contrário usar array vazio
  const dados =
    transactions.transactions && Array.isArray(transactions.transactions)
      ? transactions.transactions.map((item) => ({
          id: item.dateInsert || "",
          descricao: item.productType || "",
          valor: item.amount || "",
        }))
      : [];

  // Calcular o número de páginas necessárias
  const totalPages = calculatePagination(
    dados.length,
    tableConfig.itemsPerPage
  );

  // Criar páginas e desenhar tabelas
  for (let pageIndex = 0; pageIndex < totalPages; pageIndex++) {
    const page = pdfDoc.addPage();
    const { height } = page.getSize();
    const startY = height - 100;

    // Desenhar cabeçalho da página
    drawPageHeader(
      page,
      "Relatório gerado no backend",
      pageIndex + 1,
      totalPages
    );

    // Desenhar cabeçalho da tabela
    drawTableHeader(page, tableHeaders, tableConfig, startY);

    // Obter itens da página atual
    const pageItems = getPageItems(dados, pageIndex, tableConfig.itemsPerPage);

    // Desenhar linhas da tabela
    pageItems.forEach((item, index) => {
      const rowY =
        startY - (index + 1) * tableConfig.rowHeight - tableConfig.rowHeight;
      drawTableRow(page, item, tableHeaders, tableConfig, rowY);
    });
  }

  const pdfBytes = await pdfDoc.save();

  return new NextResponse(Buffer.from(pdfBytes), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=relatorio.pdf",
    },
  });
}
