"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Plus, Save, Trash2 } from "lucide-react";

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
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

import Link from "next/link";
export interface Functions {
  id: number;
  name: string;
}

export interface Group {
  group: string;
  functions: Functions[];
}

export interface Module {
  id: number;
  name: string;
  group: Group[];
}

export interface ProfileDetailForm {
  name: string;
  description: string;
  module: Module[];
}

// Legacy types for backward compatibility
export type Feature = {
  id: string;
  name: string;
};

export type Concept = {
  id: string;
  name: string;
  description: string;
  features: Feature[];
};

export type ModuleOld = {
  id: string;
  name: string;
};

export type ModuleWithConcepts = {
  module: ModuleOld;
  concepts: Concept[];
};

export type Permission = {
  conceptId: string;
  conceptName: string;
  features: string[];
};

export type ModulePermission = {
  moduleId: string;
  moduleName: string;
  permissions: Permission[];
};

export type Role = {
  id: string;
  name: string;
  description: string;
  isDefault?: boolean;
  modulePermissions: ModulePermission[];
};

// Schema for profile validation
export const schemaProfile = z.object({
  id: z.number().optional(),
  slug: z.string().optional(),
  name: z.string().min(1, "O nome é obrigatório"),
  description: z
    .string()
    .min(1, "A descrição é obrigatória")
    .max(500, "Limite de 500 caracteres"),
  functions: z.array(
    z
      .string()
      .min(1, "Funcionalidade inválida")
      .min(1, "Ao menos uma funcionalidade deve ser selecionada")
  ),
});

type ProfileFormValues = z.infer<typeof schemaProfile>;

// Mock data for available modules and functions
const availableModules: Module[] = [
  {
    id: 1,
    name: "Adquirência",
    group: [
      {
        group: "Agenda de Antecipações",
        functions: [
          { id: 1, name: "Listar" },
          { id: 2, name: "Criar" },
          { id: 3, name: "Editar" },
          { id: 4, name: "Excluir" },
        ],
      },
      {
        group: "Gestão de Lojistas",
        functions: [
          { id: 5, name: "Listar" },
          { id: 6, name: "Criar" },
          { id: 7, name: "Editar" },
          { id: 8, name: "Desativar" },
        ],
      },
      {
        group: "Transações",
        functions: [
          { id: 9, name: "Visualizar" },
          { id: 10, name: "Cancelar" },
          { id: 11, name: "Estornar" },
        ],
      },
      {
        group: "Terminais",
        functions: [
          { id: 12, name: "Listar" },
          { id: 13, name: "Configurar" },
          { id: 14, name: "Bloquear" },
        ],
      },
    ],
  },
  {
    id: 2,
    name: "Banco",
    group: [
      {
        group: "Contas",
        functions: [
          { id: 15, name: "Listar" },
          { id: 16, name: "Criar" },
          { id: 17, name: "Editar" },
          { id: 18, name: "Bloquear" },
        ],
      },
      {
        group: "Transferências",
        functions: [
          { id: 19, name: "Listar" },
          { id: 20, name: "Criar" },
          { id: 21, name: "Aprovar" },
          { id: 22, name: "Cancelar" },
        ],
      },
      {
        group: "Cartões",
        functions: [
          { id: 23, name: "Listar" },
          { id: 24, name: "Emitir" },
          { id: 25, name: "Bloquear" },
          { id: 26, name: "Definir Limites" },
        ],
      },
    ],
  },
  {
    id: 3,
    name: "Administração",
    group: [
      {
        group: "Usuários",
        functions: [
          { id: 27, name: "Listar" },
          { id: 28, name: "Criar" },
          { id: 29, name: "Editar" },
          { id: 30, name: "Desativar" },
        ],
      },
      {
        group: "Perfis de Acesso",
        functions: [
          { id: 31, name: "Listar" },
          { id: 32, name: "Criar" },
          { id: 33, name: "Editar" },
          { id: 34, name: "Excluir" },
        ],
      },
    ],
  },
];

// Props interface for the component
interface ProfileFormProps {
  profile?: ProfileDetailForm;
}

