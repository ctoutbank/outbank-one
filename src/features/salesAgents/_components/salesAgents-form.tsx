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

import { Card, CardContent } from "@/components/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  insertSalesAgentFormAction,
  updateSalesAgentFormAction,
} from "../_actions/salesAgents-formActions";
import { SalesAgentSchema, SchemaSalesAgent } from "../schema/schema";

interface SalesAgentsFormProps {
  salesAgent: SalesAgentSchema;
}

export default function SalesAgentForm({ salesAgent }: SalesAgentsFormProps) {
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Formulário do Consultor
  const form = useForm<SalesAgentSchema>({
    resolver: zodResolver(SchemaSalesAgent),
    defaultValues: {
      ...salesAgent,
      id: salesAgent.id,
      firstName: salesAgent.firstName || "",
      lastName: salesAgent.lastName || "",
      email: salesAgent.email || "",
      cpf: salesAgent.cpf || "",
      phone: salesAgent.phone || "",
      birthDate: salesAgent.birthDate,
    },
  });

  const onSubmit = async (data: SalesAgentSchema) => {
    try {
      setIsSubmitting(true);
      console.log("Dados do formulário original:", data);
      console.log("CPF:", data.cpf);
      console.log("Phone:", data.phone);
      console.log("BirthDate:", data.birthDate);

      if (data.id) {
        console.log("Atualizando consultor existente com ID:", data.id);
        await updateSalesAgentFormAction(data);
        console.log("Consultor atualizado com sucesso");
        router.refresh();
      } else {
        console.log("Criando novo consultor");
        const newId = await insertSalesAgentFormAction(data);
        console.log("Novo consultor criado com ID:", newId);
        router.push(`/portal/salesAgents/${newId}`);
      }
    } catch (error) {
      console.error("Erro ao submeter formulário:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card className="w-full mb-4">
            <CardContent className="pt-6">
              <div className="grid grid-cols-3 gap-4">
                <FormItem>
                  <FormLabel>Nome Completo</FormLabel>
                  <FormControl>
                    <Input
                      value={`${form.getValues("firstName") ?? ""} ${
                        form.getValues("lastName") ?? ""
                      }`.trim()}
                      onChange={(e) => {
                        const fullName = e.target.value;
                        const nameParts = fullName.split(" ");
                        const firstName = nameParts[0] || "";
                        const lastName = nameParts.slice(1).join(" ") || "";

                        form.setValue("firstName", firstName);
                        form.setValue("lastName", lastName);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
                <FormField
                  control={form.control}
                  name="cpf"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CPF</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          value={field.value ?? ""}
                          onChange={(e) => {
                            field.onChange(e.target.value);
                            console.log("CPF alterado para:", e.target.value);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value ?? ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-3 gap-4 mt-2">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefone</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          value={field.value ?? ""}
                          onChange={(e) => {
                            field.onChange(e.target.value);
                            console.log(
                              "Telefone alterado para:",
                              e.target.value
                            );
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="birthDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data de Nascimento</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          {...field}
                          value={
                            field.value
                              ? new Date(field.value)
                                  .toISOString()
                                  .split("T")[0]
                              : ""
                          }
                          onChange={(e) => {
                            const date = e.target.value
                              ? new Date(e.target.value)
                              : null;
                            field.onChange(date);
                            console.log(
                              "Data de nascimento alterada para:",
                              date
                            );
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end mt-4">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}
