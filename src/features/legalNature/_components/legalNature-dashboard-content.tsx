"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
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
    <div className="space-y-4">
      <div className="w-full mb-2">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Total Legal Natures Card */}
          <Card className="bg-white min-w-[280px]">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-zinc-500" />
                  <span className="text-sm font-medium text-zinc-600">
                    Total de Naturezas Jurídicas
                  </span>
                </div>
                <span className="text-2xl font-semibold text-zinc-900 ml-4">
                  {totalLegalNatures}
                </span>
              </div>
              <Separator className="mb-3" />
              <div className="grid grid-cols-2 gap-2">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-1.5">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    <span className="text-xs font-medium text-zinc-600">
                      Ativas
                    </span>
                  </div>
                  <span className="text-base font-semibold text-zinc-900">
                    {activeLegalNatures}
                  </span>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-1.5">
                    <div className="h-1.5 w-1.5 rounded-full bg-red-500" />
                    <span className="text-xs font-medium text-zinc-600">
                      Inativas
                    </span>
                  </div>
                  <span className="text-base font-semibold text-zinc-900">
                    {inactiveLegalNatures}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
