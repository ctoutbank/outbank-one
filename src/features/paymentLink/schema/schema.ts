import { z } from "zod";

export const schemaShoppingItems = z.object({
  slug: z.string().optional(),
  name: z.string().min(1, "Campo obrigatório"),
  quantity: z.number().min(1, "Campo obrigatório"),
  amount: z.string().min(1, "Campo obrigatório"),
  idPaymentLink: z.number().optional(),
});

export const schemaPaymentLink = z.object({
  id: z.number().optional(),
  slug: z.string().optional(),
  linkName: z.string().min(1, "Campo obrigatório"),
  idMerchant: z
    .string({
      required_error: "Campo obrigatório",
      invalid_type_error: "Campo Inválido",
    })
    .min(1, "Campo obrigatório"),
  dtExpiration: z.string().optional(),
  installments: z
    .string({
      required_error: "Campo obrigatório",
      invalid_type_error: "Campo Inválido",
    })
    .min(1, "Campo obrigatório"),
  totalAmount: z.string().min(1, "Campo obrigatório"),
  shoppingItems: z.array(schemaShoppingItems).optional(),
  productType: z.string().min(1, "Campo obrigatório"),
  paymentLinkStatus: z.string().min(1, "Campo obrigatório"),
  linkUrl: z.string().optional(),
  active: z.boolean().optional(),
  dtinsert: z.string().optional(),
  dtupdate: z.string().optional(),
  diffNumber: z
    .string({
      required_error: "Campo obrigatório",
      invalid_type_error: "Campo Inválido",
    })
    .min(1, "Campo obrigatório"),
  expiresAt: z
    .string({
      required_error: "Campo obrigatório",
      invalid_type_error: "Campo Inválido",
    })
    .min(1, "Campo obrigatório"),
  pixEnabled: z.boolean().optional(),
  transactionSlug: z.string().optional(),
});

export type PaymentLinkSchema = z.infer<typeof schemaPaymentLink>;

export type ShoppingItemsSchema = z.infer<typeof schemaShoppingItems>;
