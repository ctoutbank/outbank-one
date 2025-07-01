"use server";

import { db } from "@/server/db";
import {auth, currentUser} from "@clerk/nextjs/server";
import { desc, eq } from "drizzle-orm";
import { userNotifications, users } from "../../../../drizzle/schema";
import {NextResponse} from "next/server";
import { DateTime } from "luxon";

export interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: "info" | "success" | "warning" | "error";
  link?: string | null;
}

// Busca notificações do usuário autenticado
export async function getCurrentUserNotifications(): Promise<Notification[]> {
  const userClerk = await currentUser();
  if (!userClerk) throw new Error("User not authenticated");
  const userDb = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.idClerk, userClerk.id));
  if (!userDb || userDb.length === 0)
    throw new Error("User not found in database");
  const userId = userDb[0].id;
  const result = await db
    .select({
      id: userNotifications.id,
      title: userNotifications.title,
      message: userNotifications.message,
      time: userNotifications.dtinsert,
      read: userNotifications.isRead,
      type: userNotifications.type,
      link: userNotifications.link,
    })
    .from(userNotifications)
    .where(eq(userNotifications.idUser, userId))
    .orderBy(desc(userNotifications.dtinsert));
  return result.map((n) => ({
    ...n,
    title: n.title ?? "",
    message: n.message ?? "",
    read: n.read ?? false,
    link: n.link ?? null,
    time: n.time ? new Date(n.time).toLocaleString("pt-BR") : "",
    type: (n.type as Notification["type"]) || "info",
  }));
}

// Cria uma nova notificação para um usuário
export async function createNotification({
  idUser,
  title,
  message,
  type = "info",
  link = null,
}: {
  idUser: number;
  title: string;
  message: string;
  type?: Notification["type"];
  link?: string | null;
}) {
  return db.insert(userNotifications).values({
    idUser,
    title,
    message,
    type,
    link,
    isRead: false,
    active: true,
    dtinsert: new Date().toISOString(),
    dtupdate: new Date().toISOString(),
  });
}

// Marca uma notificação como lida
export async function markNotificationAsRead(notificationId: number) {
  return db
    .update(userNotifications)
    .set({ isRead: true, dtupdate: new Date().toISOString() })
    .where(eq(userNotifications.id, notificationId));
}

export async function createUserNotification() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const [user] = await db.select().from(users).where(eq(users.idClerk, userId));
  if (!user) {
    return NextResponse.json({ error: "Usuário não encontrado no banco" }, { status: 404 });
  }

  const now = DateTime.now().setZone("America/Sao_Paulo");

  // ✅ Sem milissegundos, sem segundos
  const startOfMonthSP = now
      .startOf("month")
      .set({ second: 0, millisecond: 0 })
      .toISO({ suppressMilliseconds: true, suppressSeconds: false });

  // ✅ Com milissegundos
  const endOfMonthSP = now
      .endOf("month")
      .toISO({ suppressMilliseconds: false });

  if (!startOfMonthSP || !endOfMonthSP) {
    return NextResponse.json({ error: "Erro ao gerar datas" }, { status: 500 });
  }

  const link = `/portal/closing?viewMode=month&dateFrom=${encodeURIComponent(startOfMonthSP)}&dateTo=${encodeURIComponent(endOfMonthSP)}`;

  await db.insert(userNotifications).values({
    slug: `teste-fechamento-${Date.now()}`,
    dtinsert: now.toISO(),
    dtupdate: now.toISO(),
    active: true,
    idUser: user.id,
    title: "Relatório disponível",
    message: "O relatório de fechamento mensal já está disponível no portal. Acesse sua conta para realizar o download.",
    type: "info",
    link,
    isRead: false,
  });

  return NextResponse.json({ ok: true });
}

export async function POST() {
  try {
    return await createUserNotification();
  } catch (error) {
    console.error("Erro na API /api/test-notification:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}



export async function updateNotification(req: Request, { params }: { params: { id: string } }) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

  const [user] = await db.select().from(users).where(eq(users.idClerk, userId));
  if (!user) return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });

  const notificationId = Number(params.id);
  if (isNaN(notificationId)) return NextResponse.json({ error: "ID inválido" }, { status: 400 });

  await db
      .update(userNotifications)
      .set({ isRead: true })
      .where(eq(userNotifications.id, notificationId));

  return NextResponse.json({ ok: true });
}

export async function deleteNotifications(req: Request, { params }: { params: { id: string } }) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

  const [user] = await db.select().from(users).where(eq(users.idClerk, userId));
  if (!user) return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });

  const notificationId = Number(params.id);
  if (isNaN(notificationId)) return NextResponse.json({ error: "ID inválido" }, { status: 400 });

  await db
      .delete(userNotifications)
      .where(eq(userNotifications.id, notificationId));

  return NextResponse.json({ ok: true });
}

export async function getNotificationsByUser() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const [user] = await db.select().from(users).where(eq(users.idClerk, userId));
  if (!user) {
    return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
  }

  const notifications = await db
      .select()
      .from(userNotifications)
      .where(eq(userNotifications.idUser, user.id))
      .orderBy(desc(userNotifications.dtinsert));

  return NextResponse.json({ notifications });
}

export async function markAllNotificationsAsReadByUser() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const [user] = await db.select().from(users).where(eq(users.idClerk, userId));
  if (!user) {
    return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
  }

  await db
      .update(userNotifications)
      .set({ isRead: true })
      .where(eq(userNotifications.idUser, user.id)); // marca todas do usuário

  return NextResponse.json({ ok: true });
}


