"use client";

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
import { FeeType } from "@/lib/lookuptables/lookuptables";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { saveOrUpdateFeeAction } from "../_actions/pricing-formActions";
import { FeeNewSchema, schemaFee } from "../schema/fee-new-Schema";
import { type FeeData } from "../server/fee-db";
import { PaymentConfigFormCompulsory } from "./new-tax-form-compusory";
import { PaymentConfigFormWithCard } from "./new-tax-form-eventual";
import { NewTaxPixSession } from "./new-tax-pixsession";

interface FeeFormProps {
  fee: FeeData;
}

export function NewTaxForm1({ fee }: FeeFormProps) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  // Referências para acessar os dados dos formulários filhos
  const compulsoryFormRef = useRef<{
    getFormData: () => {
      pixConfig: any;
      groups: any[];
    };
  }>(null);

  const eventualFormRef = useRef<{
    getFormData: () => {
      pixConfig: any;
      groups: any[];
    };
  }>(null);

  const pixFormRef = useRef<{
    getFormData: () => {
      pixConfig: any;
    };
  }>(null);

  // Mapear os dados da FeeData para FeeNewSchema para o formulário
  const defaultValues: Partial<FeeNewSchema> = {
    id: fee.id ? BigInt(fee.id) : undefined,
    slug: fee.slug || "",
    name: fee.name || "",
    code: fee.code || "",
    active: fee.active !== undefined ? fee.active : true,
    dtinsert: fee.dtinsert ? new Date(fee.dtinsert) : undefined,
    dtupdate: fee.dtupdate ? new Date(fee.dtupdate) : undefined,
    anticipationType:
      (fee.anticipationType as "NOANTECIPATION" | "EVENTUAL" | "COMPULSORY") ||
      "NOANTECIPATION",
    compulsoryAnticipationConfig: fee.compulsoryAnticipationConfig
      ? Number(fee.compulsoryAnticipationConfig)
      : undefined,
    eventualAnticipationFee: fee.eventualAnticipationFee
      ? Number(fee.eventualAnticipationFee)
      : undefined,
    tableType: fee.tableType || "",
    cardPixMdr: fee.cardPixMdr
      ? Number(fee.cardPixMdr.replace(" %", "").replace(",", "."))
      : undefined,
    cardPixCeilingFee: fee.cardPixCeilingFee
      ? Number(fee.cardPixCeilingFee.replace(",", "."))
      : undefined,
    cardPixMinimumCostFee: fee.cardPixMinimumCostFee
      ? Number(fee.cardPixMinimumCostFee.replace(",", "."))
      : undefined,
    nonCardPixMdr: fee.nonCardPixMdr
      ? Number(fee.nonCardPixMdr.replace(" %", "").replace(",", "."))
      : undefined,
    nonCardPixCeilingFee: fee.nonCardPixCeilingFee
      ? Number(fee.nonCardPixCeilingFee.replace(",", "."))
      : undefined,
    nonCardPixMinimumCostFee: fee.nonCardPixMinimumCostFee
      ? Number(fee.nonCardPixMinimumCostFee.replace(",", "."))
      : undefined,
  };

  const form = useForm<FeeNewSchema>({
    resolver: zodResolver(schemaFee),
    defaultValues,
  });

  const [selectedAnticipationType, setSelectedAnticipationType] = useState<
    "NOANTECIPATION" | "EVENTUAL" | "COMPULSORY"
  >(
    (fee.anticipationType as "NOANTECIPATION" | "EVENTUAL" | "COMPULSORY") ||
      "NOANTECIPATION"
  );

  // Função de submissão do formulário
  const onSubmit = async (data: FeeNewSchema) => {
    try {
      setIsPending(true);
      toast.loading("Salvando configurações...");

      // Coleta dados dos filhos
      const pixConfig = pixFormRef.current?.getFormData().pixConfig;
      const groups =
        selectedAnticipationType === "COMPULSORY"
          ? compulsoryFormRef.current?.getFormData().groups
          : eventualFormRef.current?.getFormData().groups;

      // Chama a action simplificada
      await saveOrUpdateFeeAction({
        fee: {
          ...data,
          anticipationType: selectedAnticipationType,
          feeBrand: undefined,
        },
        pixConfig,
        groups: groups || [],
      });

      toast.success("Configuração de taxa salva com sucesso!");
      router.refresh();
    } catch (error) {
      console.error("Erro ao salvar configuração:", error);
      toast.error("Erro ao salvar configuração da taxa");
    } finally {
      setIsPending(false);
    }
  };

  function handleAnticipationTypeChange(
    value: "NOANTECIPATION" | "EVENTUAL" | "COMPULSORY"
  ) {
    setSelectedAnticipationType(value);
    form.setValue("anticipationType", value);
  }

  if (!fee) {
    return (
      <div className="text-center text-muted-foreground p-8 border rounded-md bg-gray-50">
        <h3 className="text-lg font-medium mb-2">Taxa não encontrada</h3>
        <p className="mb-4">Não foi possível carregar os dados da taxa.</p>
        <Button
          variant="outline"
          onClick={() => router.push("/portal/pricing")}
        >
          Voltar para lista
        </Button>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome da Tabela</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Código da Tabela</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="anticipationType"
                render={() => (
                  <FormItem>
                    <FormLabel>Tipo de Antecipação</FormLabel>
                    <Select
                      value={selectedAnticipationType}
                      onValueChange={(value) =>
                        handleAnticipationTypeChange(
                          value as "NOANTECIPATION" | "EVENTUAL" | "COMPULSORY"
                        )
                      }
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo de antecipação" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {FeeType.map((type) => (
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

              {selectedAnticipationType === "COMPULSORY" && (
                <FormField
                  control={form.control}
                  name="compulsoryAnticipationConfig"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dias úteis para antecipar(d+)</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          value={field.value?.toString() || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <h3 className="text-lg font-medium mb-4 mt-4">
              Configuração de Pix
            </h3>
            <NewTaxPixSession
              data={fee}
              ref={pixFormRef}
              tableType={selectedAnticipationType}
            />
          </CardContent>
        </Card>

        {selectedAnticipationType === "EVENTUAL" ||
        selectedAnticipationType === "NOANTECIPATION" ? (
          <Card>
            <CardContent>
              <h3 className="text-lg font-medium mb-4 mt-4">
                {selectedAnticipationType === "NOANTECIPATION"
                  ? "Taxas sem antecipação"
                  : "Taxas com Antecipação Eventual"}
              </h3>
              <PaymentConfigFormWithCard
                fee={fee}
                ref={eventualFormRef}
                hideButtons={true}
              />
            </CardContent>
          </Card>
        ) : selectedAnticipationType === "COMPULSORY" ? (
          <Card>
            <CardContent>
              <h3 className="text-lg font-medium mb-4 mt-4">
                Taxas com Antecipação Compulsória
              </h3>
              <PaymentConfigFormCompulsory
                fee={fee}
                ref={compulsoryFormRef}
                hideButtons={true}
              />
            </CardContent>
          </Card>
        ) : null}

        <div className="flex justify-end mt-4">
          <Button
            variant="outline"
            onClick={() => router.push("/portal/pricing")}
            className="mr-2"
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Salvando..." : "Salvar"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
