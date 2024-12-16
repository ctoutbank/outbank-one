"use client";

import { createdOrUpdateSalesAgents, SalesAgent } from "@/server/db/salesAgent";
import { z } from "zod";
import { SalesAgentSchema } from "./schema";
import { Form, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";


interface SalesAgentsFormProps {
    salesAgent: SalesAgent | null;

}


const SalesAgentsForm: React.FC<SalesAgentsFormProps> = ({ salesAgent }) => {
    const form = useForm<z.infer<typeof SalesAgentSchema>>({
        resolver: zodResolver(SalesAgentSchema),
        
        defaultValues: {
            id: salesAgent?.id || 0,
            slug: salesAgent?.slug || "",
            firstName: salesAgent?.firstName || "",
            lastName: salesAgent?.lastName || "",
            dtinsert: salesAgent?.dtinsert ? new Date(salesAgent.dtinsert) : new Date(),
            dtupdate: salesAgent?.dtupdate ? new Date(salesAgent.dtupdate) : new Date(),
            documentId: salesAgent?.documentId || "",
            slugCustomer: salesAgent?.slugCustomer || "",
            email: salesAgent?.email || "",
            active: salesAgent?.active || false,
        },
        
    });  
    const onSubmit = (data: z.infer<typeof SalesAgentSchema>) => {
        const currentSalesAgent: SalesAgent = {
            id: data.id ? data.id : salesAgent?.id || 0,
            slug: data.slug ? data.slug : salesAgent?.slug || "",
            firstName: data.firstName ? data.firstName : salesAgent?.firstName || "",
            lastName: data.lastName ? data.lastName : salesAgent?.lastName || "",
            dtinsert: data.dtinsert ? data.dtinsert.toString() : new Date().toString(),
            dtupdate: data.dtupdate ? data.dtupdate.toString() : new Date().toString(),
            documentId: data.documentId ? data.documentId : salesAgent?.documentId || "",
            slugCustomer: data.slugCustomer ? data.slugCustomer : salesAgent?.slugCustomer || "",
            email: data.email ? data.email : salesAgent?.email || "",
            active: data.active ? data.active : salesAgent?.active || false,
        };

        createdOrUpdateSalesAgents(currentSalesAgent);

};

return(
<Form {...form}>
<form onSubmit={form.handleSubmit(onSubmit)}>
  <div id="main">
    <FormField
      control={form.control}
      name="firstName"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Name</FormLabel>
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
        <FormItem>
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
      name="documentId"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Sort</FormLabel>
          <FormControl>
            <Input
              {...field} value={field.value ?? ""} 
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    ></FormField>

    
<Button type="submit">Save</Button>
  </div>
</form>
</Form>
);
};



export default SalesAgentsForm;