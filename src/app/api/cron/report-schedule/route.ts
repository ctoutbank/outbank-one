import { scheduleReportsForNextDay } from "@/features/reports/_actions/report-schedule";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const maxDuration = 300;

export async function GET() {
  try {
    await scheduleReportsForNextDay();

    return NextResponse.json(
      { message: "Agendamento de relatórios concluído com sucesso" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Erro ao agendar relatórios", error },
      { status: 500 }
    );
  }
}
