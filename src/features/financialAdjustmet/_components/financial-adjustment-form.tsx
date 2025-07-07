"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { Building2, FileText, Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  insertFinancialAdjustmentFormAction,
  updateFinancialAdjustmentFormAction,
} from "../_actions/financialAdjustments-formActions";
import {
  type FinancialAdjustmentSchema,
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
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);

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
      idCustomer: adjustment.idCustomer || "",
    },
  });

  const onSubmit = useCallback(
    async (data: FinancialAdjustmentSchema) => {
      console.log("Dados do formulário:", data);

      try {
        if (isNew) {
          await insertFinancialAdjustmentFormAction(data);
          toast.success("Ajuste financeiro criado com sucesso");
          router.push(`/portal/financialAdjustment`);
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

  // Filtrar merchants baseado na busca
  const filteredMerchants = useMemo(() => {
    if (!searchTerm) return merchants;

    return merchants.filter((merchant) => {
      const searchLower = searchTerm.toLowerCase();
      const nameMatch = merchant.name?.toLowerCase().includes(searchLower);
      const documentMatch = merchant.idDocument
        ?.toLowerCase()
        .includes(searchLower);
      return nameMatch || documentMatch;
    });
  }, [merchants, searchTerm]);

  // Obter merchants selecionados com detalhes
  const selectedMerchantsDetails = useMemo(() => {
    return merchants.filter((merchant) =>
      selectedMerchants.includes(merchant.id)
    );
  }, [merchants, selectedMerchants]);

  // Adicionar merchant
  const addMerchant = (merchantId: number) => {
    const currentMerchants = form.getValues("merchants") || [];
    if (!currentMerchants.includes(merchantId)) {
      form.setValue("merchants", [...currentMerchants, merchantId]);
      setSearchTerm("");
      setIsSearchOpen(false);
    }
  };

  // Remover merchant
  const removeMerchant = (merchantId: number) => {
    const currentMerchants = form.getValues("merchants") || [];
    form.setValue(
      "merchants",
      currentMerchants.filter((id) => id !== merchantId)
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Informações Básicas */}
        <Card className="shadow-md rounded-lg overflow-hidden">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="reason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Razão *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="border-gray-300">
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
                    <FormLabel className="text-gray-700">Título *</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="border-gray-300">
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Motivo</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Descrição detalhada do ajuste"
                        rows={3}
                        className="border-gray-300"
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
                      <FormLabel className="text-gray-700">
                        Tipo de ajuste
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value || ""}
                      >
                        <FormControl>
                          <SelectTrigger className="border-gray-300">
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {form.watch("type") === "SINGLE" && (
                <>
                  <FormField
                    control={form.control}
                    name="expectedSettlementDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700">
                          Data de Liquidação Esperada
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="date"
                            className="border-gray-300"
                          />
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
                        <FormLabel className="text-gray-700">
                          Valor Bruto *
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            className="border-gray-300"
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
                        <FormLabel className="text-gray-700">
                          Recorrência
                        </FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value || ""}
                          >
                            <FormControl>
                              <SelectTrigger className="border-gray-300">
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
                        <FormLabel className="text-gray-700">
                          Data de Início
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="date"
                            className="border-gray-300"
                          />
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
                        <FormLabel className="text-gray-700">
                          Data de Fim
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="date"
                            className="border-gray-300"
                          />
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
                        <FormLabel className="text-gray-700">
                          Valor Bruto *
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            className="border-gray-300"
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

        {/* Merchants - Nova Interface */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Estabelecimentos</h3>
                <Badge variant="secondary" className="text-sm">
                  {selectedMerchants.length} selecionados
                </Badge>
              </div>

              {/* Campo de Busca */}
              <FormField
                control={form.control}
                name="merchants"
                render={() => (
                  <FormItem>
                    <FormLabel>Buscar Estabelecimento</FormLabel>
                    <div className="relative">
                      <div className="relative w-1/2">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          placeholder="Busque por nome ou CNPJ..."
                          value={searchTerm}
                          onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setIsSearchOpen(e.target.value.length > 0);
                          }}
                          onFocus={() => {
                            if (searchTerm.length > 0) {
                              setIsSearchOpen(true);
                            }
                          }}
                          onBlur={() => {
                            // Delay para permitir clique nos itens
                            setTimeout(() => setIsSearchOpen(false), 200);
                          }}
                          className="pl-10"
                        />
                      </div>

                      {isSearchOpen && searchTerm.length > 0 && (
                        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                          {filteredMerchants.length === 0 ? (
                            <div className="p-3 text-sm text-muted-foreground text-center">
                              Nenhum estabelecimento encontrado.
                            </div>
                          ) : (
                            <div className="py-1">
                              {filteredMerchants
                                .filter(
                                  (merchant) =>
                                    !selectedMerchants.includes(merchant.id)
                                )
                                .slice(0, 10)
                                .map((merchant) => (
                                  <button
                                    key={merchant.id}
                                    type="button"
                                    onClick={() => addMerchant(merchant.id)}
                                    className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors text-left"
                                  >
                                    <Building2 className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                    <div className="flex-1 min-w-0">
                                      <p className="font-medium truncate text-sm">
                                        {merchant.name}
                                      </p>
                                      <p className="text-xs text-muted-foreground">
                                        CNPJ: {merchant.idDocument}
                                      </p>
                                    </div>
                                  </button>
                                ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Merchants Selecionados */}
              {selectedMerchantsDetails.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Estabelecimentos Selecionados
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {selectedMerchantsDetails.map((merchant) => (
                      <Card
                        key={merchant.id}
                        className="relative group hover:shadow-md transition-shadow"
                      >
                        <CardContent className="p-4">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-destructive text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => removeMerchant(merchant.id)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0">
                              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                                <Building2 className="h-4 w-4 text-primary" />
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <h5 className="font-medium text-sm truncate">
                                {merchant.name}
                              </h5>
                              <div className="flex items-center gap-1 mt-1">
                                <FileText className="h-3 w-3 text-muted-foreground" />
                                <p className="text-xs text-muted-foreground truncate">
                                  {merchant.idDocument}
                                </p>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
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
