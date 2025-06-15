"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  adjustmentADE,
  adjustmentAJT,
  adjustmentReasons,
  adjustmentRecurrence,
  adjustmentTypes,
} from "@/lib/lookuptables/lookuptables-adjustment";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  insertFinancialAdjustmentFormAction,
  updateFinancialAdjustmentFormAction,
} from "../_actions/financialAdjustments-formActions";
import {
  FinancialAdjustmentSchema,
  SchemaFinancialAdjustment,
} from "../schema/schema";
import type { MerchantInfo } from "../server/financialAdjustments";

interface FinancialAdjustmentFormProps {
  adjustment: FinancialAdjustmentSchema;
  merchants: MerchantInfo[];
  isNew: boolean;
}

export default function FinancialAdjustmentForm({
  adjustment,
  merchants,
  isNew,
}: FinancialAdjustmentFormProps) {
  const router = useRouter();

  const form = useForm<FinancialAdjustmentSchema>({
    resolver: zodResolver(SchemaFinancialAdjustment),
    defaultValues: {
      ...adjustment,
      title: adjustment.title || "",
      reason: adjustment.reason || "",
      grossValue: adjustment.grossValue || "",
      type: adjustment.type || "",
      description: adjustment.description || "",
      rrn: adjustment.rrn || "",
      recurrence: adjustment.recurrence || "",
      expectedSettlementDate: adjustment.expectedSettlementDate || "",
      startDate: adjustment.startDate || "",
      endDate: adjustment.endDate || "",
      active: adjustment.active ?? true,
      merchants: adjustment.merchants || [],
    },
  });

  const onSubmit = useCallback(
    async (data: FinancialAdjustmentSchema) => {
      console.log("Dados do formulário:", data);

      try {
        if (isNew) {
          const newId = await insertFinancialAdjustmentFormAction(data);
          toast.success("Ajuste financeiro criado com sucesso");
          router.push(`/portal/financialAdjustment/${newId}`);
        } else {
          await updateFinancialAdjustmentFormAction(data);
          toast.success("Ajuste financeiro atualizado com sucesso");
          router.refresh();
        }
      } catch (error) {
        console.error("Erro ao salvar ajuste:", error);
        toast.error("Erro ao salvar ajuste financeiro");
      }
    },
    [isNew, router]
  );

  const selectedMerchants = form.watch("merchants") || [];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Informações Básicas */}
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="reason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Razão *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a razão" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {adjustmentReasons.map((reason) => (
                          <SelectItem key={reason.value} value={reason.value}>
                            {reason.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título *</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o título" />
                        </SelectTrigger>
                        <SelectContent>
                          {form.watch("reason") === "ADE" &&
                            adjustmentADE.map((item) => (
                              <SelectItem key={item.value} value={item.value}>
                                {item.label}
                              </SelectItem>
                            ))}
                          {form.watch("reason") === "AJT" &&
                            adjustmentAJT.map((item) => (
                              <SelectItem key={item.value} value={item.value}>
                                {item.label}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Motivo</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Descrição detalhada do ajuste"
                        rows={3}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div>
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de ajuste</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value || ""}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Nenhuma recorrência" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {adjustmentTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </CardContent>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {form.watch("type") === "SINGLE" && (
                <>
                  <FormField
                    control={form.control}
                    name="expectedSettlementDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Data de Liquidação Esperada</FormLabel>
                        <FormControl>
                          <Input {...field} type="date" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="grossValue"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Valor Bruto *</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}
              {form.watch("type") === "RECURRING" && (
                <>
                  <FormField
                    control={form.control}
                    name="recurrence"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Recorrência</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value || ""}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Nenhuma recorrência" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {adjustmentRecurrence.map((recurrence) => (
                                <SelectItem
                                  key={recurrence.value}
                                  value={recurrence.value}
                                >
                                  {recurrence.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Data de Início</FormLabel>
                        <FormControl>
                          <Input {...field} type="date" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="endDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Data de Fim</FormLabel>
                        <FormControl>
                          <Input {...field} type="date" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="grossValue"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Valor Bruto *</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Merchants */}
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-4">
              Merchants Associados ({selectedMerchants.length} selecionados)
            </h3>
            <FormField
              control={form.control}
              name="merchants"
              render={() => (
                <FormItem>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-60 overflow-y-auto">
                    {merchants.map((merchant) => (
                      <FormField
                        key={merchant.id}
                        control={form.control}
                        name="merchants"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={merchant.id}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(merchant.id)}
                                  onCheckedChange={(checked) => {
                                    const currentValue = field.value || [];
                                    if (checked) {
                                      field.onChange([
                                        ...currentValue,
                                        merchant.id,
                                      ]);
                                    } else {
                                      field.onChange(
                                        currentValue.filter(
                                          (value) => value !== merchant.id
                                        )
                                      );
                                    }
                                  }}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel className="text-sm font-normal">
                                  {merchant.name}
                                </FormLabel>
                                <p className="text-xs text-muted-foreground">
                                  Documento: {merchant.idDocument}
                                </p>
                              </div>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Botões */}
        <div className="flex justify-end mt-4 gap-2">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancelar
          </Button>
          <Button type="submit">{isNew ? "Salvar" : "Editar"}</Button>
        </div>
      </form>
    </Form>
  );
}
