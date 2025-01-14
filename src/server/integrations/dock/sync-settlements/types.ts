export type Meta = {
  limit: number;
  offset: number;
  total_count: number;
};

export type Customer = {
  slug: string;
  name: string;
  customerId: string;
  settlementManagementType: string;
  paymentInstitution: PaymentInstitution;
};

export type PaymentInstitution = {
  slug: string;
  name: string;
  customerId: string;
  settlementManagementType: string;
};

export type Settlement = {
  slug: string;
  active: boolean;
  dtInsert: string;
  dtUpdate: string;
  batchAmount: number;
  discountFeeAmount: number;
  netSettlementAmount: number;
  totalAnticipationAmount: number;
  totalRestitutionAmount: number;
  pixAmount: number;
  pixNetAmount: number;
  pixFeeAmount: number;
  pixCostAmount: number;
  pendingRestitutionAmount: number;
  totalCreditAdjustmentAmount: number;
  totalDebitAdjustmentAmount: number;
  totalSettlementAmount: number;
  restRoundingAmount: number;
  outstandingAmount: number;
  slugCustomer: string;
  customer: Customer;
  status: string;
  creditStatus: string;
  debitStatus: string;
  anticipationStatus: string;
  pixStatus: string;
  paymentDate: string;
  pendingFinancialAdjustmentAmount: number;
  creditFinancialAdjustmentAmount: number;
  debitFinancialAdjustmentAmount: number;
};

export type SettlementsResponse = {
  meta: Meta;
  objects: Array<Settlement>;
};

export type Merchant = {
  slug: string;
  name: string;
  documentId: string;
};

export type SettlementObject = {
  slug: string;
  active: boolean;
  dtInsert: string;
  dtUpdate: string;
  transactionCount: number;
  adjustmentCount: number;
  batchAmount: number;
  netSettlementAmount: number;
  pixAmount: number;
  pixNetAmount: number;
  pixFeeAmount: number;
  pixCostAmount: number;
  creditAdjustmentAmount: number;
  debitAdjustmentAmount: number;
  totalAnticipationAmount: number;
  totalRestitutionAmount: number;
  pendingRestitutionAmount: number;
  totalSettlementAmount: number;
  pendingFinancialAdjustmentAmount: number;
  creditFinancialAdjustmentAmount: number;
  debitFinancialAdjustmentAmount: number;
  status: string;
  slugMerchant: string;
  merchant: Merchant;
  slugCustomer: string;
  customer: Customer;
  outstandingAmount: number;
  restRoundingAmount: number;
  settlement: Settlement;
};

export type MerchantSettlementsResponse = {
  meta: Meta;
  objects: Array<SettlementObject>;
};

export type MerchantSettlementsOrdersResponse = {
  meta: Meta;
  objects: MerchantSettlementsOrders[];
};

export type MerchantSettlementsOrders = {
  slug: string;
  active: boolean;
  dtInsert: string;
  dtUpdate: string;
  compeCode: string;
  accountNumber: string;
  accountNumberCheckDigit: string;
  slugPaymentInstitution: string;
  paymentInstitution: PaymentInstitution;
  bankBranchNumber: string;
  accountType: string;
  integrationType: string;
  brand: string;
  productType: string;
  amount: number;
  anticipationAmount: number;
  merchantSettlement: SettlementObject;
  merchantSettlementOrderStatus: string;
  orderTransactionId: string;
  settlementUniqueNumber: string;
  protocolGuidId: string;
  legalPerson: string;
  documentId: string;
  corporateName: string;
  effectivePaymentDate: string;
  lock: boolean;
};



export type PixMerchantSettlementOrders = {
  slug: string;
  active: boolean;
  dtInsert: string;
  dtUpdate: string;
  slugCustomer: string;
  customer: Customer;
  slugMerchant: string;
  merchant: Merchant;
  paymentDate: string;
  authorizerMerchantId: string;
  expectedPaymentDate: string;
  transactionCount: number;
  totalAmount: number;
  totalRefundAmount: number;
  totalNetAmount: number;
  totalFeeAmount: number;
  totalCostAmount: number;
  totalSettlementAmount: number;
  status: string;
  compeCode: string;
  accountNumber: string;
  accountNumberCheckDigit: string;
  bankBranchNumber: string;
  accountType: string;
  legalPerson: string;
  documentId: string;
  corporateName: string;
  effectivePaymentDate: string;
  settlementUniqueNumber: string;
  protocolGuidId: string;
  feeSettlementUniqueNumber: string;
  feeEffectivePaymentDate: string;
  feeProtocolGuidId: string;
  merchantSettlement: SettlementObject;
};

export type PixMerchantSettlementOrdersResponse = {
  meta: Meta;
  objects: PixMerchantSettlementOrders[];
};
