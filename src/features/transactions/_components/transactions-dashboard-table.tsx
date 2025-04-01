import { formatCurrency } from "@/lib/utils";

interface TransactionsDashboardTableProps {
  transactions: any[];
}

export function TransactionsDashboardTable({
  transactions,
}: TransactionsDashboardTableProps) {
  // Definir todas as bandeiras e tipos possíveis
  const BANDEIRAS = [
    "MASTERCARD",
    "VISA",
    "ELO",
    "AMEX",
    "HIPERCARD",
    "CABAL",
    "NÃO IDENTIFICADA",
    "PIX",
  ];
  const TIPOS = ["DEBIT", "CREDIT", "PREPAID_CREDIT", "PREPAID_DEBIT", "PIX"];

  // Inicializar o objeto para armazenar os dados agrupados
  const dadosAgrupados: {
    [key: string]: {
      quantidade: number;
      valorTotal: number;
      quantidadeNegada: number;
      valorTotalNegado: number;
    };
  } = {};

  // Inicializar todas as combinações possíveis
  BANDEIRAS.forEach((bandeira) => {
    TIPOS.forEach((tipo) => {
      const chave = `${bandeira}-${tipo}`;
      dadosAgrupados[chave] = {
        quantidade: 0,
        valorTotal: 0,
        quantidadeNegada: 0,
        valorTotalNegado: 0,
      };
    });
  });

  // Processar as transações
  transactions.forEach((item) => {
    const bandeira = item.transactions.brand || "NÃO IDENTIFICADA";
    const tipo = item.transactions.productType || "Não Especificado";
    const valor = Number(item.transactions.totalAmount) || 0;
    const status = item.transactions.transactionStatus || "";

    const chave = `${bandeira}-${tipo}`;
    if (dadosAgrupados[chave]) {
      if (
        status === "AUTHORIZED" ||
        status === "PRE_AUTHORIZED" ||
        status === "PENDING"
      ) {
        dadosAgrupados[chave].quantidade++;
        dadosAgrupados[chave].valorTotal += valor;
      } else {
        dadosAgrupados[chave].quantidadeNegada++;
        dadosAgrupados[chave].valorTotalNegado += valor;
      }
    }
  });

  // Calcular totais gerais
  const totalGeral = Object.values(dadosAgrupados).reduce(
    (acc, item) => ({
      quantidade: acc.quantidade + item.quantidade,
      valorTotal: acc.valorTotal + item.valorTotal,
      quantidadeNegada: acc.quantidadeNegada + item.quantidadeNegada,
      valorTotalNegado: acc.valorTotalNegado + item.valorTotalNegado,
    }),
    { quantidade: 0, valorTotal: 0, quantidadeNegada: 0, valorTotalNegado: 0 }
  );

  // Calcular totais por tipo
  const totalPorTipo: {
    [key: string]: {
      quantidade: number;
      valorTotal: number;
      quantidadeNegada: number;
      valorTotalNegado: number;
    };
  } = {};

  Object.entries(dadosAgrupados).forEach(([chave, dados]) => {
    const tipo = chave.split("-")[1];
    if (!totalPorTipo[tipo]) {
      totalPorTipo[tipo] = {
        quantidade: 0,
        valorTotal: 0,
        quantidadeNegada: 0,
        valorTotalNegado: 0,
      };
    }
    totalPorTipo[tipo].quantidade += dados.quantidade;
    totalPorTipo[tipo].valorTotal += dados.valorTotal;
    totalPorTipo[tipo].quantidadeNegada += dados.quantidadeNegada;
    totalPorTipo[tipo].valorTotalNegado += dados.valorTotalNegado;
  });

  return (
    <div className="rounded-lg border mt-2">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="h-8 px-3 text-left align-middle font-medium text-xs">
                Tipo
              </th>
              <th className="h-8 px-3 text-left align-middle font-medium text-xs">
                Bandeira
              </th>
              <th className="h-8 px-3 text-right align-middle font-medium text-xs">
                Trans.
              </th>
              <th className="h-8 px-3 text-right align-middle font-medium text-xs">
                % Trans.
              </th>
              <th className="h-8 px-3 text-right align-middle font-medium text-xs">
                Valor
              </th>
              <th className="h-8 px-3 text-right align-middle font-medium text-xs">
                % Valor
              </th>
              <th className="h-8 px-3 text-right align-middle font-medium text-xs">
                Negadas
              </th>
              <th className="h-8 px-3 text-right align-middle font-medium text-xs">
                Vlr. Negado
              </th>
            </tr>
          </thead>
          <tbody className="text-xs">
            {Object.entries(dadosAgrupados)
              .filter(
                ([, dados]) =>
                  dados.quantidade > 0 || dados.quantidadeNegada > 0
              )
              .map(([chave, dados]) => {
                const [bandeira, tipo] = chave.split("-");
                return (
                  <tr key={chave} className="border-b hover:bg-muted/30">
                    <td className="px-3 py-2">{tipo}</td>
                    <td className="px-3 py-2">{bandeira}</td>
                    <td className="px-3 py-2 text-right">{dados.quantidade}</td>
                    <td className="px-3 py-2 text-right">
                      {(
                        (dados.quantidade / totalGeral.quantidade) *
                        100
                      ).toFixed(1)}
                      %
                    </td>
                    <td className="px-3 py-2 text-right">
                      {formatCurrency(dados.valorTotal)}
                    </td>
                    <td className="px-3 py-2 text-right">
                      {(
                        (dados.valorTotal / totalGeral.valorTotal) *
                        100
                      ).toFixed(1)}
                      %
                    </td>
                    <td className="px-3 py-2 text-right">
                      {dados.quantidadeNegada}
                    </td>
                    <td className="px-3 py-2 text-right">
                      {formatCurrency(dados.valorTotalNegado)}
                    </td>
                  </tr>
                );
              })}
            {/* Totais por tipo */}
            {Object.entries(totalPorTipo)
              .filter(
                ([, dados]) =>
                  dados.quantidade > 0 || dados.quantidadeNegada > 0
              )
              .map(([tipo, dados]) => (
                <tr
                  key={`total-${tipo}`}
                  className="border-b bg-muted/30 font-medium text-xs"
                >
                  <td className="px-3 py-2">Total {tipo}</td>
                  <td className="px-3 py-2"></td>
                  <td className="px-3 py-2 text-right">{dados.quantidade}</td>
                  <td className="px-3 py-2 text-right">
                    {((dados.quantidade / totalGeral.quantidade) * 100).toFixed(
                      1
                    )}
                    %
                  </td>
                  <td className="px-3 py-2 text-right">
                    {formatCurrency(dados.valorTotal)}
                  </td>
                  <td className="px-3 py-2 text-right">
                    {((dados.valorTotal / totalGeral.valorTotal) * 100).toFixed(
                      1
                    )}
                    %
                  </td>
                  <td className="px-3 py-2 text-right">
                    {dados.quantidadeNegada}
                  </td>
                  <td className="px-3 py-2 text-right">
                    {formatCurrency(dados.valorTotalNegado)}
                  </td>
                </tr>
              ))}
            {/* Total Geral */}
            <tr className="border-b bg-primary/10 font-medium text-xs">
              <td className="px-3 py-2">TOTAL GERAL</td>
              <td className="px-3 py-2"></td>
              <td className="px-3 py-2 text-right">{totalGeral.quantidade}</td>
              <td className="px-3 py-2 text-right">100%</td>
              <td className="px-3 py-2 text-right">
                {formatCurrency(totalGeral.valorTotal)}
              </td>
              <td className="px-3 py-2 text-right">100%</td>
              <td className="px-3 py-2 text-right">
                {totalGeral.quantidadeNegada}
              </td>
              <td className="px-3 py-2 text-right">
                {formatCurrency(totalGeral.valorTotalNegado)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
