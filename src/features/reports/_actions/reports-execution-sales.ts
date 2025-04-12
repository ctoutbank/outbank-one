import { TransactionsListRecord } from "@/features/transactions/serverActions/transaction";
import { drawTableHeader, drawTableRow, getPageItems } from "@/lib/pdf-utils";

import { calculatePagination, drawPageHeader } from "@/lib/pdf-utils";
import { formatCurrency, formatDate } from "@/lib/utils";
import ExcelJS from "exceljs";
import { PDFDocument, PageSizes } from "pdf-lib";

export default async function reportsExecutionSalesGeneratePDF(
  transactions: TransactionsListRecord[]
) {
  // Obter parâmetros da URL
  // Valores estáticos para o relatório de vendas

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
          date:
            formatDate(new Date(item.dateInsert || "")) +
            " " +
            new Date(item.dateInsert || "").toLocaleTimeString("pt-BR"),
          nsu: item.nsu || "",
          terminal: item.terminalLogicalNumber || "",
          valor: formatCurrency(Number(item.amount) || 0),
          bandeira: item.brand || "",
          tipo: item.productType || "",
          status: item.transactionStatus || "",
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

export async function reportsExecutionSalesGenerateXLSX(
  transactions: TransactionsListRecord[],
  dateFrom: string,
  dateTo: string
): Promise<Uint8Array | null> {
  const workbook = new ExcelJS.Workbook();

  // Verificar se transactions existe e é um array
  if (
    !transactions ||
    !Array.isArray(transactions) ||
    transactions.length === 0
  ) {
    console.log("Não há transações para gerar o relatório");
    return null;
  }

  // Definir todas as bandeiras e tipos possíveis
  const BANDEIRAS = [
    "MASTERCARD",
    "VISA",
    "ELO",
    "AMEX",
    "HIPERCARD",
    "CABAL",
    "NÃO IDENTIFICADA",
  ];
  const TIPOS = ["DEBIT", "CREDIT", "PREPAID_CREDIT", "PREPAID_DEBIT"];

  // Processar os dados e organizá-los por bandeira e tipo
  const dadosPorBandeira: { [key: string]: any[] } = {};
  const resumoGeral: {
    tipo: string;
    bandeira: string;
    quantidade: number;
    valorTotal: number;
    quantidadeNegada: number;
    valorTotalNegado: number;
  }[] = [];

  // Inicializar matriz completa
  BANDEIRAS.forEach((bandeira) => {
    TIPOS.forEach((tipo) => {
      const chaveSheet = `${bandeira}-${tipo}`;
      dadosPorBandeira[chaveSheet] = [];
      resumoGeral.push({
        tipo,
        bandeira,
        quantidade: 0,
        valorTotal: 0,
        quantidadeNegada: 0,
        valorTotalNegado: 0,
      });
    });
  });

  // Adicionar PIX-PIX separadamente
  dadosPorBandeira["PIX-PIX"] = [];
  resumoGeral.push({
    tipo: "PIX",
    bandeira: "PIX",
    quantidade: 0,
    valorTotal: 0,
    quantidadeNegada: 0,
    valorTotalNegado: 0,
  });

  transactions.forEach((item) => {
    const bandeira = item.brand || "NÃO IDENTIFICADA";
    const tipo = item.productType || "Não Especificado";
    const valor = Number(item.amount) || 0;
    const status = item.transactionStatus || "";

    // Tratar PIX-PIX separadamente
    if (bandeira === "PIX" && tipo === "PIX") {
      const chaveSheet = "PIX-PIX";
      dadosPorBandeira[chaveSheet].push({
        Data: (() => {
          const data = new Date(item.dateInsert || "");
          data.setHours(data.getHours() - 3);
          return formatDate(data) + " " + data.toLocaleTimeString("pt-BR");
        })(),
        "NSU / Id": item.nsu || "",
        Terminal: item.terminalLogicalNumber || "",
        Valor: formatCurrency(valor),
        Bandeira: bandeira,
        Tipo: tipo,
        Status: status,
      });

      // Atualizar resumo geral para PIX-PIX
      const itemResumo = resumoGeral.find(
        (r) => r.tipo === "PIX" && r.bandeira === "PIX"
      );
      if (itemResumo) {
        if (
          status === "AUTHORIZED" ||
          status === "PRE_AUTHORIZED" ||
          status === "PENDING"
        ) {
          itemResumo.quantidade++;
          itemResumo.valorTotal += valor;
        } else {
          itemResumo.quantidadeNegada++;
          itemResumo.valorTotalNegado += valor;
        }
      }
    } else {
      // Agrupar por bandeira e tipo (exceto PIX-PIX)
      const chaveSheet = `${bandeira}-${tipo}`;
      if (!dadosPorBandeira[chaveSheet]) {
        dadosPorBandeira[chaveSheet] = [];
      }
      dadosPorBandeira[chaveSheet].push({
        Data: (() => {
          const data = new Date(item.dateInsert || "");
          data.setHours(data.getHours() - 3);
          return formatDate(data) + " " + data.toLocaleTimeString("pt-BR");
        })(),
        "NSU / Id": item.nsu || "",
        Terminal: item.terminalLogicalNumber || "",
        Valor: formatCurrency(valor),
        Bandeira: bandeira,
        Tipo: tipo,
        Status: status,
      });

      // Atualizar resumo geral
      const itemResumo = resumoGeral.find(
        (r) => r.tipo === tipo && r.bandeira === bandeira
      );
      if (itemResumo) {
        if (
          status === "AUTHORIZED" ||
          status === "PRE_AUTHORIZED" ||
          status === "PENDING"
        ) {
          itemResumo.quantidade++;
          itemResumo.valorTotal += valor;
        } else {
          itemResumo.quantidadeNegada++;
          itemResumo.valorTotalNegado += valor;
        }
      }
    }
  });

  // Ordenar resumo geral por tipo e bandeira
  resumoGeral.sort((a, b) => {
    if (a.tipo === b.tipo) {
      return a.bandeira.localeCompare(b.bandeira);
    }
    return a.tipo.localeCompare(b.tipo);
  });

  // Calcular totais gerais antes de usar nas porcentagens
  const totalGeral = resumoGeral.reduce(
    (acc, item) => ({
      quantidade: acc.quantidade + item.quantidade,
      valorTotal: acc.valorTotal + item.valorTotal,
      quantidadeNegada: acc.quantidadeNegada + item.quantidadeNegada,
      valorTotalNegado: acc.valorTotalNegado + item.valorTotalNegado,
    }),
    { quantidade: 0, valorTotal: 0, quantidadeNegada: 0, valorTotalNegado: 0 }
  );

  const metadataSheet = workbook.addWorksheet("Metadados");
  metadataSheet.columns = [
    { header: "Data de Início", key: "dateFrom", width: 20 },
    { header: "Data de Fim", key: "dateTo", width: 20 },
  ];
  metadataSheet.addRow({ dateFrom, dateTo });

  // Criar planilha de resumo
  const resumoSheet = workbook.addWorksheet("Resumo Geral");

  resumoSheet.columns = [
    { header: "Tipo", key: "tipo", width: 20 },
    { header: "Bandeira", key: "bandeira", width: 20 },
    { header: "Transações", key: "quantidade", width: 15 },
    { header: "% Transações", key: "porcentagemQuantidade", width: 15 },
    { header: "Valor", key: "valorTotal", width: 20 },
    { header: "% Valor Total", key: "porcentagemValor", width: 15 },
    { header: "Transações Negadas", key: "quantidadeNegada", width: 20 },
    { header: "Valor Negado", key: "valorTotalNegado", width: 20 },
  ];

  // Adicionar dados do resumo
  resumoGeral.forEach((item) => {
    resumoSheet.addRow({
      tipo: item.tipo,
      bandeira: item.bandeira,
      quantidade: item.quantidade,
      porcentagemQuantidade: `${(
        (item.quantidade / totalGeral.quantidade) *
        100
      ).toFixed(2)}%`,
      valorTotal: formatCurrency(item.valorTotal),
      porcentagemValor: `${(
        (item.valorTotal / totalGeral.valorTotal) *
        100
      ).toFixed(2)}%`,
      quantidadeNegada: item.quantidadeNegada,
      valorTotalNegado: formatCurrency(item.valorTotalNegado),
    });
  });

  // Adicionar totais por tipo
  resumoSheet.addRow([]); // Linha em branco
  const totalPorTipo = resumoGeral.reduce(
    (acc, item) => {
      if (!acc[item.tipo]) {
        acc[item.tipo] = {
          quantidade: 0,
          valorTotal: 0,
          quantidadeNegada: 0,
          valorTotalNegado: 0,
        };
      }
      acc[item.tipo].quantidade += item.quantidade;
      acc[item.tipo].valorTotal += item.valorTotal;
      acc[item.tipo].quantidadeNegada += item.quantidadeNegada;
      acc[item.tipo].valorTotalNegado += item.valorTotalNegado;
      return acc;
    },
    {} as {
      [key: string]: {
        quantidade: number;
        valorTotal: number;
        quantidadeNegada: number;
        valorTotalNegado: number;
      };
    }
  );

  // Adicionar linha de totais por tipo
  Object.entries(totalPorTipo).forEach(([tipo, totais]) => {
    const row = resumoSheet.addRow({
      tipo: `Total ${tipo}`,
      bandeira: "",
      quantidade: totais.quantidade,
      porcentagemQuantidade: `${(
        (totais.quantidade / totalGeral.quantidade) *
        100
      ).toFixed(2)}%`,
      valorTotal: formatCurrency(totais.valorTotal),
      porcentagemValor: `${(
        (totais.valorTotal / totalGeral.valorTotal) *
        100
      ).toFixed(2)}%`,
      quantidadeNegada: totais.quantidadeNegada,
      valorTotalNegado: formatCurrency(totais.valorTotalNegado),
    });
    row.font = { bold: true };
    row.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFFFE0" },
    };
  });

  // Adicionar linha em branco
  resumoSheet.addRow([]);

  // Adicionar linha de totais gerais
  const rowTotalGeral = resumoSheet.addRow({
    tipo: "TOTAL GERAL",
    bandeira: "",
    quantidade: totalGeral.quantidade,
    porcentagemQuantidade: "100%",
    valorTotal: formatCurrency(totalGeral.valorTotal),
    porcentagemValor: "100%",
    quantidadeNegada: totalGeral.quantidadeNegada,
    valorTotalNegado: formatCurrency(totalGeral.valorTotalNegado),
  });
  rowTotalGeral.font = { bold: true, size: 12 };
  rowTotalGeral.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FFD700" },
  };

  // Estilizar cabeçalho do resumo
  const headerRow = resumoSheet.getRow(1);
  headerRow.font = { bold: true };
  headerRow.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FFE0E0E0" },
  };

  // Estilizar todas as células do resumo
  resumoSheet.eachRow((row, rowNumber) => {
    if (rowNumber > 1) {
      row.eachCell((cell) => {
        cell.alignment = { vertical: "middle", horizontal: "center" };
        cell.border = {
          top: { style: "thin" },
          bottom: { style: "thin" },
          left: { style: "thin" },
          right: { style: "thin" },
        };
      });
    }
  });

  // Criar planilha com todas as transações
  const todasTransacoesSheet = workbook.addWorksheet("Todas as Transações");
  todasTransacoesSheet.columns = [
    { header: "Data", key: "Data", width: 20 },
    { header: "NSU / Id", key: "NSU / Id", width: 20 },
    { header: "Terminal", key: "Terminal", width: 15 },
    { header: "Valor", key: "Valor", width: 20 },
    { header: "Bandeira", key: "Bandeira", width: 15 },
    { header: "Tipo", key: "Tipo", width: 20 },
    { header: "Status", key: "Status", width: 15 },
  ];

  // Adicionar todas as transações
  transactions.forEach((item) => {
    todasTransacoesSheet.addRow({
      Data: (() => {
        const data = new Date(item.dateInsert || "");
        data.setHours(data.getHours() - 3);
        return formatDate(data) + " " + data.toLocaleTimeString("pt-BR");
      })(),
      "NSU / Id": item.nsu || "",
      Terminal: item.terminalLogicalNumber || "",
      Valor: formatCurrency(Number(item.amount) || 0),
      Bandeira: item.brand || "",
      Tipo: item.productType || "",
      Status: item.transactionStatus || "",
    });
  });

  // Estilizar cabeçalho da planilha de todas as transações
  const headerRowTodas = todasTransacoesSheet.getRow(1);
  headerRowTodas.font = { bold: true };
  headerRowTodas.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FFE0E0E0" },
  };

  // Estilizar células da planilha de todas as transações
  todasTransacoesSheet.eachRow((row) => {
    row.eachCell((cell) => {
      cell.alignment = { vertical: "middle", horizontal: "center" };
      cell.border = {
        top: { style: "thin" },
        bottom: { style: "thin" },
        left: { style: "thin" },
        right: { style: "thin" },
      };
    });
  });

  // Criar planilhas por bandeira-tipo
  BANDEIRAS.forEach((bandeira) => {
    TIPOS.forEach((tipo) => {
      const chaveSheet = `${bandeira}-${tipo}`;
      const worksheet = workbook.addWorksheet(chaveSheet);

      worksheet.columns = [
        { header: "Data", key: "Data", width: 20 },
        { header: "NSU / Id", key: "NSU / Id", width: 20 },
        { header: "Terminal", key: "Terminal", width: 15 },
        { header: "Valor", key: "Valor", width: 20 },
        { header: "Status", key: "Status", width: 15 },
      ];

      dadosPorBandeira[chaveSheet].forEach((row) => {
        worksheet.addRow({
          Data: row.Data,
          "NSU / Id": row["NSU / Id"],
          Terminal: row.Terminal,
          Valor: row.Valor,
          Status: row.Status,
        });
      });

      // Estilizar cabeçalho
      const headerRow = worksheet.getRow(1);
      headerRow.font = { bold: true };
      headerRow.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFE0E0E0" },
      };

      // Estilizar células
      worksheet.eachRow((row) => {
        row.eachCell((cell) => {
          cell.alignment = { vertical: "middle", horizontal: "center" };
          cell.border = {
            top: { style: "thin" },
            bottom: { style: "thin" },
            left: { style: "thin" },
            right: { style: "thin" },
          };
        });
      });
    });
  });

  const buffer = await workbook.xlsx.writeBuffer();
  return new Uint8Array(buffer);
}
