"use client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FileUpload } from "@/components/ui/upload";
import ExcelJS from "exceljs";
import { AlertCircle } from "lucide-react";
import { useState } from "react";

interface ExcelImportProps<T> {
  onDataImported: (
    data: T[],
    invalidRows: { row: number; errors: string[] }[]
  ) => void;
  // Função que valida e transforma a linha (com as chaves em inglês)
  validator: (row: Partial<T>) => T | null;
  // Cabeçalhos esperados no Excel (em português)
  expectedHeaders: string[];
  // Mapeamento de cabeçalhos em português para as chaves do tipo T (em inglês)
  headerMapping: Record<string, string>;
}

export default function ExcelImport<T>({
  onDataImported,
  validator,

  headerMapping,
}: ExcelImportProps<T>) {
  const [importStatus, setImportStatus] = useState<{
    status: "idle" | "success" | "error" | "warning";
    message: string;
  }>({ status: "idle", message: "" });

  const handleFileUpload = async (files: File[]) => {
    const file = files[0];
    if (!file) return;

    try {
      setImportStatus({ status: "idle", message: "Processando arquivo..." });

      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(await file.arrayBuffer());

      const worksheet = workbook.worksheets[0];
      if (!worksheet) {
        throw new Error("Planilha vazia");
      }

      // Ler os cabeçalhos a partir da 5ª linha (índice 5)
      const headerRow = worksheet.getRow(5);
      let headers = headerRow.values as Array<
        string | { richText: Array<{ text: string }> }
      >;
      headers.shift(); // remove o primeiro item (geralmente vazio)

      // Função para normalizar os cabeçalhos
      const normalizeHeader = (header: string) => {
        return header
          .toLowerCase()
          .replace(/\s*\*\s*$/, "")
          .replace(/\s+/g, " ")
          .trim();
      };

      // Extrair o texto puro dos cabeçalhos
      headers = headers.map((header) => {
        if (typeof header === "string") {
          return header.replace(/\s*\*\s*$/, "").trim();
        }
        if (header?.richText) {
          return header.richText
            .map((rt) => rt.text)
            .join("")
            .replace(/\s*\*\s*$/, "")
            .trim();
        }
        return "";
      }) as string[];

      // Lista de campos obrigatórios baseados nos registros existentes
      const requiredHeaders = [
        "Nome Fantasia",
        "Nome / Razão Social",
        "CNPJ/CPF",
        "Tipo de Estabelecimento",
        "Código (N.J)",
        "Email",
        "Tipo de telefone",
        "Phone Type", // Adicionado como alternativa
        "Telefone", // Adicionado como alternativa para phoneNumber
        "Receita",
        "MCC",
        "CNAE",
        "País",
        "Cidade",
        "Estado",
        "Account type", // Adicionado como alternativa
        "Tipo de conta", // Adicionado como alternativa
      ];

      // Verificar cabeçalhos ausentes com verificação mais flexível
      const normalizedHeaders = headers.map((h) =>
        h && typeof h === "string" ? normalizeHeader(h) : ""
      );

      // Para cada cabeçalho obrigatório, verificamos se existe alguma variante dele
      const missingHeaders = requiredHeaders.filter((header) => {
        // Verificamos se existe qualquer cabeçalho que inclua esta string
        // ou variantes comuns (phone type / tipo de telefone)
        const alternatives = getHeaderAlternatives(header);

        return !alternatives.some((alt) =>
          normalizedHeaders.some((h) => h.includes(alt) || alt.includes(h))
        );
      });

      // Agrupar cabeçalhos alternativos para não mostrar duplicados no erro
      const uniqueMissingGroups = groupAlternativeHeaders(missingHeaders);

      if (uniqueMissingGroups.length > 0) {
        console.error(
          "Cabeçalhos encontrados (normalizados):",
          normalizedHeaders
        );
        throw new Error(
          `Cabeçalhos obrigatórios ausentes: ${uniqueMissingGroups.join(", ")}`
        );
      }

      // Criar mapeamento de índices para os cabeçalhos encontrados com melhor correspondência
      const headerIndexMap = new Map<string, number>();
      headers.forEach((header, index) => {
        if (header && typeof header === "string") {
          // Verificar correspondência direta
          const directMatch = Object.keys(headerMapping).find(
            (expectedHeader) =>
              normalizeHeader(header) === normalizeHeader(expectedHeader)
          );

          if (directMatch) {
            headerIndexMap.set(directMatch, index);
          } else {
            // Verificar correspondência aproximada
            // Ordenar headers esperados por tamanho para dar prioridade às correspondências mais específicas
            const sortedExpectedHeaders = Object.keys(headerMapping).sort(
              (a, b) => b.length - a.length
            );

            for (const expectedHeader of sortedExpectedHeaders) {
              const normalizedExpected = normalizeHeader(expectedHeader);
              const normalizedCurrent = normalizeHeader(header);

              if (
                !Array.from(headerIndexMap.values()).includes(index) &&
                !headerIndexMap.has(expectedHeader) &&
                (normalizedCurrent.includes(normalizedExpected) ||
                  normalizedExpected.includes(normalizedCurrent) ||
                  // Verificação especial para cabeçalhos conhecidos problemáticos
                  isHeaderAlternative(expectedHeader, header))
              ) {
                headerIndexMap.set(expectedHeader, index);

                break;
              }
            }
          }
        }
      });

      // Log dos cabeçalhos encontrados

      const data: T[] = [];
      const invalidRows: { row: number; errors: string[] }[] = [];

      // Itera as linhas a partir da 6ª linha (linha após o cabeçalho)
      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber < 6) return; // Pula as 5 primeiras linhas

        // Verificar se a linha está vazia (todas as células vazias)
        let isEmpty = true;
        row.eachCell({ includeEmpty: false }, () => {
          isEmpty = false;
        });

        if (isEmpty) {
          return;
        }

        const rowData: Partial<T> = {};

        // Para cada cabeçalho mapeado
        for (const [headerText, columnIndex] of Array.from(
          headerIndexMap.entries()
        )) {
          console.log("headerText", headerText);
          const mappedKey = headerMapping[headerText];
          if (!mappedKey) continue;

          const cellValue = row.getCell(columnIndex + 1).value;
          console.log("cellValue", cellValue);
          if (cellValue !== undefined && cellValue !== null) {
            // Split the key by dots and set the nested value
            const keys = mappedKey.split(".");
            let current: any = rowData;

            for (let i = 0; i < keys.length - 1; i++) {
              const key = keys[i];
              if (!current[key]) {
                current[key] = {};
              }
              current = current[key];
            }

            current[keys[keys.length - 1]] = formatCellValue(
              cellValue,
              keys[keys.length - 1]
            );
          }
        }

        // Garantir que phoneType esteja preenchido mesmo que não esteja no arquivo
        ensureRequiredFields(rowData);

        try {
          const validatedRow = validator(rowData);

          if (validatedRow) {
            data.push(validatedRow);
          } else {
            // Se a validação falhou sem lançar uma exceção, adicionar um erro genérico
            invalidRows.push({
              row: rowNumber,
              errors: ["Dados inválidos ou incompletos"],
            });
          }
        } catch (error) {
          // Capturar erros específicos de validação, se houver
          const errorMessage =
            error instanceof Error
              ? error.message
              : "Erro desconhecido na validação";

          console.error(
            `Erro na validação da linha ${rowNumber}:`,
            errorMessage
          );
          invalidRows.push({
            row: rowNumber,
            errors: [errorMessage],
          });
        }
      });

      if (data.length === 0) {
        setImportStatus({
          status: "error",
          message: "Nenhum registro válido encontrado no arquivo.",
        });
      } else {
        setImportStatus({
          status: invalidRows.length > 0 ? "warning" : "success",
          message:
            invalidRows.length > 0
              ? `${data.length} registros válidos e ${invalidRows.length} inválidos.`
              : `${data.length} registros importados com sucesso.`,
        });
      }

      onDataImported(data, invalidRows);
    } catch (error) {
      console.error("Erro ao importar arquivo:", error);
      setImportStatus({
        status: "error",
        message:
          error instanceof Error ? error.message : "Erro ao importar arquivo",
      });

      // Retorna uma lista vazia em caso de erro geral
      onDataImported([], []);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-start">
        <FileUpload
          onUpload={handleFileUpload}
          maxFiles={1}
          maxSize={10 * 1024 * 1024} // 10MB
          accept=".xlsx,.xls"
        />
      </div>

      {importStatus.status !== "idle" && (
        <Alert
          className={`mt-4 ${
            importStatus.status === "success"
              ? "bg-green-50 text-green-800 border-green-200"
              : importStatus.status === "warning"
              ? "bg-yellow-50 text-yellow-800 border-yellow-200"
              : "bg-red-50 text-red-800 border-red-200"
          }`}
        >
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{importStatus.message}</AlertDescription>
        </Alert>
      )}

      <div className="text-xs text-muted-foreground mt-2">
        <p>• Certifique-se de usar o template fornecido</p>
        <p>• Todos os campos marcados com * são obrigatórios</p>
        <p>• Não altere a ordem ou nomes das colunas</p>
      </div>
    </div>
  );
}

