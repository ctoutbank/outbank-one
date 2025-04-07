"use client";
import type React from "react";
import { useState } from "react";

import ExcelImport from "@/components/excelImport";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  AlertCircle,
  ArrowLeft,
  FileText,
  Info,
  Send,
  Store,
  Upload,
} from "lucide-react";

export interface MerchantData {
  name: string;
  corporateName: string;
  taxId: string; // CNPJ/CPF
  establishmentType: string;
  parentCompanyTaxId?: string;
  cnae: string;
  mcc: string;
  legalNature: string;
  legalNatureCode: string;
  legalFormat: string;
  openingDate: string;
  businessDays: string;
  businessHours: string;
  revenue: string;
}

export interface MerchantContact {
  email: string;
  areaCode: string;
  phoneNumber: string;
  phoneType: string;
}

export interface MerchantAddress {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  postalCode: string;
  city: string;
  state: string;
  country: string;
}

export interface MerchantResponsible {
  fullName: string;
  cpf: string;
  birthDate: string;
  email: string;
  pep: boolean; // Politically Exposed Person
  areaCode: string;
  phoneNumber: string;
  phoneType: string;
  motherName: string;
  idNumber?: string;
  idIssueDate?: string;
  issuingAuthority?: string;
  idState?: string;
  address: MerchantAddress;
}

export interface BankData {
  name: string;
  taxId: string; // CNPJ/CPF
  personType: string;
  bank: string;
  bankCode: string;
  agency: string;
  agencyDigit?: string;
  account: string;
  accountDigit: string;
  accountType: string;
}

export interface TaxData {
  tableCode: string;
}

export interface ConsultantData {
  consultantRegistration: string;
}

export interface OperationInfo {
  cardProcessingMethod: string;
  pixEnabled: boolean;
  url: string;
  theme: string;
  mid: string;
  tid: string;
  cnpToken: string;
  terminalTimezone: string;
  tapOnPhoneEnabled: boolean;
  accessProfile: string;
  tefEnabled: boolean;
}

export interface ImportData {
  establishment: MerchantData;
  contact: MerchantContact;
  establishmentAddress: MerchantAddress;
  responsible: MerchantResponsible;
  bankData: BankData;
  tax: TaxData;
  consultant: ConsultantData;
  operation: OperationInfo;
}

// Tipo para permitir caminhos aninhados no mapeamento
type NestedKeyOf<ObjectType extends object> = {
  [Key in keyof ObjectType & (string | number)]: ObjectType[Key] extends object
    ? `${Key}.${NestedKeyOf<ObjectType[Key]>}`
    : `${Key}`;
}[keyof ObjectType & (string | number)];

// Mapeamento dos cabeçalhos do Excel (português) para as chaves do tipo ImportData (inglês)
const headerMapping: Record<string, NestedKeyOf<ImportData>> = {
  "Nome Fantasia": "establishment.name",
  "Nome / Razão Social": "establishment.corporateName",
  "CNPJ/CPF": "establishment.taxId",
  "Tipo de Estabelecimento": "establishment.establishmentType",
  "Matriz (CNPJ)": "establishment.parentCompanyTaxId",
  CNAE: "establishment.cnae",
  MCC: "establishment.mcc",
  "Natureza Jurídica": "establishment.legalNature",
  "Código (N.J)": "establishment.legalNatureCode",
  "Formato Jurídico": "establishment.legalFormat",
  "Data de Abertura": "establishment.openingDate",
  "Dias de Funcionamento": "establishment.businessDays",
  "Horário de funcionamento": "establishment.businessHours",
  Receita: "establishment.revenue",
  Email: "contact.email",
  "Código de área": "contact.areaCode",
  "Número do Telefone": "contact.phoneNumber",
  "Tipo de telefone": "contact.phoneType",
  "Phone Type": "contact.phoneType",
  "Rua/Av.": "establishmentAddress.street",
  Número: "establishmentAddress.number",
  Complemento: "establishmentAddress.complement",
  Bairro: "establishmentAddress.neighborhood",
  CEP: "establishmentAddress.postalCode",
  Cidade: "establishmentAddress.city",
  Estado: "establishmentAddress.state",
  País: "establishmentAddress.country",
  "Nome Completo": "responsible.fullName",
  CPF: "responsible.cpf",
  "Data de Nascimento": "responsible.birthDate",
  PEP: "responsible.pep",
  Telefone: "responsible.phoneNumber",
  "Nome da Mãe": "responsible.motherName",
  "Número do RG": "responsible.idNumber",
  "Data de emissão": "responsible.idIssueDate",
  "Órgão expedidor": "responsible.issuingAuthority",
  UF: "responsible.idState",
  "Tipo PF/PJ": "bankData.personType",
  Banco: "bankData.bank",
  Código: "bankData.bankCode",
  Agência: "bankData.agency",
  "Dígito da Agência": "bankData.agencyDigit",
  Conta: "bankData.account",
  "Dígito da Conta": "bankData.accountDigit",
  "Tipo de conta": "bankData.accountType",
  "Account type": "bankData.accountType",
  "Código da Tabela": "tax.tableCode",
  "Matrícula do Consultor": "consultant.consultantRegistration",
  "Método de Processamento do Cartão": "operation.cardProcessingMethod",
  PIX: "operation.pixEnabled",
  URL: "operation.url",
  "Tema do Estabelecimento": "operation.theme",
  MID: "operation.mid",
  TID: "operation.tid",
  "Token CNP": "operation.cnpToken",
  "Fuso horário do terminal": "operation.terminalTimezone",
  "Tap On Phone": "operation.tapOnPhoneEnabled",
  "Perfil de Acesso": "operation.accessProfile",
  TEF: "operation.tefEnabled",
};

