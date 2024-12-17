"use client";

import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { createdOrUpdateSalesAgents, SalesAgentFull, salesAgentFullSchema, SalesAgentFullSchema } from "@/server/db/salesAgent";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, useForm } from "react-hook-form";


interface SalesAgentsFormProps {
    salesAgent: SalesAgentFull | null;

}


export default function SalesAgentsForm({ salesAgent } : SalesAgentsFormProps) {

    const form = useForm<SalesAgentFullSchema>({
        resolver: zodResolver(salesAgentFullSchema)
    });
    const onSubmit = (data: SalesAgentFullSchema) => {
        createdOrUpdateSalesAgents(data);

    }

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