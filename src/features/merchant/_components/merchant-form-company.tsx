"use client";

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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { zodResolver } from "@hookform/resolvers/zod";
import { Building2, MapPin } from "lucide-react";

import { useForm } from "react-hook-form";
import {
  AddressSchema,
  MerchantSchema,
  schemaAddress,
  schemaMerchant,
} from "../schema/merchant-schema";

import { Button } from "@/components/ui/button";
import { legalPersonTypes, states } from "@/lib/lookuptables/lookuptables";
import { formatCNPJ } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { addresses, merchants } from "../../../../drizzle/schema";
import {
  insertAddressFormAction,
  insertMerchantFormAction,
  updateAddressFormAction,
  updateMerchantFormAction,
} from "../_actions/merchant-formActions";
import {
  CnaeMccDropdown,
  EstablishmentFormatDropdown,
  LegalNatureDropdown,
} from "../server/merchant";

interface MerchantProps {
  merchant: typeof merchants.$inferSelect & { cnae: string; mcc: string };
  address: typeof addresses.$inferSelect;
  Cnae: string;
  Mcc: string;
  DDLegalNature: LegalNatureDropdown[];
  DDCnaeMcc: CnaeMccDropdown[];
  activeTab: string;
  DDEstablishmentFormat: EstablishmentFormatDropdown[];
  permissions: string[];

  setActiveTab: (tab: string) => void;
}

