import { z } from "zod";

export const schemaContact = z.object({
    id: z.number().optional(),
    name: z.string().min(1, "Nome é obrigatório"),
	idDocument: z.string().min(1, "Documento é obrigatório"),
	email: z.string().email("Email inválido"),
	areaCode: z.string().min(1, "Código de área é obrigatório"),
	number: z.string().min(1, "Número é obrigatório"),
	phoneType: z.string().min(1, "Tipo de telefone é obrigatório"),
	birthDate: z.date().optional(),
	mothersName: z.string().min(1, "Nome da mãe é obrigatório"),
	isPartnerContact: z.boolean().optional(),
	isPep: z.boolean().optional(),
	idMerchant: z.number().optional(),
	slugMerchant: z.string().max(50).optional(),
	idAddress: z.number().optional(),
    
	
});





export type ContactSchema = z.infer<typeof schemaContact>;