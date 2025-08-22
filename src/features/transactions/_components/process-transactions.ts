export function processTransactions(transactions: any[]) {
    const grouped: any = {};
    const totalsByType: any = {};
    let totalTransactions = 0;
    let totalValue = 0;
    let totalDenied = 0;
    let totalDeniedValue = 0;

    for (const t of transactions) {
        const tipo = t.productType || "NÃO IDENTIFICADO";
        const bandeira = t.brand || "NÃO IDENTIFICADA";
        const key = `${tipo}__${bandeira}`;

        if (!grouped[key]) {
            grouped[key] = {
                tipo,
                bandeira,
                transacoes: 0,
                valor: 0,
                transacoesNegadas: 0,
                valorNegado: 0,
            };
        }

        grouped[key].transacoes += 1;
        grouped[key].valor += t.amount;

        if (t.status === "NEGADO") {
            grouped[key].transacoesNegadas += 1;
            grouped[key].valorNegado += t.amount;
        }

        if (!totalsByType[tipo]) {
            totalsByType[tipo] = {
                tipo,
                transacoes: 0,
                valor: 0,
                transacoesNegadas: 0,
                valorNegado: 0,
            };
        }

        totalsByType[tipo].transacoes += 1;
        totalsByType[tipo].valor += t.amount;
        if (t.status === "NEGADO") {
            totalsByType[tipo].transacoesNegadas += 1;
            totalsByType[tipo].valorNegado += t.amount;
        }

        totalTransactions += 1;
        totalValue += t.amount;
        if (t.status === "NEGADO") {
            totalDenied += 1;
            totalDeniedValue += t.amount;
        }
    }

    const resumo = Object.values(grouped).map((g: any) => ({
        Tipo: g.tipo,
        Bandeira: g.bandeira,
        "Transações": g.transacoes,
        "% Transações": (g.transacoes / totalTransactions) * 100,
        "Valor": g.valor,
        "% Valor Total": (g.valor / totalValue) * 100,
        "Transações Negadas": g.transacoesNegadas,
        "Valor Negado": g.valorNegado,
    }));

    const totais = Object.values(totalsByType).map((t: any) => ({
        Tipo: `Total ${t.tipo}`,
        Bandeira: "",
        "Transações": t.transacoes,
        "% Transações": (t.transacoes / totalTransactions) * 100,
        "Valor": t.valor,
        "% Valor Total": (t.valor / totalValue) * 100,
        "Transações Negadas": t.transacoesNegadas,
        "Valor Negado": t.valorNegado,
    }));

    const totalGeral = {
        Tipo: "TOTAL GERAL",
        Bandeira: "",
        "Transações": totalTransactions,
        "% Transações": 100,
        "Valor": totalValue,
        "% Valor Total": 100,
        "Transações Negadas": totalDenied,
        "Valor Negado": totalDeniedValue,
    };

    return { resumo, totais, totalGeral };
}
