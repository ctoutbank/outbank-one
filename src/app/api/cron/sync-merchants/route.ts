import { createCronJobMonitoring } from "@/features/cronJob/actions";
import { syncMerchant } from "@/server/integrations/dock/sync-merchant/main";
import { syncMerchantPrices } from "@/server/integrations/dock/sync-merchantPrice/main";
import { syncAllMerchantPriceGroups } from "@/server/integrations/dock/sync-merchantPriceGroup/service";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const maxDuration = 300;

export async function GET() {
  const response = NextResponse.json({ message: "Iniciando sincronização..." });
  response.headers.set(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, proxy-revalidate"
  );
  response.headers.set("Pragma", "no-cache");
  response.headers.set("Expires", "0");

  await createCronJobMonitoring({
    jobName: "Sincronização de merchants",
    status: "pending",
    startTime: new Date().toISOString(),
  });
  try {
    await syncMerchant();
    await syncMerchantPrices();
    await syncAllMerchantPriceGroups();
    const successResponse = NextResponse.json({
      message: "Sincronização de merchants concluída com sucesso",
    });
    successResponse.headers.set(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, proxy-revalidate"
    );
    successResponse.headers.set("Pragma", "no-cache");
    successResponse.headers.set("Expires", "0");
    return successResponse;
  } catch (error: any) {
    const errorResponse = NextResponse.json(
      {
        error: "Erro na sincronização de merchants",
        details: error.message,
      },
      { status: 500 }
    );
    errorResponse.headers.set(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, proxy-revalidate"
    );
    errorResponse.headers.set("Pragma", "no-cache");
    errorResponse.headers.set("Expires", "0");
    return errorResponse;
  }
}
