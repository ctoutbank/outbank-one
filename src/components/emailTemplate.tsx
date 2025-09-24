interface SimplePurchaseEmailProps {
  purchaseLink: string;
  bankName?: string;
}

export const getPurchaseEmailHtml = ({
  purchaseLink,
  bankName = "Banco Prisma (Outbank)",
}: SimplePurchaseEmailProps): string => {
  return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Link de Compra</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f0f0f0;">
      <table role="presentation" style="width: 100%; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-collapse: collapse;">
        <!-- Header -->
        <tr>
          <td style="background-color: #1e2432; padding: 30px; text-align: center;">
           
          </td>
        </tr>
        
        <!-- Content -->
        <tr>
          <td style="padding: 30px 20px; text-align: center;">
            <h1 style="color: #333333; font-size: 24px; margin: 0 0 20px; font-weight: 700; border-bottom: 1px solid #cccccc; padding-bottom: 10px;">${bankName}</h1>
            <p style="color: #666666; font-size: 16px; line-height: 1.5; margin: 0 0 25px;">Você está recebendo abaixo o link para sua compra.</p>
            
            <!-- Link -->
            <p style="margin: 25px 0;">
              <a href="${purchaseLink}" target="_blank" style="color: #0066cc; font-size: 14px; text-decoration: underline; word-break: break-all; display: block; background-color: #f5f5f5; padding: 15px; border-radius: 4px;">${purchaseLink}</a>
            </p>
          </td>
        </tr>
        
        <!-- Footer -->
        <tr>
          <td style="background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 12px; color: #999999;">
            © 2017 - ${new Date().getFullYear()} Muxi. All rights reserved.
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
};
