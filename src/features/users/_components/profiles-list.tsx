"use client";

import { MoreHorizontal, Trash2, Users } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate } from "@/lib/utils";
import { deleteProfile, type ProfileList } from "../server/profiles";

interface ProfilesListProps {
  profileList: ProfileList;
  permissions?: string[];
}

export default function ProfilesList({
  profileList,
  permissions,
}: ProfilesListProps) {
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
              {permissions?.includes("Gerenciador") && (
                <TableHead className="font-semibold w-[5%] text-black"></TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {profiles?.map((profile) => (
              <tr key={profile.id} className="w-full">
                <td className="p-4">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      {permissions?.includes("Gerenciador") ? (
                        <Link
                          href={`/portal/users/profile/${profile.id}`}
                          className="text-primary hover:underline"
                        >
                          {profile.name}
                        </Link>
                      ) : (
                        <span>{profile.name}</span>
                      )}
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex flex-col">
                    <span className="text-muted-foreground">
                      {profile.description}
                    </span>
                  </div>
                </td>
                <td className="text-center text-muted-foreground">
                  {formatDate(new Date(profile.dtinsert))}
                </td>
                <td className="text-center text-muted-foreground">
                  {formatDate(new Date(profile.dtupdate))}
                </td>
                <td className="text-center text-muted-foreground">
                  <div className="flex items-center justify-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{profile.users || 0}</span>
                  </div>
                </td>
                {permissions?.includes("Excluir") && (
                  <td className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Ações</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDelete(profile.id)}
                          disabled={isDeleting === profile.id}
                          className="text-destructive focus:text-destructive"
                        >
                          {isDeleting === profile.id ? (
                            "Excluindo..."
                          ) : (
                            <>
                              <Trash2 className="mr-2 h-4 w-4" />
                              Excluir
                            </>
                          )}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                )}
              </tr>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
