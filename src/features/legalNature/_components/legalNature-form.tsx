"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import {
  insertLegalNatureFormAction,
  updateLegalNatureFormAction,
} from "../_actions/legalNature-formActions";
import {
  LegalNatureSchema,
  schemaLegalNature,
} from "../schema/legalNatures-schema";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

interface LegalNatureProps {
  legalNature: LegalNatureSchema;
}

export default function LegalNatureForm({ legalNature }: LegalNatureProps) {
  const router = useRouter();
  const form = useForm<LegalNatureSchema>({
    resolver: zodResolver(schemaLegalNature),
    defaultValues: legalNature,
  });

  const onSubmit = async (data: LegalNatureSchema) => {
    try {
      toast.loading("Salvando natureza jurídica...");
      if (data?.id) {
        await updateLegalNatureFormAction(data);
        toast.success("Natureza jurídica atualizada com sucesso!");
        router.refresh();
      } else {
        const newId = await insertLegalNatureFormAction(data);
        toast.success("Natureza jurídica criada com sucesso!");
        router.push(`/portal/legalNatures/${newId}`);
      }
    } catch (error) {
      console.error("Erro ao salvar natureza jurídica:", error);
      toast.error("Erro ao salvar natureza jurídica. Tente novamente.");
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
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

              <div className="flex justify-end mt-4">
                <Button type="submit">Salvar</Button>
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
