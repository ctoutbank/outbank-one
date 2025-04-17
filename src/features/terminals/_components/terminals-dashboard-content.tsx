"use client";

import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
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
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 sm:grid-cols-1">
          {/* Total por Serial Card */}
          <Card className="bg-white lg:col-span-3 w-full">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <HardDrive className="h-4 w-4 text-zinc-500" />
                  <span className="text-sm font-medium text-zinc-600">
                    Total por Serial
                  </span>
                </div>
                <span className="text-2xl font-semibold text-zinc-900 ml-4">
                  {totalTerminals}
                </span>
              </div>
              <Separator className="mb-3" />
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-1.5">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    <span className="text-xs font-medium text-zinc-600">
                      Ativo
                    </span>
                  </div>
                  <span className="text-base font-semibold text-zinc-900">
                    {ativosTerminals}
                  </span>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-1.5">
                    <div className="h-1.5 w-1.5 rounded-full bg-yellow-500" />
                    <span className="text-xs font-medium text-zinc-600">
                      Inativo
                    </span>
                  </div>
                  <span className="text-base font-semibold text-zinc-900">
                    {inativosTerminals}
                  </span>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-1.5">
                    <div className="h-1.5 w-1.5 rounded-full bg-red-500" />
                    <span className="text-xs font-medium text-zinc-600">
                      Desativado
                    </span>
                  </div>
                  <span className="text-base font-semibold text-zinc-900">
                    {desativadosTerminals}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Modelos Ativos Card */}
          <Card className="bg-white lg:col-span-9 w-full">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <CircuitBoard className="h-4 w-4 text-zinc-500" />
                  <span className="text-sm font-medium text-zinc-600">
                    Modelos Ativos
                  </span>
                </div>
                <span className="text-2xl font-semibold text-zinc-900 ml-4">
                  {totalModelosAtivos}
                </span>
              </div>
              <Separator className="mb-3" />
              {modelosAtivosDetalhes.length > 0 ? (
                <ScrollArea className="h-[70px] pr-3">
                  <div className="flex flex-row flex-wrap gap-4">
                    {modelosAtivosDetalhes.map((modelo, index) => (
                      <div key={index} className="text-center min-w-[100px]">
                        <div className="mb-1">
                          <span className="text-xs font-medium text-zinc-600 truncate block">
                            {modelo.nome}
                          </span>
                        </div>
                        <span className="text-base font-semibold text-zinc-900">
                          {modelo.quantidade}
                        </span>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              ) : (
                <div className="flex justify-center items-center h-[70px] text-zinc-400">
                  Nenhum modelo ativo encontrado
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
