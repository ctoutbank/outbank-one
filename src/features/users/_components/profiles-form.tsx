"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2 } from "lucide-react";

import { useState } from "react";
import { useForm } from "react-hook-form";

import { Badge } from "@/components/ui/badge";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";
import { z } from "zod";
import {
  type Functions,
  insertProfile,
  type ModuleSelect,
  type ProfileDetailForm,
  updateProfile,
} from "../server/profiles";
import { toast } from "sonner";

interface ProfileFormProps {
  profile?: ProfileDetailForm;
  availableModules: ModuleSelect[]; // Alterado de DD[] | null para Module[]
}

export default function ProfileManagement({
  profile,
  availableModules = [],
}: ProfileFormProps) {
  const [selectedModule, setSelectedModule] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<number | null>(null);
  const [selectedModules, setSelectedModules] = useState<ModuleSelect[]>(
    profile?.module || []
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  console.log(profile);

  const form = useForm<{
    id?: number;
    name: string;
    description: string;
    functions: string[];
  }>({
    resolver: zodResolver(
      z.object({
        id: z.number().optional(),
        name: z.string().min(1, "O nome é obrigatório"),
        description: z
          .string()
          .min(1, "A descrição é obrigatória")
          .max(500, "Limite de 500 caracteres"),
        functions: z
          .array(z.string())
          .min(1, "Selecione pelo menos uma funcionalidade"),
      })
    ),
    defaultValues: profile
      ? {
          id: profile.id,
          name: profile.name,
          description: profile.description,
          functions: profile.module?.flatMap((module) =>
            module.group.flatMap((group) =>
              group.functions.map((func) => func.id.toString())
            )
          ),
        }
      : {
          name: "",
          description: "",
          functions: [],
        },
  });

  // Set active tab to first module if available and not already set
  if (selectedModules.length > 0 && !activeTab) {
    setActiveTab(selectedModules[0].id);
  }

  // Get available modules (those not already added)
  const getAvailableModules = () => {
    return availableModules.filter(
      (module) => !selectedModules.some((m) => m.id === module.id)
    );
  };

  const handleAddModule = () => {
    if (!selectedModule) return;
    const moduleToAdd = availableModules.find((m) => m.id == selectedModule);
    if (!moduleToAdd) return;
    setSelectedModules([...selectedModules, moduleToAdd]);
    setSelectedModule(null);
    setActiveTab(moduleToAdd.id);
    console.log(selectedModules);
  };

  const handleRemoveModule = (moduleId: number) => {
    const updatedModules = selectedModules.filter((m) => m.id !== moduleId);
    setSelectedModules(updatedModules);

    if (activeTab === moduleId) {
      setActiveTab(updatedModules.length > 0 ? updatedModules[0].id : null);
    }

    const currentFunctions = form.getValues().functions || [];
    const moduleToRemove = selectedModules.find((m) => m.id === moduleId);

    if (moduleToRemove) {
      const functionsToRemove = new Set(
        moduleToRemove.group.flatMap((group) =>
          group.functions.map((func) => func.id.toString())
        )
      );

      const updatedFunctions = currentFunctions.filter(
        (id) => !functionsToRemove.has(id)
      );
      form.setValue("functions", updatedFunctions);
    }
  };

  const handleSelectAllFunctions = (
    moduleId: number,
    groupId: string,
    groupFunctions: Functions[],
    checked: boolean
  ) => {
    form.setValue(
      "functions",
      [
        ...(form.getValues().functions || []),
        ...groupFunctions.map((f) => f.id.toString()),
      ].filter((v, i, a) => a.indexOf(v) === i)
    );

    if (checked) {
      // Adicionar todas as funções que não estão selecionadas
      const newFunctions = [...(form.getValues().functions || [])];
      groupFunctions.forEach((id) => {
        if (!newFunctions.includes(id.toString())) {
          newFunctions.push(id.toString());
        }
      });
      form.setValue("functions", newFunctions);
    } else {
      // Remover todas as funções deste grupo
      const functionsToRemove = new Set(
        groupFunctions.map((f) => f.id.toString())
      );
      form.setValue(
        "functions",
        form
          .getValues()
          .functions?.filter((id) => !functionsToRemove.has(id)) || []
      );
    }
  };

  // Check if all functions in a group are selected
  const areAllFunctionsSelected = (
    moduleId: number,
    groupId: string,
    groupFunctions: Functions[]
  ) => {
    const functions = form.getValues().functions || [];
    return groupFunctions.every((func) =>
      functions.includes(func.id.toString())
    );
  };

  // Get the count of selected functions in a group
  const getSelectedFunctionsCount = (
    moduleId: number,
    groupId: string,
    groupFunctions: Functions[]
  ) => {
    const functions = form.getValues().functions || [];
    return groupFunctions.filter((func) =>
      functions.includes(func.id.toString())
    ).length;
  };

  // Atualizar apenas a função onSubmit para converter para o novo formato
  const onSubmit = async (data: {
    id?: number;
    name: string;
    description: string;
    functions: string[];
  }) => {
    try {
      setIsSubmitting(true);
      toast.loading("Salvando perfil...");

      const profileData = {
        ...data,
        module: selectedModules,
      };

      if (data.id) {
        await updateProfile(data.id, profileData);
        toast.success("Perfil atualizado com sucesso!");
      } else {
        await insertProfile(profileData);
        toast.success("Perfil criado com sucesso!");
      }
    } catch (error) {
      console.error("Erro ao salvar perfil:", error);
      toast.error("Erro ao salvar perfil. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-6">
            {/* Basic Info Card with Module Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Informações Básicas</CardTitle>
                <CardDescription>
                  Configure as informações básicas do perfil de acesso
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4 flex items-center gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="w-1/4">
                        <FormLabel>
                          Nome do Perfil{" "}
                          <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Ex: Gerente de Vendas"
                            className="h-9"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem className="w-1/3">
                        <FormLabel>
                          Descrição do Perfil{" "}
                          <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Descreva a finalidade deste perfil de acesso"
                            className="min-h-[60px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Add Module Section - Moved inside Basic Info */}
                  <div className="pt-2 w-1/2">
                    <div className="flex justify-center flex-col gap-2">
                      <div className="flex-shrink-0">
                        <Label className="text-base">Adicionar Módulo</Label>
                      </div>
                      <div className="flex flex-1 gap-2">
                        <Select
                          value={selectedModule?.toString() || ""}
                          onValueChange={(value) =>
                            setSelectedModule(Number.parseInt(value))
                          }
                        >
                          <SelectTrigger className="h-9">
                            <SelectValue placeholder="Selecione um módulo" />
                          </SelectTrigger>
                          <SelectContent>
                            {getAvailableModules()?.map((module) => (
                              <SelectItem
                                key={module.id}
                                value={module.id.toString()}
                              >
                                {module.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                onClick={handleAddModule}
                                disabled={!selectedModule}
                                className="bg-primary h-9"
                                type="button"
                                size="sm"
                              >
                                <Plus className="h-4 w-4 mr-1" />
                                Adicionar
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Adicionar módulo ao perfil</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Selecione um módulo para adicionar ao perfil de acesso
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Permissions Card - Now below Basic Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                  </svg>
                  Permissões
                </CardTitle>
                <CardDescription>
                  Adicione e configure as permissões para este perfil de acesso
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-base font-medium">
                        Funcionalidades
                      </Label>
                      {selectedModules.length > 0 && (
                        <Badge variant="outline" className="ml-2">
                          {selectedModules.length}{" "}
                          {selectedModules.length === 1 ? "módulo" : "módulos"}
                        </Badge>
                      )}
                    </div>

                    {selectedModules.length === 0 ? (
                      <div className="flex flex-col items-center justify-center p-8 border border-dashed rounded-lg bg-muted/50">
                        <p className="text-muted-foreground text-center">
                          Nenhum módulo adicionado. Selecione módulos acima para
                          adicionar ao perfil.
                        </p>
                      </div>
                    ) : (
                      <Tabs
                        value={activeTab?.toString() || ""}
                        onValueChange={(value) =>
                          setActiveTab(Number.parseInt(value))
                        }
                        className="w-full"
                      >
                        <div className="flex items-center mb-4 border-b">
                          <TabsList className="h-10 bg-transparent p-0">
                            {selectedModules.map((module) => (
                              <TabsTrigger
                                key={module.id}
                                value={module.id.toString()}
                                className="data-[state=active]:bg-background data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 h-10"
                              >
                                {module.name}
                              </TabsTrigger>
                            ))}
                          </TabsList>
                          {activeTab && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="ml-auto text-muted-foreground hover:text-destructive"
                              onClick={() => handleRemoveModule(activeTab)}
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Remover módulo
                            </Button>
                          )}
                        </div>

                        {selectedModules.map((module) => (
                          <TabsContent
                            key={module.id}
                            value={module.id.toString()}
                            className="mt-0"
                          >
                            {/* Functionality cards side by side */}
                            <div className="flex flex-wrap max-h-[600px] gap-4 overflow-y-auto">
                              {module.group.map((group) => (
                                <Card
                                  key={group.id}
                                  className="overflow-hidden border-l-4 border-l-primary "
                                >
                                  <CardHeader className="py-4 px-2 bg-muted/30">
                                    <div className="flex items-center justify-between">
                                      <div>
                                        <CardTitle className="text-base">
                                          {group.id}
                                        </CardTitle>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <Badge variant="outline">
                                          {getSelectedFunctionsCount(
                                            module.id,
                                            group.id,
                                            group.functions
                                          )}
                                          /{group.functions.length} permissões
                                        </Badge>
                                      </div>
                                    </div>
                                  </CardHeader>
                                  <CardContent className="p-4">
                                    <div className="flex items-center space-x-2 mb-4">
                                      <Checkbox
                                        id={`select-all-${module.id}-${group.id}`}
                                        checked={areAllFunctionsSelected(
                                          module.id,
                                          group.id,
                                          group.functions
                                        )}
                                        onCheckedChange={(checked) =>
                                          handleSelectAllFunctions(
                                            module.id,
                                            group.id,
                                            group.functions,
                                            checked as boolean
                                          )
                                        }
                                      />
                                      <Label
                                        htmlFor={`select-all-${module.id}-${group.id}`}
                                        className="font-medium"
                                      >
                                        Selecionar todas as permissões
                                      </Label>
                                    </div>
                                    <div className="flex flex-wrap gap-2 pl-4">
                                      {group.functions.map((func) => (
                                        <FormField
                                          key={func.id}
                                          control={form.control}
                                          name="functions"
                                          render={({ field }) => {
                                            const functionId =
                                              func.id.toString();
                                            return (
                                              <FormItem
                                                key={func.id}
                                                className="flex flex-row items-start space-x-1.5 space-y-0"
                                              >
                                                <FormControl>
                                                  <Checkbox
                                                    id={`${module.id}-${group.id}-${func.id}`}
                                                    checked={field.value?.includes(
                                                      functionId
                                                    )}
                                                    onCheckedChange={(
                                                      checked
                                                    ) => {
                                                      if (checked) {
                                                        field.onChange([
                                                          ...field.value,
                                                          functionId,
                                                        ]);
                                                      } else {
                                                        field.onChange(
                                                          field.value?.filter(
                                                            (value) =>
                                                              value !==
                                                              functionId
                                                          )
                                                        );
                                                      }
                                                    }}
                                                  />
                                                </FormControl>
                                                <FormLabel
                                                  htmlFor={`${module.id}-${group.id}-${func.id}`}
                                                  className="font-normal text-sm"
                                                >
                                                  {func.name}
                                                </FormLabel>
                                              </FormItem>
                                            );
                                          }}
                                        />
                                      ))}
                                    </div>
                                  </CardContent>
                                </Card>
                              ))}
                            </div>
                          </TabsContent>
                        ))}
                      </Tabs>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-between">
              <Link href="/portal/users">
                <Button type="button" variant="outline" size="lg">
                  Voltar
                </Button>
              </Link>
              <Button type="submit" size="lg" disabled={isSubmitting}>
                {isSubmitting ? "Salvando..." : "Salvar"}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
