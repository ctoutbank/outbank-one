"use client"

import { useState } from "react"
import { Edit, MoreHorizontal, Plus, Search, Trash2 } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
export interface Functions {
  id: number
  name: string
}

export interface Group {
  group: string
  functions: Functions[]
}

export interface Module {
  id: number
  name: string
  group: Group[]
}

export interface ProfileDetailForm {
  name: string
  description: string
  module: Module[]
}

// Legacy types for backward compatibility
export type Feature = {
  id: string
  name: string
}

export type Concept = {
  id: string
  name: string
  description: string
  features: Feature[]
}

export type ModuleOld = {
  id: string
  name: string
}

export type ModuleWithConcepts = {
  module: ModuleOld
  concepts: Concept[]
}

export type Permission = {
  conceptId: string
  conceptName: string
  features: string[]
}

export type ModulePermission = {
  moduleId: string
  moduleName: string
  permissions: Permission[]
}

export type Role = {
  id: string
  name: string
  description: string
  isDefault?: boolean
  modulePermissions: ModulePermission[]
}



// Mock data for the example
const mockProfiles: ProfileDetailForm[] = [
  {
    name: "[PADRÃO] CNP Com Antecipação Eventual",
    description: "Perfil padrão para CNP com permissões de antecipação",
    module: [
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
            ],
          },
          {
            group: "Gestão de Lojistas",
            functions: [
              { id: 5, name: "Listar" },
              { id: 6, name: "Criar" },
            ],
          },
        ],
      },
    ],
  },
  {
    name: "[PADRÃO] CNP Sem Antecipação Eventual",
    description: "Perfil padrão para CNP sem permissões de antecipação",
    module: [
      {
        id: 1,
        name: "Adquirência",
        group: [
          {
            group: "Gestão de Lojistas",
            functions: [
              { id: 5, name: "Listar" },
              { id: 6, name: "Criar" },
            ],
          },
        ],
      },
    ],
  },
  {
    name: "Consultor com Onboarding",
    description: "Perfil para consultores com acesso ao onboarding",
    module: [
      {
        id: 1,
        name: "Adquirência",
        group: [
          {
            group: "Gestão de Lojistas",
            functions: [
              { id: 5, name: "Listar" },
              { id: 6, name: "Criar" },
              { id: 7, name: "Editar" },
            ],
          },
          {
            group: "Transações",
            functions: [{ id: 9, name: "Visualizar" }],
          },
        ],
      },
    ],
  },
  {
    name: "Gerente Financeiro",
    description: "Perfil para gerentes da área financeira",
    module: [
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
              { id: 21, name: "Aprovar" },
            ],
          },
        ],
      },
    ],
  },
  {
    name: "Administrador Completo",
    description: "Perfil com acesso completo ao sistema",
    module: [
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
            group: "Transações",
            functions: [
              { id: 9, name: "Visualizar" },
              { id: 10, name: "Cancelar" },
              { id: 11, name: "Estornar" },
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
    ],
  },
]

export default function ProfilesList() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredProfiles = mockProfiles.filter((profile) => {
    return (
      profile.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })

  const handleDelete = (profileName: string) => {
    console.log("Delete profile:", profileName)
    // Here you would typically call your API to delete the profile
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Perfis de Acesso</h1>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar perfis..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 w-[250px]"
            />
          </div>
          <Link href="/roles/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Novo Perfil
            </Button>
          </Link>
        </div>
      </div>

      {filteredProfiles.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 border rounded-lg bg-muted/50">
          <p className="text-muted-foreground text-center">Nenhum perfil encontrado com os filtros selecionados.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredProfiles.map((profile, index) => (
            <Card key={index}>
              <CardHeader className="p-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="flex items-center gap-2">
                      {profile.name}
                      {profile.name.includes("[PADRÃO]") && (
                        <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                          Padrão
                        </span>
                      )}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">{profile.description}</p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <Link href={`/roles/${index}/edit`}>
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                      </Link>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleDelete(profile.name)} className="text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <Separator />
              <CardContent className="p-4">
                {profile.module.length > 0 && (
                  <Tabs defaultValue={profile.module[0].id.toString()} className="w-full">
                    <TabsList className="mb-4">
                      {profile.module.map((module) => (
                        <TabsTrigger key={module.id} value={module.id.toString()}>
                          {module.name}
                        </TabsTrigger>
                      ))}
                    </TabsList>

                    {profile.module.map((module) => (
                      <TabsContent key={module.id} value={module.id.toString()} className="mt-0">
                        <div className="space-y-2">
                          {module.group.map((group) => (
                            <div key={group.group} className="pl-2 border-l-2 border-muted">
                              <h4 className="font-medium text-sm">{group.group}</h4>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {group.functions.map((func) => (
                                  <span
                                    key={func.id}
                                    className="inline-flex items-center rounded-md bg-muted px-2 py-1 text-xs font-medium"
                                  >
                                    {func.name}
                                  </span>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </TabsContent>
                    ))}
                  </Tabs>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

