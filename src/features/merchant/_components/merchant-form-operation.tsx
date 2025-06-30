"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  insertConfigurationFormAction,
  updateConfigurationFormAction,
} from "@/features/configuration/_actions/configuration-formActions";
import {
  ConfigurationOperationsSchema,
  schemaConfigurationOperations,
} from "@/features/configuration/schema/configurations-schema";
import { timezones } from "@/lib/lookuptables/lookuptables";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreditCard, Settings } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  SalesAgentDropdown,
  updateMerchantColumnsById,
} from "../server/merchant";

// Estendendo o tipo de configuração para incluir os campos adicionais
interface ConfigurationWithExtras {
  id: number;
  slug: string | null;
  active: boolean | null;
  dtinsert: string | null;
  dtupdate: string | null;
  lockCpAnticipationOrder: boolean | null;
  lockCnpAnticipationOrder: boolean | null;
  url: string | null;
  anticipationRiskFactorCp?: number | null | undefined;
  anticipationRiskFactorCnp?: number | null | undefined;
  waitingPeriodCp?: number | null | undefined;
  waitingPeriodCnp?: number | null | undefined;
}

interface MerchantProps {
  Configuration: ConfigurationWithExtras;
  hasTaf: boolean;
  hastop: boolean;
  hasPix: boolean;
  merhcnatSlug: string;
  timezone: string;
  idMerchant: number;
  idSalesAgent: number | null;
  setActiveTab: (tab: string) => void;
  activeTab: string;
  permissions: string[];
  idConfiguration?: number;
  DDSalesAgent: SalesAgentDropdown[];
}

