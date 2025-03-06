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
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { MapPin, User } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { addresses, contacts } from "../../../../drizzle/schema";
import {
  insertContactFormAction,
  updateContactFormAction,
} from "../_actions/contact-formActions";
import { insertAddressFormAction } from "../_actions/merchant-formActions";
import { ContactSchema, schemaContact } from "../schema/contact-schema";
import { AddressSchema, schemaAddress } from "../schema/merchant-schema";
import { useState, useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { getMerchantAddressId } from "../server/adderres";


interface MerchantProps {
  Contact: typeof contacts.$inferSelect;
  Address: typeof addresses.$inferSelect;
  activeTab: string;
  idMerchant: number;
  setActiveTab: (tab: string) => void;
}

export default function MerchantFormcontact({
  Contact,
  Address,
  activeTab,
  idMerchant,
  setActiveTab,
}: MerchantProps) {
  const router = useRouter();
  const form = useForm<ContactSchema>({
    resolver: zodResolver(schemaContact),
    defaultValues: {
      id: Contact?.id ? Number(Contact.id) : undefined,
      name: Contact?.name || "",
      idDocument: Contact?.idDocument || "",
      email: Contact?.email || "",
      areaCode: Contact?.areaCode || "",
      number: Contact?.number || "",
      phoneType: Contact?.phoneType || "",
      birthDate: Contact?.birthDate ? new Date(Contact.birthDate) : undefined,
      mothersName: Contact?.mothersName || "",
      isPartnerContact: Contact?.isPartnerContact || false,
      isPep: Contact?.isPep || false,
      idMerchant: idMerchant,
      slugMerchant: Contact?.slugMerchant || "",
      idAddress: Contact?.idAddress || undefined,
      icNumber: Contact?.icNumber || "",
      icDateIssuance: Contact?.icDateIssuance
        ? new Date(Contact.icDateIssuance)
        : undefined,
      icDispatcher: Contact?.icDispatcher || "",
      icFederativeUnit: Contact?.icFederativeUnit || "",
    },
  });

  const form1 = useForm<AddressSchema>({
    resolver: zodResolver(schemaAddress),
    defaultValues: {
      id: Address?.id ? Number(Address.id) : undefined,
      zipCode: Address?.zipCode || "",
      street: Address?.streetAddress || "",
      number: Address?.streetNumber || "",
      complement: Address?.complement || "",
      neighborhood: Address?.neighborhood || "",
      city: Address?.city || "",
      state: Address?.state || "",
      country: Address?.country || "",
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

  const onSubmit = async (data: ContactSchema) => {
    try {
      console.log("idMerchant", idMerchant);
      const addressFormValid = await form1.trigger();
      if (!addressFormValid) {
        console.error("Formulário de endereço inválido");
        return;
      }
      const addressData = form1.getValues();
      const addressId = await insertAddressFormAction(addressData);

      const contactData = {
        ...data,
        idAddress: addressId,
        idMerchant: idMerchant,
      };
      contactData.phoneType = contactData.number?.startsWith("9") ? "C" : "P";
      console.log(contactData);

      let merchantIdToRefresh = idMerchant;
      
      if (data?.id) {
        await updateContactFormAction(contactData);
      } else {
        const newContactId = await insertContactFormAction(contactData);
        merchantIdToRefresh = newContactId;
      }

      refreshPage(merchantIdToRefresh || 0);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const [merchantAddress, setMerchantAddress] = useState<typeof addresses.$inferSelect | null>(null);
  const [useEstablishmentAddress, setUseEstablishmentAddress] = useState(false);

  const fetchMerchantAddress = async () => {
    if (idMerchant) {
      try {
        console.log("Buscando endereço para o merchant ID:", idMerchant);
        const address = await getMerchantAddressId(idMerchant);
        console.log("Endereço do merchant:", address);
        setMerchantAddress(address);
        
        if (useEstablishmentAddress && address) {
          fillFormWithMerchantAddress(address);
        }
        
        return address;
      } catch (error) {
        console.error("Erro ao buscar endereço do merchant:", error);
        return null;
      }
    }
    return null;
  };

  const fillFormWithMerchantAddress = (address: typeof addresses.$inferSelect) => {
    console.log("Preenchendo formulário com endereço:", address);
    
    form1.setValue("street", address.streetAddress || "");
    form1.setValue("number", address.streetNumber || "");
    form1.setValue("complement", address.complement || "");
    form1.setValue("neighborhood", address.neighborhood || "");
    form1.setValue("city", address.city || "");
    form1.setValue("state", address.state || "");
    form1.setValue("zipCode", address.zipCode || "");
    form1.setValue("country", address.country || "");
    
    console.log("Valores do formulário após preenchimento:", form1.getValues());
  };

  useEffect(() => {
    fetchMerchantAddress();
  }, [idMerchant]);

  useEffect(() => {
    if (useEstablishmentAddress && merchantAddress) {
      fillFormWithMerchantAddress(merchantAddress);
    } else if (!useEstablishmentAddress && Address) {
      console.log("Restaurando valores do endereço do contato");
      
      form1.setValue("id", Address.id);
      form1.setValue("street", Address.streetAddress || "");
      form1.setValue("number", Address.streetNumber || "");
      form1.setValue("complement", Address.complement || "");
      form1.setValue("neighborhood", Address.neighborhood || "");
      form1.setValue("city", Address.city || "");
      form1.setValue("state", Address.state || "");
      form1.setValue("zipCode", Address.zipCode || "");
      form1.setValue("country", Address.country || "");
      
      console.log("Valores do formulário após restauração:", form1.getValues());
    }
  }, [useEstablishmentAddress, merchantAddress, form1, Address]);

  const onSubmitAddress = async (data: AddressSchema) => {
    try {
      if (useEstablishmentAddress && merchantAddress) {
        console.log("Usando endereço do estabelecimento para o contato");
        
        const contactData = {
          ...form.getValues(),
          idAddress: merchantAddress.id
        };
        
        console.log("Atualizando contato com ID do endereço do merchant:", contactData);
        
        await updateContactFormAction(contactData);
        
        refreshPage(idMerchant);
      } else {
        if (data.id) {
          await insertAddressFormAction(data);
        } else {
          const address = await insertAddressFormAction(data);
          
          const contactData = {
            ...form.getValues(),
            idAddress: address
          };
          
          await updateContactFormAction(contactData);
        }
        
        refreshPage(idMerchant);
      }
    } catch (error) {
      console.error("Erro ao submeter endereço:", error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="mx-auto">
        <Card className="w-full">
          <CardHeader className="flex flex-row items-center space-x-2">
            <User className="w-5 h-5" />
            <CardTitle>Dados Pessoais</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="isPartnerContact"
              render={({ field }: { field: any }) => (
                <FormItem>
                  <FormLabel>
                    Sócio ou Proprietário{" "}
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
                        <RadioGroupItem value="true" id="owner-yes" />
                        <Label htmlFor="owner-yes">Sim</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="false" id="owner-no" />
                        <Label htmlFor="owner-no">Não</Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isPep"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Se considera PEP (Pessoa Exposta Politicamente)?{" "}
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
                        <RadioGroupItem value="true" id="pep-yes" />
                        <Label htmlFor="pep-yes">Sim</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="false" id="pep-no" />
                        <Label htmlFor="pep-no">Não</Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="idDocument"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    CPF <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      maxLength={11}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="icNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Número do RG <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value?.toString() || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="icDateIssuance"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Data de emissão <span className="text-red-500">*</span>
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
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="icDispatcher"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Órgão expedidor <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value?.toString() || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="icFederativeUnit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      UF <span className="text-red-500">*</span>
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value?.toString() || ""}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="PR">PR</SelectItem>
                        <SelectItem value="SP">SP</SelectItem>
                        <SelectItem value="RJ">RJ</SelectItem>
                        <SelectItem value="AC">AC</SelectItem>
                        <SelectItem value="AL">AL</SelectItem>
                        <SelectItem value="AP">AP</SelectItem>
                        <SelectItem value="AM">AM</SelectItem>
                        <SelectItem value="BA">BA</SelectItem>
                        <SelectItem value="CE">CE</SelectItem>
                        <SelectItem value="DF">DF</SelectItem>
                        <SelectItem value="ES">ES</SelectItem>
                        <SelectItem value="GO">GO</SelectItem>
                        <SelectItem value="MA">MA</SelectItem>
                        <SelectItem value="MT">MT</SelectItem>
                        <SelectItem value="MS">MS</SelectItem>
                        <SelectItem value="MG">MG</SelectItem>
                        <SelectItem value="PA">PA</SelectItem>
                        <SelectItem value="PB">PB</SelectItem>
                        <SelectItem value="PE">PE</SelectItem>
                        <SelectItem value="PI">PI</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Nome Completo <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value?.toString() || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="birthDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Data de Nascimento <span className="text-red-500">*</span>
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
              name="mothersName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Nome da mãe <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value?.toString() || ""} />
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
                    E-mail <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="email"
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
                control={form.control}
                name="areaCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Telefone (DDD) <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        maxLength={2}
                        value={field.value?.toString() || ""}
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
                  <FormItem>
                    <FormLabel>
                      Número <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        maxLength={9}
                        value={field.value?.toString() || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>
        <Card className="w-full mt-4">
          <CardHeader className="flex flex-row items-center space-x-2">
            <MapPin className="w-5 h-5" />
            <CardTitle>Endereço</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <Checkbox 
                id="useEstablishmentAddress" 
                checked={useEstablishmentAddress}
                onCheckedChange={(checked) => {
                  const isChecked = checked === true;
                  console.log("Checkbox alterada para:", isChecked);
                  setUseEstablishmentAddress(isChecked);
                  
                  if (isChecked && merchantAddress) {
                    fillFormWithMerchantAddress(merchantAddress);
                  }
                }}
              />
              <label
                htmlFor="useEstablishmentAddress"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Usar endereço do estabelecimento
              </label>
            </div>

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
                          disabled={useEstablishmentAddress}
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
                          disabled={useEstablishmentAddress}
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
                            disabled={useEstablishmentAddress}
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
                            disabled={useEstablishmentAddress}
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
                          disabled={useEstablishmentAddress}
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
                            disabled={useEstablishmentAddress}
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
                          disabled={useEstablishmentAddress}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="PR">PR</SelectItem>
                            <SelectItem value="SP">SP</SelectItem>
                            <SelectItem value="RJ">RJ</SelectItem>
                            <SelectItem value="AC">AC</SelectItem>
                            <SelectItem value="AL">AL</SelectItem>
                            <SelectItem value="AP">AP</SelectItem>
                            <SelectItem value="AM">AM</SelectItem>
                            <SelectItem value="BA">BA</SelectItem>
                            <SelectItem value="CE">CE</SelectItem>
                            <SelectItem value="DF">DF</SelectItem>
                            <SelectItem value="ES">ES</SelectItem>
                            <SelectItem value="GO">GO</SelectItem>
                            <SelectItem value="MA">MA</SelectItem>
                            <SelectItem value="MT">MT</SelectItem>
                            <SelectItem value="MS">MS</SelectItem>
                            <SelectItem value="MG">MG</SelectItem>
                            <SelectItem value="PA">PA</SelectItem>
                            <SelectItem value="PB">PB</SelectItem>
                            <SelectItem value="PE">PE</SelectItem>
                            <SelectItem value="PI">PI</SelectItem>
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
                          disabled={useEstablishmentAddress}
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
        <div className="flex justify-end mt-4">
          <Button type="submit">Avançar</Button>
        </div>
      </form>
    </Form>
  );
}
