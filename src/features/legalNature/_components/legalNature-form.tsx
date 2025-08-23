"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  insertLegalNatureFormAction,
  updateLegalNatureFormAction,
} from "../_actions/legalNature-formActions";
import {
  LegalNatureSchema,
  schemaLegalNature,
} from "../schema/legalNatures-schema";

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
      toast.loading("Salvando Formato Jurídico...");
      if (data?.id) {
        await updateLegalNatureFormAction(data);
        toast.success("Formato Jurídico atualizado com sucesso!");
        router.refresh();
      } else {
        const newId = await insertLegalNatureFormAction(data);
        toast.success("Formato Jurídico criado com sucesso!");
        router.push(`/portal/legalNatures/${newId}`);
      }
    } catch (error) {
      console.error("Erro ao salvar Formato Jurídico:", error);
      toast.error("Erro ao salvar Formato Jurídico. Tente novamente.");
    }
  };

  return (
    <>
      <Card>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div id="main">
                <div className="flex items-center gap-2 mb-8">
                  <FormField
                    control={form.control}
                    name="code"
                    render={({ field }) => (
                      <FormItem className="w-1/2">
                        <FormLabel>
                          Código
                          <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input {...field} value={field.value ?? ""} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="w-1/2">
                        <FormLabel>
                          Nome
                          <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input {...field} value={field.value ?? ""} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex justify-end mt-4">
                  <Button type="submit">Salvar</Button>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <div className="mt-6 flex items-center">
        <Link href="/portal/legalNatures">
          <Button type="button" variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </Link>
      </div>
    </>
  );
}
