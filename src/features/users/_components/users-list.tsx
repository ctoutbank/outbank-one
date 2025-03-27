"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trash } from "lucide-react";
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
    <div className="border rounded-lg mt-2">
      <Table>
        <TableHeader>
          <TableRow>
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
              key={user.email}
              className="hover:bg-muted/30 transition-colors"
            >
              <TableCell className="py-3">
                <a
                  href={`/portal/users/${user.idClerk}`}
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
                  variant={user.status === true ? "success" : "destructive"}
                  className={`${
                    user.status === true ? "bg-emerald-500" : "bg-red-500"
                  }`}
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
    </div>
  );
}
