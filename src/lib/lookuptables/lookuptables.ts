export interface SelectItem {
  value: string;
  label: string;
  color?: string;
}

export interface SelectItemSolicitationFee extends SelectItem {
  transactionFeeStart: string;
  transactionFeeEnd: string;
}

const timezones: SelectItem[] = [
  { value: "-1200", label: "(UTC-12:00) International Date Line West" },
  { value: "-1100", label: "(UTC-11:00) Coordinated Universal Time-11" },
  { value: "-1000", label: "(UTC-10:00) Honolulu (Hawaii)" },
  { value: "-0900", label: "(UTC-09:00) Anchorage (Alaska)" },
  { value: "-0800", label: "(UTC-08:00) Los Angeles" },
  { value: "-0700", label: "(UTC-07:00) Phoenix" },
  { value: "-0600", label: "(UTC-06:00) Chicago" },
  { value: "-0500", label: "(UTC-05:00) New York" },
  { value: "-0430", label: "(UTC-04:30) Caracas" },
  { value: "-0400", label: "(UTC-04:00) Atlantic Time (Canada)" },
  { value: "-0330", label: "(UTC-03:30) Newfoundland" },
  { value: "-0300", label: "(UTC-03:00) Brasilia" },
  { value: "-0200", label: "(UTC-02:00) Coordinated Universal Time-02" },
  { value: "-0100", label: "(UTC-01:00) Azores" },
  { value: "+0000", label: "(UTC) Coordinated Universal Time" },
  {
    value: "+0100",
    label: "(UTC+01:00) Amsterdam, Berlin, Bern, Rome, Stockholm, Vienna",
  },
  { value: "+0200", label: "(UTC+02:00) Athens, Bucharest" },
  { value: "+0300", label: "(UTC+03:00) Istanbul" },
  { value: "+0330", label: "(UTC+03:30) Tehran" },
  { value: "+0400", label: "(UTC+04:00) Samara, Ulyanovsk, Saratov" },
  { value: "+0430", label: "(UTC+04:30) Kabul" },
  { value: "+0500", label: "(UTC+05:00) Ashgabat, Tashkent" },
  { value: "+0530", label: "(UTC+05:30) Chennai, Kolkata, Mumbai, New Delhi" },
  { value: "+0545", label: "(UTC+05:45) Kathmandu" },
  { value: "+0600", label: "(UTC+06:00) Astana" },
  { value: "+0630", label: "(UTC+06:30) Yangon (Rangoon)" },
  { value: "+0700", label: "(UTC+07:00) Bangkok, Hanoi, Jakarta" },
  { value: "+0800", label: "(UTC+08:00) Ulaanbaatar" },
  { value: "+0900", label: "(UTC+09:00) Irkutsk" },
  { value: "+0930", label: "(UTC+09:30) Adelaide" },
  { value: "+1000", label: "(UTC+10:00) Brisbane" },
  { value: "+1100", label: "(UTC+11:00) Solomon Is., New Caledonia" },
  { value: "+1200", label: "(UTC+12:00) Auckland, Wellington" },
  { value: "+1300", label: "(UTC+13:00) Nuku'alofa" },
];

const states: SelectItem[] = [
  { value: "AC", label: "Acre" },
  { value: "AL", label: "Alagoas" },
  { value: "AM", label: "Amazonas" },
  { value: "AP", label: "Amapá" },
  { value: "BA", label: "Bahia" },
  { value: "CE", label: "Ceará" },
  { value: "DF", label: "Distrito Federal" },
  { value: "ES", label: "Espírito Santo" },
  { value: "GO", label: "Goiás" },
  { value: "MA", label: "Maranhão" },
  { value: "MG", label: "Minas Gerais" },
  { value: "MS", label: "Mato Grosso do Sul" },
  { value: "MT", label: "Mato Grosso" },
  { value: "PA", label: "Pará" },
  { value: "PB", label: "Paraíba" },
  { value: "PE", label: "Pernambuco" },
  { value: "PI", label: "Piauí" },
  { value: "PR", label: "Paraná" },
  { value: "RJ", label: "Rio de Janeiro" },
  { value: "RN", label: "Rio Grande do Norte" },
  { value: "RO", label: "Rondônia" },
  { value: "RR", label: "Roraima" },
  { value: "RS", label: "Rio Grande do Sul" },
  { value: "SC", label: "Santa Catarina" },
  { value: "SE", label: "Sergipe" },
  { value: "SP", label: "São Paulo" },
  { value: "TO", label: "Tocantins" },
];

