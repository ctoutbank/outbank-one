"use client";

import { PasswordInput } from "@/components/password-input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  UpdateMyProfile,
  UserDetailForm,
  validateCurrentPassword,
} from "@/features/users/server/users";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { ProfileFormValues, profileSchema } from "../schema/schema";

interface ProfileFormProps {
  profile?: UserDetailForm;
}

export default function ProfileForm({ profile }: ProfileFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      id: profile?.id || 0,
      firstName: profile?.firstName || "",
      lastName: profile?.lastName || "",
      email: profile?.email || "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Observar mudanças nos campos de senha
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      // Limpar erros quando o usuário digitar em qualquer campo de senha
      if (
        name &&
        ["currentPassword", "newPassword", "confirmPassword"].includes(name)
      ) {
        form.clearErrors(name);
      }

      // Verificar se as senhas correspondem quando alteradas
      const values = form.getValues();
      if (
        (name === "newPassword" || name === "confirmPassword") &&
        values.newPassword &&
        values.confirmPassword &&
        values.newPassword !== values.confirmPassword
      ) {
        form.setError("confirmPassword", {
          type: "manual",
          message: "As senhas não correspondem",
        });
      } else if (
        (name === "newPassword" || name === "confirmPassword") &&
        values.newPassword &&
        values.confirmPassword &&
        values.newPassword === values.confirmPassword
      ) {
        form.clearErrors("confirmPassword");
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

  // Função para formatar datas
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const onSubmit = async (data: ProfileFormValues) => {
    try {
      setIsLoading(true);
      const loadingToast = toast.loading("Atualizando perfil...");

      // Apenas tenta validar a senha atual se o usuário estiver tentando alterar a senha
      if (data.currentPassword) {
        try {
          const isCurrentPasswordValid = await validateCurrentPassword(
            data.currentPassword,
            profile?.idClerk || ""
          );

          if (!isCurrentPasswordValid) {
            toast.dismiss(loadingToast);
            toast.error("Senha atual incorreta");
            form.setError("currentPassword", {
              type: "manual",
              message: "Senha atual incorreta",
            });
            setIsLoading(false);
            return;
          }
        } catch (error) {
          toast.dismiss(loadingToast);
          console.error("Erro ao validar senha atual:", error);
          toast.error("Erro ao validar senha atual");
          setIsLoading(false);
          return;
        }
      }

      const userData = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.newPassword || "",
        idClerk: profile?.idClerk || "",
      };

      await UpdateMyProfile(userData);

      // Limpar campos de senha após o envio bem-sucedido
      form.setValue("currentPassword", "");
      form.setValue("newPassword", "");
      form.setValue("confirmPassword", "");

      toast.dismiss(loadingToast);
      toast.success("Perfil atualizado com sucesso!");
    } catch (error) {
      toast.dismiss();
      console.error("Erro ao atualizar perfil:", error);
      toast.error("Erro ao atualizar perfil. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card className="w-full mb-4">
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
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
                      Segundo Nome <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Digite o segundo nome" {...field} />
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
                    Email <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Digite seu email"
                      type="email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Separator className="my-4" />

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Alterar Senha</h3>

              <FormField
                control={form.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Senha Atual</FormLabel>
                    <FormControl>
                      <PasswordInput
                        id="currentPassword"
                        name="currentPassword"
                        label=""
                        placeholder="Digite sua senha atual"
                        value={field.value}
                        onChange={(value) => field.onChange(value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nova Senha</FormLabel>
                      <FormControl>
                        <PasswordInput
                          id="newPassword"
                          name="newPassword"
                          label=""
                          placeholder="Digite a nova senha"
                          value={field.value}
                          onChange={(value, isValid) => {
                            field.onChange(value);
                            // Se a senha não for válida e tiver conteúdo, definir um erro customizado
                            if (value && !isValid) {
                              form.setError("newPassword", {
                                type: "manual",
                                message:
                                  "A senha não atende aos requisitos de segurança",
                              });
                            } else {
                              form.clearErrors("newPassword");
                            }
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirmar Nova Senha</FormLabel>
                      <FormControl>
                        <PasswordInput
                          id="confirmPassword"
                          name="confirmPassword"
                          label=""
                          placeholder="Confirme a nova senha"
                          value={field.value}
                          onChange={(value) => field.onChange(value)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator className="my-4" />

            {profile && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Informações da Conta</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">
                      Data de Criação
                    </p>
                    <p className="text-sm">
                      {formatDate(profile.dtinsert || "")}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">
                      Última Atualização
                    </p>
                    <p className="text-sm">
                      {formatDate(profile.dtupdate ?? "")}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Voltar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
