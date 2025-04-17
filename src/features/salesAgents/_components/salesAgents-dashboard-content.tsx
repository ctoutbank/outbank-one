"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Users } from "lucide-react";

type SalesAgentDashboardContentProps = {
  totalAgents: number;
  activeAgents: number;
  inactiveAgents: number;
  totalMerchants: number;
  pendingMerchants: number;
  approvedMerchants: number;
  rejectedMerchants: number;
};

export function SalesAgentDashboardContent({
  totalAgents,
  activeAgents,
  inactiveAgents,
}: SalesAgentDashboardContentProps) {
  return (
    <div className="w-full  mb-2">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Agents Card */}
        <Card className="bg-white min-w-[280px]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-zinc-500" />
                <span className="text-sm font-medium text-zinc-600">
                  Total de Consultores
                </span>
              </div>
              <span className="text-2xl font-semibold text-zinc-900 ml-4">
                {totalAgents}
              </span>
            </div>
            <Separator className="mb-3" />
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <span className="text-xs font-medium text-zinc-600">
                    Ativos
                  </span>
                </div>
                <span className="text-base font-semibold text-zinc-900">
                  {activeAgents}
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
                  {inactiveAgents}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
