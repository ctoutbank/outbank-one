"use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { createdOrUpdateSalesAgents, insertSalesAgent, insertSalesAgentt, NewSalesAgent, SalesAgentFull } from "@/server/db/salesAgent";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { SalesAgentSchema } from "./schema";
import { z } from "zod";
import { generateSlug } from "@/lib/utils";

interface SalesAgentsFormProps {
  salesAgent: SalesAgentFull | null;
}

const SalesAgentsForm: React.FC<SalesAgentsFormProps> = ({ salesAgent }) => {
  const form = useForm<z.infer<typeof SalesAgentSchema>>({
    resolver: zodResolver(SalesAgentSchema),
    defaultValues: {
      
      slug: salesAgent?.slug || "",
      firstName: salesAgent?.firstName || "",
      lastName: salesAgent?.lastName || "",
      dtinsert: salesAgent?.dtinsert ? new Date(salesAgent.dtinsert) : new Date(),
      dtupdate: salesAgent?.dtupdate ? new Date(salesAgent.dtupdate) : new Date(),
      documentId: salesAgent?.documentId || "",
      slugCustomer: salesAgent?.slugCustomer || "",
      email: salesAgent?.email || "",
      active: salesAgent?.active || true,
    },
  });

  const onSubmit = (data: z.infer<typeof SalesAgentSchema>) => {
    const currentSalesAgent: NewSalesAgent = {
    
      slug: generateSlug(),
      firstName: data.firstName ? data.firstName : salesAgent?.firstName || "",
      lastName: data.lastName ? data.lastName : salesAgent?.lastName || "",
      dtinsert: data.dtinsert ? data.dtinsert.toISOString() : new Date().toISOString(),
      dtupdate: data.dtupdate ? data.dtupdate.toISOString() : new Date().toISOString(),
      documentId: data.documentId ? data.documentId : salesAgent?.documentId || "",
      slugCustomer: data.slugCustomer ? data.slugCustomer : salesAgent?.slugCustomer || "",
      email: data.email ? data.email : salesAgent?.email || "",
      active: data.active ? data.active : salesAgent?.active || true,
    };
   

    insertSalesAgentt(currentSalesAgent);
  };
console.log(salesAgent,"aqui")
  return (
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
          
            <div className="flex justify-end mt-3">
              <Button type="submit">Salvar</Button>
            </div>
        </div>
      </form>
    </Form>
  );
};

export default SalesAgentsForm;
