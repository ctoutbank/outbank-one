// app/api/relatorio/route.ts
import { getTransactions } from "@/features/transactions/serverActions/transaction";
import { NextResponse } from "next/server";
import { PDFDocument, rgb } from "pdf-lib";

export async function GET(request: Request) {
  const pdfDoc = await PDFDocument.create();

  // Definir configurações da tabela
  const tableWidth = 500;
  const startX = 50;
  const rowHeight = 30;
  const colWidth = tableWidth / 3;
  const itemsPerPage = 10; // Número de itens por página

  // Obter parâmetros da URL
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") || "";
  const pageNumber = parseInt(searchParams.get("page") || "1", 10);
  const pageSize = parseInt(searchParams.get("pageSize") || "100", 10); // Aumentei para pegar mais dados
  const status = searchParams.get("status") || undefined;
  const merchant = searchParams.get("merchant") || undefined;
  const dateFrom = searchParams.get("dateFrom") || undefined;
  const dateTo = searchParams.get("dateTo") || undefined;
  const productType = searchParams.get("productType") || undefined;

  const transactions = await getTransactions(
    search,
    pageNumber,
    pageSize,
    status,
    merchant,
    dateFrom,
    dateTo,
    productType
  );

  // Verificar se transactions existe e é um array, caso contrário usar array vazio
  const dados =
    transactions.transactions && Array.isArray(transactions.transactions)
      ? transactions.transactions.map((item) => ({
          id: item.dtInsert || "",
          descricao: item.productType || "",
          valor: item.totalAmount || "",
        }))
      : [];

  // Calcular o número de páginas necessárias
  const totalPages = Math.ceil(dados.length / itemsPerPage);

  // Criar páginas e desenhar tabelas
  for (let pageIndex = 0; pageIndex < totalPages; pageIndex++) {
    // Adicionar nova página
    const page = pdfDoc.addPage();
    const { width, height } = page.getSize();

    // Desenhar título da página
    page.drawText(
      `Relatório gerado no backend - Página ${pageIndex + 1} de ${totalPages}`,
      {
        x: 50,
        y: height - 50,
        size: 14,
      }
    );

    const startY = height - 100; // Posição inicial da tabela

    // Desenhar cabeçalho da tabela
    page.drawRectangle({
      x: startX,
      y: startY - rowHeight,
      width: tableWidth,
      height: rowHeight,
      color: rgb(0.9, 0.9, 0.9),
      borderColor: rgb(0, 0, 0),
      borderWidth: 1,
    });

    // Títulos das colunas
    page.drawText("ID", {
      x: startX + 10,
      y: startY - rowHeight + 10,
      size: 12,
    });
    page.drawText("Descrição", {
      x: startX + colWidth + 10,
      y: startY - rowHeight + 10,
      size: 12,
    });
    page.drawText("Valor", {
      x: startX + colWidth * 2 + 10,
      y: startY - rowHeight + 10,
      size: 12,
    });

    // Calcular quais itens vão nesta página
    const startItem = pageIndex * itemsPerPage;
    const endItem = Math.min(startItem + itemsPerPage, dados.length);
    const pageItems = dados.slice(startItem, endItem);

    // Desenhar linhas da tabela para esta página
    pageItems.forEach((item, index) => {
      const rowY = startY - (index + 1) * rowHeight - rowHeight;

      // Desenhar fundo e borda da linha
      page.drawRectangle({
        x: startX,
        y: rowY,
        width: tableWidth,
        height: rowHeight,
        borderColor: rgb(0, 0, 0),
        borderWidth: 0.5,
      });

      // Desenhar texto da linha
      page.drawText(String(item.id), {
        x: startX + 10,
        y: rowY + 10,
        size: 10,
      });
      page.drawText(String(item.descricao), {
        x: startX + colWidth + 10,
        y: rowY + 10,
        size: 10,
      });
      page.drawText(String(item.valor), {
        x: startX + colWidth * 2 + 10,
        y: rowY + 10,
        size: 10,
      });
    });

    // Adicionar rodapé com número da página
    page.drawText(`Página ${pageIndex + 1} de ${totalPages}`, {
      x: width / 2 - 40,
      y: 30,
      size: 10,
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
