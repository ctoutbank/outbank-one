// app/api/relatorio/route.ts
import { NextResponse } from "next/server";
import { PDFDocument } from "pdf-lib";

export async function GET() {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage();
  page.drawText("Relatório gerado no backend com pdf-lib!", { x: 50, y: 350 });
  // Adicionar uma tabela simples
  const { width, height } = page.getSize();

  // Definir configurações da tabela
  const tableWidth = 500;
  const startX = 50;
  const startY = 300;
  const rowHeight = 30;
  const colWidth = tableWidth / 3;

  // Desenhar cabeçalho da tabela

  // Títulos das colunas
  page.drawText("ID", { x: startX + 10, y: startY + 10, size: 12 });
  page.drawText("Descrição", {
    x: startX + colWidth + 10,
    y: startY + 10,
    size: 12,
  });
  page.drawText("Valor", {
    x: startX + colWidth * 2 + 10,
    y: startY + 10,
    size: 12,
  });

  // Desenhar linhas da tabela
  const dados = [
    { id: "001", descricao: "Item 1", valor: "R$ 100,00" },
    { id: "002", descricao: "Item 2", valor: "R$ 200,00" },
    { id: "003", descricao: "Item 3", valor: "R$ 300,00" },
    { id: "004", descricao: "Item 4", valor: "R$ 400,00" },
  ];

  dados.forEach((item, index) => {
    const rowY = startY - (index + 1) * rowHeight;

    // Desenhar fundo da linha

    // Desenhar texto da linha
    page.drawText(item.id, { x: startX + 10, y: rowY + 10, size: 10 });
    page.drawText(item.descricao, {
      x: startX + colWidth + 10,
      y: rowY + 10,
      size: 10,
    });
    page.drawText(item.valor, {
      x: startX + colWidth * 2 + 10,
      y: rowY + 10,
      size: 10,
    });
  });

  const pdfBytes = await pdfDoc.save();

  return new NextResponse(Buffer.from(pdfBytes), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=relatorio.pdf",
    },
  });
}
