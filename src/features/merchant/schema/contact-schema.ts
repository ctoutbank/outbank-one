import { z } from "zod";

export const schemaContact = z.object({
    id: z.number().optional(),
    name: z.string().optional(),
	idDocument: z.string().optional(),
	email: z.string().optional(),
	areaCode: z.string().optional(),
	number: z.string().optional(),
	phoneType: z.string().optional(),
	birthDate: z.date().optional(),
	mothersName: z.string().optional(),
	isPartnerContact: z.boolean().optional(),
	isPep: z.boolean().optional(),
	idMerchant: z.number().optional(),
	slugMerchant: z.string().max(50).optional(),
	idAddress: z.number().optional(),
	icNumber: z.string().optional(),
	icDateIssuance: z.date().optional(),
	icDispatcher: z.string().optional(),
	icFederativeUnit: z.string().optional(),
    
	
});





export type ContactSchema = z.infer<typeof schemaContact>;