// Função para obter alternativas para um cabeçalho
function getHeaderAlternatives(header: string): string[] {
  const normalized = header.toLowerCase().trim();

  const alternativesMap: Record<string, string[]> = {
    "tipo de telefone": ["phone type", "tipo telefone"],
    "phone type": ["tipo de telefone", "tipo telefone"],
    telefone: ["número do telefone", "phone number"],
    "tipo de conta": ["account type"],
    "account type": ["tipo de conta"],
  };

  return [normalized, ...(alternativesMap[normalized] || [])];
}

// Função para verificar se um cabeçalho é alternativa de outro
function isHeaderAlternative(expected: string, found: string): boolean {
  const normalizedExpected = expected.toLowerCase().trim();
  const normalizedFound = found.toLowerCase().trim();

  return (
    getHeaderAlternatives(normalizedExpected).includes(normalizedFound) ||
    getHeaderAlternatives(normalizedFound).includes(normalizedExpected)
  );
}

// Função para agrupar cabeçalhos alternativos
function groupAlternativeHeaders(headers: string[]): string[] {
  const groups: Record<string, string[]> = {};

  for (const header of headers) {
    let isGrouped = false;

    // Verificar se o cabeçalho pertence a algum grupo existente
    for (const groupKey of Object.keys(groups)) {
      if (isHeaderAlternative(groupKey, header)) {
        groups[groupKey].push(header);
        isGrouped = true;
        break;
      }
    }

    // Se não pertence a nenhum grupo, criar novo grupo
    if (!isGrouped) {
      groups[header] = [header];
    }
  }

  // Retornar apenas um representante de cada grupo
  return Object.values(groups).map((group) => group[0]);
}