export default function MerchantFormCompany({
  merchant,
  address,

  Mcc,
  DDLegalNature,
  DDEstablishmentFormat,
  DDCnaeMcc = [],
  activeTab,
  setActiveTab,
  permissions,
}: MerchantProps) {
  const [isRendered, setIsRendered] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const form = useForm<MerchantSchema>({
    resolver: zodResolver(schemaMerchant),
    defaultValues: {
      id: merchant?.id ? Number(merchant.id) : undefined,
      name: merchant?.name || "",
      corporateName: merchant?.corporateName || "",
      email: merchant?.email || "",
      idDocument: merchant?.idDocument || "",
      openingDate: merchant?.openingDate
        ? new Date(merchant.openingDate)
        : undefined,
      openingDays: merchant?.openingDays || "0000000",
      openingHour: merchant?.openingHour || "",
      closingHour: merchant?.closingHour || "",
      municipalRegistration: merchant?.municipalRegistration || "",
      stateSubcription: merchant?.stateSubcription || "",
      revenue: merchant?.revenue ? Number(merchant.revenue) : undefined,
      establishmentFormat: merchant?.establishmentFormat || "",
      legalPerson: merchant?.legalPerson || "",
      cnae: String(merchant?.idCategory) || "",
      mcc: Mcc || "",
      number: merchant?.number || "",
      areaCode: merchant?.areaCode || "",
      idLegalNature: merchant?.idLegalNature
        ? Number(merchant.idLegalNature)
        : undefined,
      slugLegalNature: merchant?.slugLegalNature || "",
      idMerchantBankAccount: merchant?.idMerchantBankAccount || null,
      // campos do endereço virão de outra tabela
      // você precisará adicionar os campos do endereço aqui se estiverem disponíveis
    },
  });
  console.log("legalPerson", merchant?.legalPerson);

  const form1 = useForm<AddressSchema>({
    resolver: zodResolver(schemaAddress),
    defaultValues: {
      id: address?.id ? Number(address.id) : undefined,
      zipCode: address?.zipCode || "",
      street: address?.streetAddress || "",
      number: address?.streetNumber || "",
      complement: address?.complement || "",
      neighborhood: address?.neighborhood || "",
      city: address?.city || "",
      state: address?.state || "",
      country: address?.country || "",
    },
  });

  useEffect(() => {
    setIsRendered(true);
  }, []);

  if (!DDCnaeMcc) {
    return null; // ou algum componente de loading/erro
  }

  const params = new URLSearchParams(searchParams || "");

  const refreshPage = (id: number) => {
    params.set("tab", activeTab);
    setActiveTab(activeTab);

    //add new objects in searchParams
    router.push(`/portal/merchants/${id}?${params.toString()}`);
  };

  const onSubmit = async (data: MerchantSchema) => {
    try {
      console.log(data);
      // Validar o formulário de endereço antes de submeter
      const addressFormValid = await form1.trigger();
      if (!addressFormValid) {
        return;
      }

      // Obter os dados do formulário de endereço
      const addressData = form1.getValues();

      let addressId;

      // Atualizar endereço existente ou criar um novo
      if (addressData.id) {
        await updateAddressFormAction(addressData);
        addressId = addressData.id;
      } else {
        // Criar o endereço
        addressId = await insertAddressFormAction(addressData);
      }
      if (!data.idCategory && data.cnae) {
        data.idCategory = Number(data.cnae);
      }

      // Criar o merchant com o ID do endereço
      const merchantData = {
        ...data,
        idAddress: addressId,
      };

      let idMerchant = data.id;
      merchantData.phoneType = merchantData.number?.startsWith("9") ? "C" : "P";

      if (data?.id) {
        console.log("dataid", data.id);
        console.log("merchantData", merchantData);

        // Garantir que idCategory seja um número válido
        if (merchantData.cnae) {
          merchantData.idCategory = Number(merchantData.cnae);
        }

        // Garantir que idLegalNature seja um número válido
        if (
          !merchantData.idLegalNature ||
          isNaN(Number(merchantData.idLegalNature))
        ) {
          return;
        }

        try {
          await updateMerchantFormAction(merchantData);

          alert("Dados Atualizados com sucesso!");

          // Apenas recarregar a página atual, sem alterar a aba
          router.refresh();
        } catch (error) {
          console.error("Erro ao salvar configuração:", error);
        }
      } else {
        try {
          idMerchant = await insertMerchantFormAction(merchantData);

          // Navegar para a próxima aba apenas quando estiver criando um novo merchant
          refreshPage(idMerchant || 0);
        } catch (error) {
          console.error("Erro ao salvar configuração:", error);
        }
      }
    } catch (error) {
      console.error("Erro ao salvar configuração:", error);
    }
  };

  const onSubmitAddress = async (data: AddressSchema) => {
    try {
      await insertAddressFormAction(data);
    } catch (error) {
      console.error("Erro ao salvar configuração:", error);
    }
  };

  return (
    <>
      {isRendered ? (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mx-auto">
            <Tabs defaultValue="company" className="mb-6">
              <TabsContent value="company" className="space-y-6">
                <Card className="w-full">
                  <CardHeader className="flex flex-row items-center space-x-2">
                    <Building2 className="w-5 h-5" />
                    <CardTitle>Empresa</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="idDocument"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              CNPJ <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                value={
                                  field.value ? formatCNPJ(field.value) : ""
                                }
                                onChange={(e) => {
                                  const value = e.target.value.replace(
                                    /\D/g,
                                    ""
                                  );
                                  field.onChange(value);
                                }}
                                maxLength={18}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Email <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input type="email" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="corporateName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Razão Social{" "}
                              <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Nome Fantasia{" "}
                              <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4 ">
                      <div className="flex items-center mt-4">
                        <FormField
                          control={form.control}
                          name="is_affiliate"
                          render={({ field }) => (
                            <FormItem className="flex items-center space-x-2">
                              <FormControl>
                                <Checkbox
                                  checked={field.value || false}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <FormLabel>É uma filial?</FormLabel>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <FormField
                          control={form.control}
                          name="areaCode"
                          render={({ field }) => (
                            <FormItem className="w-1/6">
                              <FormLabel>
                                DDD <span className="text-red-500">*</span>
                              </FormLabel>
                              <FormControl>
                                <Input
                                  value={field.value || ""}
                                  onChange={field.onChange}
                                  maxLength={2}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="number"
                          render={({ field }) => (
                            <FormItem className="w-5/6">
                              <FormLabel>
                                Telefone <span className="text-red-500">*</span>
                              </FormLabel>
                              <FormControl>
                                <Input
                                  value={field.value || ""}
                                  onChange={field.onChange}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="cnae"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              CNAE <span className="text-red-500">*</span>
                            </FormLabel>
                            <Select
                              onValueChange={(value) => {
                                const selected = DDCnaeMcc.find(
                                  (item) => item.value === value
                                );
                                if (selected) {
                                  field.onChange(value);
                                  form.setValue("idCategory", Number(value), {
                                    shouldValidate: true,
                                  });
                                  const mccField = form.getFieldState("mcc");
                                  if (mccField) {
                                    form.setValue("mcc", selected.mcc, {
                                      shouldValidate: false,
                                    });
                                  }
                                }
                              }}
                              value={field.value?.toString() || undefined}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione o CNAE" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectGroup>
                                  {DDCnaeMcc.map((item) => (
                                    <SelectItem
                                      key={item.value}
                                      value={item.value}
                                    >
                                      {item.label}
                                    </SelectItem>
                                  ))}
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="mcc"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>MCC</FormLabel>
                            <Select
                              onValueChange={(value) => {
                                const selected = DDCnaeMcc.find(
                                  (item) => item.mcc === value
                                );
                                if (selected) {
                                  form.setValue(
                                    "idCategory",
                                    Number(selected.value)
                                  );
                                  field.onChange(value);
                                }
                              }}
                              value={field.value || undefined}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione o MCC" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectGroup>
                                  {DDCnaeMcc.map((item) => (
                                    <SelectItem key={item.mcc} value={item.mcc}>
                                      {`${item.mcc} - ${item.label}`}
                                    </SelectItem>
                                  ))}
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="openingDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Data de Abertura{" "}
                              <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="date"
                                {...field}
                                value={
                                  field.value
                                    ? field.value.toISOString().split("T")[0]
                                    : ""
                                }
                                onChange={(e) => {
                                  const date = new Date(e.target.value);
                                  field.onChange(date);
                                }}
                                max={new Date().toISOString().split("T")[0]}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="openingDays"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Dias de Funcionamento{" "}
                              <span className="text-red-500">*</span>
                            </FormLabel>
                            <div className="grid grid-cols-4 gap-2">
                              {[
                                { id: "dom", label: "Domingo" },
                                { id: "seg", label: "Segunda" },
                                { id: "ter", label: "Terça" },
                                { id: "qua", label: "Quarta" },
                                { id: "qui", label: "Quinta" },
                                { id: "sex", label: "Sexta" },
                                { id: "sab", label: "Sábado" },
                              ].map(({ id, label }, index) => (
                                <div
                                  key={id}
                                  className="flex items-center space-x-2"
                                >
                                  <Checkbox
                                    id={id}
                                    checked={
                                      (field.value || "0000000").charAt(
                                        index
                                      ) === "1"
                                    }
                                    onCheckedChange={(checked) => {
                                      const currentValue =
                                        field.value || "0000000";
                                      const newValue =
                                        currentValue.substring(0, index) +
                                        (checked ? "1" : "0") +
                                        currentValue.substring(index + 1);
                                      field.onChange(newValue);
                                    }}
                                  />
                                  <Label htmlFor={id}>{label}</Label>
                                </div>
                              ))}
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="openingHour"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Horário de Abertura{" "}
                              <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="time"
                                {...field}
                                value={field.value || ""}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="closingHour"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Horário de Fechamento{" "}
                              <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="time"
                                {...field}
                                value={field.value || ""}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="municipalRegistration"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Inscrição Municipal</FormLabel>
                            <FormControl>
                              <Input {...field} value={field.value || ""} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="stateSubcription"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Inscrição Estadual</FormLabel>
                            <FormControl>
                              <Input {...field} value={field.value || ""} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="revenue"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Receita <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min="0"
                                step="0.01"
                                {...field}
                                onChange={(e) => {
                                  const value = parseFloat(e.target.value);
                                  field.onChange(isNaN(value) ? 0 : value);
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="idLegalNature"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Formato Jurídico{" "}
                              <span className="text-red-500">*</span>
                            </FormLabel>
                            <Select
                              onValueChange={(value) =>
                                field.onChange(Number(value))
                              }
                              value={field.value?.toString()}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {DDLegalNature.map((item) => (
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
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="legalPerson"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Tipo de Pessoa{" "}
                              <span className="text-red-500">*</span>
                            </FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value || ""}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {legalPersonTypes.map((item) => (
                                  <SelectItem
                                    key={item.value}
                                    value={item.value}
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
                        name="establishmentFormat"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Formato de estabelecimento{" "}
                              <span className="text-red-500">*</span>
                            </FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value || ""}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {DDEstablishmentFormat.map((item) => (
                                  <SelectItem
                                    key={item.value}
                                    value={item.value}
                                  >
                                    {item.value} - {item.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4"></div>
                  </CardContent>
                </Card>

                <Card className="w-full mt-4">
                  <CardHeader className="flex flex-row items-center space-x-2">
                    <MapPin className="w-5 h-5" />
                    <CardTitle>Endereço</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Form {...form1}>
                      <form onSubmit={form1.handleSubmit(onSubmitAddress)}>
                        <FormField
                          control={form1.control}
                          name="zipCode"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                CEP <span className="text-red-500">*</span>
                              </FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  maxLength={8}
                                  value={field.value?.toString() || ""}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form1.control}
                          name="street"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                Rua <span className="text-red-500">*</span>
                              </FormLabel>
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

                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form1.control}
                            name="number"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>
                                  Número <span className="text-red-500">*</span>
                                </FormLabel>
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

                          <FormField
                            control={form1.control}
                            name="complement"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Complemento</FormLabel>
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
                        </div>

                        <FormField
                          control={form1.control}
                          name="neighborhood"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                Bairro <span className="text-red-500">*</span>
                              </FormLabel>
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

                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form1.control}
                            name="city"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>
                                  Cidade <span className="text-red-500">*</span>
                                </FormLabel>
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

                          <FormField
                            control={form1.control}
                            name="state"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>
                                  Estado <span className="text-red-500">*</span>
                                </FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value?.toString() || ""}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Selecione o estado" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {states.map((state) => (
                                      <SelectItem
                                        key={state.value}
                                        value={state.value}
                                      >
                                        {state.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={form1.control}
                          name="country"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                País <span className="text-red-500">*</span>
                              </FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  defaultValue="Brasil"
                                  value={field.value?.toString() || ""}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
            {permissions?.includes("Atualizar") && (
              <div className="flex justify-end mt-4">
                <Button type="submit">
                  {merchant?.id ? "Salvar" : "Avançar"}
                </Button>
              </div>
            )}
          </form>
        </Form>
      ) : (
        <div>Loading...</div>
      )}
    </>
  );
}