export default function MerchantFormOperations({
  Configuration,
  hasTaf,
  hastop,
  hasPix,
  merhcnatSlug,
  timezone,
  setActiveTab,
  activeTab,
  idMerchant,

  permissions,
  idConfiguration,
  DDSalesAgent,
}: MerchantProps) {
  const router = useRouter();
  const [loadedConfiguration] = useState<ConfigurationWithExtras | null>(null);
  // Estados para controlar a exibição dos campos de Cartão Presente e Cartão Não Presente
  const [showCardPresent, setShowCardPresent] = useState(true);
  const [showCardNotPresent, setShowCardNotPresent] = useState(true);

  // Verificar explicitamente se o merchant já tem uma configuração associada
  const hasExistingConfiguration = !!idConfiguration;

  // Usar a configuração carregada do banco ou a recebida via props
  const configToUse = loadedConfiguration || Configuration;

  // Log dos valores da base de dados
  console.log("ID do Merchant:", idMerchant);
  console.log("Configuração recebida:", configToUse);
  console.log(
    "lockCpAnticipationOrder:",
    configToUse?.lockCpAnticipationOrder,
    "tipo:",
    typeof configToUse?.lockCpAnticipationOrder
  );
  console.log(
    "lockCnpAnticipationOrder:",
    configToUse?.lockCnpAnticipationOrder,
    "tipo:",
    typeof configToUse?.lockCnpAnticipationOrder
  );

  // Valores iniciais processados para garantir tipos booleanos corretos
  const initialLockCp = configToUse?.lockCpAnticipationOrder === true;
  const initialLockCnp = configToUse?.lockCnpAnticipationOrder === true;

  console.log("Valores processados para booleanos:");
  console.log("initialLockCp:", initialLockCp);
  console.log("initialLockCnp:", initialLockCnp);

  const form = useForm<ConfigurationOperationsSchema>({
    resolver: zodResolver(schemaConfigurationOperations),
    defaultValues: {
      // Usar o idConfiguration do merchant se disponível (mais confiável)
      id: idConfiguration || Configuration?.id || undefined,
      slug: configToUse?.slug || "",
      active: configToUse?.active || false,
      lockCpAnticipationOrder: initialLockCp,
      lockCnpAnticipationOrder: initialLockCnp,
      anticipationRiskFactorCp:
        configToUse?.anticipationRiskFactorCp !== null &&
        configToUse?.anticipationRiskFactorCp !== undefined
          ? configToUse?.anticipationRiskFactorCp.toString()
          : "0",
      anticipationRiskFactorCnp:
        configToUse?.anticipationRiskFactorCnp !== null &&
        configToUse?.anticipationRiskFactorCnp !== undefined
          ? configToUse?.anticipationRiskFactorCnp.toString()
          : "0",
      waitingPeriodCp:
        configToUse?.waitingPeriodCp !== null &&
        configToUse?.waitingPeriodCp !== undefined
          ? configToUse?.waitingPeriodCp.toString()
          : "0",
      waitingPeriodCnp:
        configToUse?.waitingPeriodCnp !== null &&
        configToUse?.waitingPeriodCnp !== undefined
          ? configToUse?.waitingPeriodCnp.toString()
          : "0",
      url: configToUse?.url || "",
      dtinsert: configToUse?.dtinsert
        ? new Date(configToUse.dtinsert)
        : new Date(),
      dtupdate: configToUse?.dtupdate
        ? new Date(configToUse.dtupdate)
        : new Date(),
      hasTaf: hasTaf,
      hastop: hastop,
      hasPix: hasPix,
      merhcnatSlug: merhcnatSlug,
      timezone: timezone,
      theme: "SYSTEM DEFAULT",
    },
  });

  // Log dos valores do formulário após a inicialização
  useEffect(() => {
    console.log("Valores iniciais do formulário:", form.getValues());
    console.log(
      "lockCpAnticipationOrder:",
      form.getValues("lockCpAnticipationOrder")
    );
    console.log(
      "lockCnpAnticipationOrder:",
      form.getValues("lockCnpAnticipationOrder")
    );
    console.log("Campos de antecipação (debugging):", {
      anticipationRiskFactorCp: form.getValues("anticipationRiskFactorCp"),
      anticipationRiskFactorCnp: form.getValues("anticipationRiskFactorCnp"),
      waitingPeriodCp: form.getValues("waitingPeriodCp"),
      waitingPeriodCnp: form.getValues("waitingPeriodCnp"),
    });
  }, [form]);

  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams || "");

  const refreshPage = (id: number) => {
    params.set("tab", activeTab);
    setActiveTab(activeTab);
    //add new objects in searchParams
    router.push(`/portal/merchants/${id}?${params.toString()}`);
  };
  const onSubmit = async (data: ConfigurationOperationsSchema) => {
    try {
      console.log("Dados enviados:", data);
      // Se temos idConfiguration do merchant, mas não temos no form, atualizar o form
      if (idConfiguration && !data.id) {
        data.id = idConfiguration;
      }

      let idConfigurationForMerchant = data.id;

      // Verificar se estamos atualizando uma configuração existente
      const isUpdating = hasExistingConfiguration;

      // Criar ou atualizar configuração
      if (isUpdating) {
        if (!data.id) {
          throw new Error("Cannot update configuration without an ID");
        }

        // Converter campos string para number antes de enviar
        const formattedData = {
          ...data,
          anticipationRiskFactorCp: data.anticipationRiskFactorCp
            ? Number(data.anticipationRiskFactorCp)
            : undefined,
          anticipationRiskFactorCnp: data.anticipationRiskFactorCnp
            ? Number(data.anticipationRiskFactorCnp)
            : undefined,
          waitingPeriodCp: data.waitingPeriodCp
            ? Number(data.waitingPeriodCp)
            : undefined,
          waitingPeriodCnp: data.waitingPeriodCnp
            ? Number(data.waitingPeriodCnp)
            : undefined,
        };

        await updateConfigurationFormAction(formattedData);
      } else {
        // Converter campos string para number antes de enviar
        const formattedData = {
          ...data,
          anticipationRiskFactorCp: data.anticipationRiskFactorCp
            ? Number(data.anticipationRiskFactorCp)
            : undefined,
          anticipationRiskFactorCnp: data.anticipationRiskFactorCnp
            ? Number(data.anticipationRiskFactorCnp)
            : undefined,
          waitingPeriodCp: data.waitingPeriodCp
            ? Number(data.waitingPeriodCp)
            : undefined,
          waitingPeriodCnp: data.waitingPeriodCnp
            ? Number(data.waitingPeriodCnp)
            : undefined,
        };

        idConfigurationForMerchant =
          await insertConfigurationFormAction(formattedData);
      } // Atualizar merchant com o ID da configuração (novo ou existente)
      const merchantUpdates = {
        idConfiguration: idConfigurationForMerchant!, // Usar o ID obtido da criação ou o existente
        hasTef: data.hasTaf || false,
        hasTop: data.hastop || false,
        hasPix: data.hasPix || false,
        timezone: data.timezone || "",
        idSalesAgent: data.idSalesAgent || null,
      };

      console.log("Dados para atualização do merchant:", merchantUpdates);

      await updateMerchantColumnsById(idMerchant, merchantUpdates);

      // Se estiver atualizando, apenas recarregar a página
      if (isUpdating) {
        alert("Dados salvos com sucesso!");
        router.refresh();
      } else {
        // Se estiver criando uma nova configuração, avançar para a próxima aba
        refreshPage(idMerchant);
      }
    } catch (error) {
      console.error("Erro ao salvar configuração:", error);
    }
  };

  return (
    <div className="grid gap-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Card Unificado: Cartão Presente e Não Presente */}
            <Card className="w-full md:col-span-2">
              <CardHeader className="flex flex-row items-center space-x-2">
                <CreditCard className="w-5 h-5" />
                <CardTitle>Capturar</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Coluna 1: Cartão Presente */}
                  <div className="space-y-4">
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={showCardPresent}
                          onCheckedChange={(checked) => {
                            setShowCardPresent(!!checked);
                            console.log(
                              `Checkbox Cartão Presente alterado para: ${checked}`
                            );
                          }}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none ml-2">
                        <FormLabel>Cartão Presente</FormLabel>
                      </div>
                    </FormItem>

                    {showCardPresent && (
                      <>
                        <FormField
                          control={form.control}
                          name="hasTaf"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                Terminal TEF{" "}
                                <span className="text-red-500">*</span>
                              </FormLabel>
                              <FormControl>
                                <RadioGroup
                                  onValueChange={(value) =>
                                    field.onChange(value === "true")
                                  }
                                  defaultValue={field.value ? "true" : "false"}
                                  className="flex space-x-4"
                                >
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="true" id="tef-yes" />
                                    <Label htmlFor="tef-yes">Sim</Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="false" id="tef-no" />
                                    <Label htmlFor="tef-no">Não</Label>
                                  </div>
                                </RadioGroup>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="hastop"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                Terminal Pagamento por Aproximação{" "}
                                <span className="text-red-500">*</span>
                              </FormLabel>
                              <FormControl>
                                <RadioGroup
                                  onValueChange={(value) =>
                                    field.onChange(value === "true")
                                  }
                                  defaultValue={field.value ? "true" : "false"}
                                  className="flex space-x-4"
                                >
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="true" id="tap-sim" />
                                    <Label htmlFor="tap-sim">Sim</Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem
                                      value="false"
                                      id="tap-nao"
                                    />
                                    <Label htmlFor="tap-nao">Não</Label>
                                  </div>
                                </RadioGroup>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </>
                    )}

                    <FormField
                      control={form.control}
                      name="hasPix"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            PIX <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={(value) =>
                                field.onChange(value === "true")
                              }
                              defaultValue={field.value ? "true" : "false"}
                              className="flex space-x-4"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="true" id="pix-yes" />
                                <Label htmlFor="pix-yes">Sim</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="false" id="pix-no" />
                                <Label htmlFor="pix-no">Não</Label>
                              </div>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Coluna 2: Cartão Não Presente */}
                  <div className="space-y-4">
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={showCardNotPresent}
                          onCheckedChange={(checked) => {
                            setShowCardNotPresent(!!checked);
                            console.log(
                              `Checkbox Cartão Não Presente alterado para: ${checked}`
                            );
                          }}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none ml-2">
                        <FormLabel>Cartão Não Presente</FormLabel>
                      </div>
                    </FormItem>

                    {showCardNotPresent && (
                      <>
                        <FormField
                          control={form.control}
                          name="url"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                URL <span className="text-red-500">*</span>
                              </FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  placeholder="https://outbank.com.br/"
                                  value={field.value || configToUse?.url || ""}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </>
                    )}
                  </div>
                </div>

                {/* Seção de Antecipação compartilhada entre as duas colunas */}
                <div className="pt-6 mt-6 border-t border-gray-100">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Antecipação Cartão Presente */}
                    <div className="space-y-4">
                      {showCardPresent && (
                        <>
                          <h3 className="font-medium mb-3">
                            Antecipação Cartão Presente
                          </h3>
                          <FormField
                            control={form.control}
                            name="anticipationRiskFactorCp"
                            render={({ field }) => (
                              <FormItem className="mb-3">
                                <FormLabel>Valor antecipável (%):</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    {...field}
                                    value={field.value || "0"}
                                    disabled
                                    onChange={(e) =>
                                      field.onChange(
                                        e.target.value
                                          ? Number(e.target.value)
                                          : null
                                      )
                                    }
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="waitingPeriodCp"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Carência de Antecipação:</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    {...field}
                                    value={field.value || "0"}
                                    disabled
                                    onChange={(e) =>
                                      field.onChange(
                                        e.target.value
                                          ? Number(e.target.value)
                                          : null
                                      )
                                    }
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          {/* Nova seção de Dados de Antecipação para Cartão Presente */}
                          <div className="pt-4 mt-4 border-t border-gray-100">
                            <h3 className="font-medium mb-3">
                              Dados de Antecipação
                            </h3>
                            <FormField
                              control={form.control}
                              name="lockCpAnticipationOrder"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value}
                                      onCheckedChange={(checked) => {
                                        field.onChange(!!checked);
                                        console.log(
                                          `Bloquear cartão presente para análise: ${checked}, lockCpAnticipationOrder: ${checked}`
                                        );
                                      }}
                                    />
                                  </FormControl>
                                  <div className="space-y-1 leading-none ml-2">
                                    <Label>
                                      Bloquear cartão presente para análise
                                    </Label>
                                  </div>
                                </FormItem>
                              )}
                            />
                          </div>
                        </>
                      )}
                    </div>

                    {/* Antecipação Cartão Não Presente */}
                    <div className="space-y-4">
                      {showCardNotPresent && (
                        <>
                          <h3 className="font-medium mb-3">
                            Antecipação Cartão Não Presente
                          </h3>
                          <FormField
                            control={form.control}
                            name="anticipationRiskFactorCnp"
                            render={({ field }) => (
                              <FormItem className="mb-3">
                                <FormLabel>Valor antecipável (%):</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    {...field}
                                    value={field.value || "0"}
                                    disabled
                                    onChange={(e) =>
                                      field.onChange(
                                        e.target.value
                                          ? Number(e.target.value)
                                          : null
                                      )
                                    }
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="waitingPeriodCnp"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Carência de Antecipação:</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    {...field}
                                    value={field.value || "0"}
                                    disabled
                                    onChange={(e) =>
                                      field.onChange(
                                        e.target.value
                                          ? Number(e.target.value)
                                          : null
                                      )
                                    }
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          {/* Nova seção de Dados de Antecipação para Cartão Não Presente */}
                          <div className="pt-4 mt-4 border-t border-gray-100">
                            <h3 className="font-medium mb-3">
                              Dados de Antecipação
                            </h3>
                            <FormField
                              control={form.control}
                              name="lockCnpAnticipationOrder"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value}
                                      onCheckedChange={(checked) => {
                                        field.onChange(!!checked);
                                        console.log(
                                          `Bloquear cartão não presente para análise: ${checked}, lockCnpAnticipationOrder: ${checked}`
                                        );
                                      }}
                                    />
                                  </FormControl>
                                  <div className="space-y-1 leading-none ml-2">
                                    <Label>
                                      Bloquear cartão não presente para análise
                                    </Label>
                                  </div>
                                </FormItem>
                              )}
                            />
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Card: Dados Operacionais */}
            <Card className="w-full md:col-span-1">
              <CardHeader className="flex flex-row items-center space-x-2">
                <Settings className="w-5 h-5" />
                <CardTitle>DADOS OPERACIONAIS</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="timezone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Fuso horário do terminal{" "}
                        <span className="text-red-500">*</span>
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value || "-0300"}
                        defaultValue={field.value || "-0300"}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select timezone" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {timezones.map((timezone) => (
                            <SelectItem
                              key={timezone.value}
                              value={timezone.value}
                            >
                              {timezone.label}
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
                  name="idSalesAgent"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Formato Jurídico <span className="text-red-500">*</span>
                      </FormLabel>
                      <Select
                        onValueChange={(value) => field.onChange(Number(value))}
                        value={field.value?.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {DDSalesAgent.map((item) => (
                            <SelectItem
                              key={item.value}
                              value={item.value.toString()}
                            >
                              {item.label}
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
                  name="theme"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Tema do estabelecimento{" "}
                        <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="SYSTEM DEFAULT"
                          disabled
                          value={field.value}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>

          {permissions?.includes("Atualizar") && (
            <div className="flex justify-end mt-4">
              <Button type="submit">
                {hasExistingConfiguration ? "Salvar" : "Avançar"}
              </Button>
            </div>
          )}
        </form>
      </Form>
    </div>
  );
}
