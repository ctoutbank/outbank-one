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
import { timezones } from "@/lib/lookuptables";
import { zodResolver } from "@hookform/resolvers/zod";
import { Settings } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { configurations } from "../../../../drizzle/schema";
import { updateMerchantColumnsById } from "../server/merchant";

interface MerchantProps {
  Configuration: typeof configurations.$inferSelect;
  hasTaf: boolean;
  hastop: boolean;
  hasPix: boolean;
  merhcnatSlug: string;
  timezone: string;
  idMerchant: number;
  setActiveTab: (tab: string) => void;
  activeTab: string;
  permissions: string[];
  idConfiguration?: number;
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
}: MerchantProps) {
  const router = useRouter();
  const [loadedConfiguration] = useState<
    typeof configurations.$inferSelect | null
  >(null);

  // Verificar explicitamente se o merchant já tem uma configuração associada
  const hasExistingConfiguration = !!idConfiguration;

  // Usar a configuração carregada do banco ou a recebida via props
  const configToUse = loadedConfiguration || Configuration;

  const form = useForm<ConfigurationOperationsSchema>({
    resolver: zodResolver(schemaConfigurationOperations),
    defaultValues: {
      // Usar o idConfiguration do merchant se disponível (mais confiável)
      id: idConfiguration || Configuration?.id || undefined,
      slug: configToUse?.slug || "",
      active: configToUse?.active || false,
      lockCpAnticipationOrder: configToUse?.lockCpAnticipationOrder || false,
      lockCnpAnticipationOrder: configToUse?.lockCnpAnticipationOrder || false,
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
      cardPresent: false,
      cardNotPresent: false,
      timezone: timezone,
      theme: "SYSTEM DEFAULT",
    },
  });

  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams || "");

  const refreshPage = (id: number) => {
    params.set("tab", activeTab);
    setActiveTab(activeTab);
    //add new objects in searchParams
    router.push(`/portal/merchants/${id}?${params.toString()}`);
  };

  // Buscar a configuração completa do banco quando temos idConfiguration

  const onSubmit = async (data: ConfigurationOperationsSchema) => {
    try {
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
        await updateConfigurationFormAction(data);
      } else {
        idConfigurationForMerchant = await insertConfigurationFormAction(data);
      } // Atualizar merchant com o ID da configuração (novo ou existente)
      const merchantUpdates = {
        idConfiguration: idConfigurationForMerchant!, // Usar o ID obtido da criação ou o existente
        hasTef: data.hasTaf || false,
        hasTop: data.hastop || false,
        hasPix: data.hasPix || false,
        timezone: data.timezone || "",
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
          <Card className="w-full">
            <CardHeader className="flex flex-row items-center space-x-2">
              <Settings className="w-5 h-5" />
              <CardTitle>Capturar</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="cardPresent"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none ml-2">
                      <FormLabel>Cartão Presente</FormLabel>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="hasTaf"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Terminal TEF <span className="text-red-500">*</span>
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
                          <RadioGroupItem value="false" id="tap-nao" />
                          <Label htmlFor="tap-nao">Não</Label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cardNotPresent"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="ml-2">
                        Cartão Não Presente
                      </FormLabel>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Url <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="https://dock.tech/"
                        value={field.value || configToUse?.url || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
            </CardContent>
          </Card>

          <Card className="w-full mt-4">
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
                      Timezone do Terminal{" "}
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
                name="merhcnatSlug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Cliente <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="DOCK"
                        value={field.value}
                      />
                    </FormControl>
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
