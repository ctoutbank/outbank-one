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
import { zodResolver } from "@hookform/resolvers/zod";
import { Landmark } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { merchantpixaccount } from "../../../../drizzle/schema";
import {
  insertMerchantPixAccountFormAction,
  updateMerchantPixAccountFormAction,
} from "../_actions/merchantPixAccount-formActions";
import {
  merchantPixAccountSchema,
  MerchantPixAccountSchema,
} from "../schema/merchant-pixaccount-schema";
import {
  accountTypeDropdown,
  banckDropdown,
} from "../server/merchantpixacount";

interface MerchantProps {
  merchantpixaccount: typeof merchantpixaccount.$inferSelect;
  merchantcorporateName: string;
  merchantdocumentId: string;
  legalPerson: string;
  activeTab: string;
  idMerchant: number;
  DDAccountType: accountTypeDropdown[];
  DDBank: banckDropdown[];
  setActiveTab: (tab: string) => void;
  permissions: string[];
}

export default function MerchantFormBank({
  merchantpixaccount,
  idMerchant,
  setActiveTab,
  activeTab,
  DDAccountType,
  DDBank,
  permissions,
}: MerchantProps) {
  const router = useRouter();

  const form = useForm<MerchantPixAccountSchema>({
    resolver: zodResolver(merchantPixAccountSchema),
    defaultValues: {
      id: merchantpixaccount?.id ? Number(merchantpixaccount.id) : undefined,
      slug: merchantpixaccount?.slug || "",
      active: merchantpixaccount?.active || true,
      dtinsert: merchantpixaccount?.dtinsert
        ? new Date(merchantpixaccount.dtinsert)
        : undefined,
      dtupdate: merchantpixaccount?.dtupdate
        ? new Date(merchantpixaccount.dtupdate)
        : undefined,
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
          </CardHeader>
          <CardContent className="space-y-4">
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
                        // Define o bankNumber (value)
                        field.onChange(value);

                        // Encontra o banco selecionado para obter a label
                        const selectedBank = DDBank.find(
                          (bank) => bank.value === value
                        );

                        // Define o bankName (label)
                        if (selectedBank) {
                          form.setValue("bankName", selectedBank.label);
                          console.log("Banco selecionado:", {
                            bankNumber: value,
                            bankName: selectedBank.label,
                          });
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

              {/* Campo oculto para bankName */}
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
                        <Input {...field} />
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
                        <Input {...field} />
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
        {permissions?.includes("Atualizar") && (
          <div className="flex justify-end mt-4">
            <Button type="submit">Avançar</Button>
          </div>
        )}
      </form>
    </Form>
  );
}
