import { getCurrentUserNotifications } from "@/features/notifications/server/notification";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const notifications = await getCurrentUserNotifications();
    return NextResponse.json({ notifications });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 401 });
  }
}
