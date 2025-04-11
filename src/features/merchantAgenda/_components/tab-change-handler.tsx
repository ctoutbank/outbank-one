"use client";

import { Tabs } from "@/components/ui/tabs";
import { useRouter, useSearchParams } from "next/navigation";

type TabChangeHandlerProps = {
  children: React.ReactNode;
};

export function TabChangeHandler({ children }: TabChangeHandlerProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleTabChange = () => {
    const params = new URLSearchParams(searchParams?.toString() || "");

    // Clear all filter params
    params.delete("dateFrom");
    params.delete("dateTo");
    params.delete("establishment");
    params.delete("status");
    params.delete("cardBrand");
    params.delete("settlementDateFrom");
    params.delete("settlementDateTo");
    params.delete("expectedSettlementDateFrom");
    params.delete("expectedSettlementDateTo");
    params.delete("saleDateFrom");
    params.delete("saleDateTo");
    params.delete("nsu");
    params.delete("orderId");
    params.set("page", "1");

    router.push(`?${params.toString()}`);
  };

  return (
    <Tabs
      defaultValue="receivables"
      className="w-full"
      onValueChange={handleTabChange}
    >
      {children}
    </Tabs>
  );
}
