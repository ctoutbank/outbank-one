import { z } from "zod";

export const SchemaSalesAgent = z.object({
  id: z.number().optional(),
  slug: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().optional(),
  active: z.boolean().optional(),
  dtinsert: z.date().optional(),
  dtupdate: z.date().optional(),
  documentId: z.string().optional(),
  slugCustomer: z.string().optional(),
  cpf: z.string().optional(),
  phone: z.string().optional(),
  birthDate: z.date().optional(),
  idUser: z.number().optional(),
});

export type SalesAgentSchema = z.infer<typeof SchemaSalesAgent>;