export default function ProfileManagement({ profile }: ProfileFormProps = {}) {
  const [selectedModule, setSelectedModule] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<number | null>(null);
  const [selectedModules, setSelectedModules] = useState<Module[]>(
    profile?.module || []
  );

  // Initialize form with default values or existing profile data
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(schemaProfile),
    defaultValues: profile
      ? {
          id: profile.module[0]?.id,
          name: profile.name,
          description: profile.description,
          functions: profile.module.flatMap((module) =>
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

  // Add a module to the form
  const handleAddModule = () => {
    if (!selectedModule) return;

    const moduleToAdd = availableModules.find((m) => m.id === selectedModule);
    if (!moduleToAdd) return;

    setSelectedModules([...selectedModules, moduleToAdd]);
    setSelectedModule(null);
    setActiveTab(moduleToAdd.id);
  };

  // Remove a module from the form
  const handleRemoveModule = (moduleId: number) => {
    const updatedModules = selectedModules.filter((m) => m.id !== moduleId);
    setSelectedModules(updatedModules);

    // Update active tab if needed
    if (activeTab === moduleId) {
      setActiveTab(updatedModules.length > 0 ? updatedModules[0].id : null);
    }
  };

  // Toggle a function selection
  const handleFunctionToggle = (functionId: number, checked: boolean) => {
    const currentFunctions = form.getValues().functions || [];

    if (checked) {
      form.setValue("functions", [...currentFunctions, functionId.toString()]);
    } else {
      form.setValue(
        "functions",
        currentFunctions.filter((id) => id !== functionId.toString())
      );
    }
  };

  // Check if a function is selected
  const isFunctionSelected = (functionId: number) => {
    const functions = form.getValues().functions || [];
    return functions.includes(functionId.toString());
  };

  // Select all functions in a group
  const handleSelectAllFunctions = (
    groupFunctions: Functions[],
    checked: boolean
  ) => {
    const currentFunctions = form.getValues().functions || [];
    const functionIds = groupFunctions.map((f) => f.id.toString());

    if (checked) {
      // Add all functions that aren't already selected
      const newFunctions = [...currentFunctions];
      functionIds.forEach((id) => {
        if (!newFunctions.includes(id)) {
          newFunctions.push(id);
        }
      });
      form.setValue("functions", newFunctions);
    } else {
      // Remove all functions from this group
      form.setValue(
        "functions",
        currentFunctions.filter((id) => !functionIds.includes(id))
      );
    }
  };

  // Check if all functions in a group are selected
  const areAllFunctionsSelected = (groupFunctions: Functions[]) => {
    const functions = form.getValues().functions || [];
    return groupFunctions.every((func) =>
      functions.includes(func.id.toString())
    );
  };

  // Get the count of selected functions in a group
  const getSelectedFunctionsCount = (groupFunctions: Functions[]) => {
    const functions = form.getValues().functions || [];
    return groupFunctions.filter((func) =>
      functions.includes(func.id.toString())
    ).length;
  };

  const onSubmit = (data: ProfileFormValues) => {
    console.log("Form submitted:", data);

    // Convert form data to ProfileDetailForm structure
    const profileData: ProfileDetailForm = {
      name: data.name,
      description: data.description,
      module: selectedModules
        .map((module) => ({
          ...module,
          group: module.group
            .map((group) => ({
              ...group,
              functions: group.functions.filter((func) =>
                data.functions.includes(func.id.toString())
              ),
            }))
            .filter((group) => group.functions.length > 0),
        }))
        .filter((module) => module.group.length > 0),
    };

    console.log("Structured profile data:", profileData);

    // Here you would typically send this data to your API
  };

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid md:grid-cols-3 gap-6">
            {/* Left column - Basic info */}
            <div className="md:col-span-1">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Informações Básicas</CardTitle>
                  <CardDescription>
                    Configure as informações básicas do perfil de acesso
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Nome do Perfil{" "}
                            <span className="text-destructive">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Ex: Gerente de Vendas"
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
                        <FormItem>
                          <FormLabel>
                            Descrição do Perfil{" "}
                            <span className="text-destructive">*</span>
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Descreva a finalidade deste perfil de acesso"
                              className="min-h-[100px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right column - Permissions */}
            <div className="md:col-span-2">
              <Card className="h-full">
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
                    Adicione e configure as permissões para este perfil de
                    acesso
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex flex-col gap-6">
                    {/* Add Module Section */}
                    <div className="space-y-2">
                      <Label className="text-base">Adicionar Módulo</Label>
                      <div className="flex gap-2">
                        <Select
                          value={selectedModule?.toString() || ""}
                          onValueChange={(value) =>
                            setSelectedModule(Number.parseInt(value))
                          }
                        >
                          <SelectTrigger className="flex-1">
                            <SelectValue placeholder="Selecione um módulo" />
                          </SelectTrigger>
                          <SelectContent>
                            {getAvailableModules().map((module) => (
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
                                className="bg-primary"
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
                      <p className="text-sm text-muted-foreground">
                        Selecione um módulo para adicionar ao perfil de acesso
                      </p>
                    </div>

                    <Separator />

                    {/* Module Permissions Section */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label className="text-base font-medium">
                          Funcionalidades
                        </Label>
                        {selectedModules.length > 0 && (
                          <Badge variant="outline" className="ml-2">
                            {selectedModules.length}{" "}
                            {selectedModules.length === 1
                              ? "módulo"
                              : "módulos"}
                          </Badge>
                        )}
                      </div>

                      {selectedModules.length === 0 ? (
                        <div className="flex flex-col items-center justify-center p-8 border border-dashed rounded-lg bg-muted/50">
                          <p className="text-muted-foreground text-center">
                            Nenhum módulo adicionado. Selecione módulos acima
                            para adicionar ao perfil.
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
                              <div className="space-y-4">
                                {module.group.map((group) => (
                                  <Card
                                    key={group.group}
                                    className="overflow-hidden border-l-4 border-l-primary"
                                  >
                                    <CardHeader className="py-4 px-6 bg-muted/30">
                                      <div className="flex items-center justify-between">
                                        <div>
                                          <CardTitle className="text-lg">
                                            {group.group}
                                          </CardTitle>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <Badge variant="outline">
                                            {getSelectedFunctionsCount(
                                              group.functions
                                            )}
                                            /{group.functions.length} permissões
                                          </Badge>
                                        </div>
                                      </div>
                                    </CardHeader>
                                    <CardContent className="p-6">
                                      <div className="flex items-center space-x-2 mb-4">
                                        <Checkbox
                                          id={`select-all-${module.id}-${group.group}`}
                                          checked={areAllFunctionsSelected(
                                            group.functions
                                          )}
                                          onCheckedChange={(checked) =>
                                            handleSelectAllFunctions(
                                              group.functions,
                                              checked as boolean
                                            )
                                          }
                                        />
                                        <Label
                                          htmlFor={`select-all-${module.id}-${group.group}`}
                                          className="font-medium"
                                        >
                                          Selecionar todas as permissões
                                        </Label>
                                      </div>
                                      <div className="grid grid-cols-2 gap-3 pl-6">
                                        {group.functions.map((func) => (
                                          <div
                                            key={func.id}
                                            className="flex items-center space-x-2"
                                          >
                                            <Checkbox
                                              id={`${module.id}-${group.group}-${func.id}`}
                                              checked={isFunctionSelected(
                                                func.id
                                              )}
                                              onCheckedChange={(checked) =>
                                                handleFunctionToggle(
                                                  func.id,
                                                  checked as boolean
                                                )
                                              }
                                            />
                                            <Label
                                              htmlFor={`${module.id}-${group.group}-${func.id}`}
                                            >
                                              {func.name}
                                            </Label>
                                          </div>
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
            </div>
          </div>

          <div className="flex justify-between">
            <Link href="/roles">
              <Button type="button" variant="outline" size="lg">
                Cancelar
              </Button>
            </Link>
            <Button type="submit" size="lg">
              <Save className="mr-2 h-4 w-4" />
              Salvar
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
