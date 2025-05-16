import { NextResponse } from "next/server";
import { verifyDBLogin } from "@/lib/verifyBdLogin";

export async function POST(req: Request) {
    const { email, password } = await req.json();

    if (!email || !password) {
        return NextResponse.json({ error: "Email e senha são obrigatórios" }, { status: 400 });
    }

    const result = await verifyDBLogin(email, password);

    if (!result.success) {
        return NextResponse.json({ error: result.message }, { status: 401 });
    }

    return NextResponse.json({ message: "Login bem-sucedido", userId: result.userId });
}