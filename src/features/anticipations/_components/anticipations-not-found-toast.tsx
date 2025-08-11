"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export function AnticipationsNotFoundToast() {
  const router = useRouter();

  useEffect(() => {
    toast.error("Antecipação não encontrada ou acesso não permitido.");
    router.push("/portal/anticipations");
  }, [router]);

  return null;
}
