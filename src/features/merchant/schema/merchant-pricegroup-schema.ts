import { z } from "zod";

export const merchantPriceGroupSchema = z.object({
    id: z.number().optional(),
    slug: z.string().optional(),
    active: z.boolean().optional(),
    dtinsert: z.date().nullable(),
    dtupdate: z.date().nullable(),
    brand: z.string().max(25).optional(),
    idGroup: z.number().optional(),
    idMerchantPrice: z.number().optional(),
});

export type MerchantPriceGroupSchema = z.infer<typeof merchantPriceGroupSchema>; 