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
import { brandList } from "@/lib/lookuptables/lookuptables-transactions";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { saveOrUpdateFeeAction } from "../_actions/pricing-formActions";
import { schemaFee, type FeeNewSchema } from "../schema/fee-new-Schema";
import { getFeeAdminByCnaeMccAction, type FeeData } from "../server/fee-db";
import { PaymentConfigFormCompulsory } from "./new-tax-form-compusory";
import { PaymentConfigFormWithCard } from "./new-tax-form-eventual";
import { NewTaxPixSession } from "./new-tax-pixsession";

interface Category {
  mcc: string;
  cnae: string;
}

interface FeeFormProps {
  fee: FeeData;
  categories: Category[];
}

export function NewTaxForm1({ fee, categories }: FeeFormProps) {
  console.log("DADOS RECEBIDOS NO FORMULÁRIO:", fee);
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [feeFieldErrors, setFeeFieldErrors] = useState<Record<string, string>>(
    {}
  );

  // Novo estado para armazenar os valores mínimos
  const [minValuesMap, setMinValuesMap] = useState<Record<string, any>>({});

  // Referências para acessar os dados dos formulários filhos
  const compulsoryFormRef = useRef<{
    getFormData: () => {
      pixConfig: any;
      groups: any[];
    };
  }>(null);
  console.log(
    "DADOS RECEBIDOS NO SUBFORMULÁRIO COMPULSÓRIO:",
    compulsoryFormRef
  );

  const eventualFormRef = useRef<{
    getFormData: () => {
      pixConfig: any;
      groups: any[];
    };
  }>(null);
  console.log("DADOS RECEBIDOS NO SUBFORMULÁRIO EVENTUAL:", eventualFormRef);

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
    mcc: fee.mcc || "",
    cnae: fee.cnae || "",
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

  const mccValue = form.watch("mcc");
  const cnaeValue = form.watch("cnae");

  // Buscar os valores mínimos ao carregar o formulário ou quando MCC/CNAE mudarem
  useEffect(() => {
    async function fetchMinValues() {
      if (mccValue && cnaeValue) {
        const feeAdminMap = await getFeeAdminByCnaeMccAction(
          String(cnaeValue),
          String(mccValue)
        );
        setMinValuesMap(feeAdminMap);
      } else {
        setMinValuesMap({});
      }
    }
    fetchMinValues();
  }, [mccValue, cnaeValue]);

  // Sincroniza CNAE quando MCC muda
  useEffect(() => {
    const subscription = form.watch((values, { name }) => {
      if (name === "mcc" && values.mcc) {
        const found = categories.find((cat) => cat.mcc === values.mcc);
        if (found && form.getValues("cnae") !== found.cnae) {
          console.log("MCC alterado, atualizando CNAE:", found.cnae);
          form.setValue("cnae", found.cnae, {
            shouldValidate: true,
            shouldDirty: true,
          });
        }
      }
      if (name === "cnae" && values.cnae) {
        const found = categories.find((cat) => cat.cnae === values.cnae);
        if (found && form.getValues("mcc") !== found.mcc) {
          console.log("CNAE alterado, atualizando MCC:", found.mcc);
          form.setValue("mcc", found.mcc, {
            shouldValidate: true,
            shouldDirty: true,
          });
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [form, categories]);

  // Função de submissão do formulário
  const onSubmit = async (data: FeeNewSchema) => {
    try {
      setIsPending(true);
      setFeeFieldErrors({});

      // Garante que os campos estejam atualizados e validados
      await form.trigger(["mcc", "cnae"]);

      // Obter os valores mais recentes do formulário
      const mccValue = form.getValues("mcc");
      const cnaeValue = form.getValues("cnae");

      // Atualiza os valores no objeto data que será enviado
      data.mcc = mccValue;
      data.cnae = cnaeValue;

      console.log("VALORES ANTES DE ENVIAR:", {
        mcc: data.mcc,
        cnae: data.cnae,
        formMcc: mccValue,
        formCnae: cnaeValue,
      });

      // Sincroniza MCC e CNAE se um deles estiver vazio mas o outro estiver preenchido
      if (!data.cnae && data.mcc) {
        const found = categories.find((cat) => cat.mcc === data.mcc);
        if (found) {
          data.cnae = found.cnae;
          console.log("CNAE sincronizado a partir do MCC:", data.cnae);
        }
      }
      if (!data.mcc && data.cnae) {
        const found = categories.find((cat) => cat.cnae === data.cnae);
        if (found) {
          data.mcc = found.mcc;
          console.log("MCC sincronizado a partir do CNAE:", data.mcc);
        }
      }

      // Coleta dados dos filhos
      const pixConfig = pixFormRef.current?.getFormData().pixConfig;
      const groups =
        selectedAnticipationType === "COMPULSORY"
          ? compulsoryFormRef.current?.getFormData().groups
          : eventualFormRef.current?.getFormData().groups;

      // Lista de todas as bandeiras disponíveis
      const allBrands = brandList.map((brand) => brand.value);

      // Conjunto de bandeiras selecionadas em todos os grupos
      const selectedBrands = new Set<string>();

      // Verifica se há grupos e coleta todas as bandeiras selecionadas
      if (groups && groups.length > 0) {
        groups.forEach((group) => {
          if (group.selectedCards && group.selectedCards.length > 0) {
            group.selectedCards.forEach((brand: string) =>
              selectedBrands.add(brand)
            );
          }
        });
      }

      // Verifica se todas as bandeiras foram selecionadas
      const missingBrands = allBrands.filter(
        (brand) => !selectedBrands.has(brand)
      );

      if (missingBrands.length > 0) {
        toast.error(
          `Preecha as taxas para todas as bandeiras. Bandeiras faltando: ${missingBrands.join(", ")}`
        );
        setIsPending(false);
        return;
      }

      // Se não temos grupos, não precisamos validar
      if (!groups || groups.length === 0) {
        console.log("Sem grupos para validar");
      } else {
        console.log("Grupos para validação:", groups);
      }

      // Validação dos campos de taxa com base no feeAdmin
      console.log(
        "Buscando valores mínimos para CNAE:",
        data.cnae,
        "e MCC:",
        data.mcc
      );
      const feeAdminMap = await getFeeAdminByCnaeMccAction(
        String(data.cnae ?? ""),
        String(data.mcc ?? "")
      );

      console.log("Validando taxas com feeAdminMap:", feeAdminMap);

      let hasError = false;
      const errors: Record<string, string> = {};

      if (Object.keys(feeAdminMap).length === 0) {
        console.log(
          "Nenhum valor mínimo encontrado para validação. Verificar se existe solicitação COMPLETED para este CNAE/MCC."
        );
      }

      if (groups) {
        let hasEmptyGroup = false;
        for (const group of groups) {
          // Se não tem cartões selecionados, marca erro
          if (!group.selectedCards || group.selectedCards.length === 0) {
            hasEmptyGroup = true;
            continue;
          }

          for (const brand of group.selectedCards) {
            // Verificar se temos valores de referência para esta marca
            if (!feeAdminMap[brand]) {
              continue;
            }

            for (const [productType, modeRaw] of Object.entries(group.modes)) {
              const mode = modeRaw as any;
              const minPresent = feeAdminMap?.[brand]?.[productType];
              const nocardKey = `nocard_${productType}`;
              const minNotPresent =
                feeAdminMap?.[brand]?.[nocardKey] || minPresent;

              if (minPresent === undefined) {
                continue;
              }

              const presentIntermediationValue = mode.presentIntermediation
                ? Number.parseFloat(
                    mode.presentIntermediation.toString().replace(",", ".")
                  )
                : null;
              const notPresentIntermediationValue =
                mode.notPresentIntermediation
                  ? Number.parseFloat(
                      mode.notPresentIntermediation.toString().replace(",", ".")
                    )
                  : null;
              const presentTransactionValue = mode.presentTransaction
                ? Number.parseFloat(
                    mode.presentTransaction.toString().replace(",", ".")
                  )
                : null;
              const notPresentTransactionValue = mode.notPresentTransaction
                ? Number.parseFloat(
                    mode.notPresentTransaction.toString().replace(",", ".")
                  )
                : null;

              if (
                minPresent !== undefined &&
                presentIntermediationValue !== null &&
                presentIntermediationValue < minPresent
              ) {
                hasError = true;
                errors[`${brand}-${productType}-presentIntermediation`] =
                  `Mínimo permitido: ${minPresent}%`;
              }
              if (
                minNotPresent !== undefined &&
                notPresentIntermediationValue !== null &&
                notPresentIntermediationValue < minNotPresent
              ) {
                hasError = true;
                errors[`${brand}-${productType}-notPresentIntermediation`] =
                  `Mínimo permitido: ${minNotPresent}%`;
              }
              if (
                minPresent !== undefined &&
                presentTransactionValue !== null &&
                presentTransactionValue < minPresent
              ) {
                hasError = true;
                errors[`${brand}-${productType}-presentTransaction`] =
                  `Mínimo permitido: ${minPresent}%`;
              }
              if (
                minNotPresent !== undefined &&
                notPresentTransactionValue !== null &&
                notPresentTransactionValue < minNotPresent
              ) {
                hasError = true;
                errors[`${brand}-${productType}-notPresentTransaction`] =
                  `Mínimo permitido: ${minNotPresent}%`;
              }

              // Parcelas (se existirem)
              if (mode.installments) {
                for (const [installment, instRaw] of Object.entries(
                  mode.installments
                )) {
                  const inst = instRaw as any;
                  const instPresentIntermediationValue =
                    inst.presentIntermediation
                      ? Number.parseFloat(
                          inst.presentIntermediation
                            .toString()
                            .replace(",", ".")
                        )
                      : null;
                  const instNotPresentIntermediationValue =
                    inst.notPresentIntermediation
                      ? Number.parseFloat(
                          inst.notPresentIntermediation
                            .toString()
                            .replace(",", ".")
                        )
                      : null;
                  const instPresentTransactionValue = inst.presentTransaction
                    ? Number.parseFloat(
                        inst.presentTransaction.toString().replace(",", ".")
                      )
                    : null;
                  const instNotPresentTransactionValue =
                    inst.notPresentTransaction
                      ? Number.parseFloat(
                          inst.notPresentTransaction
                            .toString()
                            .replace(",", ".")
                        )
                      : null;

                  if (
                    minPresent !== undefined &&
                    instPresentIntermediationValue !== null &&
                    instPresentIntermediationValue < minPresent
                  ) {
                    hasError = true;
                    errors[
                      `${brand}-${productType}-presentIntermediation-${installment}`
                    ] = `Mínimo permitido: ${minPresent}%`;
                  }
                  if (
                    minNotPresent !== undefined &&
                    instNotPresentIntermediationValue !== null &&
                    instNotPresentIntermediationValue < minNotPresent
                  ) {
                    hasError = true;
                    errors[
                      `${brand}-${productType}-notPresentIntermediation-${installment}`
                    ] = `Mínimo permitido: ${minNotPresent}%`;
                  }
                  if (
                    minPresent !== undefined &&
                    instPresentTransactionValue !== null &&
                    instPresentTransactionValue < minPresent
                  ) {
                    hasError = true;
                    errors[
                      `${brand}-${productType}-presentTransaction-${installment}`
                    ] = `Mínimo permitido: ${minPresent}%`;
                  }
                  if (
                    minNotPresent !== undefined &&
                    instNotPresentTransactionValue !== null &&
                    instNotPresentTransactionValue < minNotPresent
                  ) {
                    hasError = true;
                    errors[
                      `${brand}-${productType}-notPresentTransaction-${installment}`
                    ] = `Mínimo permitido: ${minNotPresent}%`;
                  }
                }
              }
            }
          }
        }
        if (hasEmptyGroup) {
          hasError = true;
          toast.error("Selecione pelo menos uma bandeira em cada grupo.");
        }
      }

      if (hasError) {
        console.log("Erros de validação encontrados:", errors);
        setFeeFieldErrors(errors);
        toast.error("Algumas taxas estão abaixo do mínimo permitido.");
        setIsPending(false);
        return;
      }

      // Registra os valores finais antes de enviar
      console.log("VALORES FINAIS PARA ENVIO:", {
        mcc: data.mcc,
        cnae: data.cnae,
      });

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
      router.push("/portal/pricing");
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
        <Card className="rounded-xl shadow-sm">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="">
                    <FormLabel>Nome da Tabela</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value || ""}
                        className="rounded-lg"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem className="">
                    <FormLabel>Código da Tabela</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value || ""}
                        className="rounded-lg"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="anticipationType"
                render={() => (
                  <FormItem className="">
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

              <div>
                <FormField
                  control={form.control}
                  name="mcc"
                  render={({ field }) => (
                    <FormItem className="">
                      <FormLabel>MCC</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          value={field.value || ""}
                          className="rounded-lg"
                          onChange={(e) => {
                            const value = e.target.value;
                            field.onChange(value);
                            const found = categories.find(
                              (cat) => cat.mcc === value
                            );
                            if (found) {
                              form.setValue("cnae", found.cnae);
                              form.trigger("cnae");
                            }
                          }}
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
                  name="cnae"
                  render={({ field }) => (
                    <FormItem className="">
                      <FormLabel>CNAE</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          value={field.value || ""}
                          className="rounded-lg"
                          onChange={(e) => {
                            const value = e.target.value;
                            field.onChange(value);
                            const found = categories.find(
                              (cat) => cat.cnae === value
                            );
                            if (found) {
                              form.setValue("mcc", found.mcc);
                              form.trigger("mcc");
                            }
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {selectedAnticipationType === "COMPULSORY" && (
                <FormField
                  control={form.control}
                  name="compulsoryAnticipationConfig"
                  render={({ field }) => (
                    <FormItem className="">
                      <FormLabel>Dias úteis para antecipar(d+)</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          value={field.value?.toString() || ""}
                          onChange={(e) => {
                            const value = e.target.value;
                            field.onChange(
                              value === "" ? undefined : Number(value)
                            );
                          }}
                          type="number"
                          min={0}
                          className="rounded-lg"
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

        <Card className="rounded-xl shadow-sm">
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
          <Card className="rounded-xl shadow-sm">
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
                feeFieldErrors={feeFieldErrors}
              />
            </CardContent>
          </Card>
        ) : selectedAnticipationType === "COMPULSORY" ? (
          <Card className="rounded-xl shadow-sm">
            <CardContent>
              <h3 className="text-lg font-medium mb-4 mt-4">
                Taxas com Antecipação Compulsória
              </h3>
              <PaymentConfigFormCompulsory
                fee={fee}
                ref={compulsoryFormRef}
                hideButtons={true}
                feeFieldErrors={feeFieldErrors}
                minValuesMap={minValuesMap}
              />
            </CardContent>
          </Card>
        ) : null}

        <div className="flex justify-between mt-4 gap-2">
          <Link href="/portal/pricing">
            <Button
              type="button"
              variant="outline"
              className="rounded-lg px-6 py-2"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
          </Link>
          <Button
            type="submit"
            disabled={isPending}
            className="rounded-lg px-6 py-2"
          >
            {isPending ? "Salvando..." : "Salvar"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
