"use client";

import { Button } from "@/components/ui/button";
import { syncAllMerchantPriceGroups } from "@/server/integrations/dock/sync-merchantPriceGroup/service";

import { useState } from "react";

export default function AsyncButtonsPayout() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSync = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await syncAllMerchantPriceGroups();
      setSuccess("Sincronização realizada com sucesso!");
    } catch (err) {
      setError("Erro ao realizar a sincronização.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Sincronização Merchant Price Group</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Button
          onClick={handleSync}
          disabled={loading}
          className={`bg-green-500 hover:bg-green-600 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          Merchant Price Group {loading ? "Sincronizando..." : "Sincronizar"}
        </Button>
      </div>

      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">{success}</p>}
    </div>
  );
}
