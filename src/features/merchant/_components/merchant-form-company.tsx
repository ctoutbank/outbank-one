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
import { AddressSchema, MerchantSchema, schemaAddress, schemaMerchant } from "../schema/merchant-schema";

import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { addresses, merchants } from "../../../../drizzle/schema";
import { insertAddressFormAction, insertMerchantFormAction, updateMerchantFormAction } from "../_actions/merchant-formActions";
import { CnaeMccDropdown, LegalNatureDropdown } from "../server/merchant";

interface MerchantProps {
  merchant: typeof merchants.$inferSelect & {cnae:string, mcc:string};
  address: typeof addresses.$inferSelect;
  Cnae: string;
  Mcc: string;
  DDLegalNature: LegalNatureDropdown[];
  DDCnaeMcc: CnaeMccDropdown[];
  activeTab: string;
}

export default function MerchantFormCompany({ 
  merchant, 
  address, 
  Cnae, 
  Mcc, 
  DDLegalNature, 
  DDCnaeMcc = [],
  activeTab
}: MerchantProps) {

  const [openCnae, setOpenCnae] = useState(false)
  const [openMcc,setOpenMcc]= useState(false);

  if (!DDCnaeMcc) {
    return null; // ou algum componente de loading/erro
  }

  const handleCnaeSelect = (cnaeMcc: CnaeMccDropdown) => {
    form.setValue("cnae", cnaeMcc.cnae);
    form.setValue("mcc", cnaeMcc.mcc);
    setOpenCnae(false);
  };

  const handleMccSelect = (cnaeMcc: CnaeMccDropdown) => {
    form.setValue("cnae", cnaeMcc.cnae);
    form.setValue("mcc", cnaeMcc.mcc);
    setOpenMcc(false);
  };
  
  const router = useRouter();
  const form = useForm<MerchantSchema>({
    resolver: zodResolver(schemaMerchant),
    defaultValues: {
      id: merchant?.id ? Number(merchant.id) : undefined,
      name: merchant?.name || "",
      corporateName: merchant?.corporateName || "",
      email: merchant?.email || "",
      idDocument: merchant?.idDocument || "",
      openingDate: merchant?.openingDate ? new Date(merchant.openingDate) : undefined,
      openingDays: merchant?.openingDays || "",
      openingHour: merchant?.openingHour || "",
      closingHour: merchant?.closingHour || "",
      municipalRegistration: merchant?.municipalRegistration || "",
      stateSubcription: merchant?.stateSubcription || "",
      revenue: merchant?.revenue ? Number(merchant.revenue) : undefined,
      establishmentFormat: merchant?.establishmentFormat || "",
      legalPerson: merchant?.legalPerson || "",
      cnae: Cnae || "",
      mcc: Mcc || "",
      number: merchant?.number || "",
      areaCode: merchant?.areaCode || "",
      legal_nature: DDLegalNature[0].label || "",
      
    
      
     
      // campos do endereço virão de outra tabela
      // você precisará adicionar os campos do endereço aqui se estiverem disponíveis
    },

    
  });

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
    }
  });

  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams || "");

  const refreshPage = (id: number) => {
    
    params.set("tab", activeTab);
    
    //add new objects in searchParams
    router.push(`/portal/merchants/${id}?${params.toString()}`);
  };

  const onSubmit = async (data: MerchantSchema) => {
    try {
      // Validar o formulário de endereço antes de submeter
      const addressFormValid = await form1.trigger();
      if (!addressFormValid) {
        console.error("Formulário de endereço inválido");
        return;
      }

      // Obter os dados do formulário de endereço
      const addressData = form1.getValues();
      
      // Criar o endereço
      const addressId = await insertAddressFormAction(addressData);
      
      // Criar o merchant com o ID do endereço
      const merchantData = {
        ...data,
        idAddress: addressId
      };

      let idMerchant = data.id;

      if (data?.id) {
        await updateMerchantFormAction(merchantData);
      } else {
        
       idMerchant = await insertMerchantFormAction(merchantData);
      }
      
    
      refreshPage(idMerchant || 0);
     
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const onSubmitAddress = async (data: AddressSchema) => {
    try {
      await insertAddressFormAction(data);
     } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
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
                          maxLength={14}
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
                        Razão Social <span className="text-red-500">*</span>
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
                        Nome Fantasia <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                </div>
                <div className="grid grid-cols-2 gap-4 ">
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
                  <div> </div>
                 
                </div>


               
                <div className="grid grid-cols-2 gap-4">
  <FormField
    control={form.control}
    name="idCategory"
    render={({ field }) => (
      <FormItem>
        <FormLabel>CNAE <span className="text-red-500">*</span></FormLabel>
        <Select 
          onValueChange={(value) => {
            const selected = DDCnaeMcc.find(item => item.value === value);
            if (selected) {
              field.onChange(Number(value));
              const mccField = form.getFieldState('mcc');
              if (mccField) {
                form.setValue('mcc', selected.mcc, { shouldValidate: false });
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
                <SelectItem key={item.value} value={item.value}>
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
            const selected = DDCnaeMcc.find(item => item.mcc === value);
            if (selected) {
              form.setValue('idCategory', Number(selected.value));
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
                <FormField
  control={form.control}
  name="openingDays"
  render={({ field }) => (
    <FormItem>
      <FormLabel>
        Dias de Funcionamento <span className="text-red-500">*</span>
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
          <div key={id} className="flex items-center space-x-2">
            <Checkbox
              id={id}
              checked={field.value ? field.value[index] === "1" : false}
              onCheckedChange={(checked) => {
                const currentValue = field.value || "0000000";
                const valueArray = (typeof currentValue === 'string' ? currentValue.split('') : currentValue);
                valueArray[index] = checked ? "1" : "0";
                field.onChange(valueArray.join(""));
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
                

                <FormField
                  control={form.control}
                  name="openingDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Data de Abertura <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          {...field}
                          value={field.value ? field.value.toISOString().split('T')[0] : ''}
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
                  name="legal_nature"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Formato Jurídico <span className="text-red-500">*</span>
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
                          {DDLegalNature.map((item) => (
                            <SelectItem key={item.value} value={item.label}>
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
                                  <SelectValue placeholder="Selecione" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="PR">PR</SelectItem>
                                <SelectItem value="SP">SP</SelectItem>
                                <SelectItem value="RJ">RJ</SelectItem>
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
                              disabled
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
        <div className="flex justify-end mt-4">
          <Button type="submit">Avançar</Button>
        </div>
      </form>
    </Form>
  );
}
