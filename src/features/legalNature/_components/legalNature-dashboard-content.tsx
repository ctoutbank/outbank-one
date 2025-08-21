"use client";

import { Card, CardContent } from "@/components/ui/card";
import { FileText } from "lucide-react";

type LegalNatureDashboardContentProps = {
  totalLegalNatures: number;
  activeLegalNatures: number;
  inactiveLegalNatures: number;
};

export function LegalNatureDashboardContent({
  totalLegalNatures,
  activeLegalNatures,
  inactiveLegalNatures,
}: LegalNatureDashboardContentProps) {
  return (
    <div className="w-full max-w-full">
      <div className="w-full mt-2 mb-2">
        <Card className="w-full bg-transparent flex justify-center">
          <CardContent className="p-6">
            <div className="flex items-start justify-start w-full">
              {/* Card Único de Naturezas Jurídicas */}
              <div className="w-[500px]">
                <Card className="bg-transparent border">
                  <CardContent className="p-4">
                    {/* Total de Naturezas Jurídicas */}
                    <div className="text-center mb-4">
                      <div className="flex items-center gap-2 mb-3">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="text-base font-medium">
                          Total de Formatos Jurídicos
                        </span>
                      </div>
                      <div className="text-2xl font-bold text-zinc-900">
                        {totalLegalNatures}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Total de Formatos Jurídicos
                      </div>
                    </div>

                    {/* Status das Naturezas Jurídicas */}
                    <div className="grid grid-cols-2 gap-2">
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <div className="h-2 w-2 rounded-full bg-emerald-500" />
                          <span className="text-xs font-medium text-zinc-600">
                            Ativas
                          </span>
                        </div>
                        <div className="text-sm font-semibold text-zinc-900">
                          {activeLegalNatures}
                        </div>
                      </div>

                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <div className="h-2 w-2 rounded-full bg-red-500" />
                          <span className="text-xs font-medium text-zinc-600">
                            Inativas
                          </span>
                        </div>
                        <div className="text-sm font-semibold text-zinc-900">
                          {inactiveLegalNatures}
                        </div>
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
