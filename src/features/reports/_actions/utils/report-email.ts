import { resend } from "@/lib/resend";
import { UploadFileResponse } from "@/server/upload";
import { DateTime } from "luxon";

export function validateAndProcessEmails(
  emailsToSend: string | string[] | null
): string[] {
  if (
    !emailsToSend ||
    (typeof emailsToSend === "string" && emailsToSend.trim() === "")
  ) {
    throw new Error("Não há destinatários para enviar o relatório");
  }

  const emailList = Array.isArray(emailsToSend)
    ? emailsToSend
    : typeof emailsToSend === "string"
    ? emailsToSend.split(",").map((email) => email.trim())
    : [];

  if (emailList.length === 0) {
    throw new Error("Lista de emails para envio está vazia");
  }

  return emailList;
}

export async function sendReportEmail(
  emailList: string[],
  uploadResult: UploadFileResponse,
  execution: any,
  report: any
) {
  await resend.emails.send({
    from: "noreply@outbank.cloud",
    to: emailList,
    subject: `Relatório de Vendas Outbank One`,
    html: generateReportEmailHtml(uploadResult, execution, report),
  });
}

export function generateReportEmailHtml(
  uploadResult: UploadFileResponse,
  execution: any,
  report: any
): string {
  return `
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office" lang="pt-BR">
    <head>
    <title>Relatório de Vendas Outbank One</title>
    <meta charset="UTF-8" />
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="x-apple-disable-message-reformatting" content="" />
    <meta content="target-densitydpi=device-dpi" name="viewport" />
    <meta content="true" name="HandheldFriendly" />
    <meta content="width=device-width" name="viewport" />
    <meta name="format-detection" content="telephone=no, date=no, address=no, email=no, url=no" />
    <style type="text/css">
    table { border-collapse: separate; table-layout: fixed; mso-table-lspace: 0pt; mso-table-rspace: 0pt }
    table td { border-collapse: collapse }
    body, a, li, p, h1, h2, h3 { -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; }
    </style>
    </head>
    <body id="body" style="min-width:100%;Margin:0px;padding:0px;background-color:#242424;">
    <div style="background-color:#242424;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" align="left" style="background-color:#242424;">
        <tr>
          <td align="left">
            <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:600px;Margin-left:auto;Margin-right:auto; margin-top: 30px;">
              <tr>
                <td style="padding:40px 50px;background-color:#FFFFFF;border-radius:8px;margin-top:20px;">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td align="left" style="padding-bottom:30px;">
                        <img src="https://outbank.cloud/outbank-logo.png" alt="Outbank One" width="130" style="display:block;border:0;height:auto;width:130px;" />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <h1 style="margin:0;font-family:Arial,sans-serif;line-height:36px;font-weight:700;font-size:28px;text-align:left;padding-bottom:20px;">${
                          report.title
                        }</h1>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <p style="margin:0;font-family:Arial,sans-serif;line-height:24px;font-size:16px;color:#333333;padding-bottom:15px;">Olá,</p>
                        <p style="margin:0;font-family:Arial,sans-serif;line-height:24px;font-size:16px;color:#333333;padding-bottom:15px;">Seu relatório de vendas está pronto. Ele contém todas as transações do período de <strong>${DateTime.fromISO(
                          execution.reportFilterStartDate
                        )
                          .setZone("America/Sao_Paulo")
                          .setLocale("pt-BR")
                          .toLocaleString(
                            DateTime.DATETIME_MED
                          )} a ${DateTime.fromISO(
    execution.reportFilterEndDateTime
  )
    .setZone("America/Sao_Paulo")
    .setLocale("pt-BR")
    .toLocaleString(DateTime.DATETIME_MED)}</strong>.</p>
                        <p style="margin:0;font-family:Arial,sans-serif;line-height:24px;font-size:16px;color:#333333;padding-bottom:10px;">O relatório inclui:</p>
                        <ul style="margin:0;padding-left:20px;padding-bottom:15px;">
                          <li style="font-family:Arial,sans-serif;line-height:24px;font-size:16px;color:#333333;padding-bottom:5px;">Resumo de transações</li>
                          <li style="font-family:Arial,sans-serif;line-height:24px;font-size:16px;color:#333333;padding-bottom:5px;">Transações por bandeira e Tipo de Pagamento</li>
                        </ul>
                      </td>
                    </tr>
                    <tr>
                      <td align="left" style="padding:20px 0;">
                        <table role="presentation" cellpadding="0" cellspacing="0" style="border-radius:20px;background-color:#242424;">
                          <tr>
                            <td style="padding:12px 25px;">
                              <a href="${
                                uploadResult.fileURL
                              }" style="font-family:Arial,sans-serif;font-size:16px;font-weight:bold;color:#FFFFFF;text-decoration:none;display:inline-block;">ACESSAR RELATÓRIO</a>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <p style="margin:0;font-family:Arial,sans-serif;line-height:24px;font-size:16px;color:#333333;padding-bottom:15px;">Para qualquer dúvida, nossa equipe está à disposição.</p>
                        <p style="margin:0;font-family:Arial,sans-serif;line-height:24px;font-size:16px;color:#333333;padding-top:20px;">Atenciosamente,<br>Equipe Outbank</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td align="left" style="padding:20px 0;">
                  <p style="margin:0;font-family:Arial,sans-serif;line-height:20px;font-size:12px;color:#666666;">© 2025 Outbank. Todos os direitos reservados.</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </div>
    </body>
    </html>
  `;
}
