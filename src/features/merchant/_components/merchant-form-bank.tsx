"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Landmark } from "lucide-react"
import { merchantPixAccountSchema, MerchantPixAccountSchema } from "../schema/merchant-pixaccount-schema"
import { merchantpixaccount } from "../../../../drizzle/schema"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter, useSearchParams } from "next/navigation"
import { updateMerchantPixAccountFormAction } from "../_actions/merchantPixAccount-formActions"
import { insertMerchantPixAccountFormAction } from "../_actions/merchantPixAccount-formActions"
import { Button } from "@/components/ui/button"
import { accountTypeDropdown, banckDropdown } from "../server/merchantpixacount"
interface MerchantProps {
  merchantpixaccount: typeof merchantpixaccount.$inferSelect,
  merchantcorporateName:string,
  merchantdocumentId:string,legalPerson:string,
  activeTab: string;
  idMerchant:number
  DDAccountType:accountTypeDropdown[],
  DDBank:banckDropdown[],
  setActiveTab: (tab: string) => void;

}
  



export default function MerchantFormBank({ merchantpixaccount,merchantcorporateName,merchantdocumentId,legalPerson,idMerchant,setActiveTab,activeTab,DDAccountType,DDBank  }: MerchantProps) {
  const router = useRouter();
  
  const form = useForm<MerchantPixAccountSchema>({
    
    resolver: zodResolver(merchantPixAccountSchema),
    defaultValues: {

      id: merchantpixaccount?.id ? Number(merchantpixaccount.id) : undefined,
      slug: merchantpixaccount?.slug || "",
      active: merchantpixaccount?.active || false,
      dtinsert: merchantpixaccount?.dtinsert ? new Date(merchantpixaccount.dtinsert) : undefined,
      dtupdate: merchantpixaccount?.dtupdate ? new Date(merchantpixaccount.dtupdate) : undefined,
      idRegistration: merchantpixaccount?.idRegistration || "",
      idAccount: merchantpixaccount?.idAccount || "",
      bankNumber: merchantpixaccount?.bankNumber || "",
      bankBranchNumber: merchantpixaccount?.bankBranchNumber || "",
      bankBranchDigit: merchantpixaccount?.bankBranchDigit || "0",
      bankAccountNumber: merchantpixaccount?.bankAccountNumber || "",
      bankAccountDigit: merchantpixaccount?.bankAccountDigit || "0",
      bankAccountType: merchantpixaccount?.bankAccountType || "",
      bankAccountStatus: merchantpixaccount?.bankAccountStatus || "",
      onboardingPixStatus: merchantpixaccount?.onboardingPixStatus || "",
      message: merchantpixaccount?.message || "",
      bankName: merchantpixaccount?.bankName || "",
      idMerchant: idMerchant,
      slugMerchant: merchantpixaccount?.slugMerchant || "",
      useEstablishmentData: false,
      merchantcorporateName: merchantcorporateName || "",
      merchantdocumentId: merchantdocumentId || "",
      legalPerson: legalPerson || "",
      
      
     
      
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

  const onSubmit = async (data: MerchantPixAccountSchema) => {
    try {
      console.log("Iniciando submit do formulário"); // Debug
      console.log("Dados do formulário:", data); // Debug

      if (data.id) {
        console.log("Atualizando conta existente");
        await updateMerchantPixAccountFormAction(data);
      } else {
        console.log("Criando nova conta");
        await insertMerchantPixAccountFormAction(data);
      }
      
      console.log("Operação concluída com sucesso");
      refreshPage(idMerchant);
    } catch (error) {
      console.error("Erro no submit:", error);
    }
  };

  return (
    <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mx-auto">
    
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center space-x-2">
        <Landmark className="w-5 h-5" />
        <CardTitle>DADOS BANCÁRIOS</CardTitle>
        <span className="text-sm text-muted-foreground ml-2">pessoa jurídica</span>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          control={form.control}
          name="useEstablishmentData"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Usar dados do Estabelecimento</FormLabel>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="merchantdocumentId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                CNPJ <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input {...field}  />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="merchantcorporateName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Razão Social <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input {...field}  />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
<div className="grid grid-cols-2 gap-4">
<FormField
                        control={form.control}
                        name="bankNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Banco <span className="text-red-500">*</span>
                            </FormLabel>
                            <Select
                              onValueChange={(value) => {
                                const selectedBank = DDBank.find(bank => bank.value === value);
                                field.onChange(value);
                                if (selectedBank) {
                                  form.setValue('bankName', selectedBank.label);
                                }
                              }}
                              value={field.value || ""}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {DDBank.map((item) => (
                                  <SelectItem key={item.value} value={item.value}>
                                    {item.value} - {item.label}
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
                        name="bankName"
                        render={({ field }) => (
                          <FormItem className="hidden">
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                       <FormField
          control={form.control}
          name="bankAccountType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Tipo de Conta <span className="text-red-500">*</span>
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
                  {DDAccountType.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
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
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="bankBranchNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Agência <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input {...field}  />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="bankBranchDigit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dígito da agência</FormLabel>
                  <FormControl>
                    <Input {...field} maxLength={1} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="bankAccountNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Conta <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input {...field}  />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="bankAccountDigit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Dígito da conta <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} maxLength={1} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

       
      </CardContent>
    </Card>
    <div className="flex justify-end mt-4">
      <Button type="submit">Avançar</Button>
    </div>
    </form>
    </Form>
  )
}

