import { z } from "zod";

export const schemaMerchant = z.object({
  id: z.bigint().optional(),
  slug: z.string().max(50).optional(),
  active: z.boolean().optional(),
  dtinsert: z.date().optional(),
  dtupdate: z.date().optional(),
  idMerchant: z.string().max(20).optional(),
  name: z.string().max(255).optional(),
  idDocument: z.string().max(20).optional(),
  corporateName: z.string().max(255).optional(),
  email: z.string().max(255).optional(),
  areaCode: z.string().max(5).optional(),
  number: z.string().max(15).optional(),
  phoneType: z.string().max(2).optional(),
  language: z.string().max(10).optional(),
  timezone: z.string().max(10).optional(),
  slugCustomer: z.string().max(50).optional(),
  riskAnalysisStatus: z.string().max(20).optional(),
  riskAnalysisStatusJustification: z.string().optional(),
  legalPerson: z.string().max(50).optional(),
  openingDate: z.date().optional(),
  inclusion: z.string().max(255).optional(),
  openingDays: z.array(z.string()).optional(),
  openingHour: z.string().optional(),
  closingHour: z.string().optional(),
  municipalRegistration: z.string().max(20).optional(),
  stateSubcription: z.string().max(20).optional(),
  hasTef: z.boolean().optional(),
  hasPix: z.boolean().optional(),
  hasTop: z.boolean().optional(),
  establishmentFormat: z.string().max(10).optional(),
  revenue: z.number().optional(),
  idCategory: z.number().optional(),
  slugCategory: z.string().max(50).optional(),
  idLegalNature: z.number().optional(),
  slugLegalNature: z.string().max(50).optional(),
  idSalesAgent: z.number().optional(),
  slugSalesAgent: z.string().max(50).optional(),
  idConfiguration: z.number().optional(),
  slugConfiguration: z.string().max(50).optional(),
  idAddress: z.number().optional(),
  is_affiliate: z.boolean().optional().nullable(),
  cnae: z.string().max(20).optional().nullable(),
  mcc: z.string().max(20).optional().nullable(),
  state_registration: z.string().max(20).optional().nullable(),
  legal_nature: z.string().optional().nullable(),
  legal_form: z.string().optional().nullable(),
  address: z
    .object({
      zipCode: z.string().max(10).optional().nullable(),
      street: z.string().max(255).optional().nullable(),
      number: z.string().max(10).optional().nullable(),
      complement: z.string().max(255).optional().nullable(),
      neighborhood: z.string().max(255).optional().nullable(),
      city: z.string().max(255).optional().nullable(),
      state: z.string().max(2).optional().nullable(),
      country: z.string().max(255).optional().nullable(),
    })
    .optional()
    .nullable(),
  isOwner: z.string().optional().nullable(),
  isPep: z.string().optional().nullable(),
  cpf: z.string().max(14).optional().nullable(),
  rg: z
    .object({
      number: z.string().max(20).optional().nullable(),
      issueDate: z.string().optional().nullable(),
      issuingAgency: z.string().max(20).optional().nullable(),
      issuingState: z.string().max(2).optional().nullable(),
    })
    .optional()
    .nullable(),
  fullName: z.string().max(255).optional().nullable(),
  birthDate: z.string().optional().nullable(),
  motherName: z.string().max(255).optional().nullable(),
  personalEmail: z.string().max(255).optional().nullable(),
  phone: z
    .object({
      areaCode: z.string().max(3).optional().nullable(),
      number: z.string().max(10).optional().nullable(),
    })
    .optional()
    .nullable(),
  personalAddress: z
    .object({
      zipCode: z.string().max(10).optional().nullable(),
      street: z.string().max(255).optional().nullable(),
      number: z.string().max(10).optional().nullable(),
      complement: z.string().max(255).optional().nullable(),
      neighborhood: z.string().max(255).optional().nullable(),
      city: z.string().max(255).optional().nullable(),
      state: z.string().max(2).optional().nullable(),
      country: z.string().max(255).optional().nullable(),
    })
    .optional()
    .nullable(),
});

export type MerchantSchema = z.infer<typeof schemaMerchant>;
