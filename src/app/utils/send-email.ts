import { resend } from "@/lib/resend";

export async function sendWelcomePasswordEmail(to: string, password: string) {
    await resend.emails.send({
        from: "noreply@outbank.cloud",
        to,
        subject: "Sua senha de acesso ao Outbank",
        html: `
      <div style="font-family: sans-serif; padding: 20px;">
        <h2>Bem-vindo ao Outbank 👋</h2>
        <p>Sua conta foi criada com sucesso!</p>
        <p><strong>Sua senha temporária é:</strong></p>
        <pre style="background: #f4f4f4; padding: 10px; font-size: 16px;">${password}</pre>
        <p>Você poderá alterá-la no primeiro login.</p>
        <p>Se não foi você quem fez esse cadastro, ignore este e-mail.</p>
        <br />
        <p>Atenciosamente,<br/>Equipe Outbank</p>
      </div>
    `,
    });
}