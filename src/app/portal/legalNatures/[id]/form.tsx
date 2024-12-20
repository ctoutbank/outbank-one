"use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { generateSlug } from "@/lib/utils";
import { insertLegalNature, LegalNatureDetail, LegalNatureInsert, updateLegalNature } from "@/server/db/legalNature";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { schemaLegalNature } from "./schema";
import { useRouter } from "next/navigation";

interface LegalNatureProps {
    legalNature: LegalNatureDetail | null;
    }


const LegalNatureForm: React.FC<LegalNatureProps> = ({ legalNature }) => {
  const router = useRouter();
    const form = useForm<z.infer<typeof schemaLegalNature>>({
        resolver: zodResolver(schemaLegalNature),
        defaultValues: {
            slug: legalNature?.slug || "",
            name: legalNature?.name || "",
            code: legalNature?.code || "",
            active: legalNature?.active || true,
            dtinsert: legalNature?.dtinsert ? new Date(legalNature.dtinsert) : new Date(),
            dtupdate: legalNature?.dtupdate ? new Date(legalNature.dtupdate) : new Date(),
        },
    });

    const onSubmit = (data: z.infer<typeof schemaLegalNature>) => {
      
        const currentLegalNature: LegalNatureInsert = {
            slug:data.slug ? data.slug : "",
            name: data.name ? data.name : legalNature?.name || "",
            code: data.code ? data.code : legalNature?.code || "",
            active: data.active ? data.active : legalNature?.active || true,
            dtinsert: data.dtinsert ? data.dtinsert.toISOString() : new Date().toISOString(),
            dtupdate: data.dtupdate ? data.dtupdate.toISOString() : new Date().toISOString(),
        };
        if(legalNature){
          legalNature.name = currentLegalNature.name!;
          legalNature.code = currentLegalNature.code!;
        }
        console.log(legalNature, "currentLegalNature");
        
        if (legalNature?.id) {
          updateLegalNature(legalNature );
            
        }
        else{

        insertLegalNature(currentLegalNature);
        }
        router.refresh();
        
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
              <FormItem className="mt-2">
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