// Função para garantir que campos obrigatórios estejam preenchidos
function ensureRequiredFields(rowData: any): void {
  // Garantir que contact existe
  if (!rowData.contact) {
    rowData.contact = {};
  }

  // Garantir que phoneType está preenchido
  if (!rowData.contact.phoneType) {
    // Tentar inferir o tipo de telefone a partir do número
    if (rowData.contact.phoneNumber) {
      // Se for um número longo (10+ dígitos), provavelmente é celular
      const digits = rowData.contact.phoneNumber.replace(/\D/g, "");
      if (digits.length >= 10) {
        rowData.contact.phoneType = "P"; // Celular
      } else {
        rowData.contact.phoneType = "C"; // Padrão para comercial
      }
    } else {
      rowData.contact.phoneType = "C"; // Padrão para comercial
    }
  }

  // Garantir que bankData.accountType está preenchido
  if (rowData.bankData && !rowData.bankData.accountType) {
    rowData.bankData.accountType = "Corrente"; // Padrão
  }
}

// Função para formatar valores de células conforme o tipo esperado
function formatCellValue(value: any, fieldType: string): any {
  // Se o valor for null ou undefined, retornar string vazia
  if (value === null || value === undefined) {
    return "";
  }

  // Se for uma célula Excel com valor
  if (typeof value === "object" && value.text) {
    value = value.text;
  } else if (typeof value === "object" && value.result !== undefined) {
    value = value.result;
  }

  // Converter para string se não for
  if (typeof value !== "string") {
    value = String(value);
  }

  // Formatações específicas por campo
  switch (fieldType) {
    case "phoneType":
      // Padronizar tipos de telefone
      if (
        value.toLowerCase().includes("celular") ||
        value.toLowerCase() === "p"
      ) {
        return "P";
      } else if (
        value.toLowerCase().includes("residencial") ||
        value.toLowerCase() === "r"
      ) {
        return "R";
      } else {
        return "C"; // Comercial por padrão
      }

    case "mcc":
      // Garantir que MCC seja apenas números
      return value.replace(/\D/g, "");

    case "cnae":
      // Formatar CNAE no formato esperado
      return value.trim();

    case "pixEnabled":
    case "tapOnPhoneEnabled":
    case "tefEnabled":
      // Converter valores booleanos
      return (
        value.toLowerCase() === "sim" ||
        value.toLowerCase() === "yes" ||
        value.toLowerCase() === "true"
      );

    case "accountType":
      // Padronizar tipo de conta
      if (
        value.toLowerCase().includes("poupança") ||
        value.toLowerCase().includes("poupanca") ||
        value.toLowerCase() === "savings"
      ) {
        return "Poupança";
      } else {
        return "Corrente";
      }

    default:
      return value;
  }
}
