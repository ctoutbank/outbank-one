"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { UseFormReturn } from "react-hook-form";
import { PricingSolicitationSchema } from "../schema/schema";

interface PricingSolicitationSummaryProps {
  form: UseFormReturn<PricingSolicitationSchema>;
}

export function PricingSolicitationSummary({
  form,
}: PricingSolicitationSummaryProps) {
  return (
    <Card className="w-full">
      <CardContent className="pt-6 space-y-8">
        <div>
          <h3 className="font-semibold text-lg text-slate-800">
            Resumo da Solicitação
          </h3>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="text-slate-600">CNAE</span>
            <span className="text-slate-800">{form.watch("cnae") || "-"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600">MCC</span>
            <span className="text-slate-800">{form.watch("mcc") || "-"}</span>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="text-slate-600">Quantidade de CNPJs</span>
            <span className="text-slate-800">
              {form.watch("cnpjsQuantity") || "-"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600">Ticket Médio</span>
            <span className="text-slate-800">
              {form.watch("ticketAverage") || "-"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600">TPV Mensal</span>
            <span className="text-slate-800">
              {form.watch("tpvMonthly") || "-"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600">CNAE em uso</span>
            <span className="text-slate-800">
              {form.watch("cnaeInUse") ? "Sim" : "Não"}
            </span>
          </div>
        </div>

        {form.watch("cnaeInUse") && form.watch("description") && (
          <>
            <Separator />
            <div>
              <h4 className="text-slate-600 mb-2">Descrição</h4>
              <div className="p-2 border rounded-md bg-gray-50">
                {form.watch("description")}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
