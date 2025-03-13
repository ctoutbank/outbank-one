import { z } from "zod";

export const schemaUser = z.object({
  id: z.number().optional(),
  slug: z.string().optional(),
  firstName: z.string().min(1, "O nome é obrigatório"),
  lastName: z.string().min(1, "O sobrenome é obrigatório"),
  email: z.string().email("Email inválido"),
  password: z.string().min(8, "senha obrigatória"),
  idProfile: z.string().min(1, "o perfil é obrigatório"),
  idMerchant: z.string().optional(),
  idCustomer: z.string().optional(),
  isEstablishment: z.boolean().optional(),
  active: z.boolean().optional(),
  idClerk: z.string().optional(),
});

export const schemaProfile = z.object({
  id: z.number().optional(),
  slug: z.string().optional(),
  name: z.string().min(1, "O nome é obrigatório"),
  description: z
    .string()
    .min(1, "A descrição é obrigatória")
    .max(500, "Limite de 500 caracteres"),
  functions: z.array(
    z
      .string()
      .min(1, "Funcionalidade inválida")
      .min(1, "Ao menos uma funcionalidade deve ser selecionada")
  ),
});

export type UserSchema = z.infer<typeof schemaUser>;

export type ProfileSchema = z.infer<typeof schemaProfile>;
