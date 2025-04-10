

export interface CardBrand {
  brand: string;
  grossAmount: number;
  netAmount: number;
}

export interface PaymentType {
  type: string;
  totalGross: number;
  totalNet: number;
  brands: CardBrand[];
}

export interface Transaction {
  id: string;
  name: string;
  totalAmount: number;
  paymentTypes: PaymentType[];
}

export interface DailyData {
  date: string;
  total: number;
  transactions: Transaction[];
}

export interface MerchantBrand {
  brand: string;
  total_settlement_amount: number;
}

export interface MerchantProductType {
  product_type: string;
  total_settlement_amount: number;
  brands: MerchantBrand[];
}

export interface MerchantGroupedData {
  merchant_id: string;
  merchant_name: string;
  total_settlement_amount: number;
  product_types: MerchantProductType[];
}

export interface MerchantGroupedResponse {
  result: MerchantGroupedData[];
}

