export type Merchantdock = {
    objects: never[];
    slug: string;
    active: boolean;
    dtInsert: Date;
    dtUpdate: Date;
    merchantId: string;
    name: string;
    documentId: string;
    corporateName?: string;
    email?: string;
    areaCode?: string;
    number?: string;
    phoneType?: "C" | "F"; // "C" para celular, "F" para fixo
    language?: string;
    timezone?: string;
    contacts?: contactsdock[];
    address?: Addressdock;
  
    slugCustomer?: string;
    category?: categorydock;
    legalNature?: LegalNaturedock;
    saleAgent?: saleAgentdock;
  
    riskAnalysisStatus?: string;
    riskAnalysisStatusJustification?: string;
    legalPerson?: string;
    openingDate?: Date;
    inclusion?: string;
    openingDays?: string;
    openingHour?: string;
    closingHour?: string;
    municipalRegistration?: string;
    stateSubcription?: string;
    configuration?: configurationsdock;
    hasTef: boolean;
    hasPix: boolean;
    hasTop: boolean;
    establishmentFormat?: string;
    revenue?: number;
    merchantPixAccount?: merchantPixAccountdock;
  };
  
  export type Addressdock = {
    id: number;
    streetAddress?: string;
    streetNumber?: string;
    complement?: string;
    neighborhood?: string;
    city?: string;
    state?: string;
    country?: string;
    zipCode?: string;
  };
  
  export type contactsdock = {
    id: number;
    name?: string;
    documentId?: string;
    email?: string;
    areaCode?: string;
    number?: string;
    phoneType?: "C" | "F"; // Mobile or Fixed
    birthDate?: Date; // YYYY-MM-DD
    mothersName?: string;
    isPartnerContact: boolean;
    isPep: boolean;
    address?: Addressdock;
  };
  
  export type categorydock = {
    slug: string;
    active: boolean;
    dtInsert: Date;
    dtUpdate: Date;
    name?: string;
    mcc?: string;
    cnae?: string;
    anticipationRiskFactorCp?: number;
    anticipationRiskFactorCnp?: number;
    waitingPeriodCp?: number;
    waitingPeriodCnp?: number;
  };
  
  export type LegalNaturedock = {
    slug: string;
    active: boolean;
    dtInsert: Date;
    dtUpdate: Date;
    name?: string;
    code?: string;
  };
  
  export type saleAgentdock = {
    slug: string;
    active: boolean;
    dtInsert: Date;
    dtUpdate: Date;
    firstName: string;
    lastName: string;
    documentId?: number;
    email?: string;
    slugCustomer?: string;
  };
  
  export type configurationsdock = {
    slug: string;
    active: boolean;
    dtInsert: Date;
    dtUpdate: Date;
    lockCpAnticipationOrder: boolean;
    lockCnpAnticipationOrder: boolean;
    url?: string;
  };
  
  export type merchantPixAccountdock = {
    slug: string;
    active: boolean;
    dtInsert: Date;
    dtUpdate: Date;
    idRegistration?: string;
    idAccount?: string;
    bankNumber?: string;
    bankBranchNumber?: string;
    bankBranchDigit?: string;
    bankAccountNumber?: string;
    bankAccountDigit?: string;
    bankAccountType?: string;
    bankAccountStatus?: string;
    onboardingPixStatus?: string;
    onboardingPixStatusMessage?: string;
    onboardingPixStatusDate?: string;
    message?: string;
    bankName?: string;
  };
  