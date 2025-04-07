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

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { states } from "@/lib/lookuptables/lookuptables";
import { zodResolver } from "@hookform/resolvers/zod";
import { MapPin } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  insertAddressFormAction,
  insertSalesAgentFormAction,
  updateAddressFormAction,
  updateSalesAgentFormAction,
} from "../_actions/salesAgents-formActions";
import {
  AddressSchema,
  SalesAgentSchema,
  SchemaAddress,
  SchemaSalesAgent,
} from "../schema/schema";
import { getAddressById } from "../server/address";

interface SalesAgentsFormProps {
  salesAgent: SalesAgentSchema;
}

export default function SalesAgentForm({ salesAgent }: SalesAgentsFormProps) {
  const router = useRouter();
  const [isRendered, setIsRendered] = useState(false);
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

  // Formulário do Endereço
  const addressForm = useForm<AddressSchema>({
    resolver: zodResolver(SchemaAddress),
    defaultValues: {
      id: undefined,
      zipCode: "",
      street: "",
      number: "",
      complement: "",
      neighborhood: "",
      city: "",
      state: "",
      country: "Brasil",
    },
  });

  // Carregar endereço se existir um idAddress
  useEffect(() => {
    async function loadAddress() {
      if (salesAgent.idAddress) {
        try {
          const addressData = await getAddressById(salesAgent.idAddress);
          if (addressData) {
            addressForm.reset({
              id: addressData.id,
              zipCode: addressData.zipCode || "",
              street: addressData.streetAddress || "",
              number: addressData.streetNumber || "",
              complement: addressData.complement || "",
              neighborhood: addressData.neighborhood || "",
              city: addressData.city || "",
              state: addressData.state || "",
              country: addressData.country || "Brasil",
            });
          }
        } catch (error) {
          console.error("Erro ao carregar endereço:", error);
        }
      }
    }
    loadAddress();
    setIsRendered(true);
  }, [salesAgent.idAddress, addressForm]);

  // Log dos valores iniciais

  const onSubmit = async (data: SalesAgentSchema) => {
    try {
      setIsSubmitting(true);
      console.log("Dados do formulário original:", data);
      console.log("CPF:", data.cpf);
      console.log("Phone:", data.phone);
      console.log("BirthDate:", data.birthDate);

      // Validar formulário de endereço
      const addressFormValid = await addressForm.trigger();
      if (!addressFormValid) {
        console.error("Formulário de endereço inválido");
        return;
      }

      // Salvar endereço
      const addressData = addressForm.getValues();
      console.log("Dados do endereço para salvar:", addressData);

      let addressId;

      if (addressData.id) {
        console.log("Atualizando endereço existente com ID:", addressData.id);
        addressId = await updateAddressFormAction(addressData);
      } else {
        console.log("Criando novo endereço");
        addressId = await insertAddressFormAction(addressData);
      }

      console.log("Endereço salvo com ID:", addressId);

      // Atualizar consultor com o ID do endereço
      const salesAgentWithAddress: SalesAgentSchema = {
        ...data,
        idAddress: addressId,
      };

      if (salesAgentWithAddress.id) {
        console.log(
          "Atualizando consultor existente com ID:",
          salesAgentWithAddress.id
        );
        await updateSalesAgentFormAction(salesAgentWithAddress);
        console.log("Consultor atualizado com sucesso");
        router.refresh();
      } else {
        console.log("Criando novo consultor");
        const newId = await insertSalesAgentFormAction(salesAgentWithAddress);
        console.log("Novo consultor criado com ID:", newId);
        router.push(`/portal/salesAgents/${newId}`);
      }
    } catch (error) {
      console.error("Erro ao submeter formulário:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isRendered) {
    return <div>Carregando...</div>;
  }

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

              {/* Campo oculto para idAddress */}
              <FormField
                control={form.control}
                name="idAddress"
                render={({ field }) => (
                  <input
                    type="hidden"
                    name="idAddress"
                    value={field.value?.toString() || ""}
                    onChange={field.onChange}
                  />
                )}
              />
            </CardContent>
          </Card>

          <Card className="w-full mt-4">
            <CardHeader className="flex flex-row items-center space-x-2">
              <MapPin className="w-5 h-5" />
              <CardTitle>Endereço</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={addressForm.control}
                name="zipCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      CEP <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        maxLength={8}
                        value={field.value?.toString() || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={addressForm.control}
                name="street"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Rua <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value?.toString() || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={addressForm.control}
                  name="number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Número <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          value={field.value?.toString() || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={addressForm.control}
                  name="complement"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Complemento</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          value={field.value?.toString() || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={addressForm.control}
                name="neighborhood"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Bairro <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value?.toString() || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={addressForm.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Cidade <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          value={field.value?.toString() || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={addressForm.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Estado <span className="text-red-500">*</span>
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value || undefined}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Digite a sigla do estado" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {states.map((state) => (
                            <SelectItem key={state.value} value={state.value}>
                              {state.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={addressForm.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      País <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        defaultValue="Brasil"
                        value={field.value?.toString() || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
