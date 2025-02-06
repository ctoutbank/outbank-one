import { z } from "zod";

export const merchantPixAccountSchema = z.object({
    id: z.number().optional(),
    slug: z.string().max(50).optional(),
    active: z.boolean().optional(),
    dtinsert: z.string().optional(),
    dtupdate: z.string().optional(),
    idRegistration: z.string().max(50).optional(),
    idAccount: z.string().max(20).optional(),
    bankNumber: z.string().max(10).optional(),
    bankBranchNumber: z.string().max(10).optional(), 
    bankBranchDigit: z.string().max(1).optional(),
    bankAccountNumber: z.string().max(20).optional(),
    bankAccountDigit: z.string().max(1).optional(),
    bankAccountType: z.string().max(10).optional(),
    bankAccountStatus: z.string().max(20).optional(),
    onboardingPixStatus: z.string().max(20).optional(),
    message: z.string().optional(),
    bankName: z.string().max(255).optional(),
    idMerchant: z.number().optional(),
    slugMerchant: z.string().max(50).optional(),
    useEstablishmentData: z.boolean().optional(),
    merchantcorporateName: z.string().max(255).optional(),
    merchantdocumentId: z.string().max(14).optional(),
    legalPerson: z.string().max(255).optional(),
    bank: z.string().max(20).optional(),
    accountType: z.string().max(20).optional(),
   
    
    
   
});

export type MerchantPixAccountSchema = z.infer<typeof merchantPixAccountSchema>;
