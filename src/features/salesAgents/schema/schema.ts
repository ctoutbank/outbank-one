import { z } from "zod";

export const SchemaAddress = z.object({
  id: z.number().optional(),
  zipCode: z.string().min(1, "CEP é obrigatório"),
  streetAddress: z.string().min(1, "Rua é obrigatória"),
  streetNumber: z.string().min(1, "Número é obrigatório"),
  complement: z.string().optional(),
  neighborhood: z.string().min(1, "Bairro é obrigatório"),
  city: z.string().min(1, "Cidade é obrigatória"),
  state: z.string().min(1, "Estado é obrigatório"),
  country: z.string().min(1, "País é obrigatório").default("Brasil"),
});

export type AddressSchema = z.infer<typeof SchemaAddress>;

export const schemaUser = z.object({
  id: z.number().optional(),
  slug: z.string().optional(),
  firstName: z.string().min(1, "O nome é obrigatório"),
  lastName: z.string().min(1, "O sobrenome é obrigatório"),
  email: z.string().email("Email inválido"),
  idAddress: z.number().optional(),
  idProfile: z.string().min(1, "o perfil é obrigatório"),
  idCustomer: z.string().optional(),
  isEstablishment: z.boolean().optional(),
  active: z.boolean().optional(),
  idClerk: z.string().optional(),
  selectedMerchants: z.array(z.string()).optional(),
  fullAccess: z.boolean().optional(),
});

export const schemaGroup = z.object({
  id: z.string().optional(),
  functions: z.array(
    z
      .string()
      .min(1, "Funcionalidade inválida")
      .min(1, "Ao menos uma funcionalidade deve ser selecionada")
  ),
});

export const schemaModule = z.object({
  id: z.number().optional(),
  group: z.array(schemaGroup).optional(),
});

export const schemaProfile = z.object({
  id: z.number().optional(),
  slug: z.string().optional(),
  name: z.string().min(1, "O nome é obrigatório"),
  description: z
    .string()
    .min(1, "A descrição é obrigatória")
    .max(500, "Limite de 500 caracteres"),
  module: z.array(schemaModule).optional(),
});

export const schemaSalesAgent = z.object({
  id: z.number().optional(),
  slug: z.string().optional(),
  firstName: z.string().min(1, "O nome é obrigatório"),
  lastName: z.string().min(1, "O sobrenome é obrigatório"),
  email: z.string().email("Email inválido"),
  active: z.boolean().optional(),
  dtinsert: z.date().optional(),
  dtupdate: z.date().optional(),
  documentId: z.string().optional(),
  slugCustomer: z.string().optional(),
  cpf: z
    .string()
    .min(11, "O cpf deve ter 11 dígitos")
    .max(11, "Deve ter 11 dígitos"),
  phone: z
    .string()
    .min(11, "O número de telefone deve ter 11 dígitos (DDD incluso)")
    .max(11, "Deve ter 11 dígitos"),
  birthDate: z.date().optional(),
  idUser: z.number().optional(),
});

export type SalesAgentSchema = z.infer<typeof schemaSalesAgent>;

export type UserSchema = z.infer<typeof schemaUser>;

export type ProfileSchema = z.infer<typeof schemaProfile>;

export const schemaCombined = schemaUser.merge(schemaSalesAgent);

export type CombinedSchema = z.infer<typeof schemaCombined>;

// Novo schema alinhado ao padrão paymentLink
export const schemaSalesAgentForm = z.object({
  id: z.number().optional(),
  firstName: z.string().min(1, "O nome é obrigatório"),
  lastName: z.string().min(1, "O sobrenome é obrigatório"),
  email: z.string().email("Email inválido"),
  cpf: z
    .string()
    .min(11, "O cpf deve ter 11 dígitos")
    .max(11, "Deve ter 11 dígitos"),
  phone: z
    .string()
    .min(11, "O número de telefone deve ter 11 dígitos (DDD incluso)")
    .max(11, "Deve ter 11 dígitos"),
  birthDate: z.date().optional(),
  idProfile: z.string().optional(),
  idCustomer: z.string().optional(),
  active: z.boolean().optional(),
  address: z.object({
    zipCode: z.string().min(1, "CEP é obrigatório"),
    streetAddress: z.string().min(1, "Rua é obrigatória"),
    streetNumber: z.string().min(1, "Número é obrigatório"),
    complement: z.string().optional(),
    neighborhood: z.string().min(1, "Bairro é obrigatório"),
    city: z.string().min(1, "Cidade é obrigatória"),
    state: z.string().min(1, "Estado é obrigatório"),
    country: z.string().min(1, "País é obrigatório").default("Brasil"),
  }),
  selectedMerchants: z.array(z.string()).optional(),
});

export type SalesAgentFormSchema = z.infer<typeof schemaSalesAgentForm>;
