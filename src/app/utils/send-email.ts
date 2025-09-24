import { resend } from "@/lib/resend"
import {getThemeByTenant} from "@/lib/getThemeByTenant";
import {headers} from "next/headers";



export function getWelcomeEmailHtml(themeData: any, password: string): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Bem-vindo ao ${themeData.name}</title>
        </head>
        <body
          style="margin: 0; padding: 0; background-color: #1a1a1a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;"
        >
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #1a1a1a;">
            <tr>
              <td align="center" style="padding: 40px 20px;">
                <table width="100%" style="max-width: 600px;" cellpadding="0" cellspacing="0">
                  <tr>
                    <td
                      style="background-color: #ffffff; border-radius: 16px; padding: 40px;"
                    >
                      <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td align="left" style="padding-bottom: 30px;">
                            <div
                              style="width: 128px; height: 128px; background-color: #000000; border-radius: 12px; display: inline-flex; align-items: center; justify-content: center;"
                            >
                              <img
                                src="${themeData.imageUrl}"
                                alt="Logo"
                                style="width: 80px; height: 80px; object-fit: cover; border-radius: 8px;"
                              />
                            </div>
                          </td>
                        </tr>
                      </table>

                      <!-- Título -->
                      <h1
                        style="font-size: 32px; font-weight: bold; color: #1a1a1a; margin: 0 0 24px 0; line-height: 1.2; text-align: left;"
                      >
                        Bem-vindo ao ${themeData.name}
                      </h1>

                      <!-- Conteúdo -->
                      <div
                        style="color: #666666; font-size: 16px; line-height: 1.6; margin-bottom: 32px; text-align: left;"
                      >
                        <p style="margin: 0 0 8px 0;">
                          Sua conta foi criada com sucesso! Estamos felizes em tê-lo conosco.
                        </p>
                        <p style="margin: 0 0 8px 0;">
                          Acesse sua conta para começar a usar todos os nossos recursos.
                        </p>
                      </div>

                      <!-- Label da senha -->
                      <p style="color: #1a1a1a; font-size: 16px; margin: 0 0 16px 0; font-weight: 600; text-align: left;">
                        Sua senha temporária de acesso:
                      </p>

                      <!-- Senha em botão preto -->
                      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 16px;">
                        <tr>
                          <td text-align="left">
                            <div
                              style="display: inline-block; background-color: #000000; color: #ffffff; padding: 12px 32px; border-radius: 25px; font-weight: 500; font-size: 16px; letter-spacing: 1px; font-family: 'Courier New', monospace;"
                            >
                              ${password}
                            </div>
                          </td>
                        </tr>
                      </table>

                      <!-- Texto sobre primeiro login -->
                      <p style="color: #666666; font-size: 14px; margin: 0 0 32px 0; text-align: left;">
                        Você poderá alterá-la no primeiro login.
                      </p>

                      <!-- Aviso de segurança -->
                      <div style="background-color: #f8f9fa; border-left: 4px solid #000000; padding: 16px; margin: 32px 0; border-radius: 4px;">
                        <p style="color: #666666; font-size: 14px; margin: 0; text-align: left;">
                          <strong>Importante:</strong> Se não foi você quem fez esse cadastro, ignore este e-mail.
                        </p>
                      </div>

                      <!-- Assinatura -->
                      <div style="margin-top: 40px; text-align: left;">
                        <p style="color: #1a1a1a; font-size: 16px; margin: 0;">
                          Atenciosamente,
                        </p>
                        <p style="color: #1a1a1a; font-size: 16px; font-weight: 600; margin: 4px 0 0 0;">
                          Equipe ${themeData.name}
                        </p>
                      </div>
                    </td>
                  </tr>
                </table>

                <!-- Footer -->
                <table width="100%" style="max-width: 600px; margin-top: 30px;" cellpadding="0" cellspacing="0">
                  <tr>
                    <td align="center">
                      <p style="color: #888888; font-size: 12px; margin: 0;">
                        © 2024 ${themeData.name}. Todos os direitos reservados.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `;
}

export async function sendWelcomePasswordEmail(to: string, password: string) {
    const headersList = await headers();
    const host = headersList.get("host") || "";
    const subdomain = host.split(".")[0];
    const themeData = await getThemeByTenant(subdomain)
    if (!themeData) {
        return;
    }

    
    await resend.emails.send({
        from: "noreply@outbank.cloud",
        to,
        subject: `Bem-vindo ao ${themeData.name} - Sua conta foi criada!`,
        html: getWelcomeEmailHtml(themeData, password),
    })
}
