import { z } from 'zod';

export const SalesAgentSchema = z.object({
    id: z.number(),
    slug: z.string().nullable().optional(),
    firstName: z.string().nullable().optional(),
    lastName: z.string().nullable().optional(),
    email: z.string().nullable().optional(),
    active: z.boolean().nullable().optional(),
    dtinsert: z.date().nullable().optional(),
    dtupdate: z.date().nullable().optional(),
    documentId: z.string().nullable().optional(),
    slugCustomer: z.string().nullable().optional(),
});