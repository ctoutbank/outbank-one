"use client";

import { Button } from "@/components/ui/button";
import { syncMerchant } from "@/server/integrations/dock/sync-merchant/main";
import { syncMerchantPrices } from "@/server/integrations/dock/sync-merchantPrice/main";
import { syncAllMerchantPriceGroups } from "@/server/integrations/dock/sync-merchantPriceGroup/service";
import { RefreshCw } from "lucide-react";
import { useState } from "react";

export function MerchantSyncButton() {
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSync = async () => {
    try {
      setIsSyncing(true);
      await syncMerchant();
      await syncMerchantPrices();
      await syncAllMerchantPriceGroups();
    } catch (error) {
      console.error("Error syncing:", error);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleSync}
      disabled={isSyncing}
      className="flex items-center gap-2"
    >
      <RefreshCw className={`h-4 w-4 ${isSyncing ? "animate-spin" : ""}`} />
    </Button>
  );
}
