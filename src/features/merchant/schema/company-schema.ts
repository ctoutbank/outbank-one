import { z } from "zod";

// Schema para endereço da empresa
export const companyAddressSchema = z.object({
  id: z.number().optional(), // Opcional para criação inicial
  zipCode: z
    .string()
    .min(8, "CEP deve ter 8 dígitos")
    .max(8, "CEP deve ter 8 dígitos")
    .regex(/^\d{8}$/, "CEP deve conter apenas números"),
  street: z
    .string()
    .min(1, "Rua é obrigatória")
    .max(255, "Rua deve ter no máximo 255 caracteres"),
  number: z
    .string()
    .min(1, "Número é obrigatório")
    .max(10, "Número deve ter no máximo 10 caracteres"),
  complement: z
    .string()
    .optional()
    .or(z.literal(""))
    .transform((val) => val || ""),
  neighborhood: z
    .string()
    .min(1, "Bairro é obrigatório")
    .max(255, "Bairro deve ter no máximo 255 caracteres"),
  city: z
    .string()
    .min(1, "Cidade é obrigatória")
    .max(255, "Cidade deve ter no máximo 255 caracteres"),
  state: z
    .string()
    .min(2, "Estado é obrigatório")
    .max(2, "Estado deve ter 2 caracteres"),
  country: z
    .string()
    .min(1, "País é obrigatório")
    .max(2, "País deve ter 2 caracteres"),
});

// Schema principal para dados da empresa
export const companySchema = z.object({
  id: z.number().optional(), // Opcional para criação inicial
  name: z
    .string()
    .min(1, "Nome é obrigatório")
    .max(255, "Nome deve ter no máximo 255 caracteres"),
  corporateName: z
    .string()
    .min(1, "Nome Corporativo é obrigatório")
    .max(255, "Nome Corporativo deve ter no máximo 255 caracteres"),
  email: z
    .string()
    .email("Email inválido")
    .min(1, "Email é obrigatório")
    .max(255, "Email deve ter no máximo 255 caracteres"),
  idDocument: z
    .string()
    .min(14, "CNPJ deve ter 14 dígitos")
    .max(14, "CNPJ deve ter 14 dígitos")
    .regex(/^\d{14}$/, "CNPJ deve conter apenas números"),
  openingDate: z.date({ required_error: "Data de abertura é obrigatória" }),
  openingDays: z
    .string()
    .optional()
    .or(z.literal(""))
    .transform((val) => val || "0000000"),
  openingHour: z
    .string()
    .optional()
    .or(z.literal(""))
    .transform((val) => val || "08:00"),
  closingHour: z
    .string()
    .optional()
    .or(z.literal(""))
    .transform((val) => val || "18:00"),
  municipalRegistration: z
    .string()
    .optional()
    .or(z.literal(""))
    .transform((val) => val || ""),
  stateSubcription: z
    .string()
    .optional()
    .or(z.literal(""))
    .transform((val) => val || ""),
  revenue: z
    .number()
    .optional()
    .or(z.literal(0))
    .transform((val) => val || 1000),
  establishmentFormat: z
    .string()
    .optional()
    .or(z.literal(""))
    .transform((val) => val || "PHYSICAL"),
  legalPerson: z
    .string()
    .optional()
    .or(z.literal(""))
    .transform((val) => val || "JURIDICAL"),
  cnae: z
    .string()
    .optional()
    .or(z.literal(""))
    .transform((val) => val || ""),
  mcc: z
    .string()
    .optional()
    .or(z.literal(""))
    .transform((val) => val || ""),
  number: z
    .string()
    .optional()
    .or(z.literal(""))
    .transform((val) => val || ""),
  areaCode: z
    .string()
    .optional()
    .or(z.literal(""))
    .transform((val) => val || ""),
  phoneType: z
    .string()
    .optional()
    .or(z.literal(""))
    .transform((val) => val || ""),
  idLegalNature: z
    .number()
    .optional()
    .or(z.literal(0))
    .transform((val) => val || 1),
  slugLegalNature: z
    .string()
    .optional()
    .or(z.literal(""))
    .transform((val) => val || ""),
  idMerchantBankAccount: z.number().optional(), // Opcional para criação inicial
  idCustomer: z.number().optional(), // Opcional para criação inicial
  idCategory: z.number().optional(), // ID da categoria selecionada
  // Endereço da empresa
  address: companyAddressSchema.optional(), // Opcional para criação inicial
});

export type CompanyAddressSchema = z.infer<typeof companyAddressSchema>;
export type CompanySchema = z.infer<typeof companySchema>;
