"use client";

import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/layout/portal/PageHeader";
import { Button } from "@/components/ui/button";
import { ShieldAlert } from "lucide-react";
import { useRouter } from "next/navigation";

export default function UnauthorizedPage() {
  const router = useRouter();

  return (
    <div className="space-y-8">
      <PageHeader
        title="Acesso Negado"
        description="Você não tem permissão para visualizar esta página."
      />
      <div className="flex items-center justify-center rounded-lg border border-dashed py-24">
        <EmptyState
          icon={ShieldAlert}
          title="Acesso não autorizado"
          description="Parece que você não tem as permissões necessárias para acessar este recurso. Se acredita que isso é um erro, entre em contato com o administrador do sistema."
          action={
            <Button variant="default" onClick={() => router.back()}>
              Voltar para a página anterior
            </Button>
          }
        />
      </div>
    </div>
  );
}