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

export const schemaConfigurationOperations = z.object({
  id: z.number().optional(),
  slug: z.string().optional(),
  active: z.boolean().optional(),
  lockCpAnticipationOrder: z.boolean().optional(),
  lockCnpAnticipationOrder: z.boolean().optional(),
  url: z.string().optional(),
  dtinsert: z.date().optional(),
  dtupdate: z.date().optional(),
  hasTaf: z.boolean().optional(),
  hastop: z.boolean().optional(),
  hasPix: z.boolean().optional(),
  merhcnatSlug: z.string().optional(),
  cardPresent: z.boolean().optional(),
  cardNotPresent: z.boolean().optional(),
  timezone: z.string().optional(),
  theme: z.string().optional(),
 
});

export type ConfigurationOperationsSchema = z.infer<
  typeof schemaConfigurationOperations
>;
