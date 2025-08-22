"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { CategoriesSchema, schemaCategories } from "../schema/schema";

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
import { cnaeMap } from "@/lib/lookuptables/lookuptables";
import { ArrowLeft, Settings } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  insertCategoryFormAction,
  updateCategoryFormAction,
} from "../_actions/categories-formActions";
import {
  CategoryDetail,
  CategoryInsert,
  FeeDetail,
  getFeeDetailById,
} from "../server/category";
import { FeeView } from "./fee-view";

interface CategoriesProps {
  categories: CategoriesSchema;
}

export default function Categoriesform({ categories }: CategoriesProps) {
  const router = useRouter();
  const form = useForm<CategoriesSchema>({
    resolver: zodResolver(schemaCategories),
    defaultValues: categories,
  });
  console.log(categories);
  const [feeDetail, setFeeDetail] = useState<FeeDetail | null>(null);

  useEffect(() => {
    async function fetchFee() {
      if (categories?.id && categories?.idSolicitationFee) {
        const fee = await getFeeDetailById(
          Number(categories.idSolicitationFee)
        );
        setFeeDetail(fee);
      }
    }
    fetchFee();
  }, [categories?.id, categories?.idSolicitationFee]);

  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "cnae" && value.cnae) {
        const mapping = cnaeMap[value.cnae];
        if (mapping && value.mcc !== mapping.mcc) {
          form.setValue("mcc", mapping.mcc);
        }
      }
    });
    return () => subscription.unsubscribe?.();
  }, [form]);

  const onSubmit = async (data: CategoriesSchema) => {
    try {
      toast.loading("Salvando categoria...");
      if (data?.id) {
        const updateData: CategoryDetail = {
          id: data.id,
          name: data.name,
          mcc: data.mcc,
          cnae: data.cnae,
          idSolicitationFee: Number(data.idSolicitationFee) || null,
          anticipationRiskFactorCp:
            Number(data.anticipation_risk_factor_cp) || 0,
          anticipationRiskFactorCnp:
            Number(data.anticipation_risk_factor_cnp) || 0,
          waitingPeriodCp: Number(data.waiting_period_cp) || 0,
          waitingPeriodCnp: Number(data.waiting_period_cnp) || 0,
          slug: data.slug || "",
          active: data.active || true,
          dtinsert: data.dtinsert?.toString() || new Date().toISOString(),
          dtupdate: new Date().toISOString(),
        };
        await updateCategoryFormAction(updateData);
        toast.success("Categoria atualizada com sucesso!");
        router.refresh();
      } else {
        const insertData: CategoryInsert = {
          ...data,
          waitingPeriodCp:
            data.waiting_period_cp ||
            data.waiting_period_cp == "" ||
            data.waiting_period_cp == null
              ? 0
              : Number(data.waiting_period_cp),
          waitingPeriodCnp:
            data.waiting_period_cnp ||
            data.waiting_period_cnp == "" ||
            data.waiting_period_cnp == null
              ? 0
              : Number(data.waiting_period_cnp),
          anticipationRiskFactorCp:
            data.anticipation_risk_factor_cp ||
            data.anticipation_risk_factor_cp == "" ||
            data.anticipation_risk_factor_cp == null
              ? 0
              : Number(data.anticipation_risk_factor_cp),
          anticipationRiskFactorCnp:
            data.anticipation_risk_factor_cnp ||
            data.anticipation_risk_factor_cnp == "" ||
            data.anticipation_risk_factor_cnp == null
              ? 0
              : Number(data.anticipation_risk_factor_cnp),
          dtinsert: new Date().toString(),
          dtupdate: new Date().toString(),
          slug: "",
          idSolicitationFee:
            data.idSolicitationFee ||
            data.idSolicitationFee == "0" ||
            data.idSolicitationFee == null
              ? null
              : Number(data.idSolicitationFee),
        };

        const newId = await insertCategoryFormAction(insertData);
        toast.success("Categoria criada com sucesso!");
        router.push(`/portal/categories/${newId}`);
      }
    } catch (error) {
      console.error("Erro ao salvar categoria:", error);
      toast.error("Erro ao salvar categoria. Tente novamente.");
    }
  };

  return (
    <>
      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-xl flex items-center">
            <Settings className="h-5 w-5 mr-2 text-primary" />
            Informações do CNAE
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Nome
                        <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          value={field.value ? String(field.value) : ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="cnae"
                  rules={{
                    required: "CNAE é obrigatório",
                    pattern: {
                      value: /^\d{5}\/\d{2}$/,
                      message: "Formato inválido (ex: 12345/67)",
                    },
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        CNAE <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="00000/00"
                          value={field.value}
                          onChange={(e) => {
                            const raw = e.target.value.replace(/\D/g, ""); // remove tudo que não for número
                            let formatted = raw;

                            if (raw.length > 5) {
                              formatted = `${raw.slice(0, 5)}/${raw.slice(5, 7)}`;
                            }

                            field.onChange(formatted);
                          }}
                          maxLength={8} // 7 números + 1 caractere da barra
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="mcc"
                  rules={{
                    required: "MCC é obrigatório",
                    pattern: {
                      value: /^\d{4}$/,
                      message: "Formato inválido (ex: 1234)",
                    },
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        MCC <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="0000"
                          value={field.value}
                          onChange={(e) => {
                            const onlyDigits = e.target.value
                              .replace(/\D/g, "")
                              .slice(0, 4);
                            field.onChange(onlyDigits);
                          }}
                          maxLength={4}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="anticipation_risk_factor_cp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fator de risco de antecipação CP</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          value={field.value ?? ""}
                          onChange={(e) => {
                            const value = e.target.value.replace(/[^\d.]/g, "");
                            field.onChange(value);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="anticipation_risk_factor_cnp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fator de risco de antecipação CNP</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          value={field.value ?? ""}
                          onChange={(e) => {
                            const value = e.target.value.replace(/[^\d.]/g, "");
                            field.onChange(value);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="waiting_period_cp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Período de espera CP</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          value={field.value ?? ""}
                          onChange={(e) => {
                            const value = e.target.value.replace(/[^\d.]/g, "");
                            field.onChange(value);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="waiting_period_cnp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Período de espera CNP</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          value={field.value ?? ""}
                          onChange={(e) => {
                            const value = e.target.value.replace(/[^\d.]/g, "");
                            field.onChange(value);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="active"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block mb-1 mt-3">Ativo</FormLabel>
                      <FormControl>
                        <Checkbox
                          onCheckedChange={field.onChange}
                          checked={field.value ?? undefined}
                          value={field.value?.toString()}
                          className="w-4"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end">
                <Button type="submit">Salvar</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {categories?.id && categories?.idSolicitationFee && feeDetail && (
        <div className="mt-8 overflow-x-hidden">
          <FeeView feeDetail={feeDetail} />
        </div>
      )}

      <div className="mt-6 flex items-center">
        <Link href="/portal/categories">
          <Button type="button" variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </Link>
      </div>
    </>
  );
}
