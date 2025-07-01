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
import { legalPersonTypes } from "@/lib/lookuptables/lookuptables";
import { zodResolver } from "@hookform/resolvers/zod";
import { Landmark } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { merchantBankAccounts } from "../../../../drizzle/schema";

import {
  insertMerchantBankAccountFormAction,
  updateMerchantBankAccountFormAction,
} from "@/features/merchant/_actions/merchantBankAccount-formActions";
import {
  insertMerchantPixAccountFormAction,
  updateMerchantPixAccountFormAction,
} from "@/features/merchant/_actions/merchantPixAccount-formActions";
import {
  MerchantBankAccountSchema,
  merchantBankAccountSchema,
} from "@/features/merchant/schema/merchant-bankaccount-schema";
import {
  MerchantPixAccountSchema,
  merchantPixAccountSchema,
} from "@/features/merchant/schema/merchant-pixaccount-schema";
import { typeaccountDD } from "@/features/merchant/server/merchant-bank";
import { handleNumericInput } from "@/lib/utils";
import { banckDropdown } from "../server/merchantpixacount";

interface MerchantProps {
  merchantBankAccount: typeof merchantBankAccounts.$inferSelect;
  merchantcorporateName: string;
  merchantdocumentId: string;
  activeTab: string;
  idMerchant: number;
  DDBank: banckDropdown[];
  setActiveTab: (tab: string) => void;
  permissions: string[];
  accountTypeDD: typeaccountDD[];
  hasPix?: boolean;
  merchantpixaccount?: any;
}

