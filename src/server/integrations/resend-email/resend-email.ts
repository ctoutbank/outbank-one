"use server";

import { Resend } from "resend";
import { getPurchaseEmailHtml } from "@/components/emailTemplate";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function SendEmail(email: string, link: string) {
  try {
    const data = await resend.emails.send({
      from: "Outbank <info@outbank.cloud>",
      to: [email],
      subject: `Link para compra`,
      html: getPurchaseEmailHtml({ purchaseLink: link }),
    });
    return data;
  } catch (err) {
    console.log(err);
  }
}
