import { NextRequest, NextResponse } from "next/server";
import { contactFormSchema } from "@/lib/contact-form-schema";
import { resend } from "@/lib/resend";
import ContactEmailTemplate from "@/components/contact-email-template";

const RATE_LIMIT_MAP = new Map<string, { count: number; timestamp: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 3; // 3 requests per minute per IP

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const userLimit = RATE_LIMIT_MAP.get(ip);

  if (!userLimit) {
    RATE_LIMIT_MAP.set(ip, { count: 1, timestamp: now });
    return true;
  }

  if (now - userLimit.timestamp > RATE_LIMIT_WINDOW) {
    RATE_LIMIT_MAP.set(ip, { count: 1, timestamp: now });
    return true;
  }

  if (userLimit.count >= RATE_LIMIT_MAX_REQUESTS) {
    return false;
  }

  userLimit.count++;
  return true;
}

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";
    
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Muitas tentativas. Tente novamente em alguns minutos." },
        { status: 429 }
      );
    }

    const body = await request.json();
    
    const validationResult = contactFormSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: "Dados inválidos", 
          details: validationResult.error.errors 
        },
        { status: 400 }
      );
    }

    const { fullName, email, company, phone, industry, message } = validationResult.data;

    const emailResult = await resend.emails.send({
      from: "OutBank <noreply@outbank.cloud>",
      to: ["operacao@outbank.com.br"],
      cc: ["denisonzl@gmail.com"],
      subject: `Nova mensagem de contato - ${fullName} (${company})`,
      react: ContactEmailTemplate({
        fullName,
        email,
        company,
        phone,
        industry,
        message,
      }),
    });

    if (emailResult.error) {
      console.error("Erro ao enviar email:", emailResult.error);
      return NextResponse.json(
        { error: "Erro interno do servidor. Tente novamente mais tarde." },
        { status: 500 }
      );
    }

    console.log(`Formulário de contato enviado com sucesso - ${fullName} (${company}) - ID: ${emailResult.data?.id}`);

    return NextResponse.json(
      { 
        success: true, 
        message: "Mensagem enviada com sucesso! Entraremos em contato em breve.",
        emailId: emailResult.data?.id 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Erro no processamento do formulário de contato:", error);
    
    return NextResponse.json(
      { error: "Erro interno do servidor. Tente novamente mais tarde." },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { error: "Método não permitido" },
    { status: 405 }
  );
}
