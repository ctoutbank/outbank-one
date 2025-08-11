"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export function PaymentLinkNotFoundToast() {
  const router = useRouter();

  useEffect(() => {
    toast.error("Link de pagamento não encontrado ou acesso não permitido.");
    router.push("/portal/paymentLink");
  }, [router]);

  return null;
}
