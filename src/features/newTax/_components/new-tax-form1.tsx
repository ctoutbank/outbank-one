"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import {
  saveMerchantPricingAction,
  updatePixConfigAction,
} from "@/features/newTax/_actions/pricing-formActions";
import {
  FeeNewSchema,
  schemaFee,
} from "@/features/newTax/schema/fee-new-Schema";
import type { FeeData } from "@/features/newTax/server/fee-db";
import { FeeType } from "@/lib/lookuptables/lookuptables";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { PaymentConfigFormCompulsory } from "./new-tax-form-compusory";
import { PaymentConfigFormWithCard } from "./new-tax-form-eventual";
import { NewTaxPixSession } from "./new-tax-pixsession";

interface FeeDataProps {
  fee: FeeData | null;
}

export function NewTaxForm1({ fee }: FeeDataProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

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

  // Convertendo os tipos conforme necessário para corresponder ao schema
  const form = useForm<FeeNewSchema>({
    resolver: zodResolver(schemaFee),
    defaultValues: {
      id: fee?.id ? BigInt(fee.id) : undefined,
      slug: "",
      anticipationType: fee?.anticipationType || "NOANTECIPATION",
      compulsoryAnticipationConfig: fee?.compulsoryAnticipationConfig
        ? Number(fee.compulsoryAnticipationConfig)
        : undefined,
      eventualAnticipationFee: fee?.eventualAnticipationFee
        ? Number(fee.eventualAnticipationFee)
        : undefined,
      tableType: fee?.tableType || "",
      active: fee?.active || false,
      dtinsert: fee?.dtinsert ? new Date(fee.dtinsert) : undefined,
      dtupdate: fee?.dtupdate ? new Date(fee.dtupdate) : undefined,
      name: fee?.name || "",
      cardPixMdr: fee?.cardPixMdr ? Number(fee.cardPixMdr) : undefined,
      cardPixCeilingFee: fee?.cardPixCeilingFee
        ? Number(fee.cardPixCeilingFee)
        : undefined,
      cardPixMinimumCostFee: fee?.cardPixMinimumCostFee
        ? Number(fee.cardPixMinimumCostFee)
        : undefined,
      nonCardPixMdr: fee?.nonCardPixMdr ? Number(fee.nonCardPixMdr) : undefined,
      nonCardPixCeilingFee: fee?.nonCardPixCeilingFee
        ? Number(fee.nonCardPixCeilingFee)
        : undefined,
      nonCardPixMinimumCostFee: fee?.nonCardPixMinimumCostFee
        ? Number(fee.nonCardPixMinimumCostFee)
        : undefined,
      feeBrand:
        fee?.feeBrand?.map((brand) => ({
          id: BigInt(brand.id),
          slug: brand.slug || "",
          active: brand.active || false,
          dtinsert: brand.dtinsert ? new Date(brand.dtinsert) : undefined,
          dtupdate: brand.dtupdate ? new Date(brand.dtupdate) : undefined,
          brand: brand.brand || "",
          idGroup: brand.idGroup || 0,
          idFee: BigInt(brand.idFee || 0),
          feeBrandProductType:
            brand.feeBrandProductType?.map((productType) => ({
              id: BigInt(productType.id),
              slug: productType.slug || "",
              active: productType.active || false,
              dtinsert: productType.dtinsert
                ? new Date(productType.dtinsert)
                : undefined,
              dtupdate: productType.dtupdate
                ? new Date(productType.dtupdate)
                : undefined,
              installmentTransactionFeeStart:
                productType.installmentTransactionFeeStart || 0,
              installmentTransactionFeeEnd:
                productType.installmentTransactionFeeEnd || 0,
              cardTransactionFee: productType.cardTransactionFee || 0,
              cardTransactionMdr: productType.cardTransactionMdr || 0,
              nonCardTransactionFee: productType.nonCardTransactionFee || 0,
              nonCardTransactionMdr: productType.nonCardTransactionMdr || 0,
              producttype: productType.producttype || "",
              idFeeBrand: BigInt(productType.idFeeBrand || 0),
            })) || [],
        })) || [],
    },
  });

  const [selectedAnticipationType, setSelectedAnticipationType] = useState<
    "NOANTECIPATION" | "EVENTUAL" | "COMPULSORY"
  >(
    (fee?.anticipationType as "NOANTECIPATION" | "EVENTUAL" | "COMPULSORY") ||
      "NOANTECIPATION"
  );

  useEffect(() => {
    if (fee?.anticipationType) {
      setSelectedAnticipationType(
        fee.anticipationType as "NOANTECIPATION" | "EVENTUAL" | "COMPULSORY"
      );
      form.setValue("anticipationType", fee.anticipationType);
    }
  }, [fee, form]);

  // Função de submissão do formulário
  const onSubmit = async (data: FeeNewSchema) => {
    try {
      console.log("Iniciando submit do formulário");

      // Utilizando o valor selecionado do tipo de antecipação
      const dataToSubmit = {
        ...data,
        anticipationType: selectedAnticipationType,
      };

      console.log("Dados do formulário principal:", dataToSubmit);

      startTransition(async () => {
        try {
          // Salvar dados do formulário principal primeiro
          // Aqui você implementaria a lógica para salvar os dados principais

          // Obter e salvar dados da seção PIX
          if (pixFormRef.current) {
            const pixData = pixFormRef.current.getFormData();
            console.log("Dados do formulário PIX:", pixData);

            // Salvar os dados de PIX
            await updatePixConfigAction(fee!.id, pixData.pixConfig);
          }

          // Obter e salvar dados do formulário filho apropriado
          if (
            selectedAnticipationType === "COMPULSORY" &&
            compulsoryFormRef.current
          ) {
            const compulsoryData = compulsoryFormRef.current.getFormData();
            console.log("Dados do formulário compulsório:", compulsoryData);

            // Salvar as configurações de taxas por bandeira
            await saveMerchantPricingAction(fee!.id, compulsoryData.groups);
          } else if (
            selectedAnticipationType === "EVENTUAL" &&
            eventualFormRef.current
          ) {
            const eventualData = eventualFormRef.current.getFormData();
            console.log("Dados do formulário eventual:", eventualData);

            // Salvar as configurações de taxas por bandeira
            await saveMerchantPricingAction(fee!.id, eventualData.groups);
          }

          toast.success("Configuração de taxa salva com sucesso!");
          router.refresh();
        } catch (error) {
          console.error("Erro ao salvar dados:", error);
          toast.error("Erro ao salvar configuração da taxa");
        }
      });
    } catch (error) {
      console.error("Erro no submit:", error);
      toast.error("Erro ao salvar configuração da taxa");
    }
  };

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

  function handleAnticipationTypeChange(
    value: "NOANTECIPATION" | "EVENTUAL" | "COMPULSORY"
  ) {
    setSelectedAnticipationType(value);
    form.setValue("anticipationType", value);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Configuração da Tabela</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome da Tabela</FormLabel>
                      <FormControl>
                        <Input
                          placeholder=""
                          {...field}
                          value={fee?.name || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div>
                <FormField
                  control={form.control}
                  name="name"
                  render={() => (
                    <FormItem>
                      <FormLabel>Código da Tabela</FormLabel>
                      <FormControl>
                        <Input placeholder="" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div>
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
                            value as
                              | "NOANTECIPATION"
                              | "EVENTUAL"
                              | "COMPULSORY"
                          )
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo de antecipação" />
                        </SelectTrigger>
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
              </div>
              {selectedAnticipationType === "COMPULSORY" && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="col-span-1 md:col-start-3">
                    <FormField
                      control={form.control}
                      name="compulsoryAnticipationConfig"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Dias úteis para antecipar(d+)</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Configuração de Pix</CardTitle>
          </CardHeader>
          <CardContent>
            <NewTaxPixSession
              data={fee}
              ref={pixFormRef}
              tableType={selectedAnticipationType}
            />
          </CardContent>
        </Card>
        {selectedAnticipationType === "EVENTUAL" ||
        selectedAnticipationType === "NOANTECIPATION" ? (
          <div>
            <h3 className="text-lg font-medium mb-4">
              {selectedAnticipationType === "NOANTECIPATION"
                ? "Formulário sem antecipação"
                : "Formulário de Antecipação Eventual"}
            </h3>
            <PaymentConfigFormWithCard
              fee={fee}
              ref={eventualFormRef}
              hideButtons={true}
            />
          </div>
        ) : selectedAnticipationType === "COMPULSORY" ? (
          <div>
            <h3 className="text-lg font-medium mb-4">
              Formulário de Antecipação Compulsória
            </h3>
            <PaymentConfigFormCompulsory
              fee={fee}
              ref={compulsoryFormRef}
              hideButtons={true}
            />
          </div>
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
