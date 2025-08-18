"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";
import { toggleFinancialAdjustmentActiveFormAction } from "../_actions/financialAdjustments-formActions";

interface DeactivateFinancialAdjustmentButtonProps {
  id: number;
  active: boolean;
}

export function DeactivateFinancialAdjustmentButton({
  id,
  active,
}: DeactivateFinancialAdjustmentButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);

  async function handleToggle() {
    setLoading(true);
    try {
      // Nova action: ativa se estiver inativo, desativa se estiver ativo
      await toggleFinancialAdjustmentActiveFormAction(id, !active);
      toast.success(
        !active
          ? "Ajuste financeiro ativado com sucesso"
          : "Ajuste financeiro desativado com sucesso"
      );
      router.push("/portal/financialAdjustment");
    } catch (e) {
      console.log(e);
      toast.error(
        !active
          ? "Erro ao ativar ajuste financeiro"
          : "Erro ao desativar ajuste financeiro"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant={active ? "destructive" : "default"}
          disabled={loading}
          className="absolute top-8 right-6"
        >
          {active ? "Desativar Ajuste Financeiro" : "Ativar Ajuste Financeiro"}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {active
              ? "Desativar ajuste financeiro?"
              : "Ativar ajuste financeiro?"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {active
              ? "Tem certeza que deseja desativar este ajuste?"
              : "Tem certeza que deseja ativar este ajuste?"}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              onClick={handleToggle}
              disabled={loading}
              variant={active ? "destructive" : "default"}
            >
              {loading
                ? active
                  ? "Desativando..."
                  : "Ativando..."
                : active
                  ? "Desativar"
                  : "Ativar"}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
