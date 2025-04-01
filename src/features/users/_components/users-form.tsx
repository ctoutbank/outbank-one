"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { schemaUser, UserSchema } from "../schema/schema";
import { DD, InsertUser, updateUser, UserDetailForm } from "../server/users";
import { toast } from "sonner";

interface UserFormProps {
  user?: UserDetailForm;
  profiles: DD[];
  merchants: DD[];
  customers: DD[];
  permissions?: string[];
}

export default function UserForm({
  user,
  profiles,
  merchants,
  customers,
  permissions,
}: UserFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<UserSchema>({
    resolver: zodResolver(schemaUser),
    defaultValues: {
      id: user?.id || 0,
      slug: user?.slug || "",
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      password: "",
      idProfile: user?.idProfile?.toString(),
      idMerchant: user?.idMerchant?.toString(),
      idCustomer: user?.idCustomer?.toString(),
      isEstablishment: user?.idMerchant ? true : false,
      active: user?.active == undefined ? true : user?.active,
    },
  });

  const onSubmit = async (data: UserSchema) => {
    try {
      setIsLoading(true);
      toast.loading("Salvando usuário...");

      // Validação adicional da senha
      if (!user?.id && !data.password) {
        form.setError("password", {
          type: "manual",
          message: "Senha é obrigatória para novos usuários",
        });
        toast.error("Senha é obrigatória para novos usuários");
        return;
      }

      const userData: UserDetailForm = {
        id: data.id || 0,
        slug: data.slug || "",
        active: data.active || true,
        dtinsert: new Date().toISOString(),
        dtupdate: new Date().toISOString(),
        idClerk: data.idClerk || "",
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        idProfile: Number(data.idProfile),
        idMerchant: data.isEstablishment ? Number(data.idMerchant) : null,
        idCustomer: data.isEstablishment ? Number(data.idCustomer) : null,
      };

      if (data.id && data.id > 0) {
        await updateUser(data.id, userData);
        toast.success("Usuário atualizado com sucesso!");
      } else {
        await InsertUser(userData);
        toast.success("Usuário criado com sucesso!");
        router.push("/portal/users");
      }
    } catch (error) {
      console.error("Erro ao salvar usuário:", error);
      toast.error("Erro ao salvar usuário. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Informações do Usuário</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Primeiro Nome <span className="text-destructive">*</span>
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
                    <FormLabel>
                      Último Nome <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Digite o último nome" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    E-mail <span className="text-destructive">*</span>
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
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Senha{" "}
                    {!user?.id && <span className="text-destructive">*</span>}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder={
                        user?.id
                          ? "Digite a nova senha (opcional)"
                          : "Digite a senha"
                      }
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="idProfile"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Perfil <span className="text-destructive">*</span>
                  </FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(value)}
                    defaultValue={field.value ? field.value.toString() : ""}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o perfil" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {profiles.map((profile) => (
                        <SelectItem
                          key={profile.id}
                          value={profile.id.toString()}
                        >
                          {profile.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isEstablishment"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="font-normal">
                    Marcar como estabelecimento
                  </FormLabel>
                </FormItem>
              )}
            />

            {form.watch("isEstablishment") && (
              <>
                <FormField
                  control={form.control}
                  name="idMerchant"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Estabelecimento{" "}
                        <span className="text-destructive">*</span>
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o estabelecimento" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {merchants.map((merchant) => (
                            <SelectItem
                              key={merchant.id}
                              value={merchant.id.toString()}
                            >
                              {merchant.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="idCustomer"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Cliente <span className="text-destructive">*</span>
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o cliente" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {customers.map((customer) => (
                            <SelectItem
                              key={customer.id}
                              value={customer.id.toString()}
                            >
                              {customer.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-between">
          <Link href="/portal/users">
            <Button type="button" variant="outline">
              Voltar
            </Button>
          </Link>
          {(!user?.id && permissions?.includes("Inserir")) ||
          (user?.id && permissions?.includes("Atualizar")) ? (
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Salvando..." : "Salvar"}
            </Button>
          ) : null}
        </div>
      </form>
    </Form>
  );
}
