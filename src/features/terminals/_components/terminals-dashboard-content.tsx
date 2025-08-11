"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BarChart from "@/features/terminals/_components/barChart";
import LineChart from "@/features/terminals/_components/lineChart";
import { terminalModels } from "@/lib/lookuptables/lookuptables-terminals";
import {
  Cell,
  Pie,
  PieChart,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from "recharts";
import type { EvolucaoMensal, ModeloAtivo } from "../serverActions/terminal";

type TerminalsDashboardContentProps = {
  totalTerminals: number;
  ativosTerminals: number;
  inativosTerminals: number;
  modelosAtivosDetalhes?: ModeloAtivo[];
  evolucaoData: EvolucaoMensal[];
};

// Placeholder para gráficos vazios
function EmptyChartPlaceholder({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full py-6">
      <span className="text-3xl mb-2">📉</span>
      <span className="text-xs text-zinc-500 text-center">{message}</span>
    </div>
  );
}

export function TerminalsDashboardContent({
  totalTerminals,
  ativosTerminals,
  inativosTerminals,
  modelosAtivosDetalhes = [],
  evolucaoData,
}: TerminalsDashboardContentProps) {
  modelosAtivosDetalhes = terminalModels.map((item) => {
    const quantity = modelosAtivosDetalhes.find((model) => model.nome === item);
    return {
      nome: item,
      quantidade: quantity ? quantity.quantidade : 0,
    };
  });

  // Dados para o gráfico de pizza (Distribuição por Status)
  const statusData = [
    {
      name: "Ativos",
      value: ativosTerminals,
      color: "#e76e51", // red-500
    },
    {
      name: "Inativos",
      value: inativosTerminals,
      color: "#2a9d90", // emerald-500
    },
  ];

  // Dados para gráfico de barras dos modelos
  const modelosData = modelosAtivosDetalhes.sort(
    (a, b) => b.quantidade - a.quantidade
  );

  return (
    <div className="w-full mt-1 mb-1 md:mt-2 md:mb-2 lg:mt-4 lg:mb-4">
      <div className="grid grid-cols-1 gap-2 md:gap-3 lg:gap-4">
        <Card className="w-full border-none bg-transparent">
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-3 lg:gap-6 w-full">
              {/* Card 1: Distribuição por Status */}
              <Card className="bg-transparent border">
                <CardHeader>
                  <CardTitle className="text-[10px] md:text-sm lg:text-base font-semibold">
                    Distribuição por Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[100px] md:h-[140px] lg:h-[180px] w-full flex items-center justify-center mt-4">
                    {totalTerminals === 0 ? (
                      <EmptyChartPlaceholder message="Nenhum terminal cadastrado." />
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={statusData}
                            cx="50%"
                            cy="50%"
                            outerRadius={60}
                            className="md:outerRadius-[35] lg:outerRadius-[50]"
                            dataKey="value"
                          >
                            {statusData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <RechartsTooltip
                            formatter={(
                              value: number,
                              name: string
                            ) => [`${value} terminais`, name]}
                            separator=": "
                            contentStyle={{
                              background: "#fff",
                              border: "1px solid #e5e7eb",
                              borderRadius: 6,
                              fontSize: 12,
                              color: "#222",
                            }}
                            itemStyle={{ color: "#222" }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    )}
                  </div>

                  {/* Legenda simples centralizada */}
                  {totalTerminals !== 0 && (
                    <div className="flex justify-center gap-2 md:gap-3 lg:gap-4 mt-2 md:mt-3 lg:mt-4">
                      {statusData.map((item, index) => {
                        const percentage = (
                          (item.value / totalTerminals) *
                          100
                        ).toFixed(0);
                        return (
                          <div
                            key={index}
                            className="flex items-center gap-1 md:gap-2"
                          >
                            <div
                              className="h-2 w-2 md:h-3 md:w-3 lg:h-4 lg:w-4 rounded-full"
                              style={{ backgroundColor: item.color }}
                            />
                            <span className="text-[10px] md:text-xs lg:text-sm text-zinc-700">
                              {item.name}
                            </span>
                            <span className="text-[10px] md:text-xs lg:text-sm font-semibold text-zinc-900">
                              {percentage}%
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Card 2: Evolução Mensal */}
              <Card className="bg-transparent border">
                <CardHeader>
                  <CardTitle className="text-[10px] md:text-sm lg:text-base font-semibold">
                    Evolução Mensal de Inclusão de Terminais
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0 h-[100px] md:h-[140px] lg:h-[180px] mt-4">
                  <div className="flex items-center justify-center w-full h-full">
                    {!evolucaoData ||
                    evolucaoData.every((item) => item.valor === 0) ? (
                      <EmptyChartPlaceholder message="Sem evolução registrada." />
                    ) : (
                      <LineChart
                        monthlyData={evolucaoData.map((item) => ({
                          month: item.mes,
                          value: item.valor,
                        }))}
                      />
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Card 3: Terminais por Modelo */}
              <Card className="bg-transparent border">
                <CardHeader>
                  <CardTitle className="text-[10px] md:text-sm lg:text-base font-semibold">
                    Terminais por Modelo
                  </CardTitle>
                </CardHeader>
                <CardContent className="mt-4">
                  <div className="w-full h-[100px] md:h-[140px] lg:h-[180px] flex items-center justify-center">
                    {!modelosAtivosDetalhes ||
                    modelosAtivosDetalhes.every(
                      (item) => item.quantidade === 0
                    ) ? (
                      <EmptyChartPlaceholder message="Nenhum modelo ativo encontrado." />
                    ) : (
                      <BarChart
                        data={modelosData.map((item) => ({
                          name: item.nome,
                          value: item.quantidade,
                        }))}
                      />
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
