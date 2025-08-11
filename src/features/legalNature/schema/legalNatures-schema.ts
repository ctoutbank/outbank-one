import { z } from "zod";

export const schemaLegalNature = z.object({
  id: z.number().optional(),
  code: z.string().min(1, "Código é obrigatório"),
  name: z.string().min(1, "Nome é obrigatório"),
  slug: z.string().optional(),
  active: z.boolean().optional(),
  dtinsert: z.date().optional(),
  dtupdate: z.date().optional(),
});

export type LegalNatureSchema = z.infer<typeof schemaLegalNature>;
