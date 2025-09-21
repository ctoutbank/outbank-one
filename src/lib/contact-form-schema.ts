import { z } from "zod";

export const contactFormSchema = z.object({
  fullName: z
    .string()
    .min(2, "Nome deve ter pelo menos 2 caracteres")
    .max(100, "Nome deve ter no máximo 100 caracteres"),
  
  email: z
    .string()
    .email("Email inválido")
    .max(255, "Email deve ter no máximo 255 caracteres"),
  
  company: z
    .string()
    .min(2, "Nome da empresa é obrigatório")
    .max(100, "Nome da empresa deve ter no máximo 100 caracteres"),
  
  phone: z
    .string()
    .min(10, "Telefone deve ter pelo menos 10 dígitos")
    .max(15, "Telefone deve ter no máximo 15 dígitos")
    .regex(/^[\d\s\(\)\-\+]+$/, "Telefone deve conter apenas números e símbolos válidos"),
  
  industry: z
    .string()
    .min(1, "Selecione o ramo de atuação"),
  
  message: z
    .string()
    .min(10, "Mensagem deve ter pelo menos 10 caracteres")
    .max(1000, "Mensagem deve ter no máximo 1000 caracteres"),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;
