"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export function SalesAgentsNotFoundToast() {
  const router = useRouter();

  useEffect(() => {
    toast.error("Consultor Comercial não encontrado ou acesso não permitido.");
    router.push("/portal/salesAgents");
  }, [router]);

  return null;
}