const legalPersonTypes: SelectItem[] = [
  { value: "JURIDICAL", label: "Pessoa Jurídica" },
  { value: "NATURE", label: "Pessoa Física" },
];

const week: SelectItem[] = [
  { value: "DOM", label: "Domingo" },
  { value: "SEG", label: "Segunda" },
  { value: "TER", label: "Terça" },
  { value: "QUA", label: "Quarta" },
  { value: "QUI", label: "Quinta" },
  { value: "SEX", label: "Sexta" },
  { value: "SAB", label: "Sábado" },
];

const UF: SelectItem[] = [
  { value: "AC", label: "AC" },
  { value: "AL", label: "AL" },
  { value: "AM", label: "AM" },
  { value: "AP", label: "AP" },
  { value: "BA", label: "BA" },
  { value: "CE", label: "CE" },
  { value: "DF", label: "DF" },
  { value: "ES", label: "ES" },
  { value: "GO", label: "GO" },
  { value: "MA", label: "MA" },
  { value: "MG", label: "MG" },
  { value: "MS", label: "MS" },
  { value: "MT", label: "MT" },
  { value: "PA", label: "PA" },
  { value: "PB", label: "PB" },
  { value: "PE", label: "PE" },
  { value: "PI", label: "PI" },
  { value: "PR", label: "PR" },
  { value: "RJ", label: "RJ" },
  { value: "RN", label: "RN" },
  { value: "RO", label: "RO" },
  { value: "RR", label: "RR" },
  { value: "RS", label: "RS" },
  { value: "SC", label: "SC" },
  { value: "SE", label: "SE" },
  { value: "SP", label: "SP" },
  { value: "TO", label: "TO" },
];

export const StatusKyc: SelectItem[] = [
  { value: "APPROVED", label: "Aprovado" },
  { value: "PENDING", label: "Em Análise" },
  { value: "DECLINED", label: "Recusado" },
  { value: "NOTANALYSED", label: "Cadastrado" },
  { value: "WAITINGDOCUMENTS", label: "Incompleto" },
  { value: "KYCOFFLINE", label: "KYC Desligado" },
];

export const AccountTypee: SelectItem[] = [
  { value: "CHECKING", label: "Conta Corrente" },
  { value: "SAVINGS", label: "Conta Poupança" },
  { value: "DEPOSIT", label: "Conta Depósito" },
  { value: "PAYMENT", label: "Conta Pagamento" },
];

export { legalPersonTypes, states, timezones, UF, week };

export const PricingSolicitationStatus: SelectItem[] = [
  {
    value: "PENDING",
    label: "Pendente",
    color: "bg-yellow-500 hover:bg-yellow-600",
  },
  {
    value: "REVIEWED",
    label: "Revisado",
    color: "bg-gray-500 hover:bg-gray-600",
  },
  {
    value: "APPROVED",
    label: "Aprovado",
    color: "bg-emerald-500 hover:bg-emerald-600",
  },
  {
    value: "CANCELED",
    label: "Cancelado",
    color: "bg-red-500 hover:bg-red-600",
  },
];

export const SolicitationFeeProductTypeList: SelectItemSolicitationFee[] = [
  {
    value: "DEBIT",
    label: "Débito",
    transactionFeeStart: "0",
    transactionFeeEnd: "0",
  },
  {
    value: "CREDIT",
    label: "Crédito a Vista",
    transactionFeeStart: "0",
    transactionFeeEnd: "0",
  },
  {
    value: "CREDIT_INSTALLMENTS_2_TO_6 ",
    label: "Crédito (2-6x)",
    transactionFeeStart: "2",
    transactionFeeEnd: "6",
  },
  {
    value: "CREDIT_INSTALLMENTS_7_TO_12 ",
    label: "Crédito (7-12x)",
    transactionFeeStart: "7",
    transactionFeeEnd: "12",
  },
  {
    value: "VOUCHER",
    label: "Voucher",
    transactionFeeStart: "0",
    transactionFeeEnd: "0",
  },
  {
    value: "PREPAID_CREDIT",
    label: "Pré-pago",
    transactionFeeStart: "0",
    transactionFeeEnd: "0",
  },
];
