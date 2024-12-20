"use client";


import { schemaCategories } from "./schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CategoryDetail, CategoryInsert, insertCategory } from "@/server/db/category";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";







interface CategoriesProps {
    categories: CategoryDetail | null;
    }

const Categoriesform: React.FC<CategoriesProps> = ({ categories }) => {
    
    const form = useForm<z.infer<typeof schemaCategories>>({
        resolver: zodResolver(schemaCategories),
        defaultValues:{
           
            slug: categories?.slug ?? null,
            name: categories?.name ?? null,
            active: categories?.active ?? null,
            dtinsert: categories?.dtinsert ? new Date(categories.dtinsert) : null,
            dtupdate: categories?.dtupdate ? new Date(categories.dtupdate) : null,
            mcc: categories?.mcc ?? null,
            cnae: categories?.cnae ?? null,
            anticipation_risk_factor_cp: categories?.anticipationRiskFactorCp ?? null,
            anticipation_risk_factor_cnp: categories?.anticipationRiskFactorCnp ?? null,
            waiting_period_cp: categories?.waitingPeriodCp ?? null,
            waiting_period_cnp: categories?.waitingPeriodCnp ?? null

        }
    });

    const onSubmit = (data: z.infer<typeof schemaCategories>) => {
        const currentCategories: CategoryInsert = {
            slug: data.slug,
            name: data.name,
            active: data.active,
            dtinsert: data.dtinsert ? data.dtinsert.toISOString() : null,
            dtupdate: data.dtupdate ? data.dtupdate.toISOString() : null,
            mcc: data.mcc,
            cnae: data.cnae,
            anticipationRiskFactorCp: data.anticipation_risk_factor_cp,
            anticipationRiskFactorCnp: data.anticipation_risk_factor_cnp,
            waitingPeriodCp: data.waiting_period_cp,
            waitingPeriodCnp: data.waiting_period_cnp
        };

        insertCategory(currentCategories);
    }

return(
    <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <div id="main">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input {...field} value={field.value ? String(field.value) : ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
        control={form.control}
        name="slug"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Slug</FormLabel>
            <FormControl>
              <Input {...field} value={field.value ?? ""} />
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
                <FormLabel className="block mb-4">Ativo</FormLabel>
                <FormControl>
                  <Checkbox onCheckedChange={field.onChange} checked={field.value ?? undefined} value={field.value?.toString()} className="w-4" />
                </FormControl>
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
            <FormControl>
              <Input {...field} value={field.value ?? ""} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="cnae"
        render={({ field }) => (
          <FormItem>
            <FormLabel>CNAE</FormLabel>
            <FormControl>
              <Input {...field} value={field.value ?? ""} />
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
              <Input {...field} value={field.value ?? ""} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="anticipation_risk_factor_cnp"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Fator de risco de antecipação CNP</FormLabel>
            <FormControl>
              <Input {...field} value={field.value ?? ""} />
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
              <Input {...field} value={field.value ?? ""} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="waiting_period_cnp"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Período de espera CNP</FormLabel>
            <FormControl>
              <Input {...field} value={field.value ?? ""} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="flex justify-end mt-3">
              <Button type="submit">Salvar</Button>
            </div>
    </div>
  </form>
</Form>
);
}

export default Categoriesform;
        
