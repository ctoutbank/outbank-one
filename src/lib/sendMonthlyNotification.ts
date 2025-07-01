import { db } from "@/lib/db";
import { userNotifications, users } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

export async function sendMonthlyNotification() {
    const now = new Date().toISOString();

    const allUsers = await db.select().from(users).where(eq(users.active, true));

    const inserts = allUsers.map((user) =>
        db.insert(userNotifications).values({
            slug: `fechamento-${Date.now()}-${user.id}`,
            dtinsert: now,
            dtupdate: now,
            active: true,
            idUser: user.id,
            title: "Fechamento de Rendimentos Disponível",
            message: "Fechamento está disponível para download, clique aqui para fazer o download",
            type: "info",
            link: "/portal/closing",
            isRead: false,
        })
    );

    await Promise.all(inserts);
}