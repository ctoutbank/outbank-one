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
      <div className="w-full">
          <div className="w-full mt-2 mb-2">
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

                  <CardContent className="p-6">
                      <div className="flex items-start justify-start w-full">
                          {/* Card Único de Consultores */}
                          <div className="w-full max-w-md">
                              <div className="flex items-center gap-2 mb-4">
                                  <Users className="h-5 w-5 text-muted-foreground" />
                                  <span className="text-lg font-medium">Visão Geral</span>
                              </div>

                              <Card className="bg-background border">
                                  <CardContent className="p-6">
                                      {/* Total de Consultores */}
                                      <div className="text-center mb-6">
                                          <div className="text-4xl font-bold text-zinc-900">{totalAgents}</div>
                                          <div className="text-sm text-muted-foreground mt-1">Total de Consultores</div>
                                      </div>

                                      {/* Status dos Consultores */}
                                      <div className="flex flex-wrap justify-center gap-8">
                                          <div className="flex items-center gap-2">
                                              <div className="h-3 w-3 rounded-full bg-emerald-500" />
                                              <span className="text-sm font-medium text-zinc-600">Ativo</span>
                                              <span className="text-xl font-semibold text-zinc-900 ml-2">{activeAgents}</span>
                                          </div>

                                          <div className="flex items-center gap-2">
                                              <div className="h-3 w-3 rounded-full bg-red-500" />
                                              <span className="text-sm font-medium text-zinc-600">Inativo</span>
                                              <span className="text-xl font-semibold text-zinc-900 ml-2">{inactiveAgents}</span>
                                          </div>
                                      </div>
                                  </CardContent>
                              </Card>
                          </div>
                      </div>
                  </CardContent>
              </Card>
          </div>
      </div>
  );
}
