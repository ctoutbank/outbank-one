"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil, Trash, RotateCcw, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { UserList } from "../server/users";

export default function UsersList({ users }: { users: UserList }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <div className="w-full rounded-md border">
      <ScrollArea className="w-full">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="font-medium">E-mail</TableHead>
              <TableHead className="font-medium">Primeiro Nome</TableHead>
              <TableHead className="font-medium">Último Nome</TableHead>
              <TableHead className="font-medium">Perfil</TableHead>
              <TableHead className="font-medium text-center">Status</TableHead>
              <TableHead className="font-medium text-center">Opções</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.userObject?.map((user) => (
              <TableRow
                key={user.id}
                className="hover:bg-muted/30 transition-colors"
              >
                <TableCell className="py-3">
                  <a
                    href={`/portal/users/${user.id}`}
                    className="text-primary hover:underline"
                  >
                    {user.email}
                  </a>
                </TableCell>
                <TableCell className="py-3">{user.firstName}</TableCell>
                <TableCell className="py-3">{user.lastName}</TableCell>
                <TableCell className="py-3">
                  <div className="flex flex-col">
                    <span className="font-medium">{user.profileName}</span>
                    {user.profileName && (
                      <span className="text-xs text-muted-foreground">
                        {user.profileDescription}
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="py-3 text-center">
                  <Badge
                    className={`${
                      user.status === true ? "bg-emerald-500" : "bg-red-500"
                    } text-white px-3 py-1 rounded-full text-xs font-medium`}
                  >
                    {user.status === true ? "Ativo" : "Desativado"}
                  </Badge>
                </TableCell>
                <TableCell className="py-3">
                  <div className="flex items-center justify-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full hover:bg-muted"
                      title="Editar"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full hover:bg-muted"
                      title="Permissões"
                    >
                      <ShieldCheck className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full hover:bg-muted"
                      title="Atualizar"
                    >
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full hover:bg-muted"
                      title="Excluir"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  );
}
