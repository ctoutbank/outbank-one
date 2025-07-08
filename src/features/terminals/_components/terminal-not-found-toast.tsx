"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export function TerminalNotFoundToast() {
  const router = useRouter();

  useEffect(() => {
    toast.error("Terminal não encontrado ou acesso não permitido.");
    router.push("/portal/terminals");
  }, [router]);

  return null;
}
