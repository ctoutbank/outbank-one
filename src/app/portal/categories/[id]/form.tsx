"use client";


import { schemaCategories } from "./schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CategoryDetail, CategoryInsert, insertCategory, updateCategory } from "@/server/db/category";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { generateSlug } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";







interface CategoriesProps {
    categories: CategoryDetail | null;
    }

const Categoriesform: React.FC<CategoriesProps> = ({ categories }) => {
    
    const form = useForm<z.infer<typeof schemaCategories>>({
      resolver: zodResolver(schemaCategories),
      defaultValues:{
        slug: categories?.slug ?? "",
        name: categories?.name ?? null,
        active: categories?.active ?? null,
        dtinsert: categories?.dtinsert ? new Date(categories.dtinsert) : null,
        dtupdate: categories?.dtupdate ? new Date(categories.dtupdate) : null,
        mcc: categories?.mcc ?? null,
        cnae: categories?.cnae ?? null,
        anticipation_risk_factor_cp: categories?.anticipationRiskFactorCp ? String(categories.anticipationRiskFactorCp) : null,
        anticipation_risk_factor_cnp: categories?.anticipationRiskFactorCnp ? String(categories.anticipationRiskFactorCnp) : null,
        waiting_period_cp: categories?.waitingPeriodCp ? String(categories.waitingPeriodCp) : null,
        waiting_period_cnp: categories?.waitingPeriodCnp ? String(categories.waitingPeriodCnp) : null
      }
    });

    const onSubmit = (data: z.infer<typeof schemaCategories>) => {
        const currentCategories: CategoryInsert = {
            
            name: data.name,
            slug: generateSlug(),
            active: data.active ? data.active : true,
            dtinsert: data.dtinsert ? data.dtinsert.toISOString() : new Date().toISOString(),
            dtupdate: data.dtupdate ? data.dtupdate.toISOString() : new Date().toISOString(),
            mcc: data.mcc,
            cnae: data.cnae,
            anticipationRiskFactorCp: data.anticipation_risk_factor_cp ? Number(data.anticipation_risk_factor_cp) : null,
            anticipationRiskFactorCnp: data.anticipation_risk_factor_cnp ? Number(data.anticipation_risk_factor_cnp) : null,
            waitingPeriodCp: data.waiting_period_cp ? Number(data.waiting_period_cp) : null,
            waitingPeriodCnp: data.waiting_period_cnp ? Number(data.waiting_period_cnp) : null
        };
       
        if(categories?.id ){
          const updatecategory: CategoryDetail = {
            id: categories.id,
            slug: currentCategories.slug || "",
            name: currentCategories.name || "",
            active: currentCategories.active || true,
            dtinsert:  new Date().toISOString(),
            dtupdate: new Date().toISOString(),
            mcc: currentCategories.mcc || "",
            cnae: currentCategories.cnae || "",
            anticipationRiskFactorCp: currentCategories.anticipationRiskFactorCp ? Number(currentCategories.anticipationRiskFactorCp) : null,
            anticipationRiskFactorCnp: currentCategories.anticipationRiskFactorCnp ? Number(currentCategories.anticipationRiskFactorCnp) : null,
            waitingPeriodCp: currentCategories.waitingPeriodCp ? Number(currentCategories.waitingPeriodCp) : null,
            waitingPeriodCnp: currentCategories.waitingPeriodCnp ? Number(currentCategories.waitingPeriodCnp) : null
          };
          updateCategory( updatecategory);
           
         
                
        
        
        }
        else{
        insertCategory(currentCategories);
        

    }
    console.log(categories,"aqui2")
    }
   

return(
    <Form  {...form}>
    <form  onSubmit={form.handleSubmit(onSubmit) } className="space-y-4">
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
            name="active"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="block mb-1 mt-3">Ativo</FormLabel>
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
            <FormLabel className="mt-2">MCC</FormLabel>
            <FormControl>
              <Input className="mb-2" {...field} value={field.value ?? ""} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="cnae"
        render={({ field }) => (
          <FormItem className="mt-2">
            <FormLabel >CNAE</FormLabel>
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
          <FormItem className="mt-2">
            <FormLabel >Fator de risco de antecipação CP</FormLabel>
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
          <FormItem className="mt-2">
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
        
