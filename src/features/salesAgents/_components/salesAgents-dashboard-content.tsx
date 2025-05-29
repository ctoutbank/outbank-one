"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Users } from "lucide-react";
import { Separator } from "@/components/ui/separator";

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
      <div className="space-y-4">
        <div className="w-full mt-2 mb-2">
          <div className="grid grid-cols-1 gap-4">
            <Card className="w-full border-l-8 border-black bg-sidebar min-h-[200px]">
              <CardContent className="pt-6">
                <div className="flex flex-col justify-between gap-12">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="h-5 w-5 text-muted-foreground" />
                      <span className="text-xl font-bold">Total de Consultores</span>
                    </div>
                    <div className="text-2xl font-semibold text-zinc-900 mb-3">
                      {totalAgents}
                    </div>
                    <Separator className="mb-4" />
                    <div className="flex gap-6">
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-2 mb-1.5">
                          <div className="h-2 w-2 rounded-full bg-emerald-500" />
                          <span className="text-xs font-medium text-zinc-600">Ativo</span>
                        </div>
                        <span className="text-base font-semibold text-zinc-900">
                        {activeAgents}
                      </span>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-2 mb-1.5">
                          <div className="h-2 w-2 rounded-full bg-red-500" />
                          <span className="text-xs font-medium text-zinc-600">Inativo</span>
                        </div>
                        <span className="text-base font-semibold text-zinc-900">
                        {inactiveAgents}
                      </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
  );
}
