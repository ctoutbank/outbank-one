import { z } from "zod";

export const schemaConfiguration = z.object({
  id: z.number().optional(),
  slug: z.string().optional(),
  active: z.boolean().optional(),
  lockCpAnticipationOrder: z.boolean().optional(),
  lockCnpAnticipationOrder: z.boolean().optional(),
  url: z.string().optional(),
  dtinsert: z.date().optional(),
  dtupdate: z.date().optional(),
});

export type ConfigurationSchema = z.infer<typeof schemaConfiguration>;
