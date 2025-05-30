"use client";

import {Card, CardContent, CardHeader, CardTitle,} from "@/components/ui/card";
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
      <div className="w-full">
        <div className="w-full mt-2 mb-2">
          <div className="grid grid-cols-1 gap-4">
            <Card className="w-full border-l-8 border-black bg-sidebar">
              <div className="flex items-center justify-between">
                <CardHeader>
                  <CardTitle className="text-xl font-bold">Visão geral</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {new Date().toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </CardHeader>
              </div>

              <CardContent className="p-6">
                <div className="flex flex-col xl:flex-row gap-6 w-full">
                  {/* Card de Terminais */}
                  <div className="flex-1 min-w-0">


                    <Card className="bg-background border h-[210px]">
                      <CardContent className="p-6">
                        {/* Total de Terminais */}
                        <div className="text-center mb-6">
                          <div className="flex items-center gap-2 mb-4">
                            <HardDrive className="h-5 w-5 text-muted-foreground" />
                            <span className="text-lg font-medium">Terminais</span>
                          </div>
                          <div className="text-4xl font-bold text-zinc-900">{totalTerminals}</div>
                          <div className="text-sm text-muted-foreground mt-1">Total de Terminais</div>
                        </div>

                        {/* Status dos Terminais */}
                        <div className="flex flex-wrap justify-center gap-8">
                          <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded-full bg-emerald-500" />
                            <span className="text-sm font-medium text-zinc-600">Ativo</span>
                            <span className="text-xl font-semibold text-zinc-900 ml-2">{ativosTerminals}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded-full bg-yellow-500" />
                            <span className="text-sm font-medium text-zinc-600">Inativo</span>
                            <span className="text-xl font-semibold text-zinc-900 ml-2">{inativosTerminals}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded-full bg-red-500" />
                            <span className="text-sm font-medium text-zinc-600">Desativado</span>
                            <span className="text-xl font-semibold text-zinc-900 ml-2">{desativadosTerminals}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Card de Modelos Ativos */}
                  <div className="flex-1 min-w-0">


                    <Card className="bg-background border h-[210px]">
                      <CardContent className="p-6">
                        {/* Total de Modelos Ativos */}
                        <div className="text-center mb-6">
                          <div className="flex items-center gap-2 mb-4">
                            <CircuitBoard className="h-5 w-5 text-muted-foreground" />
                            <span className="text-lg font-medium">Modelos Ativos</span>
                          </div>
                          <div className="text-4xl font-bold text-zinc-900">{totalModelosAtivos}</div>
                          <div className="text-sm text-muted-foreground mt-1">Total de Modelos Ativos</div>
                        </div>

                        {/* Detalhes dos Modelos */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3">
                          {modelosAtivosDetalhes.map((modelo, index) => (
                              <div key={index} className="text-center">
                                <div className="text-lg font-semibold text-zinc-900">{modelo.quantidade}</div>
                                <div className="text-xs text-muted-foreground font-medium truncate" title={modelo.nome}>
                                  {modelo.nome}
                                </div>
                              </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
  )
}
