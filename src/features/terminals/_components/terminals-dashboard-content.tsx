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

      <div className="space-y-4">
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

              <CardContent>
                <div className="flex flex-col lg:flex-row gap-8">
                  {/* Seção de Terminais */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-4">
                      <HardDrive className="h-5 w-5 text-muted-foreground" />
                      <span className="text-lg font-medium">Terminais</span>
                    </div>

                    <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                      <div className="text-center p-4 bg-background rounded-lg border">
                        <div className="text-2xl font-semibold text-zinc-900 mb-2">{totalTerminals}</div>
                        <div className="text-sm text-muted-foreground">Total de Terminais</div>
                      </div>

                      <div className="text-center p-4 bg-background rounded-lg border">
                        <div className="flex items-center justify-center gap-2 mb-2">
                          <div className="h-2 w-2 rounded-full bg-emerald-500" />
                          <span className="text-sm font-medium text-zinc-600">Ativo</span>
                        </div>
                        <div className="text-xl font-semibold text-zinc-900">{ativosTerminals}</div>
                      </div>

                      <div className="text-center p-4 bg-background rounded-lg border">
                        <div className="flex items-center justify-center gap-2 mb-2">
                          <div className="h-2 w-2 rounded-full bg-yellow-500" />
                          <span className="text-sm font-medium text-zinc-600">Inativo</span>
                        </div>
                        <div className="text-xl font-semibold text-zinc-900">{inativosTerminals}</div>
                      </div>

                      <div className="text-center p-4 bg-background rounded-lg border">
                        <div className="flex items-center justify-center gap-2 mb-2">
                          <div className="h-2 w-2 rounded-full bg-red-500" />
                          <span className="text-sm font-medium text-zinc-600">Desativado</span>
                        </div>
                        <div className="text-xl font-semibold text-zinc-900">{desativadosTerminals}</div>
                      </div>
                    </div>
                  </div>

                  {/* Seção de Modelos Ativos */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-4">
                      <CircuitBoard className="h-5 w-5 text-muted-foreground" />
                      <span className="text-lg font-medium">Modelos Ativos</span>
                    </div>

                    <div className="grid gap-4">
                      <div className="text-center p-4 bg-background rounded-lg border">
                        <div className="text-2xl font-semibold text-zinc-900 mb-2">{totalModelosAtivos}</div>
                        <div className="text-sm text-muted-foreground">Total de Modelos Ativos</div>
                      </div>

                      {modelosAtivosDetalhes.length > 0 ? (
                          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {modelosAtivosDetalhes.map((modelo, index) => (
                                <div key={index} className="text-center p-4 bg-background rounded-lg border">
                                  <div className="text-lg font-semibold text-zinc-900 mb-1">{modelo.quantidade}</div>
                                  <div className="text-sm text-muted-foreground truncate">{modelo.nome}</div>
                                </div>
                            ))}
                          </div>
                      ) : (
                          <div className="flex justify-center items-center h-[100px] text-zinc-400 bg-background rounded-lg border">
                            Nenhum modelo ativo encontrado
                          </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
  )
}
