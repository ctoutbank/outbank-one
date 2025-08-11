"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export function MerchantNotFoundToast() {
  const router = useRouter();

  useEffect(() => {
    toast.error("Merchant não encontrado ou acesso não permitido.");
    router.push("/portal/merchants");
  }, [router]);

  return null;
}
