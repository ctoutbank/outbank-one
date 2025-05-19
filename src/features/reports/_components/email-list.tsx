"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/components/use-toast";
import { Plus, Trash, X } from "lucide-react";
import { useEffect, useState } from "react";

interface EmailListProps {
  value?: string;
  onChange?: (emails: string) => void;
  label?: string;
  description?: string;
  className?: string;
  onDeleteEmail?: (email: string) => Promise<void>;
  reportExists?: boolean; // Indica se o relatório já existe no banco
}

export default function EmailList({
  value = "",
  onChange,
  label = "Lista de Emails",
  description = "Adicione ou remova emails da sua lista",
  className = "",
  onDeleteEmail,
  reportExists = false,
}: EmailListProps) {
  const [emails, setEmails] = useState<string[]>([]);
  const [newEmail, setNewEmail] = useState("");
  const [error, setError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const emailList = value
      .split(",")
      .map((email: string) => email.trim())
      .filter((email: string) => email !== "");
    setEmails(emailList);
  }, [value]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addEmail();
    }
  };

  const handleAddButtonClick = () => {
    addEmail();
  };

  const addEmail = () => {
    if (!newEmail || !isValidEmail(newEmail)) {
      setError("Por favor, insira um email válido");
      return;
    }

    if (emails.includes(newEmail)) {
      setError("Este email já está na lista");
      return;
    }

    const updatedEmails = [...emails, newEmail];
    setEmails(updatedEmails);
    setNewEmail("");
    setError("");

    if (onChange && !isDeleting) {
      onChange(updatedEmails.join(", "));
    }

    toast({
      title: "Email adicionado",
      description: `${newEmail} foi adicionado à lista. ${
        reportExists ? "Clique em Salvar para confirmar." : ""
      }`,
    });
  };

  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const removeEmail = async (emailToRemove: string) => {
    try {
      setIsDeleting(true);

      // Se tiver callback de deleção E o relatório já existir, chama a função para deletar do banco
      if (onDeleteEmail && reportExists) {
        await onDeleteEmail(emailToRemove);
      }

      const updatedEmails = emails.filter(
        (email: string) => email !== emailToRemove
      );
      setEmails(updatedEmails);

      if (onChange) {
        onChange(updatedEmails.join(", "));
      }

      toast({
        title: "Email removido",
        description: reportExists
          ? `${emailToRemove} foi removido da lista.`
          : `${emailToRemove} foi removido da lista. Clique em Salvar para confirmar.`,
      });
    } catch (error) {
      toast({
        title: "Erro ao remover email",
        description: "Não foi possível remover o email. Tente novamente.",
        variant: "destructive",
      });
      console.error("Erro ao remover email:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const clearAllEmails = async () => {
    try {
      setIsDeleting(true);

      // Se tiver callback de deleção E o relatório já existir, chama a função para deletar do banco
      if (onDeleteEmail && reportExists) {
        // Deletar cada email um por um
        for (const email of emails) {
          await onDeleteEmail(email);
        }
      }

      setEmails([]);

      if (onChange) {
        onChange("");
      }

      toast({
        title: "Lista limpa",
        description: reportExists
          ? "Todos os emails foram removidos da lista."
          : "Todos os emails foram removidos da lista. Clique em Salvar para confirmar.",
      });
    } catch (error) {
      toast({
        title: "Erro ao limpar emails",
        description:
          "Não foi possível limpar todos os emails. Tente novamente.",
        variant: "destructive",
      });
      console.error("Erro ao limpar emails:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card className={`w-full ${className} ml-0 pl-0`}>
      <CardHeader className="pb-2 pl-0 ml-0">
        <CardTitle>{label}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="pl-0 ml-0">
        <div className="space-y-4">
          <div className="flex space-x-2">
            <Input
              type="email"
              placeholder="exemplo@email.com"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1"
            />
            <Button
              type="button"
              size="sm"
              disabled={isDeleting}
              onClick={handleAddButtonClick}
            >
              <Plus className="h-4 w-4 mr-1" /> Adicionar
            </Button>
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>

        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">Emails ({emails.length})</h3>
            {emails.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                type="button"
                onClick={clearAllEmails}
                disabled={isDeleting}
                className="h-8 text-xs"
              >
                <Trash className="h-3 w-3 mr-1" /> Limpar lista
              </Button>
            )}
          </div>

          {emails.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Nenhum email na lista
            </p>
          ) : (
            <ScrollArea
              className={`pr-4 ${
                emails.length > 6 ? "h-[180px]" : "max-h-fit"
              }`}
            >
              <ul className="flex flex-wrap gap-2">
                {emails.map((email) => (
                  <li
                    key={email}
                    className="flex items-center justify-between p-2 border rounded-md max-w-fit"
                  >
                    <span className="text-sm mr-1">{email}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      type="button"
                      onClick={() => removeEmail(email)}
                      disabled={isDeleting}
                      aria-label={`Remover ${email}`}
                      className="ml-1 h-6 w-6 p-0"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </li>
                ))}
              </ul>
            </ScrollArea>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
