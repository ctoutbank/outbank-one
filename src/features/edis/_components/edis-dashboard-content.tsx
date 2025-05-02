"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AlertTriangle, FileCheck, FileText } from "lucide-react";

type EdisDashboardContentProps = {
  totalEdis: number;
  activeEdis: number;
  inactiveEdis: number;
  pendingEdis: number;
  processedEdis: number;
  errorEdis: number;
};

export function EdisDashboardContent({
  totalEdis,
  activeEdis,
  inactiveEdis,
  pendingEdis,
  processedEdis,
  errorEdis,
}: EdisDashboardContentProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center flex-wrap gap-4 mb-2">
        {/* Total EDIS Card */}
        <Card className="bg-white min-w-[280px]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-zinc-500" />
                <span className="text-sm font-medium text-zinc-600">
                  Total de Arquivos
                </span>
              </div>
              <span className="text-2xl font-semibold text-zinc-900 ml-4">
                {totalEdis}
              </span>
            </div>
            <Separator className="mb-3" />
            <div className="grid grid-cols-2 gap-2">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <span className="text-xs font-medium text-zinc-600">
                    Ativos
                  </span>
                </div>
                <span className="text-base font-semibold text-zinc-900">
                  {activeEdis}
                </span>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-red-500" />
                  <span className="text-xs font-medium text-zinc-600">
                    Inativos
                  </span>
                </div>
                <span className="text-base font-semibold text-zinc-900">
                  {inactiveEdis}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Processamento Status Card */}
        <Card className="bg-white min-w-[280px]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <FileCheck className="h-4 w-4 text-zinc-500" />
                <span className="text-sm font-medium text-zinc-600">
                  Status Processamento
                </span>
              </div>
              <span className="text-2xl font-semibold text-zinc-900 ml-4">
                {processedEdis + pendingEdis + errorEdis}
              </span>
            </div>
            <Separator className="mb-3" />
            <div className="grid grid-cols-3 gap-2">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <span className="text-xs font-medium text-zinc-600">
                    Processados
                  </span>
                </div>
                <span className="text-base font-semibold text-zinc-900">
                  {processedEdis}
                </span>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                  <span className="text-xs font-medium text-zinc-600">
                    Pendentes
                  </span>
                </div>
                <span className="text-base font-semibold text-zinc-900">
                  {pendingEdis}
                </span>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-red-500" />
                  <span className="text-xs font-medium text-zinc-600">
                    Erros
                  </span>
                </div>
                <span className="text-base font-semibold text-zinc-900">
                  {errorEdis}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tipos de Arquivo Card */}
        <Card className="bg-white min-w-[280px]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-zinc-500" />
                <span className="text-sm font-medium text-zinc-600">
                  Tipos de Arquivo
                </span>
              </div>
              <span className="text-2xl font-semibold text-zinc-900 ml-4">
                {totalEdis}
              </span>
            </div>
            <Separator className="mb-3" />
            <div className="grid grid-cols-2 gap-2">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                  <span className="text-xs font-medium text-zinc-600">
                    Remessa
                  </span>
                </div>
                <span className="text-base font-semibold text-zinc-900">
                  {Math.round(totalEdis * 0.6)}
                </span>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-purple-500" />
                  <span className="text-xs font-medium text-zinc-600">
                    Retorno
                  </span>
                </div>
                <span className="text-base font-semibold text-zinc-900">
                  {Math.round(totalEdis * 0.4)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
