import { z } from "zod";

export const schemaLegalNature = z.object({
  id: z.number().optional(),
  code: z.string().optional(),
  name: z.string().optional(),
  slug: z.string().optional(),
  active: z.boolean().optional(),
  dtinsert: z.date().optional(),
  dtupdate: z.date().optional(),
});

export type LegalNatureSchema = z.infer<typeof schemaLegalNature>;
