import { NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";

export async function POST(req: Request) {
    try {
        const { userId, newPassword } = await req.json();

        const clerk = await clerkClient();

        await clerk.users.updateUserMetadata(userId, {
            publicMetadata: {
                isFirstLogin: false,
            },
        });

        await clerk.users.updateUser(userId, {
            password: newPassword,
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Erro ao atualizar usuário" }, { status: 500 });
    }
}
