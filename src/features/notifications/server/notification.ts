"use server";

import { db } from "@/server/db";
import { currentUser } from "@clerk/nextjs/server";
import { desc, eq } from "drizzle-orm";
import { userNotifications, users } from "../../../../drizzle/schema";

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
