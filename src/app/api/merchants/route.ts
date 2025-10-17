import { NextResponse } from "next/server";
import { getMerchantDD } from "@/features/anticipations/server/anticipation";

export async function GET() {
  try {
    const merchants = await getMerchantDD();
    return NextResponse.json(merchants);
  } catch (error) {
    console.error("Error fetching merchants in API route:", error);
    return NextResponse.json({ error: "Error fetching merchants" }, { status: 500 });
  }
}
