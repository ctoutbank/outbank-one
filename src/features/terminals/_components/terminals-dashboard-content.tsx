"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CircuitBoard, HardDrive } from "lucide-react";

type TerminalsDashboardContentProps = {
  totalTerminals: number;
  ativosTerminals: number;
  inativosTerminals: number;
  desativadosTerminals: number;
  totalModelosAtivos: number;
};

export function TerminalsDashboardContent({
  totalTerminals,
  ativosTerminals,
  inativosTerminals,
  desativadosTerminals,
  totalModelosAtivos,
}: TerminalsDashboardContentProps) {
  return (
    <div className="w-full mt-4 mb-2">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Total por Serial Card */}
        <Card className="bg-white min-w-[280px]">
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

        {/* Total por Modelos Ativos Card */}
        <Card className="bg-white min-w-[280px]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <CircuitBoard className="h-4 w-4 text-zinc-500" />
                <span className="text-sm font-medium text-zinc-600">
                  Total por Modelos Ativos
                </span>
              </div>
              <span className="text-2xl font-semibold text-zinc-900 ml-4">
                {totalModelosAtivos}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
