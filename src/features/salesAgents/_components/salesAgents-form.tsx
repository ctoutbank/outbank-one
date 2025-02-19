"use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { Card, CardContent } from "@/components/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { insertSalesAgentFormAction, updateSalesAgentFormAction } from "../_actions/salesAgents-formActions";
import { SalesAgentSchema, SchemaSalesAgent } from "../schema/schema";

interface SalesAgentsFormProps {
  salesAgent: SalesAgentSchema ;
}

export default  function SalesAgentForm({ salesAgent }: SalesAgentsFormProps) {
  const router = useRouter();
  const form = useForm<SalesAgentSchema>({
    resolver: zodResolver(SchemaSalesAgent),
    defaultValues: salesAgent,
  });

  const onSubmit = async (data: SalesAgentSchema) => {
    if (data?.id) {
      await updateSalesAgentFormAction(data);
      router.refresh();
    } else {
      const newId = await insertSalesAgentFormAction(data);
      router.push(`/portal/salesAgents/${newId}`);
    }
  }
  


console.log(salesAgent,"aqui")
  return (
    <Card>
    <CardContent className="pt-6">
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div id="main">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem className="mt-2">
                <FormLabel>Sobre Nome</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="mt-2">
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
            <div className="flex justify-end mt-4 ">
              <Button type="submit">Salvar</Button>
            </div>
        </div>
      </form>
    </Form>
  </CardContent>
</Card>
  );
};


