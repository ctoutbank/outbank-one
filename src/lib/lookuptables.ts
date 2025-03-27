interface SelectItem {
  value: string;
  label: string;
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

export { timezones, states, legalPersonTypes, week };