export default function MerchantFormBankAccount({
  merchantBankAccount,
  idMerchant,
  setActiveTab,
  activeTab,
  DDBank,
  permissions,
  merchantcorporateName,
  merchantdocumentId,
  accountTypeDD,
  hasPix = false,
  merchantpixaccount,
}: MerchantProps) {
  const router = useRouter();

  const form = useForm<MerchantBankAccountSchema>({
    resolver: zodResolver(merchantBankAccountSchema),
    defaultValues: {
      id: merchantBankAccount?.id ? Number(merchantBankAccount.id) : undefined,
      documentId: merchantBankAccount?.documentId || merchantdocumentId || "",
      corporateName:
        merchantBankAccount?.corporateName || merchantcorporateName || "",
      legalPerson: merchantBankAccount?.legalPerson || "JURIDICAL",
      bankBranchNumber: merchantBankAccount?.bankBranchNumber || "",
      bankBranchCheckDigit: merchantBankAccount?.bankBranchCheckDigit || "",
      accountNumber: merchantBankAccount?.accountNumber || "",
      accountNumberCheckDigit:
        merchantBankAccount?.accountNumberCheckDigit || "",
      accountType: merchantBankAccount?.accountType || "CHECKING",
      compeCode: merchantBankAccount?.compeCode || "",
      dtinsert: merchantBankAccount?.dtinsert
        ? new Date(merchantBankAccount.dtinsert)
        : undefined,
      dtupdate: merchantBankAccount?.dtupdate
        ? new Date(merchantBankAccount.dtupdate)
        : undefined,
      idMerchant: idMerchant,
    },
  });

  // Formulário para conta PIX
  const pixForm = useForm<MerchantPixAccountSchema>({
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
    router.push(`/portal/merchants/${id}?${params.toString()}`);
  };

  const onSubmit = async (data: MerchantBankAccountSchema) => {
    try {
      console.log("Iniciando submit do formulário");
      console.log("Dados do formulário:", data);

      const isUpdating = !!data.id;
      data.idMerchant = idMerchant;

      if (isUpdating) {
        console.log("Atualizando conta bancária existente");
        await updateMerchantBankAccountFormAction(data);

        // Se tiver PIX, também precisa salvar os dados do PIX
        if (hasPix) {
          const pixData = pixForm.getValues();
          if (pixData.id) {
            await updateMerchantPixAccountFormAction(pixData);
          } else {
            await insertMerchantPixAccountFormAction(pixData);
          }
        }
      } else {
        console.log("Criando nova conta bancária");
        await insertMerchantBankAccountFormAction(data);

        // Se tiver PIX, também precisa salvar os dados do PIX
        if (hasPix) {
          const pixData = pixForm.getValues();
          pixData.idMerchant = idMerchant;
          await insertMerchantPixAccountFormAction(pixData);
        }
      }

      console.log("Dados bancários salvos no banco local com sucesso");

      router.refresh();
      refreshPage(idMerchant);

      console.log("Operação de salvamento local concluída com sucesso");
    } catch (error) {
      console.error("Erro no submit:", error);
    }
  };

  return (
    <div className="space-y-6">
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
                  name="documentId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        CPF/CNPJ <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          maxLength={14}
                          onKeyDown={(e) => handleNumericInput(e, 14)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="legalPerson"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Tipo de Pessoa <span className="text-red-500">*</span>
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value || "JURIDICAL"}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {legalPersonTypes.map((item) => (
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

                <FormField
                  control={form.control}
                  name="compeCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Código do Banco <span className="text-red-500">*</span>
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
                          <Input
                            {...field}
                            maxLength={5}
                            onKeyDown={(e) => handleNumericInput(e, 5)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="bankBranchCheckDigit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Dígito da agência</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            maxLength={1}
                            onKeyDown={(e) => handleNumericInput(e, 1)}
                          />
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
                    name="accountNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Conta <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            maxLength={13}
                            onKeyDown={(e) => handleNumericInput(e, 13)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="accountNumberCheckDigit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Dígito da conta</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            maxLength={1}
                            onKeyDown={(e) => handleNumericInput(e, 1)}
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
                  name="accountType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Tipo de Conta <span className="text-red-500">*</span>
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value || "CHECKING"}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {accountTypeDD.map((item) => (
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
            </CardContent>
          </Card>

          {hasPix && (
            <Form {...pixForm}>
              <Card className="w-full mt-6">
                <CardHeader className="flex flex-row items-center space-x-2 justify-between">
                  <div className="flex items-center">
                    <Landmark className="w-5 h-5" />
                    <CardTitle>DADOS BANCÁRIOS PIX</CardTitle>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      // Função para copiar os dados do formulário principal para o PIX
                      const mainFormData = form.getValues();
                      pixForm.setValue("bankNumber", mainFormData.compeCode);
                      pixForm.setValue(
                        "bankBranchNumber",
                        mainFormData.bankBranchNumber
                      );
                      pixForm.setValue(
                        "bankBranchDigit",
                        mainFormData.bankBranchCheckDigit
                      );
                      pixForm.setValue(
                        "bankAccountNumber",
                        mainFormData.accountNumber
                      );
                      pixForm.setValue(
                        "bankAccountDigit",
                        mainFormData.accountNumberCheckDigit || ""
                      );
                      pixForm.setValue(
                        "bankAccountType",
                        mainFormData.accountType || ""
                      );

                      // Obter o nome do banco selecionado
                      const selectedBank = DDBank.find(
                        (bank) => bank.value === mainFormData.compeCode
                      );
                      if (selectedBank) {
                        pixForm.setValue("bankName", selectedBank.label);
                      }
                    }}
                  >
                    Copiar dados acima
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={pixForm.control}
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
                                pixForm.setValue(
                                  "bankName",
                                  selectedBank.label
                                );
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
                      control={pixForm.control}
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
                      control={pixForm.control}
                      name="bankAccountType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Tipo de Conta{" "}
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
                              {accountTypeDD.map((item) => (
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
                        control={pixForm.control}
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
                        control={pixForm.control}
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
                        control={pixForm.control}
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
                        control={pixForm.control}
                        name="bankAccountDigit"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Dígito da conta{" "}
                              <span className="text-red-500">*</span>
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
            </Form>
          )}

          {permissions?.includes("Atualizar") && (
            <div className="flex justify-end mt-4">
              <Button type="submit">
                {merchantBankAccount?.id ? "Salvar" : "Avançar"}
              </Button>
            </div>
          )}
        </form>
      </Form>
    </div>
  );
}
