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
  idAddress: z.number().optional(),
  cpf: z.string().optional(),
  phone: z.string().optional(),
  birthDate: z.date().optional(),
  

});

export type SalesAgentSchema = z.infer<typeof SchemaSalesAgent>;

export const SchemaAddress = z.object({
  id: z.number().optional(),
  zipCode: z.string().min(1, "CEP é obrigatório"),
  street: z.string().min(1, "Rua é obrigatória"),
  number: z.string().min(1, "Número é obrigatório"),
  complement: z.string().optional(),
  neighborhood: z.string().min(1, "Bairro é obrigatório"),
  city: z.string().min(1, "Cidade é obrigatória"),
  state: z.string().min(1, "Estado é obrigatório"),
  country: z.string().min(1, "País é obrigatório").default("Brasil"),
});

export type AddressSchema = z.infer<typeof SchemaAddress>;
