"use client";

import { Calendar, Edit, MoreHorizontal, Trash2, Users } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatDate } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@radix-ui/react-accordion";
import { deleteProfile, type ProfileList } from "../server/profiles";

interface ProfilesListProps {
  profileList: ProfileList;
}

export default function ProfilesList({ profileList }: ProfilesListProps) {
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const profiles = profileList.profiles;
  const handleDelete = async (profileId: number) => {
    try {
      setIsDeleting(profileId);
      await deleteProfile(profileId);
    } catch (error) {
      console.error("Error deleting profile:", error);
    } finally {
      setIsDeleting(null);
    }
  };
  console.log(profiles);
  return (
    <div className="w-full rounded-md border">
      <div className="min-w-[1040px]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-semibold w-[30%] text-black">
                Nome do Perfil
              </TableHead>
              <TableHead className="font-semibold w-[20%] text-black">
                Descrição
              </TableHead>
              <TableHead className="font-semibold w-[15%] text-center text-black">
                Data de Criação
              </TableHead>
              <TableHead className="font-semibold w-[15%] text-center text-black">
                Última Atualização
              </TableHead>
              <TableHead className="font-semibold w-[15%] text-center text-black">
                Usuários
              </TableHead>
              <TableHead className="font-semibold w-[5%] text-black"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {profiles?.map((profile) => (
              <tr key={profile.id} className="w-full">
                <td colSpan={6} className="p-0 border-0">
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem
                      value={profile.id.toString()}
                      className="border-0"
                    >
                      <AccordionTrigger className="hover:no-underline w-full py-1 border-b border-gray-200">
                        <Table>
                          <TableBody>
                            <TableRow>
                              <TableCell className="w-[30%] text-muted-foreground">
                                <div className="flex items-center gap-2">
                                  {profile.name}
                                  {profile.name.includes("[PADRÃO]") && (
                                    <Badge
                                      variant="outline"
                                      className="bg-blue-50 text-blue-700 border-blue-200"
                                    >
                                      Padrão
                                    </Badge>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell className="w-[20%] text-left text-muted-foreground">
                                {profile.description || "Sem descrição"}
                              </TableCell>
                              <TableCell className="w-[15%] text-center text-muted-foreground">
                                {formatDate(new Date(profile.dtinsert))}
                              </TableCell>
                              <TableCell className="w-[15%] text-center text-muted-foreground">
                                {formatDate(new Date(profile.dtupdate))}
                              </TableCell>
                              <TableCell className="w-[15%] text-center text-muted-foreground">
                                <div className="flex items-center justify-center gap-1">
                                  <Users className="h-4 w-4" />
                                  <span>{profile.users || 0}</span>
                                </div>
                              </TableCell>
                              <TableCell className="w-[5%] text-right">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <Link
                                      href={`/portal/users/profile/${profile.id}`}
                                    >
                                      <DropdownMenuItem>
                                        <Edit className="mr-2 h-4 w-4" />
                                        Editar
                                      </DropdownMenuItem>
                                    </Link>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                      onClick={() => handleDelete(profile.id)}
                                      className="text-destructive"
                                      disabled={isDeleting === profile.id}
                                    >
                                      <Trash2 className="mr-2 h-4 w-4" />
                                      {isDeleting === profile.id
                                        ? "Excluindo..."
                                        : "Excluir"}
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </AccordionTrigger>

                      <AccordionContent className="border-t bg-muted/40 border-b-2 border-gray-200">
                        <div className="p-4">
                          <div className="rounded-lg bg-white shadow-sm border border-gray-200">
                            <div className="p-4">
                              <div className="flex items-center gap-2 mb-4">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm text-muted-foreground">
                                  Criado em{" "}
                                  {formatDate(new Date(profile.dtinsert))} •
                                  Atualizado em{" "}
                                  {formatDate(new Date(profile.dtupdate))}
                                </span>
                              </div>

                              {profile.functions.length > 0 ? (
                                <Tabs
                                  defaultValue={profile.functions[0]?.name}
                                  className="w-full"
                                >
                                  <TabsList className="mb-4">
                                    {profile.functions.map((module) => (
                                      <TabsTrigger
                                        key={module.name}
                                        value={module.name}
                                      >
                                        {module.name}
                                      </TabsTrigger>
                                    ))}
                                  </TabsList>

                                  {profile.functions.map((module) => (
                                    <TabsContent
                                      key={module.name}
                                      value={module.name}
                                      className="mt-0"
                                    >
                                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {module.group.map((group) => (
                                          <Card
                                            key={group.id}
                                            className="overflow-hidden"
                                          >
                                            <CardHeader className="p-3 pb-1">
                                              <h4 className="font-medium text-sm">
                                                {group.id}
                                              </h4>
                                            </CardHeader>
                                            <CardContent className="p-3 pt-1">
                                              <div className="flex flex-wrap gap-1">
                                                {group.functions?.map(
                                                  (func) => (
                                                    <Badge
                                                      key={func.id}
                                                      variant="secondary"
                                                      className="bg-muted text-muted-foreground"
                                                    >
                                                      {func.name}
                                                    </Badge>
                                                  )
                                                )}
                                              </div>
                                            </CardContent>
                                          </Card>
                                        ))}
                                      </div>
                                    </TabsContent>
                                  ))}
                                </Tabs>
                              ) : (
                                <div className="text-center py-6 text-muted-foreground">
                                  Este perfil não possui funções atribuídas
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </td>
              </tr>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
