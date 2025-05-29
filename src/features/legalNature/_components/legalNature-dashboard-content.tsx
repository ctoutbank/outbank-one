"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText } from "lucide-react"

type LegalNatureDashboardContentProps = {
  totalLegalNatures: number
  activeLegalNatures: number
  inactiveLegalNatures: number
}

export function LegalNatureDashboardContent({
                                              totalLegalNatures,
                                              activeLegalNatures,
                                              inactiveLegalNatures,
                                            }: LegalNatureDashboardContentProps) {
  return (
      <div className="w-full">
        <div className="w-full mt-2 mb-2">
          <Card className="w-full border-l-8 border-black bg-sidebar">
            <div className="flex items-center justify-between">
              <CardHeader>
                <CardTitle className="text-xl font-bold">Naturezas Jurídicas</CardTitle>
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
              <div className="flex flex-col lg:flex-row gap-6 w-full">
                {/* Total de Naturezas Jurídicas */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-4">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <span className="text-lg font-medium">Total de Naturezas Jurídicas</span>
                  </div>

                  <div className="grid gap-4">
                    <div className="text-center p-4 bg-background rounded-lg border">
                      <div className="text-2xl font-semibold text-zinc-900 mb-2">{totalLegalNatures}</div>
                      <div className="text-sm text-muted-foreground">Total de Naturezas Jurídicas</div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="text-center p-3 bg-background rounded-lg border">
                        <div className="flex items-center justify-center gap-2 mb-2">
                          <div className="h-3 w-3 rounded-full bg-emerald-500" />
                          <span className="text-sm font-medium text-zinc-600">Ativas</span>
                        </div>
                        <div className="text-lg font-semibold text-zinc-900">{activeLegalNatures}</div>
                      </div>

                      <div className="text-center p-3 bg-background rounded-lg border">
                        <div className="flex items-center justify-center gap-2 mb-2">
                          <div className="h-3 w-3 rounded-full bg-red-500" />
                          <span className="text-sm font-medium text-zinc-600">Inativas</span>
                        </div>
                        <div className="text-lg font-semibold text-zinc-900">{inactiveLegalNatures}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
  )
}
