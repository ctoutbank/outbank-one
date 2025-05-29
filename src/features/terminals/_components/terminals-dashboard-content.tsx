"use client";

import { Card, CardContent, } from "@/components/ui/card";
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
  return (
      <div className="space-y-4">
        <div className="w-full mt-2 mb-2">
          <div className="grid grid-cols-1 gap-4">

            {/* Card único unificado */}
            <Card className="w-full border-l-8 border-black bg-sidebar min-h-[200px]">
              <CardContent className="pt-6">
                <div className="flex flex-col lg:flex-row justify-between gap-12">

                  {/* Total por Serial */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <HardDrive className="h-5 w-5 text-muted-foreground" />
                      <span className="text-xl font-bold">Total por Serial</span>
                    </div>
                    <div className="text-2xl font-semibold text-zinc-900 mb-3">
                      {totalTerminals}
                    </div>
                    <div className="flex gap-6">
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-2 mb-1.5">
                          <div className="h-2 w-2 rounded-full bg-emerald-500" />
                          <span className="text-xs font-medium text-zinc-600">Ativo</span>
                        </div>
                        <span className="text-base font-semibold text-zinc-900">
                        {ativosTerminals}
                      </span>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-2 mb-1.5">
                          <div className="h-2 w-2 rounded-full bg-yellow-500" />
                          <span className="text-xs font-medium text-zinc-600">Inativo</span>
                        </div>
                        <span className="text-base font-semibold text-zinc-900">
                        {inativosTerminals}
                      </span>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-2 mb-1.5">
                          <div className="h-2 w-2 rounded-full bg-red-500" />
                          <span className="text-xs font-medium text-zinc-600">Desativado</span>
                        </div>
                        <span className="text-base font-semibold text-zinc-900">
                        {desativadosTerminals}
                      </span>
                      </div>
                    </div>
                  </div>

                  {/* Modelos Ativos */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <CircuitBoard className="h-5 w-5 text-muted-foreground" />
                      <span className="text-xl font-bold">Modelos Ativos</span>
                    </div>
                    <div className="text-2xl font-semibold text-zinc-900 mb-3">
                      {totalModelosAtivos}
                    </div>
                    {modelosAtivosDetalhes.length > 0 ? (
                        <div className="flex flex-wrap gap-4">
                          {modelosAtivosDetalhes.map((modelo, index) => (
                              <div key={index} className="text-center min-w-[100px]">
                          <span className="text-xs font-medium text-zinc-600 block truncate mb-1">
                            {modelo.nome}
                          </span>
                                <span className="text-base font-semibold text-zinc-900">
                            {modelo.quantidade}
                          </span>
                              </div>
                          ))}
                        </div>
                    ) : (
                        <div className="flex justify-center items-center h-[70px] text-zinc-400">
                          Nenhum modelo ativo encontrado
                        </div>
                    )}
                  </div>

                </div>
              </CardContent>
            </Card>

          </div>
        </div>
      </div>
  );
}
