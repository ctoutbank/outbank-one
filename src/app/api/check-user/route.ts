import { NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";

export async function POST(req: Request) {
    try {
        const { email } = await req.json();

        // Obter o client
        const clerk = await clerkClient();

        // Buscar usuários pelo e-mail
        const response = await clerk.users.getUserList({ emailAddress: [email] });

        const users = response.data;

        if (!users || users.length === 0) {
            return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
        }

        const user = users[0];
        const isFirstLogin = user.publicMetadata?.isFirstLogin ?? false;

        return NextResponse.json({ userId: user.id, firstLogin: isFirstLogin });
    } catch (error) {
        return NextResponse.json({ error: "Erro ao verificar usuário" }, { status: 500 });
    }
}
