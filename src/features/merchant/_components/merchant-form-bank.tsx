"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Landmark } from "lucide-react"
import { Label } from "@/components/ui/label"
import { merchantPixAccountSchema, MerchantPixAccountSchema } from "../schema/merchant-pixaccount-schema"
import { merchantpixaccount } from "../../../../drizzle/schema"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

interface MerchantProps {
  merchantpixaccount: typeof merchantpixaccount.$inferSelect,merchantcorporateName:string,merchantdocumentId:string,legalPerson:string}
  


export default function MerchantFormBank({ merchantpixaccount,merchantcorporateName,merchantdocumentId,legalPerson  }: MerchantProps) {
  
  const form = useForm<MerchantPixAccountSchema>({
    resolver: zodResolver(merchantPixAccountSchema),
    defaultValues: {
      id: merchantpixaccount?.id ? Number(merchantpixaccount.id) : undefined,
      slug: merchantpixaccount?.slug || "",
      active: merchantpixaccount?.active || false,
      dtinsert: merchantpixaccount?.dtinsert || "",
      dtupdate: merchantpixaccount?.dtupdate || "",
      idRegistration: merchantpixaccount?.idRegistration || "",
      idAccount: merchantpixaccount?.idAccount || "",
      bankNumber: merchantpixaccount?.bankNumber || "",
      bankBranchNumber: merchantpixaccount?.bankBranchNumber || "",
      bankBranchDigit: merchantpixaccount?.bankBranchDigit || "",
      bankAccountNumber: merchantpixaccount?.bankAccountNumber || "",
      bankAccountDigit: merchantpixaccount?.bankAccountDigit || "",
      bankAccountType: merchantpixaccount?.bankAccountType || "",
      bankAccountStatus: merchantpixaccount?.bankAccountStatus || "",
      onboardingPixStatus: merchantpixaccount?.onboardingPixStatus || "",
      message: merchantpixaccount?.message || "",
      bankName: merchantpixaccount?.bankName || "",
      idMerchant: merchantpixaccount?.idMerchant || undefined,
      slugMerchant: merchantpixaccount?.slugMerchant || "",
      useEstablishmentData: false,
      merchantcorporateName: merchantcorporateName || "",
      merchantdocumentId: merchantdocumentId || "",
      legalPerson: legalPerson || "",
      bank: merchantpixaccount?.bankNumber || "",
      accountType: merchantpixaccount?.bankAccountType || "",
      
     
      
    },
  });

  const onSubmit = async (data: MerchantPixAccountSchema) => {
    console.log(data);
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
                <Input {...field} placeholder="81.362.459/0001-37" />
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
                <Input {...field} placeholder="Teste LTDA" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bank"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Banco <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input {...field} placeholder="001 BCO DO BRASIL S.A" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="accountType" 
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Tipo da Conta <span className="text-red-500">*</span>
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value === "CC" ? "checking" : "savings"}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo de conta" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="checking">Conta Corrente</SelectItem>
                  <SelectItem value="savings">Conta Poupança</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

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
                    <Input {...field} placeholder="0001" />
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
                    <Input {...field} maxLength={1} value={field.value || "0"} />
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
                    <Input {...field} placeholder="01023302" />
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
                    <Input {...field} maxLength={1} value={field.value === " " ? "0" : field.value || "0"} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </CardContent>
    </Card>
    </form>
    </Form>
  )
}

