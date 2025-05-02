"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tags } from "lucide-react";

type CategoriesDashboardContentProps = {
  totalCategories: number;
  activeCategories: number;
  inactiveCategories: number;
  avgWaitingPeriodCp: number;
  avgWaitingPeriodCnp: number;
  avgAnticipationRiskFactorCp: number;
  avgAnticipationRiskFactorCnp: number;
};

export function CategoriesDashboardContent({
  totalCategories,
  activeCategories,
  inactiveCategories,
}: CategoriesDashboardContentProps) {
  return (
    <div className="space-y-4">
      <div className="w-full mb-2">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* Total Categories Card */}
          <Card className="bg-white min-w-[280px]">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Tags className="h-4 w-4 text-zinc-500" />
                  <span className="text-sm font-medium text-zinc-600">
                    Total de Categorias
                  </span>
                </div>
                <span className="text-2xl font-semibold text-zinc-900 ml-4">
                  {totalCategories}
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
                    {activeCategories}
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
                    {inactiveCategories}
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
