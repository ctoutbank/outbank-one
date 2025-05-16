import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { users } from "../../drizzle/schema";
import { matchPassword } from "@/app/utils/password";

export async function verifyDBLogin(email: string, password: string): Promise<{
    success: boolean;
    userId?: string;
    message?: string;
}> {
    try {
        const result = await db
            .select()
            .from(users)
            .where(eq(users.email, email))
            .limit(1);

        const user = result[0];

        if (!user) {
            return { success: false, message: "Usuário não encontrado" };
        }

        if (!user.hashedPassword) {
            return { success: false, message: "Senha não registrada" };
        }

        const isMatch = matchPassword(password, user.hashedPassword); // senha já hash+salt
        if (!isMatch) {
            return { success: false, message: "Senha incorreta" };
        }

        return { success: true, userId: String(user.id) };
    } catch (err) {
        console.error("Erro ao verificar login:", err);
        return { success: false, message: "Erro interno" };
    }
}