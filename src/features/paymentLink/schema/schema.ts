import { z } from "zod";

export const schemaShoppingItems = z.object({
  slug: z.string().optional(),
  name: z.string().optional(),
  quantity: z.number().optional(),
  amount: z.string().optional(),
  idPaymentLink: z.number().optional(),
});

export const schemaPaymentLink = z.object({
  id: z.number().optional(),
  linkName: z.string().optional(),
  idMerchant: z.string().optional(),
  dtExpiration: z.string().optional(),
  installments: z.string().optional(),
  totalAmount: z.string().optional(),
  items: z.array(schemaShoppingItems).optional(),
  active: z.boolean().optional(),
  dtinsert: z.string().optional(),
  dtupdate: z.string().optional(),
});

export type PaymentLinkSchema = z.infer<typeof schemaPaymentLink>;

export type ShoppingItemsSchema = z.infer<typeof schemaShoppingItems>;
