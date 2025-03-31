import { drawTableHeader, drawTableRow, getPageItems } from "@/lib/pdf-utils";

import { getTransactionsForReport } from "@/features/transactions/serverActions/transaction";
import { calculatePagination, drawPageHeader } from "@/lib/pdf-utils";
import { formatCurrency, formatDate } from "@/lib/utils";
import { PDFDocument, PageSizes } from "pdf-lib";

export default async function reportsExecutionSalesGeneratePDF() {
  // Obter parâmetros da URL
  // Valores estáticos para o relatório de vendas
  const search = "";
  const pageNumber = 1;
  const pageSize = 1000;
  const status = undefined;
  const merchant = undefined;
  const dateFrom = undefined;
  const dateTo = new Date().toISOString();
  const productType = undefined;

  const transactions = await getTransactionsForReport(
    search,
    pageNumber,
    pageSize,
    status,
    merchant,
    dateFrom,
    dateTo,
    productType
  );

  const pdfDoc = await PDFDocument.create();

  // Configurações da tabela para layout paisagem
  const tableConfig = {
    tableWidth: 750, // Aumentado para aproveitar o espaço horizontal
    startX: 40,
    rowHeight: 25, // Diminuído para caber mais linhas
    colWidth: 750 / 7, // Dividido pelo número de colunas
    itemsPerPage: 18, // Aumentado devido ao layout paisagem
    fontSize: 9, // Tamanho da fonte reduzido
  };

  // Definição dos cabeçalhos da tabela com larguras ajustadas
  const tableHeaders = [
    { id: "date", label: "Data", width: tableConfig.colWidth * 0.9 },
    { id: "nsu", label: "NSU / Id", width: tableConfig.colWidth * 1.4 },
    { id: "terminal", label: "Terminal", width: tableConfig.colWidth * 1.2 },
    { id: "valor", label: "Valor", width: tableConfig.colWidth * 0.8 },
    { id: "bandeira", label: "Bandeira", width: tableConfig.colWidth * 0.9 },
    { id: "tipo", label: "Tipo", width: tableConfig.colWidth * 0.8 },
    { id: "status", label: "Status", width: tableConfig.colWidth * 0.8 },
  ];

  // Verificar se transactions existe e é um array, caso contrário usar array vazio
  const dados =
    transactions && Array.isArray(transactions)
      ? transactions.map((item) => ({
          date: formatDate(new Date(item.transactions.dtInsert || "")),
          nsu: item.transactions.rrn || "",
          terminal: item.terminals.logicalNumber || "",
          valor: formatCurrency(Number(item.transactions.totalAmount) || 0),
          bandeira: item.transactions.brand || "",
          tipo: item.transactions.productType || "",
          status: item.transactions.transactionStatus || "",
        }))
      : [];

  // Calcular o número de páginas necessárias
  const totalPages = calculatePagination(
    dados.length,
    tableConfig.itemsPerPage
  );

  // Criar páginas e desenhar tabelas
  for (let pageIndex = 0; pageIndex < totalPages; pageIndex++) {
    // Criar página em modo paisagem usando as dimensões corretas do A4 (altura, largura)
    const page = pdfDoc.addPage([PageSizes.A4[1], PageSizes.A4[0]]);
    const { height } = page.getSize();
    const startY = height - 80;

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

  return pdfBytes;
}
