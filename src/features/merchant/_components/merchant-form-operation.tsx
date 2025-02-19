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
import { insertConfigurationFormAction, updateConfigurationFormAction } from "@/features/configuration/_actions/configuration-formActions";
import {
  ConfigurationOperationsSchema,
  schemaConfigurationOperations,
} from "@/features/configuration/schema/configurations-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Settings } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { configurations } from "../../../../drizzle/schema";
import { updateMerchantColumnsById } from "../server/merchant";

interface MerchantProps {
  Configuration: typeof configurations.$inferSelect;
  hasTaf: boolean;
  hastop: boolean;
  hasPix: boolean;
  merhcnatSlug: string;
  timerzone: string;
  idMerchant: number;
  setActiveTab: (tab: string) => void;
  activeTab: string;

}

export default function MerchantFormOperations({
  Configuration,
  hasTaf,
  hastop,
  hasPix,
  merhcnatSlug,
  timerzone,
  setActiveTab,
  activeTab,
  idMerchant,
}: MerchantProps) {
  const router = useRouter();

  const form = useForm<ConfigurationOperationsSchema>({
    resolver: zodResolver(schemaConfigurationOperations),
    defaultValues: {
      id: Configuration?.id || undefined,
      slug: Configuration?.slug || "",
      active: Configuration?.active || false,
      lockCpAnticipationOrder: Configuration?.lockCpAnticipationOrder || false,
      lockCnpAnticipationOrder:
        Configuration?.lockCnpAnticipationOrder || false,
      url: Configuration?.url || "",
      dtinsert: Configuration?.dtinsert
        ? new Date(Configuration.dtinsert)
        : new Date(),
      dtupdate: Configuration?.dtupdate
        ? new Date(Configuration.dtupdate)
        : new Date(),
      hasTaf: hasTaf,
      hastop: hastop,
      hasPix: hasPix,
      merhcnatSlug: merhcnatSlug,
      cardPresent: false,
      cardNotPresent: false,
      timerzone: timerzone,
      theme: "SYSTEM DEFAULT",
      accessProfile: "merchant-cp",
    },
  });

  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams || "");

  const refreshPage = (id: number) => {
    setActiveTab(activeTab);
    //add new objects in searchParams
    router.push(`/portal/merchants/${id}?${params.toString()}`);
  };

  const onSubmit = async (data: ConfigurationOperationsSchema) => {
    try {
      let idConfiguration = data.id;

      // Criar ou atualizar configuração
      if (data?.id) {
        await updateConfigurationFormAction(data);
      } else {
        idConfiguration = await insertConfigurationFormAction(data);
      }

      console.log("idConfiguration", idConfiguration);
  
      // Atualizar merchant com o ID da configuração (novo ou existente)
      await updateMerchantColumnsById(idMerchant, {
        idConfiguration: idConfiguration!, // Usar o ID obtido da criação ou o existente
        hasTef: data.hasTaf || false,
        hasTop: data.hastop || false,
        hasPix: data.hasPix || false,
      });
  
      refreshPage(idMerchant);
    } catch (error) {
      console.error("Error submitting form:", error);
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
                      TEF Terminal <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={(value) => field.onChange(value === "true")}
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
                      Terminal Tap On Phone{" "}
                      <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={(value) => field.onChange(value === "true")}
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
                      <FormLabel className="ml-2">Card Not Present</FormLabel>
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
                      <Input {...field} placeholder="https://dock.tech/" />
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
                        onValueChange={(value) => field.onChange(value === "true")}
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
                name="timerzone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Timezone do Terminal{" "}
                      <span className="text-red-500">*</span>
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={
                        field.value === "-0300" ? "UTC-03:00" : field.value
                      }
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select timezone" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="UTC-03:00">
                          (UTC-03:00) Brasilia
                        </SelectItem>
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
                      Tema do estabelecimento <span className="text-red-500">*</span>
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

              <FormField
                control={form.control}
                name="accessProfile"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Perfil de acesso <span className="text-red-500">*</span>
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o perfil" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="merchant-cp">
                          Merchant CP sem Antecipação
                        </SelectItem>
                        <SelectItem value="teste-default">
                          Teste Default
                        </SelectItem>
                        <SelectItem value="perfil-padrao">
                          Perfil Padrão de EC
                        </SelectItem>
                        <SelectItem value="role-default">
                          Role Default
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
          <div className="flex justify-end mt-4">
          <Button type="submit">Avançar</Button>
        </div>  
        </form>
      </Form>
    </div>
  );
}
