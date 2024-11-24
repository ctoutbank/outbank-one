export type Terminal = {
  slug: string;
  active: boolean;
  dtInsert: string; // ISO 8601 date string
  dtUpdate: string; // ISO 8601 date string
  logicalNumber: string;
  type: "P" | string; // Assuming "P" is an example; adjust as needed
  status: "ACTIVE" | string; // Assuming "ACTIVE" is an example; adjust as needed
  serialNumber: string;
  model: string;
  manufacturer: string;
  pinpadSerialNumber: string;
  pinpadFirmware: string;
  slugMerchant: string;
  slugCustomer: string;
  pverfm: string;
  goUpdate: boolean;
  inactivationDate: string; // ISO 8601 date string
  uniqueNumberForMerchant: number;
};
