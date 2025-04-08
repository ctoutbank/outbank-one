"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
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
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  Building,
  HelpCircle,
  Lock,
  Mail,
  User,
  UserCog,
  X,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { schemaUser, UserSchema } from "../schema/schema";
import {
  DD,
  getDDMerchants,
  InsertUser,
  updateUser,
  UserDetailForm,
} from "../server/users";

interface UserFormProps {
  user?: UserDetailForm;
  profiles: DD[];
  customers: DD[];
  permissions?: string[];
}

export default function UserForm({
  user,
  profiles,
  customers,
  permissions,
}: UserFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMerchants, setSelectedMerchants] = useState<string[]>(
    user?.selectedMerchants || []
  );
  const [selectedCustomer, setSelectedCustomer] = useState<string | undefined>(
    user?.idCustomer?.toString()
  );
  const [merchantsList, setMerchantsList] = useState<DD[]>([]);

  const filteredMerchants = useMemo(() => {
    if (!selectedCustomer) return [];
    return merchantsList.filter(
      (merchant) => !selectedMerchants.includes(merchant.id.toString())
    );
  }, [merchantsList, selectedMerchants, selectedCustomer]);
  console.log("merchantsList", merchantsList);
  console.log("filteredMerchants", filteredMerchants);

  const selectedMerchantsList = useMemo(() => {
    return merchantsList.filter((merchant) =>
      selectedMerchants.includes(merchant.id.toString())
    );
  }, [merchantsList, selectedMerchants]);

  const fetchMerchants = async (customerId: string) => {
    try {
      const merchants = await getDDMerchants(Number(customerId));
      setMerchantsList(merchants);
    } catch (error) {
      console.error("Error fetching merchants:", error);
      toast.error("Erro ao carregar estabelecimentos");
    }
  };

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
      idCustomer: user?.idCustomer?.toString(),
      fullAccess: user?.fullAccess || false,
      active: user?.active == undefined ? true : user?.active,
      selectedMerchants: selectedMerchants,
    },
  });

  const onSubmit = async (data: UserSchema) => {
    const loadingToastId = toast.loading("Salvando usuário...");
    try {
      setIsLoading(true);

      if (!user?.id && !data.password) {
        form.setError("password", {
          type: "manual",
          message: "Senha é obrigatória para novos usuários",
        });
        toast.dismiss(loadingToastId);
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
        idCustomer: Number(data.idCustomer),
        fullAccess: data.fullAccess || false,
        selectedMerchants: data.fullAccess ? [] : selectedMerchants,
      };

      if (data.id && data.id > 0) {
        await updateUser(data.id, userData);
        toast.dismiss(loadingToastId);
        toast.success("Usuário atualizado com sucesso!");
      } else {
        await InsertUser(userData);
        toast.dismiss(loadingToastId);
        toast.success("Usuário criado com sucesso!");
        router.push("/portal/users");
      }
    } catch (error) {
      console.error("Erro ao salvar usuário:", error);
      toast.dismiss(loadingToastId);
      toast.error("Erro ao salvar usuário. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleMerchantSelection = (merchantId: string) => {
    if (!selectedMerchants.includes(merchantId)) {
      setSelectedMerchants((prev) => [...prev, merchantId]);
    }
  };

  const handleRemoveMerchant = (merchantId: string) => {
    setSelectedMerchants((prev) => prev.filter((id) => id !== merchantId));
  };

  const handleCustomerChange = (value: string) => {
    setSelectedCustomer(value);
    form.setValue("idCustomer", value);
    // Clear selected merchants when customer changes
    setSelectedMerchants([]);
    // Fetch merchants for the selected customer
    fetchMerchants(value);
  };

  const hasFullAccess = form.watch("fullAccess");

  // Add useEffect to load merchants on component mount if there's a selected customer
  useEffect(() => {
    if (selectedCustomer) {
      fetchMerchants(selectedCustomer);
    }
  }, []); // Run only on mount

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center">
                    <Lock className="h-4 w-4 mr-1" />
                    Senha{" "}
                    {!user?.id && (
                      <span className="text-destructive ml-1">*</span>
                    )}
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
                  <FormLabel className="flex items-center">
                    <UserCog className="h-4 w-4 mr-1" />
                    Perfil <span className="text-destructive ml-1">*</span>
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
            <FormField
              control={form.control}
              name="idCustomer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center">
                    Cliente <span className="text-destructive ml-1">*</span>
                  </FormLabel>
                  <Select
                    onValueChange={handleCustomerChange}
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

            {selectedCustomer && (
              <>
                <FormField
                  control={form.control}
                  name="fullAccess"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="flex items-center">
                        <FormLabel className="font-medium m-0">
                          Acesso Total
                        </FormLabel>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 ml-1 p-0"
                              >
                                <HelpCircle className="h-4 w-4 text-muted-foreground" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent className="max-w-xs">
                              Quando marcado, o usuário terá acesso a todos os
                              estabelecimentos deste cliente.
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </FormItem>
                  )}
                />

                {!hasFullAccess && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <FormLabel className="flex items-center">
                        Estabelecimentos{" "}
                        <span className="text-destructive ml-1">*</span>
                      </FormLabel>

                      <div className="flex items-center space-x-2">
                        <Select
                          onValueChange={handleMerchantSelection}
                          value=""
                          disabled={filteredMerchants.length === 0}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue
                                placeholder={
                                  filteredMerchants.length === 0
                                    ? "Todos os estabelecimentos já foram selecionados"
                                    : "Selecione o estabelecimento"
                                }
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {filteredMerchants.map((merchant) => (
                              <SelectItem
                                key={merchant.id}
                                value={merchant.id.toString()}
                              >
                                {merchant.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <Separator className="my-4" />

                    {selectedMerchantsList.length > 0 ? (
                      <div>
                        <div className="mb-2 flex items-center justify-between">
                          <h3 className="font-medium">
                            Estabelecimentos selecionados
                          </h3>
                          <Badge variant="outline">
                            {selectedMerchantsList.length}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {selectedMerchantsList.map((merchant) => (
                            <div
                              key={merchant.id}
                              className="flex items-center justify-between py-1.5 px-3 rounded-md border bg-background hover:bg-accent/10 transition-colors"
                            >
                              <span className="text-sm font-medium truncate">
                                {merchant.name}
                              </span>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() =>
                                  handleRemoveMerchant(merchant.id.toString())
                                }
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
                  </div>
                )}

                {hasFullAccess && (
                  <div className="rounded-md border p-4 bg-muted/30">
                    <div className="flex items-center text-sm">
                      <Building className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>
                        O usuário terá acesso a todos os estabelecimentos deste
                        cliente
                      </span>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-between">
          <Link href="/portal/users">
            <Button type="button" variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
          </Link>
          {(user?.id && permissions?.includes("Gerenciador")) || !user?.id ? (
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Salvando..." : "Salvar"}
            </Button>
          ) : null}
        </div>
      </form>
    </Form>
  );
}
