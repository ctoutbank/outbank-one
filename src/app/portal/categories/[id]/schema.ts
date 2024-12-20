
import { z } from 'zod';

export const schemaCategories = z.object({
    id: z.number().optional(),
    slug: z.string().nullable(),
    name: z.string().nullable(),
    active: z.boolean().nullable(),
    dtinsert: z.date().nullable(),
    dtupdate: z.date().nullable(),
    mcc: z.string().nullable(),
    cnae: z.string().nullable(),
    anticipation_risk_factor_cp: z.number().nullable(),
    anticipation_risk_factor_cnp: z.number().nullable(),
    waiting_period_cp: z.number().nullable(),
    waiting_period_cnp: z.number().nullable(),
});