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
import { states } from "@/lib/lookuptables/lookuptables";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    ArrowLeft,
    Building,
    HelpCircle,
    Mail,
    MapPin,
    User,
    X,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
    AddressSchema, SalesAgentSchema,
    SchemaAddress,
    schemaUser,
    UserSchema,
} from "../schema/schema";
import {
    createSalesAgent,
    DD,
    getAddressById,
    getDDMerchants,
    getProfileById,
    insertAddressFormAction,
    InsertUser,
    updateAddressFormAction,
    updateUser,
    UserDetailForm,
    UserInsert,
} from "../server/users";
import {SchemaSalesAgent} from "@/features/salesAgents/schema/salesAgentsSchema";

interface UserFormProps {
    user?: UserDetailForm;
    profiles: DD[];
    customers: DD[];
    permissions?: string[];
    salesAgent?: SalesAgentSchema;
}


export default function UserForm({user, permissions, salesAgent}: UserFormProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [selectedMerchants, setSelectedMerchants] = useState<string[]>(
        user?.selectedMerchants || []
    );
    const [selectedCustomer,] = useState<string | undefined>(
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
            idProfile: "12",
            idCustomer: "1",
            fullAccess: user?.fullAccess || false,
            active: user?.active == undefined ? true : user?.active,
            selectedMerchants: selectedMerchants,
        },
    });

    const addressForm = useForm<AddressSchema>({
        resolver: zodResolver(SchemaAddress),
        defaultValues: {
            id: undefined,
            zipCode: "",
            streetAddress: "",
            streetNumber: "",
            complement: "",
            neighborhood: "",
            city: "",
            state: "",
            country: "Brasil",
        },
    });

    const salesAgentForm = useForm<SalesAgentSchema>({
        resolver: zodResolver(SchemaSalesAgent),
        defaultValues: {
            ...salesAgent,
            id: salesAgent?.id,
            firstName: salesAgent?.firstName || "",
            lastName: salesAgent?.lastName || "",
            email: salesAgent?.email || "",
            cpf: salesAgent?.cpf || "",
            phone: salesAgent?.phone || "",
            birthDate: salesAgent?.birthDate,
        }
    })

    useEffect(() => {
        async function loadAddress() {
            if (user?.idAddress) {
                try {
                    const addressData = await getAddressById(user.idAddress);
                    if (addressData) {
                        addressForm.reset({
                            id: addressData.id,
                            zipCode: addressData.zipCode || "",
                            streetAddress: addressData.streetAddress || "",
                            streetNumber: addressData.streetNumber || "",
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
    }, [user?.idAddress, addressForm]);

    const onSubmit = async (data: UserSchema) => {


        console.log("Enviado", data);
        const loadingToastId = toast.loading("Salvadndo usuário...");
        try {


            // Validar formulário de endereço
            if (!addressForm.formState.isValid) {
                const valid = await addressForm.trigger();
                if (!valid) {
                    console.error("Formulário de endereço inválido");
                    toast.dismiss(loadingToastId);
                    toast.error(
                        "Por favor, preencha todos os  campos obrigatórios do endereço"
                    );
                    return;
                }
            }

            // Salvar endereço
            const addressData = addressForm.getValues();
            let addressId = user?.idAddress;

            try {
                if (addressData.id) {
                    addressId = await updateAddressFormAction(addressData);
                } else {
                    addressId = await insertAddressFormAction(addressData);
                }
            } catch (error) {
                console.error("Erro ao salvar endereço:", error);
                toast.dismiss(loadingToastId);
                toast.error("Erro ao salvar endereço. Tente novamente.");
                return;
            }

            console.log("Endereço salvo com ID:", addressId);

            if (data.id && data.id > 0) {
                // Atualizar usuário existente
                try {
                    const userData: UserInsert = {
                        firstName: data.firstName,
                        lastName: data.lastName,
                        email: data.email,
                        idProfile: 12,
                        idCustomer: 1,
                        idAddress: addressId,
                        fullAccess: data.fullAccess || false,
                        selectedMerchants: data.fullAccess ? [] : selectedMerchants,
                        active: data.active || true,
                        idClerk: data.idClerk || null,

                        dtinsert: new Date().toISOString(),
                        dtupdate: new Date().toISOString(),
                    };

                    await updateUser(data.id, userData);
                    toast.dismiss(loadingToastId);
                    toast.success("Usuário atualizado com sucesso!");

                    // Verificação de perfil para usuário existente
                    const profileId = 12;
                    const profileInfo = await getProfileById(profileId);

                    if (profileInfo && profileInfo.isSalesAgent) {
                        console.log(
                            "Perfil de Consultor Comercial detectado, criando registro de agente de vendas"
                        );

                        try {

                            const salesAgentData = salesAgentForm.getValues();
                            // Criar registro de agente de vendas associado ao usuário
                            await createSalesAgent(
                                data.id,
                                data.firstName,
                                data.lastName,
                                data.email,
                                salesAgentData.cpf || "",
                                salesAgentData.phone || "",
                                salesAgentData.birthDate
                                    ? (salesAgentData.birthDate as Date).toISOString()
                                    : "",

                            );
                        } catch (salesAgentError) {
                            console.error(
                                "Erro ao criar consultor comercial:",
                                salesAgentError
                            );
                            toast.error(
                                "Erro ao criar Consultor Comercial. Usuário atualizado, mas operação de consultor falhou."
                            );
                        }
                    }
                } catch (updateError) {
                    console.error("Erro ao atualizar usuário:", updateError);
                    toast.dismiss(loadingToastId);
                    toast.error("Erro ao atualizar usuário. Tente novamente.");
                }
            } else {
                // Criar novo usuário
                try {
                    const newUserData: UserInsert = {
                        firstName: data.firstName,
                        lastName: data.lastName,
                        email: data.email,
                        idProfile: 12,
                        idCustomer: 1,
                        idAddress: addressId,
                        fullAccess: data.fullAccess || false,
                        selectedMerchants: data.fullAccess ? [] : selectedMerchants,
                        active: true,
                        idClerk: null,

                        dtinsert: new Date().toISOString(),
                        dtupdate: new Date().toISOString(),
                    };



                    const idCustomer = parseInt(data.idCustomer ?? "0");
                    if (isNaN(idCustomer)) {
                        throw new Error("idCustomer inválido.");
                    }
                    console.log("dados", data)
                    const newUser = await InsertUser(newUserData);
                    const newUserId = newUser[0].id;
                    toast.dismiss(loadingToastId);
                    toast.success("Usuário criado com sucesso!");


                    // Verificação de perfil para novo usuário
                    const profileId = Number(data.idProfile);
                    const profileInfo = await getProfileById(profileId);

                    if (profileInfo && profileInfo.isSalesAgent) {
                        console.log(
                            "Perfil de Consultor Comercial detectado, criando registro de agente de vendas"
                        );

                        try {
                            const salesAgentData = salesAgentForm.getValues();

                            // Criar registro de agente de vendas associado ao usuário
                            await createSalesAgent(
                                newUserId,
                                data.firstName,
                                data.lastName,
                                data.email,
                                salesAgentData.cpf || "",
                                salesAgentData.phone || "",
                                salesAgentData.birthDate
                                    ? (salesAgentData.birthDate as Date).toISOString()
                                    : "",
                            );
                        } catch (salesAgentError) {
                            console.error(
                                "Erro ao criar consultor comercial:",
                                salesAgentError
                            );
                        }
                    }
                    router.push("/portal/users");
                } catch (createError: any) {
                    toast.dismiss(loadingToastId);

                    if (createError.errors && createError.errors.length > 0) {
                        // Outros erros do Clerk
                        toast.error(
                            createError.errors[0].message || "Erro ao criar usuário"
                        );
                    } else {
                        // Mensagem genérica de erro
                        toast.error(
                            "Erro ao criar usuário. Verifique se o email já está em uso ou se a senha atende aos requisitos."
                        );
                    }
                }
            }
        } catch (error) {
            console.error("Erro ao submeter formulário:", error);
            toast.dismiss(loadingToastId);
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error("Erro ao salvar usuário. Tente novamente.");
            }
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


    const hasFullAccess = form.watch("fullAccess");

    useEffect(() => {
        if (selectedCustomer) {
            fetchMerchants(selectedCustomer);
        }
    }, []);



    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(
                (data) => {
                    console.log("✅ Submit OK", data);
                    onSubmit(data);
                },
                (errors) => {
                    console.error("Erros de validação", Object.keys(errors));
                    toast.error("Preencha todos os campos obrigatórios.");
                }
            )} className="space-y-6">
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
                                control={salesAgentForm.control}
                                name="phone"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="flex items-center">
                                            <Mail className="h-4 w-4 mr-1" />
                                            Telefone <span className="text-destructive ml-1">*</span>
                                        </FormLabel>
                                        <FormControl>
                                            <Input placeholder="Digite o telefone do novo consultor" maxLength={11} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={salesAgentForm.control}
                                name="birthDate"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="flex items-center">
                                            <Mail className="h-4 w-4 mr-1" />
                                            Data de nascimento <span className="text-destructive ml-1">*</span>
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type="date"
                                                placeholder="Data de Nascimento"
                                                value={field.value ? field.value.toISOString().split("T")[0] : ""}
                                                onChange={(e) => field.onChange(new Date(e.target.value))}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={salesAgentForm.control}
                                name="cpf"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="flex items-center">
                                            Cpf{" "}
                                            <span className="text-destructive ml-1">*</span>
                                        </FormLabel>
                                        <FormControl>
                                            <Input placeholder="Digite o cpf do novo consultor" maxLength={11} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        </div>
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
                            name="streetAddress"
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
                                name="streetNumber"
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
                                control={addressForm.control}
                                name="complement"
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
                                            <Input {...field} value={field.value?.toString() || ""} />
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
