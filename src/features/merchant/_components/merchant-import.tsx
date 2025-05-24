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
import {
  AlertCircle,
  ArrowLeft,
  FileText,
  Info,
  Send,
  Store,
  Upload,
} from "lucide-react";
import { toast } from "sonner";
import { processMerchantImportDirect } from "../server/merchant-import-direct-action";

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
  address1: MerchantAddress;
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

export interface MerchantResponsibleAddress {
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
  address: MerchantResponsibleAddress;
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
  "Rua/Av. estabelecimento": "establishment.address1.street",
  "Número estabelecimento": "establishment.address1.number",
  "Complemento estabelecimento": "establishment.address1.complement",
  "Bairro estabelecimento": "establishment.address1.neighborhood",
  "CEP Estabelecimento": "establishment.address1.postalCode",
  "Cidade Estabelecimento": "establishment.address1.city",
  "Estado Estabelecimento": "establishment.address1.state",
  "País Estabelecimento": "establishment.address1.country",
  "Nome Completo": "responsible.fullName",
  "CPF Responsável": "responsible.cpf",
  "Data de Nascimento": "responsible.birthDate",
  PEP: "responsible.pep",
  "Telefone Responsável": "responsible.phoneNumber",
  "Telefone do Responsável": "responsible.phoneNumber",
  "DDD Responsável": "responsible.areaCode",
  "Email Responsável": "responsible.email",
  "Email do Responsável": "responsible.email",
  "Nome da Mãe": "responsible.motherName",
  "Número do RG": "responsible.idNumber",
  "Data de emissão": "responsible.idIssueDate",
  "Órgão expedidor": "responsible.issuingAuthority",
  UF: "responsible.idState",
  "UF do RG": "responsible.idState",
  "Endereço Responsável": "responsible.address.street",
  "Rua/Av. Responsável": "responsible.address.street",
  "Número Responsável": "responsible.address.number",
  "Complemento Responsável": "responsible.address.complement",
  "Bairro Responsável": "responsible.address.neighborhood",
  "CEP Responsável": "responsible.address.postalCode",
  "Cidade Responsável": "responsible.address.city",
  "Estado Responsável": "responsible.address.state",
  "País Responsável": "responsible.address.country",
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

  const [importResult, setImportResult] = useState<{
    status: string;
    message: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [importedData, setImportedData] = useState<ImportData[]>([]);
  const [processResult, setProcessResult] = useState<{
    errors: {
      merchantName: string;
      taxId: string;
      error: string;
    }[];
  } | null>(null);

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
        address1: {
          street: row.establishment.address1.street || "",
          number: row.establishment.address1.number || "",
          complement: row.establishment.address1.complement || "",
          neighborhood: row.establishment.address1.neighborhood || "",
          postalCode: row.establishment.address1.postalCode || "",
          city: row.establishment.address1.city || "",
          state: row.establishment.address1.state || "",
          country: row.establishment.address1.country || "",
        },
      },
      contact: {
        email: row.contact?.email || "",
        areaCode: row.contact?.areaCode || "",
        phoneNumber: row.contact?.phoneNumber || "",
        phoneType: row.contact?.phoneType || "",
      },

      responsible: {
        fullName: row.responsible?.fullName || "",
        cpf: row.responsible?.cpf || "",
        birthDate: row.responsible?.birthDate || "",
        email: row.responsible?.email || row.contact?.email || "", // Usar email do contato como fallback
        pep: row.responsible?.pep || false,
        areaCode: row.responsible?.areaCode || row.contact?.areaCode || "", // Usar área do contato como fallback
        phoneNumber:
          row.responsible?.phoneNumber || row.contact?.phoneNumber || "", // Usar telefone do contato como fallback
        phoneType: row.responsible?.phoneType || row.contact?.phoneType || "",
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
          country: row.responsible?.address?.country || "Brasil",
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
    console.log("data", data);
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
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (importedData.length === 0) {
      setImportResult({
        status: "error",
        message: "Por favor, importe um arquivo antes de enviar.",
      });
      return;
    }

    // Autorizadores são opcionais, então não fazemos verificação aqui

    setIsLoading(true);

    try {
      // Chamar a server action para processar os dados
      const result = await processMerchantImportDirect(importedData);

      // Armazenar o resultado para mostrar os erros se necessário
      setProcessResult(result);

      if (result.created > 0) {
        // Mostrar mensagem de sucesso
        toast.success(
          `${result.created} estabelecimento(s) criado(s) com sucesso!`
        );

        setImportResult({
          status: "success",
          message: `${
            result.created
          } estabelecimento(s) criado(s) com sucesso! ${
            result.skipped.total > 0
              ? `(${result.skipped.total} ignorados)`
              : ""
          }`,
        });

        // Se tudo foi processado com sucesso, fechar o modal após 2 segundos
        if (result.skipped.total === 0) {
          setTimeout(() => {
            setOpen(false);
          }, 2000);
        }
      } else {
        // Se nenhum foi criado, mostrar aviso
        setImportResult({
          status: "warning",
          message:
            "Nenhum estabelecimento foi criado. Verifique os erros abaixo.",
        });
      }

      // Se houve registros ignorados, mostrar detalhes
      if (result.skipped.total > 0) {
        const alreadyExists = result.skipped.reasons.alreadyExists;
        const validationError = result.skipped.reasons.validationError;
        const systemError = result.skipped.reasons.systemError;

        let warningMessage = `${result.skipped.total} estabelecimento(s) ignorado(s)`;
        if (alreadyExists > 0) {
          warningMessage += `, ${alreadyExists} já existente(s)`;
        }
        if (validationError > 0) {
          warningMessage += `, ${validationError} com erro(s) de validação`;
        }
        if (systemError > 0) {
          warningMessage += `, ${systemError} com erro(s) do sistema`;
        }

        toast.warning(warningMessage);
      }

      // Se houve erros específicos, exibir
      if (result.errors.length > 0) {
        console.log("Erros durante o processamento:", result.errors);
      }
    } catch (error) {
      console.error("Erro ao processar os dados:", error);

      toast.error("Falha ao processar os estabelecimentos");

      setImportResult({
        status: "error",
        message:
          error instanceof Error
            ? error.message
            : "Erro ao processar os dados. Tente novamente.",
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
          <Button
            variant="outline"
            className="flex items-center gap-2 transition-colors hover:bg-neutral-100"
          >
            <Upload size={16} />
            Importar
          </Button>
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
                    Template
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
                  Importação
                </h2>

                <div className="mb-6">
                  <Label className="block mb-2">
                    Planilha Preenchida: <span className="text-red-500">*</span>
                  </Label>

                  <ExcelImport<ImportData>
                    onDataImported={handleDataImported}
                    validator={validateRow}
                    expectedHeaders={expectedHeaders}
                    headerMapping={headerMapping}
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

                {importResult &&
                  importResult.status !== "success" &&
                  processResult?.errors &&
                  processResult.errors.length > 0 && (
                    <div className="mt-4 mb-4">
                      <h4 className="font-semibold mb-2">
                        Detalhes dos erros:
                      </h4>
                      <div className="max-h-40 overflow-y-auto border rounded p-2 bg-red-50">
                        <ul className="text-sm text-red-700 list-disc pl-5">
                          {processResult?.errors.map(
                            (
                              error: {
                                merchantName: string;
                                taxId: string;
                                error: string;
                              },
                              index: number
                            ) => (
                              <li key={index}>
                                <strong>{error.merchantName}</strong> (
                                {error.taxId}): {error.error}
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                    </div>
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
