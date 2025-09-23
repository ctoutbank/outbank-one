import type React from "react";

interface ContactEmailTemplateProps {
  fullName: string;
  email: string;
  company: string;
  phone: string;
  industry: string;
  message: string;
}

const ContactEmailTemplate: React.FC<ContactEmailTemplateProps> = ({
  fullName,
  email,
  company,
  phone,
  industry,
  message,
}) => {
  const getHtmlContent = () => {
    return `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Nova Mensagem de Contato - Outbank Cloud</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f5f5f5;">
        <table role="presentation" style="width: 100%; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-collapse: collapse;">
          <!-- Header -->
          <tr>
            <td style="background-color: #000000; padding: 40px 30px; text-align: left;">
              <img src="https://outbank.cloud/outbank_logo_email.png" alt="Outbank Cloud" width="160" height="44" style="display: block; height: auto;" />
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px; background-color: #ffffff;">
              <!-- Title -->
              <h1 style="font-size: 32px; font-weight: bold; color: #000000; margin: 0 0 30px 0; line-height: 1.2;">
                Nova mensagem de contato.
              </h1>
              
              <!-- Intro text -->
              <p style="color: #666666; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
                Você recebeu uma nova mensagem através do formulário de contato do site Outbank Cloud.
              </p>
              
              <!-- Contact details -->
              <div style="background-color: #f8f9fa; border-radius: 8px; padding: 24px; margin: 30px 0;">
                <h2 style="font-size: 18px; font-weight: 600; color: #000000; margin: 0 0 20px 0;">
                  Dados do Contato:
                </h2>
                
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; font-weight: 600; color: #333333; width: 120px; vertical-align: top;">
                      Nome:
                    </td>
                    <td style="padding: 8px 0; color: #666666;">
                      ${fullName}
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; font-weight: 600; color: #333333; vertical-align: top;">
                      Email:
                    </td>
                    <td style="padding: 8px 0; color: #666666;">
                      <a href="mailto:${email}" style="color: #0066cc; text-decoration: none;">
                        ${email}
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; font-weight: 600; color: #333333; vertical-align: top;">
                      Empresa:
                    </td>
                    <td style="padding: 8px 0; color: #666666;">
                      ${company}
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; font-weight: 600; color: #333333; vertical-align: top;">
                      Telefone:
                    </td>
                    <td style="padding: 8px 0; color: #666666;">
                      <a href="tel:${phone.replace(/\D/g, '')}" style="color: #0066cc; text-decoration: none;">
                        ${phone}
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; font-weight: 600; color: #333333; vertical-align: top;">
                      Ramo:
                    </td>
                    <td style="padding: 8px 0; color: #666666;">
                      ${industry}
                    </td>
                  </tr>
                </table>
              </div>
              
              <!-- Message -->
              <div style="margin: 30px 0;">
                <h3 style="font-size: 16px; font-weight: 600; color: #000000; margin: 0 0 12px 0;">
                  Mensagem:
                </h3>
                <div style="background-color: #ffffff; border: 1px solid #e1e5e9; border-radius: 8px; padding: 20px; color: #333333; line-height: 1.6;">
                  ${message.replace(/\n/g, '<br>')}
                </div>
              </div>
              
              
              <!-- Footer note -->
              <p style="color: #999999; font-size: 14px; line-height: 1.5; margin: 40px 0 0 0;">
                Esta mensagem foi enviada através do formulário de contato do site Outbank Cloud em ${new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}.
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #000000; padding: 30px; text-align: center;">
              <p style="color: #ffffff; font-size: 14px; margin: 0 0 10px 0; font-weight: 500;">
                Outbank Cloud - Soluções Financeiras
              </p>
              <p style="color: #888888; font-size: 12px; margin: 0;">
                © ${new Date().getFullYear()} Outbank Cloud. Todos os direitos reservados.
              </p>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;
  };

  return <div dangerouslySetInnerHTML={{ __html: getHtmlContent() }} />;
};

export default ContactEmailTemplate;
