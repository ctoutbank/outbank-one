import { getTerminalsForExport } from "@/features/terminals/serverActions/terminal";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const search = searchParams.get("search") || "";
  const dateTo = searchParams.get("dateTo") || undefined;
  const numeroLogico = searchParams.get("numeroLogico") || undefined;
  const numeroSerial = searchParams.get("numeroSerial") || undefined;
  const estabelecimento = searchParams.get("estabelecimento") || undefined;
  const modelo = searchParams.get("modelo") || undefined;
  const status = searchParams.get("status") || undefined;
  const provedor = searchParams.get("provedor") || undefined;

  const data = await getTerminalsForExport(search, {
    dateTo,
    numeroLogico,
    numeroSerial,
    estabelecimento,
    modelo,
    status,
    provedor,
  });

  return NextResponse.json(data);
}
