"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { terminalModels } from "@/lib/lookuptables/lookuptables-terminals";
import { CircuitBoard, HardDrive } from "lucide-react";
import { ModeloAtivo } from "../serverActions/terminal";

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
  desativadosTerminals,
  totalModelosAtivos,
  modelosAtivosDetalhes = [],
}: TerminalsDashboardContentProps) {
  modelosAtivosDetalhes = terminalModels.map((item) => {
    const quantity = modelosAtivosDetalhes.find((model) => model.nome === item);
    return {
      nome: item,
      quantidade: quantity ? quantity.quantidade : 0,
    };
  });
  return (
    <div className="w-full mt-2 mb-2">
      <div className="grid grid-cols-1 gap-4">
        <Card className="w-full border-l-8 border-black bg-background">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Visão geral</CardTitle>
            <p className="text-sm text-muted-foreground">
              {new Date().toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                timeZone: "America/Sao_Paulo",
              })}
            </p>
          </CardHeader>

          <CardContent>
            <div className="flex flex-row gap-6 w-full">
              {/* Card de Terminais */}
              <div className="flex-1 min-w-0">
                <Card className="bg-background border h-[220px] flex flex-col justify-between p-6">
                  <div>
                    {/* Total de Terminais */}
                    <div className="text-center mb-6">
                      <div className="flex items-center gap-2 mb-4">
                        <HardDrive className="h-5 w-5 text-muted-foreground" />
                        <span className="text-sm font-medium">Terminais</span>
                      </div>
                      <div className="text-lg font-bold text-zinc-900">
                        {totalTerminals}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        Total de Terminais
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap justify-center gap-8">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-emerald-500" />
                      <span className="text-xs font-medium text-zinc-600">
                        Ativo
                      </span>
                      <span className="text-xs font-semibold text-zinc-900 ml-2">
                        {ativosTerminals}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-yellow-500" />
                      <span className="text-xs font-medium text-zinc-600">
                        Inativo
                      </span>
                      <span className="text-xs font-semibold text-zinc-900 ml-2">
                        {inativosTerminals}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-red-500" />
                      <span className="text-xs font-medium text-zinc-600">
                        Desativado
                      </span>
                      <span className="text-xs font-semibold text-zinc-900 ml-2">
                        {desativadosTerminals}
                      </span>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Card de Modelos Ativos */}
              <div className="flex-1 min-w-0">
                <Card className="bg-background border h-[220px] flex flex-col justify-between p-6">
                  <div className="text-center mb-6">
                    <div className="flex items-center gap-2 mb-4">
                      <CircuitBoard className="h-5 w-5 text-muted-foreground" />
                      <span className="text-sm font-medium">
                        Modelos Ativos
                      </span>
                    </div>
                    <div className="text-lg font-bold text-zinc-900">
                      {totalModelosAtivos}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      Total de Modelos Ativos
                    </div>
                  </div>

                  {/* Detalhes dos Modelos */}
                  <div className="flex flex-wrap items-center justify-center gap-2">
                    {modelosAtivosDetalhes.map((modelo, index) => (
                      <div key={index} className="text-center">
                        <div className="text-xs font-semibold text-zinc-900">
                          {modelo.quantidade}
                        </div>
                        <div
                          className="text-xs text-muted-foreground font-medium truncate"
                          title={modelo.nome}
                        >
                          {modelo.nome}
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
