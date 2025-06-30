"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { SalesAgentesDetail } from "@/features/salesAgents/server/salesAgent";
import {
  insertSalesAgent,
  SalesAgentInsert,
  updateSalesAgent,
} from "@/features/salesAgents/server/salesAgent";
import { DD } from "@/features/users/server/users";
import { states } from "@/lib/lookuptables/lookuptables";
import {formatCep, formatCPF, formatPhone} from "@/lib/regex";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  Building,
  Mail,
  MapPin,
  Phone,
  User,
  X,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { SalesAgentFormSchema, schemaSalesAgentForm } from "../schema/schema";

interface UserFormProps {
  profiles: DD[];
  customers: DD[];
  permissions?: string[];
  salesAgent?: SalesAgentFormSchema;
  merchantsList: DD[];
}

export default function SalesAgentsForm({
  permissions,
  salesAgent,
}: UserFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  // Garantir que salesAgent é do tipo SalesAgentFormSchema
  const defaultAgent: SalesAgentFormSchema = {
    id: salesAgent?.id || 0,
    firstName: salesAgent?.firstName || "",
    lastName: salesAgent?.lastName || "",
    email: salesAgent?.email || "",
    cpf: salesAgent?.cpf || "",
    phone: salesAgent?.phone || "",
    birthDate:
      typeof salesAgent?.birthDate === "string"
        ? new Date(salesAgent.birthDate)
        : salesAgent?.birthDate || undefined,
    idProfile: salesAgent?.idProfile ? String(salesAgent.idProfile) : undefined,
    idCustomer: salesAgent?.idCustomer
      ? String(salesAgent.idCustomer)
      : undefined,
    active: salesAgent?.active ?? true,
    address: {
      zipCode: salesAgent?.address?.zipCode || "",
      streetAddress: salesAgent?.address?.streetAddress || "",
      streetNumber: salesAgent?.address?.streetNumber || "",
      complement: salesAgent?.address?.complement || "",
      neighborhood: salesAgent?.address?.neighborhood || "",
      city: salesAgent?.address?.city || "",
      state: salesAgent?.address?.state || "",
      country: salesAgent?.address?.country || "Brasil",
    },
    selectedMerchants: Array.isArray(salesAgent?.selectedMerchants)
      ? salesAgent.selectedMerchants
      : [],
  };

  const form = useForm<SalesAgentFormSchema>({
    resolver: zodResolver(schemaSalesAgentForm),
    defaultValues: defaultAgent,
  });

  const handleRemoveMerchant = (merchantId: string) => {
    const current = form.getValues("selectedMerchants") || [];
    form.setValue(
      "selectedMerchants",
      current.filter((id) => id !== merchantId)
    );
  };

  // Submit consolidado
  const onSubmit = async (data: SalesAgentFormSchema) => {
    setIsLoading(true);

    if (salesAgent?.id) {
      // Cast seguro para SalesAgentesDetail
      const agentDb = salesAgent as unknown as SalesAgentesDetail;
      const salesAgentData: SalesAgentesDetail = {
        id: agentDb.id,
        slug: agentDb.slug || null,
        active: typeof data.active === "boolean" ? data.active : null,
        dtinsert: agentDb.dtinsert || null,
        dtupdate: new Date().toISOString(),
        firstName: data.firstName,
        lastName: data.lastName,
        documentId: data.cpf,
        email: data.email,
        slugCustomer: data.idCustomer || null,
        birthDate: data.birthDate ? data.birthDate.toISOString() : null,
        phone: data.phone,
        cpf: data.cpf,
        idUsers: agentDb.idUsers ?? null,
      };
      await updateSalesAgent(salesAgentData);
    } else {
      const salesAgentData: SalesAgentInsert = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        cpf: data.cpf,
        birthDate: data.birthDate?.toISOString() || null,
        streetAddress: data.address.streetAddress,
        streetNumber: data.address.streetNumber,
        complement: data.address.complement || null,
        neighborhood: data.address.neighborhood,
        city: data.address.city,
        state: data.address.state,
        country: data.address.country,
        zipCode: data.address.zipCode,
        selectedMerchants: data.selectedMerchants || null,
        idProfile: data.idProfile ? Number(data.idProfile) : null,
        idCustomer: data.idCustomer ? Number(data.idCustomer) : null,
        active: data.active,
        slug: "",
        dtinsert: new Date().toISOString(),
        dtupdate: new Date().toISOString(),
        documentId: data.cpf,
        slugCustomer: data.idCustomer,
        idUsers: null,
      };
      await insertSalesAgent(salesAgentData);
    }
    setIsLoading(false);
  };

  // Merchants filtrados
  const selectedMerchants = form.watch("selectedMerchants") || [];

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(
          (data) => {
            console.log("✅ Submit OK", data);
            onSubmit(data);
          },
          (errors) => {
            console.error("Erros de validação", errors);
            toast.error("Preencha todos os campos obrigatórios.");
          }
        )}
        className="space-y-6"
      >
        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-xl flex items-center">
              <User className="h-5 w-5 mr-2 text-primary" />
              Informações do Usuário
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      Primeiro Nome{" "}
                      <span className="text-destructive ml-1">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Digite o primeiro nome" {...field} />
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
                    <FormLabel className="flex items-center">
                      Último Nome{" "}
                      <span className="text-destructive ml-1">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Digite o último nome" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      <Mail className="h-4 w-4 mr-1" />
                      E-mail <span className="text-destructive ml-1">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Digite o e-mail" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      <Phone className="h-4 w-4 mr-1" />
                      Telefone <span className="text-destructive ml-1">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Digite o telefone do novo consultor"
                        value={formatPhone(field.value)}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value.replace(/\D/g, "").slice(0, 11)
                          )
                        }
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
                    <FormLabel className="flex items-center">
                      <Mail className="h-4 w-4 mr-1" />
                      Data de nascimento{" "}
                      <span className="text-destructive ml-1">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        placeholder="Data de Nascimento"
                        value={
                          field.value
                            ? field.value.toISOString().split("T")[0]
                            : ""
                        }
                        onChange={(e) =>
                          field.onChange(new Date(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="cpf"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      CPF <span className="text-destructive ml-1">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Digite o telefone do novo consultor"
                        value={formatCPF(field.value)}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value.replace(/\D/g, "").slice(0, 11)
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6"></div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-xl flex items-center">
              <Building className="h-5 w-5 mr-2 text-primary" />
              Estabelecimentos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {selectedMerchants.length > 0 ? (
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="font-medium">Estabelecimentos selecionados</h3>
                  <Badge variant="outline">{selectedMerchants.length}</Badge>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedMerchants.map((merchant) => (
                    <div
                      key={merchant}
                      className="flex items-center justify-between py-1.5 px-3 rounded-md border bg-background hover:bg-accent/10 transition-colors"
                    >
                      <span className="text-sm font-medium truncate">
                        {merchant}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveMerchant(merchant)}
                        className="h-6 w-6 text-muted-foreground hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center p-3 border border-dashed rounded-md">
                <p className="text-muted-foreground text-sm">
                  Nenhum estabelecimento selecionado
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="w-full mt-4">
          <CardHeader className="flex flex-row items-center space-x-2">
            <MapPin className="w-5 h-5" />
            <CardTitle>Endereço</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="address.zipCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    CEP <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                      <Input
                          placeholder="Digite o CEP do novo consultor"
                          value={formatCep(field.value)}
                          onChange={(e) => field.onChange(e.target.value.replace(/\D/g, '').slice(0, 11))}
                      />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address.streetAddress"
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
                control={form.control}
                name="address.streetNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Número <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value?.toString() || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address.complement"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Complemento</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value?.toString() || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="address.neighborhood"
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
                control={form.control}
                name="address.city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Cidade <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value?.toString() || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address.state"
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
              control={form.control}
              name="address.country"
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

        <div className="flex justify-between">
          <Link href="/portal/salesAgents">
            <Button type="button" variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
          </Link>
          {(salesAgent?.id && permissions?.includes("Gerenciador")) ||
          !salesAgent?.id ? (
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Salvando..." : "Salvar"}
            </Button>
          ) : null}
        </div>
      </form>
    </Form>
  );
}
