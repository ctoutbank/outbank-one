"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
      <div className="space-y-4">
        <div className="w-full mt-2 mb-2">
          <div className="grid grid-cols-1 gap-4">
            <Card className="w-full border-l-8 border-black bg-sidebar">
              <div className="flex items-center justify-between">
                <CardHeader>
                  <CardTitle className="text-xl font-bold">Total de Consultores</CardTitle>
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
                  {/* Seção Principal - Total */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-4">
                      <Users className="h-5 w-5 text-muted-foreground" />
                      <span className="text-lg font-medium">Visão Geral</span>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      <div className="text-center p-6 bg-background rounded-lg border">
                        <div className="text-3xl font-semibold text-zinc-900 mb-2">{totalAgents}</div>
                        <div className="text-sm text-muted-foreground">Total de Consultores</div>
                      </div>
                    </div>
                  </div>

                  {/* Seção de Status */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-4">
                      <Users className="h-5 w-5 text-muted-foreground" />
                      <span className="text-lg font-medium">Status dos Consultores</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="text-center p-6 bg-background rounded-lg border">
                        <div className="flex items-center justify-center gap-2 mb-3">
                          <div className="h-3 w-3 rounded-full bg-emerald-500" />
                          <span className="text-sm font-medium text-zinc-600">Ativo</span>
                        </div>
                        <div className="text-2xl font-semibold text-zinc-900">{activeAgents}</div>
                      </div>

                      <div className="text-center p-6 bg-background rounded-lg border">
                        <div className="flex items-center justify-center gap-2 mb-3">
                          <div className="h-3 w-3 rounded-full bg-red-500" />
                          <span className="text-sm font-medium text-zinc-600">Inativo</span>
                        </div>
                        <div className="text-2xl font-semibold text-zinc-900">{inactiveAgents}</div>
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
