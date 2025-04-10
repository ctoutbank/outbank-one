"use client";

import { Button } from "@/components/ui/button";
import { syncMerchant } from "@/server/integrations/dock/sync-merchant/main";
import { syncMerchantPrices } from "@/server/integrations/dock/sync-merchantPrice/main";
import { syncAllMerchantPriceGroups } from "@/server/integrations/dock/sync-merchantPriceGroup/service";
import { syncPaymentLink } from "@/server/integrations/dock/sync-paymentLink/main";
import { syncPayouts } from "@/server/integrations/dock/sync-payout/main";
import { syncPayoutAntecipations } from "@/server/integrations/dock/sync-payoutAntecipations/main";
import { syncSettlements } from "@/server/integrations/dock/sync-settlements/main";
import { syncTransactions } from "@/server/integrations/dock/sync-transactions/main";
import { RefreshCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

type SyncButtonProps = {
  onSyncComplete?: () => void;
  syncType: "transactions" | "merchants" | "paymentLink" | "settlement" | "payout" | "payoutAntecipation";
};

export function SyncButton({ onSyncComplete, syncType }: SyncButtonProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  return (
    <Button
      variant="outline"
      disabled={isPending}
      onClick={() =>
        startTransition(async () => {
          if (syncType === "transactions") {
            await syncTransactions();
          } else if (syncType === "merchants") {
            await syncMerchant();
            await syncMerchantPrices();
            await syncAllMerchantPriceGroups();
          } else if (syncType === "paymentLink") {
            await syncPaymentLink();
          } else if (syncType === "settlement") {
            await syncSettlements();
          } else if (syncType === "payout") {
            await syncPayouts();
          } else if (syncType === "payoutAntecipation") {
            await syncPayoutAntecipations();
          }
          onSyncComplete?.();
          router.refresh();
        })
      }
    >
      {isPending ? (
        <>
          <RefreshCcw className="w-4 h-4 animate-spin" />
        </>
      ) : (
        <RefreshCcw className="w-4 h-4" />
      )}
    </Button>
  );
}