// Cabeçalhos esperados (em português) – extraídos das chaves do mapeamento
const expectedHeaders = Object.keys(headerMapping);

export default function ExcelImportButton() {
  const [open, setOpen] = useState(false);
  const [authorizer, setAuthorizer] = useState<string>("POSTILION");
  const [importResult, setImportResult] = useState<{
    status: string;
    message: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [importedData, setImportedData] = useState<ImportData[]>([]);

  // Função para validar cada linha do Excel
  const validateRow = (row: Partial<ImportData>): ImportData | null => {
    // Verifica se os campos obrigatórios estão presentes
    if (
      !row.establishment?.name ||
      !row.establishment?.corporateName ||
      !row.establishment?.taxId ||
      !row.establishment?.establishmentType ||
      !row.establishment?.legalNatureCode
    ) {
      console.log("Invalid row, missing required fields:", row);
      return null;
    }

    // Se necessário, adicione validação adicional (ex.: formato de CNPJ, etc.)
    return {
      establishment: {
        name: String(row.establishment?.name),
        corporateName: String(row.establishment?.corporateName),
        taxId: String(row.establishment?.taxId),
        establishmentType: String(row.establishment?.establishmentType),
        parentCompanyTaxId: row.establishment?.parentCompanyTaxId,
        cnae: row.establishment?.cnae || "",
        mcc: row.establishment?.mcc || "",
        legalNature: row.establishment?.legalNature || "",
        legalNatureCode: row.establishment?.legalNatureCode || "",
        legalFormat: row.establishment?.legalFormat || "",
        openingDate: row.establishment?.openingDate || "",
        businessDays: row.establishment?.businessDays || "",
        businessHours: row.establishment?.businessHours || "",
        revenue: row.establishment?.revenue || "",
      },
      contact: {
        email: row.contact?.email || "",
        areaCode: row.contact?.areaCode || "",
        phoneNumber: row.contact?.phoneNumber || "",
        phoneType: row.contact?.phoneType || "",
      },
      establishmentAddress: {
        street: row.establishmentAddress?.street || "",
        number: row.establishmentAddress?.number || "",
        complement: row.establishmentAddress?.complement || "",
        neighborhood: row.establishmentAddress?.neighborhood || "",
        postalCode: row.establishmentAddress?.postalCode || "",
        city: row.establishmentAddress?.city || "",
        state: row.establishmentAddress?.state || "",
        country: row.establishmentAddress?.country || "",
      },
      responsible: {
        fullName: row.responsible?.fullName || "",
        cpf: row.responsible?.cpf || "",
        birthDate: row.responsible?.birthDate || "",
        email: row.responsible?.email || "",
        pep: row.responsible?.pep || false,
        areaCode: row.responsible?.areaCode || "",
        phoneNumber: row.responsible?.phoneNumber || "",
        phoneType: row.responsible?.phoneType || "",
        motherName: row.responsible?.motherName || "",
        idNumber: row.responsible?.idNumber,
        idIssueDate: row.responsible?.idIssueDate,
        issuingAuthority: row.responsible?.issuingAuthority,
        idState: row.responsible?.idState,
        address: {
          street: row.responsible?.address?.street || "",
          number: row.responsible?.address?.number || "",
          complement: row.responsible?.address?.complement || "",
          neighborhood: row.responsible?.address?.neighborhood || "",
          postalCode: row.responsible?.address?.postalCode || "",
          city: row.responsible?.address?.city || "",
          state: row.responsible?.address?.state || "",
          country: row.responsible?.address?.country || "",
        },
      },
      bankData: {
        name: row.bankData?.name || "",
        taxId: row.bankData?.taxId || "",
        personType: row.bankData?.personType || "",
        bank: row.bankData?.bank || "",
        bankCode: row.bankData?.bankCode || "",
        agency: row.bankData?.agency || "",
        agencyDigit: row.bankData?.agencyDigit,
        account: row.bankData?.account || "",
        accountDigit: row.bankData?.accountDigit || "",
        accountType: row.bankData?.accountType || "",
      },
      tax: {
        tableCode: row.tax?.tableCode || "",
      },
      consultant: {
        consultantRegistration: row.consultant?.consultantRegistration || "",
      },
      operation: {
        cardProcessingMethod: row.operation?.cardProcessingMethod || "",
        pixEnabled: row.operation?.pixEnabled || false,
        url: row.operation?.url || "",
        theme: row.operation?.theme || "",
        mid: row.operation?.mid || "",
        tid: row.operation?.tid || "",
        cnpToken: row.operation?.cnpToken || "",
        terminalTimezone: row.operation?.terminalTimezone || "",
        tapOnPhoneEnabled: row.operation?.tapOnPhoneEnabled || false,
        accessProfile: row.operation?.accessProfile || "",
        tefEnabled: row.operation?.tefEnabled || false,
      },
    };
  };

  // Processar os dados importados
  const handleDataImported = (data: ImportData[]) => {
    setImportedData(data);

    if (data.length === 0) {
      setImportResult({
        status: "error",
        message: "No valid data found in the file.",
      });
      return;
    }

    setImportResult({
      status: "success",
      message: `${data.length} records successfully imported!`,
    });

    console.log("Imported data:", data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (importedData.length === 0) {
      setImportResult({
        status: "error",
        message: "Please import a file before submitting.",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Simulação de envio/processamento
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setImportResult({
        status: "success",
        message: `${importedData.length} records successfully processed!`,
      });
    } catch (error) {
      console.error("Error processing the data:", error);
      setImportResult({
        status: "error",
        message: "Error processing the data. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const downloadTemplate = () => {
    window.open("/import_merchants.xlsx", "_blank");
  };

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <button className="flex items-center gap-2 p-2 text-black rounded-md bg-sidebar border border-black">
            <Upload size={16} />
            Importar
          </button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px] md:max-w-[800px]">
          <DialogHeader>
            <DialogTitle className="flex items-center text-xl">
              <Store className="h-5 w-5 mr-2" />
              Importação em Massa
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6 mt-4">
            <div className="space-y-6">
              <div className="border-b pb-4">
                <h2 className="text-lg font-semibold mb-2 uppercase text-gray-700">
                  Template
                </h2>
                <p className="text-sm text-gray-500 mb-3">
                  Baixar template atualizado e use-o para criar seu arquivo:
                </p>
                <div className="flex items-center">
                  <Button
                    variant="link"
                    onClick={downloadTemplate}
                    type="button"
                    className="flex items-center p-0 h-auto text-gray-700 hover:text-gray-900"
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    Baixar Template
                  </Button>
                  <div
                    className="ml-2 text-gray-500 cursor-help"
                    title="Use this template to ensure your data is imported correctly"
                  >
                    <Info className="h-4 w-4" />
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-semibold mb-4 uppercase text-gray-700">
                  Configuração de Importação
                </h2>

                <div className="mb-6">
                  <Label className="block mb-2">
                    Autorizador: <span className="text-red-500">*</span>
                  </Label>
                  <RadioGroup
                    value={authorizer}
                    onValueChange={setAuthorizer}
                    className="space-y-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="POSTILION" id="POSTILION" />
                      <Label htmlFor="POSTILION">POSTILION</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="GLOBAL" id="GLOBAL" />
                      <Label htmlFor="GLOBAL">GLOBAL</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value="GLOBAL-ECOMMERCE"
                        id="GLOBAL-ECOMMERCE"
                      />
                      <Label htmlFor="GLOBAL-ECOMMERCE">GLOBAL-ECOMMERCE</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="CARADHRAS" id="CARADHRAS" />
                      <Label htmlFor="CARADHRAS">CARADHRAS</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="mb-6">
                  <Label className="block mb-2">
                    Planilha Preenchida: <span className="text-red-500">*</span>
                  </Label>

                  <ExcelImport<ImportData>
                    onDataImported={handleDataImported}
                    validator={validateRow}
                    expectedHeaders={expectedHeaders}
                    headerMapping={headerMapping}
                    buttonLabel="Selecionar Arquivo"
                  />

                  {importedData.length > 0 && (
                    <div className="mt-2 text-sm text-gray-600">
                      {importedData.length} registros carregados
                    </div>
                  )}
                </div>

                {importResult && (
                  <Alert
                    className={`mb-4 ${
                      importResult.status === "success"
                        ? "bg-green-50 text-green-800 border-green-200"
                        : "bg-red-50 text-red-800 border-red-200"
                    }`}
                  >
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{importResult.message}</AlertDescription>
                  </Alert>
                )}

                <div className="flex justify-between mt-8">
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => setOpen(false)}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    disabled={isLoading || importedData.length === 0}
                    className="bg-black text-white hover:bg-gray-800"
                  >
                    {isLoading ? "Processando..." : "Enviar"}
                    {!isLoading && <Send className="ml-2 h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
