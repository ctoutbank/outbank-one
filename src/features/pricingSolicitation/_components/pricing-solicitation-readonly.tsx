"use client";

import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { PricingSolicitationSchema } from "../schema/schema";
import { FeesSection } from "./sections/fees-section";

interface PricingSolicitationReadOnlyProps {
  data: PricingSolicitationSchema;
}

export function PricingSolicitationReadOnlyView({
  data,
}: PricingSolicitationReadOnlyProps) {
  const form = useForm({
    defaultValues: data,
  });

  return (
    <Form {...form}>
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="text-sm font-medium">CNAE</div>
            <div className="p-2 border rounded-md bg-gray-50">
              {data.cnae || "-"}
            </div>
          </div>
          <div>
            <div className="text-sm font-medium">MCC</div>
            <div className="p-2 border rounded-md bg-gray-50">
              {data.mcc || "-"}
            </div>
          </div>
          <div>
            <div className="text-sm font-medium">Quantidade de CNPJs</div>
            <div className="p-2 border rounded-md bg-gray-50">
              {data.cnpjsQuantity || "-"}
            </div>
          </div>
          <div>
            <div className="text-sm font-medium">Ticket Médio</div>
            <div className="p-2 border rounded-md bg-gray-50">
              {data.ticketAverage || "-"}
            </div>
          </div>
          <div>
            <div className="text-sm font-medium">TPV Mensal</div>
            <div className="p-2 border rounded-md bg-gray-50">
              {data.tpvMonthly || "-"}
            </div>
          </div>
          <div className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-4">
            <div className="h-4 w-4 rounded border flex items-center justify-center">
              {data.cnaeInUse && (
                <span className="h-2 w-2 bg-black rounded-sm" />
              )}
            </div>
            <div className="space-y-1 leading-none">
              <div className="text-sm font-medium">CNAE em uso?</div>
            </div>
          </div>
        </div>

        {data.cnaeInUse && data.description && (
          <div className="mb-6">
            <div className="text-sm font-medium">Descrição</div>
            <div className="p-2 border rounded-md bg-gray-50 min-h-[100px]">
              {data.description}
            </div>
          </div>
        )}

        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Taxas</h3>
          <FeesSection control={form.control} isReadOnly={true} />
        </div>
      </div>
    </Form>
  );
}
