import ExcelJS from "exceljs";
import { formatCurrency, formatDate } from "@/lib/utils";

interface ResumoItem {
    tipo: string;
    bandeira: string;
    quantidade: number;
    valorTotal: number;
    quantidadeNegada: number;
    valorTotalNegado: number;
}

interface TotaisTipo {
    quantidade: number;
    valorTotal: number;
    quantidadeNegada: number;
    valorTotalNegado: number;
}

export async function exportToExcelTransactions({
                                                    transactions,
                                                    fileName,
                                                }: {
    transactions: any[];
    fileName: string;
}) {
    const workbook = new ExcelJS.Workbook();

    if (!transactions || transactions.length === 0) {
        console.warn("Não há transações para gerar o relatório");
        return;
    }

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

    const dadosPorBandeira: { [key: string]: any[] } = {};
    const resumoGeral: ResumoItem[] = [];

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

    dadosPorBandeira["PIX-PIX"] = [];
    resumoGeral.push({
        tipo: "PIX",
        bandeira: "PIX",
        quantidade: 0,
        valorTotal: 0,
        quantidadeNegada: 0,
        valorTotalNegado: 0,
    });

    // --- monta dados por bandeira (usando valores numéricos corretos para % e moeda) ---
    transactions.forEach((item) => {
        const bandeira = item.brand || "NÃO IDENTIFICADA";
        const tipo = item.productType || "Não Especificado";
        const valor = Number(item.amount) || 0;
        const status = item.transactionStatus || "";
        const fee = Number(item.feeAdmin);
        const transactionMdr = Number(item.transactionMdr);
        const lucro = Number(item.lucro);
        const repasse = Number(item.repasse) || 0;

        const rowData = {
            Data: (() => {
                if (!item.dtInsert) return "-";
                const data = new Date(item.dtInsert);
                data.setHours(data.getHours() - 3);
                return formatDate(data) + " " + data.toLocaleTimeString("pt-BR");
            })(),
            "NSU / Id": item.nsu || "-",
            Terminal: item.terminalLogicalNumber || "-",
            Valor: valor,
            Bandeira: bandeira,
            Tipo: tipo,
            Status: status || "-",
            Fee_Admin: isNaN(fee) ? 0 : fee / 100, // percent as fractional
            TransactionMdr: isNaN(transactionMdr) ? 0 : transactionMdr / 100,
            Lucro: isNaN(lucro) ? 0 : lucro / 100,
            Repasse: isNaN(repasse) ? 0 : repasse,
        };

        if (bandeira === "PIX" && tipo === "PIX") {
            dadosPorBandeira["PIX-PIX"].push(rowData);
            const itemResumo = resumoGeral.find(
                (r) => r.tipo === "PIX" && r.bandeira === "PIX"
            );
            if (itemResumo) {
                if (["AUTHORIZED", "PRE_AUTHORIZED", "PENDING"].includes(status)) {
                    itemResumo.quantidade++;
                    itemResumo.valorTotal += valor;
                } else {
                    itemResumo.quantidadeNegada++;
                    itemResumo.valorTotalNegado += valor;
                }
            }
        } else {
            const chaveSheet = `${bandeira}-${tipo}`;
            dadosPorBandeira[chaveSheet]?.push(rowData);
            const itemResumo = resumoGeral.find(
                (r) => r.tipo === tipo && r.bandeira === bandeira
            );
            if (itemResumo) {
                if (["AUTHORIZED", "PRE_AUTHORIZED", "PENDING"].includes(status)) {
                    itemResumo.quantidade++;
                    itemResumo.valorTotal += valor;
                } else {
                    itemResumo.quantidadeNegada++;
                    itemResumo.valorTotalNegado += valor;
                }
            }
        }
    });

    resumoGeral.sort((a, b) => {
        if (a.tipo === b.tipo) return a.bandeira.localeCompare(b.bandeira);
        return a.tipo.localeCompare(b.tipo);
    });

    const totalGeral: TotaisTipo = resumoGeral.reduce(
        (acc, item) => ({
            quantidade: acc.quantidade + item.quantidade,
            valorTotal: acc.valorTotal + item.valorTotal,
            quantidadeNegada: acc.quantidadeNegada + item.quantidadeNegada,
            valorTotalNegado: acc.valorTotalNegado + item.valorTotalNegado,
        }),
        { quantidade: 0, valorTotal: 0, quantidadeNegada: 0, valorTotalNegado: 0 }
    );

    // --- ABA RESUMO ---
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

    // aplica estilo ao header da primeira página (Resumo Geral) — sem tocar nos blocos amarelos abaixo
    const resumoHeader = resumoSheet.getRow(1);
    resumoHeader.eachCell((cell) => {
        cell.font = { bold: true, color: { argb: "FFFFFF" } };
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "4F4F4F" } };
        cell.border = {
            top: { style: "thin", color: { argb: "000000" } },
            left: { style: "thin", color: { argb: "000000" } },
            bottom: { style: "thin", color: { argb: "000000" } },
            right: { style: "thin", color: { argb: "000000" } },
        };
        cell.alignment = { horizontal: "center", vertical: "middle" };
    });

    // adiciona as linhas do resumo (mantendo e NÃO sobrescrevendo fills de totais amarelos)
    resumoGeral.forEach((item) => {
        const row = resumoSheet.addRow({
            tipo: item.tipo,
            bandeira: item.bandeira,
            quantidade: item.quantidade,
            porcentagemQuantidade: `${((item.quantidade / totalGeral.quantidade) * 100).toFixed(2)}%`,
            valorTotal: formatCurrency(item.valorTotal),
            porcentagemValor: `${((item.valorTotal / totalGeral.valorTotal) * 100).toFixed(2)}%`,
            quantidadeNegada: item.quantidadeNegada,
            valorTotalNegado: formatCurrency(item.valorTotalNegado),
        });

        // aplica apenas fonte e borda — não altera fill (assim mantém os blocos amarelos quando existirem)
        row.eachCell((cell) => {
            cell.font = { bold: true };
            cell.border = {
                top: { style: "thin", color: { argb: "000000" } },
                left: { style: "thin", color: { argb: "000000" } },
                bottom: { style: "thin", color: { argb: "000000" } },
                right: { style: "thin", color: { argb: "000000" } },
            };
        });
    });

    resumoSheet.addRow([]);

    // --- TOTAIS POR TIPO (mantém o preenchimento amarelo como no seu código original) ---
    const totalPorTipo: Record<string, TotaisTipo> = resumoGeral.reduce((acc, item) => {
        if (!acc[item.tipo]) acc[item.tipo] = { quantidade: 0, valorTotal: 0, quantidadeNegada: 0, valorTotalNegado: 0 };
        acc[item.tipo].quantidade += item.quantidade;
        acc[item.tipo].valorTotal += item.valorTotal;
        acc[item.tipo].quantidadeNegada += item.quantidadeNegada;
        acc[item.tipo].valorTotalNegado += item.valorTotalNegado;
        return acc;
    }, {} as Record<string, TotaisTipo>);

    ["CREDIT", "DEBIT", "PREPAID_CREDIT", "PREPAID_DEBIT", "PIX"].forEach((tipo) => {
        if (!totalPorTipo[tipo]) totalPorTipo[tipo] = { quantidade: 0, valorTotal: 0, quantidadeNegada: 0, valorTotalNegado: 0 };
    });

    Object.entries(totalPorTipo).forEach(([tipo, totais]) => {
        const row = resumoSheet.addRow({
            tipo: `Total ${tipo}`,
            bandeira: "",
            quantidade: totais.quantidade,
            porcentagemQuantidade: `${((totais.quantidade / totalGeral.quantidade) * 100).toFixed(2)}%`,
            valorTotal: formatCurrency(totais.valorTotal),
            porcentagemValor: `${((totais.valorTotal / totalGeral.valorTotal) * 100).toFixed(2)}%`,
            quantidadeNegada: totais.quantidadeNegada,
            valorTotalNegado: formatCurrency(totais.valorTotalNegado),
        });
        // mantém o comportamento original (fundo amarelo), mas garante negrito
        row.font = { bold: true };
        row.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFFE0" } };

        // aplica borda nas células desse row (não muda fill)
        row.eachCell((cell) => {
            cell.border = {
                top: { style: "thin", color: { argb: "000000" } },
                left: { style: "thin", color: { argb: "000000" } },
                bottom: { style: "thin", color: { argb: "000000" } },
                right: { style: "thin", color: { argb: "000000" } },
            };
        });
    });

    resumoSheet.addRow([]);

    // --- TOTAL GERAL (mantém dourado) ---
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
    rowTotalGeral.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFD700" } };

    // aplica bordas no TOTAL GERAL (sem alterar o fill dourado)
    rowTotalGeral.eachCell((cell) => {
        cell.border = {
            top: { style: "thin", color: { argb: "000000" } },
            left: { style: "thin", color: { argb: "000000" } },
            bottom: { style: "thin", color: { argb: "000000" } },
            right: { style: "thin", color: { argb: "000000" } },
        };
    });

    // --- PLANILHA TODAS AS TRANSAÇÕES ---
    const todasSheet = workbook.addWorksheet("Todas as Transações");
    todasSheet.columns = [
        { header: "Data", key: "dtInsert", width: 20 },
        { header: "NSU", key: "nsu", width: 20 },
        { header: "Terminal", key: "terminalLogicalNumber", width: 20 },
        { header: "Valor (R$)", key: "amount", width: 15, style: { numFmt: "R$ #,##0.00" } },
        { header: "Bandeira", key: "brand", width: 20 },
        { header: "Tipo", key: "productType", width: 20 },
        { header: "Status", key: "transactionStatus", width: 20 },
        { header: "% Custo", key: "feeAdmin", width: 15, style: { numFmt: "0.00%" } },
        { header: "% Total", key: "transactionMdr", width: 15, style: { numFmt: "0.00%" } },
        { header: "% Lucro", key: "lucro", width: 15, style: { numFmt: "0.00%" } },
        { header: "R$ Repasse", key: "repasse", width: 15, style: { numFmt: "R$ #,##0.00" } },
    ];

    // header estilizado (Todas as Transações)
    const headerRow = todasSheet.getRow(1);
    headerRow.eachCell((cell) => {
        cell.font = { bold: true, color: { argb: "FFFFFF" } };
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "4F4F4F" } };
        cell.border = {
            top: { style: "thin", color: { argb: "000000" } },
            left: { style: "thin", color: { argb: "000000" } },
            bottom: { style: "thin", color: { argb: "000000" } },
            right: { style: "thin", color: { argb: "000000" } },
        };
        cell.alignment = { horizontal: "center", vertical: "middle" };
    });

    // escreve linhas garantindo 0 para campos numéricos quando ausentes
    transactions.forEach((item) => {
        // format date like in rowData
        let dtValue = "-";
        if (item.dtInsert) {
            const d = new Date(item.dtInsert);
            d.setHours(d.getHours() - 3);
            dtValue = formatDate(d) + " " + d.toLocaleTimeString("pt-BR");
        }

        const amount = Number(item.amount) || 0;
        const feeRaw = Number(item.feeAdmin);
        const fee = isNaN(feeRaw) ? 0 : feeRaw / 100;
        const mdrRaw = Number(item.transactionMdr);
        const mdr = isNaN(mdrRaw) ? 0 : mdrRaw / 100;
        const lucroRaw = Number(item.lucro);
        const lucro = isNaN(lucroRaw) ? 0 : lucroRaw / 100;
        const repasse = Number(item.repasse) || 0;

        const addedRow = todasSheet.addRow({
            dtInsert: dtValue,
            nsu: item.nsu || "-",
            terminalLogicalNumber: item.terminalLogicalNumber || "-",
            amount: amount,
            brand: item.brand || "-",
            productType: item.productType || "-",
            transactionStatus: item.transactionStatus || "-",
            feeAdmin: fee,
            transactionMdr: mdr,
            lucro: lucro,
            repasse: repasse,
        });

        addedRow.eachCell((cell) => {
            cell.font = { bold: true };
            cell.border = {
                top: { style: "thin", color: { argb: "000000" } },
                left: { style: "thin", color: { argb: "000000" } },
                bottom: { style: "thin", color: { argb: "000000" } },
                right: { style: "thin", color: { argb: "000000" } },
            };
        });
    });

    // --- Outras abas por bandeira ---
    Object.entries(dadosPorBandeira).forEach(([sheetName, rows]) => {
        const ws = workbook.addWorksheet(sheetName);
        if (rows.length > 0) {
            ws.columns = Object.keys(rows[0]).map((k) => {
                if (["Valor", "Repasse"].includes(k)) {
                    return { header: k, key: k, width: 20, style: { numFmt: "R$ #,##0.00" } };
                }
                if (["Fee_Admin", "TransactionMdr", "Lucro"].includes(k)) {
                    return { header: k, key: k, width: 20, style: { numFmt: "0.00%" } };
                }
                return { header: k, key: k, width: 20 };
            });

            // header formatado
            const wsHeader = ws.getRow(1);
            wsHeader.eachCell((cell) => {
                cell.font = { bold: true, color: { argb: "FFFFFF" } };
                cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "4F4F4F" } };
                cell.border = {
                    top: { style: "thin", color: { argb: "000000" } },
                    left: { style: "thin", color: { argb: "000000" } },
                    bottom: { style: "thin", color: { argb: "000000" } },
                    right: { style: "thin", color: { argb: "000000" } },
                };
                cell.alignment = { horizontal: "center", vertical: "middle" };
            });

            // aplica estilo nas linhas
            rows.forEach((r) => {
                const addedRow = ws.addRow(r);
                addedRow.eachCell((cell) => {
                    cell.font = { bold: true };
                    cell.border = {
                        top: { style: "thin", color: { argb: "000000" } },
                        left: { style: "thin", color: { argb: "000000" } },
                        bottom: { style: "thin", color: { argb: "000000" } },
                        right: { style: "thin", color: { argb: "000000" } },
                    };
                });
            });
        }
    });

    // --- DOWNLOAD ---
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
}
