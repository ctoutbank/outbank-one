"use client";

import { Button } from "@/components/ui/button";
import { syncTransactions } from "@/server/integrations/dock/sync-transactions/main";
import { RefreshCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

type SyncButtonProps = {
  onSyncComplete?: () => void;
  syncType: "transactions" | "merchants";
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
            console.log("syncing merchants");
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
