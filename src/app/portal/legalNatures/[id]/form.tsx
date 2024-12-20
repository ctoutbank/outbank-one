"use client";

import { insertLegalNature, LegalNatureDetail, LegalNatureInsert } from "@/server/db/legalNature";
import { useForm } from "react-hook-form";
import { schemaLegalNature } from "./schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { generateSlug } from "@/lib/utils";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage  } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface LegalNatureProps {
    legalNature: LegalNatureDetail | null;
    }


const LegalNatureForm: React.FC<LegalNatureProps> = ({ legalNature }) => {
    const form = useForm<z.infer<typeof schemaLegalNature>>({
        resolver: zodResolver(schemaLegalNature),
        defaultValues: {
            slug: legalNature?.slug || "",
            name: legalNature?.name || "",
            code: legalNature?.code || "",
            active: legalNature?.active || false,
            dtinsert: legalNature?.dtinsert ? new Date(legalNature.dtinsert) : new Date(),
            dtupdate: legalNature?.dtupdate ? new Date(legalNature.dtupdate) : new Date(),
        },
    });

    const onSubmit = (data: z.infer<typeof schemaLegalNature>) => {
        const currentLegalNature: LegalNatureInsert = {
            slug: generateSlug(),
            name: data.name ? data.name : legalNature?.name || "",
            code: data.code ? data.code : legalNature?.code || "",
            active: data.active ? data.active : legalNature?.active || false,
            dtinsert: data.dtinsert ? data.dtinsert.toString() : new Date().toString(),
            dtupdate: data.dtupdate ? data.dtupdate.toString() : new Date().toString(),
        };

        insertLegalNature(currentLegalNature);
    };

    return (
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
                  <Input {...field} value={field.value ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Code</FormLabel>
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

export default LegalNatureForm;
