"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartTooltip } from "@/components/ui/chart";
import { terminalModels } from "@/lib/lookuptables/lookuptables-terminals";
import {
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import type { ModeloAtivo } from "../serverActions/terminal";

type TerminalsDashboardContentProps = {
  totalTerminals: number;
  ativosTerminals: number;
  inativosTerminals: number;
  desativadosTerminals: number;
  totalModelosAtivos: number;
  modelosAtivos: string[];
  modelosAtivosDetalhes?: ModeloAtivo[];
};

export function TerminalsDashboardContent({
  totalTerminals,
  ativosTerminals,
  inativosTerminals,
  modelosAtivosDetalhes = [],
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

  // Dados mockados para evolução mensal
  const evolucaoData = [
    { mes: "Fev", valor: 12 },
    { mes: "Mar", valor: 15 },
    { mes: "Abr", valor: 18 },
    { mes: "Mai", valor: 25 },
    { mes: "Jun", valor: 22 },
    { mes: "Jul", valor: 28 },
  ];

  // Dados para gráfico de barras dos modelos
  const modelosData = [
    { nome: "FEPAS", quantidade: 25 },
    { nome: "GPOS700X1024MB-C", quantidade: 20 },
    { nome: "S920203GWB-C", quantidade: 5 },
    { nome: "INTEGRATION", quantidade: 3 },
    { nome: "PAYLINK", quantidade: 2 },
  ];

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
                  <div className="h-[100px] md:h-[140px] lg:h-[180px] w-full flex items-center justify-center">
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
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Legenda simples centralizada */}
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
                </CardContent>
              </Card>

              {/* Card 2: Evolução Mensal */}
              <Card className="bg-transparent border md:col-span-2 lg:col-span-1">
                <CardHeader>
                  <CardTitle className="text-[10px] md:text-sm lg:text-base font-semibold">
                    Evolução Mensal de Inclusão de Terminais
                  </CardTitle>
                </CardHeader>
                <CardContent >
                  <div className="h-[120px] md:h-[160px] lg:h-[200px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={evolucaoData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis
                          dataKey="mes"
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 8, fill: "#666" }}
                          className="md:text-[10px] lg:text-xs"
                        />
                        <YAxis hide />
                        <Line
                          type="monotone"
                          dataKey="valor"
                          stroke="#ef4444"
                          strokeWidth={1}
                          className="md:stroke-[1.5] lg:stroke-2"
                          dot={{ fill: "#ef4444", strokeWidth: 1, r: 1 }}
                          activeDot={{ r: 3, fill: "#ef4444" }}
                        />
                        <ChartTooltip
                          content={({ active, payload, label }) => {
                            if (active && payload && payload.length) {
                              return (
                                <div className="bg-white p-1 md:p-2 lg:p-3 border rounded shadow">
                                  <p className="text-[10px] md:text-xs lg:text-sm font-medium">
                                    {label}
                                  </p>
                                  <p className="text-[10px] md:text-xs lg:text-sm">
                                    {payload[0].value} terminais
                                  </p>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Card 3: Terminais por Modelo */}
              <Card className="bg-transparent border md:col-span-2 lg:col-span-1">
                <CardHeader>
                  <CardTitle className="text-[10px] md:text-sm lg:text-base font-semibold">
                    Terminais por Modelo
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[180px] md:h-[220px] lg:h-[280px] w-full flex flex-col justify-between">
                    {/* Gráfico de barras customizado */}
                    <div className="flex-1 space-y-1 md:space-y-2 lg:space-y-3 py-1 md:py-2 lg:py-3">
                      {modelosData.map((modelo, index) => (
                        <div key={index} className="space-y-0.5 md:space-y-1">
                          <div className="flex items-center gap-2 md:gap-3 lg:gap-4">
                            <div
                              className="text-[9px] md:text-[10px] lg:text-xs text-gray-600 text-right w-16 md:w-20 lg:w-24 truncate"
                              title={modelo.nome}
                            >
                              {modelo.nome}
                            </div>
                            <div className="flex-1 relative">
                              <div
                                className="h-2 md:h-3 lg:h-4 bg-orange-500 rounded-r-sm transition-all duration-300"
                                style={{
                                  width: `${(modelo.quantidade / Math.max(...modelosData.map((m) => m.quantidade))) * 100}%`,
                                  minWidth:
                                    modelo.quantidade > 0 ? "12px" : "0px",
                                }}
                              />
                            </div>
                          </div>
                          <div className="flex items-center gap-2 md:gap-3 lg:gap-4">
                            <div className="w-16 md:w-20 lg:w-24"></div>
                            <div className="flex-1">
                              <span className="text-[9px] md:text-[10px] lg:text-xs text-gray-700 font-medium">
                                {modelo.quantidade}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Escala dinâmica baseada no valor máximo */}
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
