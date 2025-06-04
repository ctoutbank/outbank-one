import { z } from "zod";

export const schemaFeeBrandProductType = z.object({
  id: z.bigint(),
  slug: z.string().max(50),
  active: z.boolean(),
  dtinsert: z.date().optional(),
  dtupdate: z.date().optional(),
  installmentTransactionFeeStart: z.number().int().optional(),
  installmentTransactionFeeEnd: z.number().int().optional(),
  cardTransactionFee: z.number().int().optional(),
  cardTransactionMdr: z.number().optional(),
  nonCardTransactionFee: z.number().int().optional(),
  nonCardTransactionMdr: z.number().optional(),
  producttype: z.string().max(20).optional(),
  idFeeBrand: z.bigint().optional(),
});

export const schemaFeeBrand = z.object({
  id: z.bigint(),
  slug: z.string().max(50).optional(),
  active: z.boolean().optional(),
  dtinsert: z.date().optional(),
  dtupdate: z.date().optional(),
  brand: z.string().max(25).optional(),
  idGroup: z.number().int().optional(),
  idFee: z.bigint().optional(),
  feeBrandProductType: z.array(schemaFeeBrandProductType).optional(),
});

export const schemaFee = z.object({
  id: z.bigint().optional(),
  slug: z.string().max(50).optional(),
  active: z.boolean().optional(),
  dtinsert: z.date().optional(),
  dtupdate: z.date().optional(),
  name: z.string().max(255).optional(),
  tableType: z.string().max(20).optional(),
  compulsoryAnticipationConfig: z.number().int().optional(),
  eventualAnticipationFee: z.number().optional(),
  anticipationType: z.string().max(25).optional(),
  cardPixMdr: z.number().optional(),
  cardPixCeilingFee: z.number().optional(),
  cardPixMinimumCostFee: z.number().optional(),
  nonCardPixMdr: z.number().optional(),
  nonCardPixCeilingFee: z.number().optional(),
  nonCardPixMinimumCostFee: z.number().optional(),
  feeBrand: z.array(schemaFeeBrand).optional(),
});

export type FeeNewSchema = z.infer<typeof schemaFee>;

export const anticipationTypeSchema = z.object({
  id: z.string().optional(),
  anticipationType: z.enum(["NOANTECIPATION", "EVENTUAL", "COMPULSORY"]),
});

export type AnticipationTypeSchema = z.infer<typeof anticipationTypeSchema>;
