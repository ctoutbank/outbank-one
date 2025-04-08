"use client";
import { FileUpload } from "@/components/ui/upload";
import ExcelJS from "exceljs";

interface ExcelImportProps<T> {
  onDataImported: (data: T[]) => void;
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
  expectedHeaders,
  headerMapping,
}: ExcelImportProps<T>) {
  const handleFileUpload = async (files: File[]) => {
    const file = files[0];
    if (!file) return;

    try {
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(await file.arrayBuffer());

      const worksheet = workbook.worksheets[0];
      if (!worksheet) {
        throw new Error("Planilha vazia");
      }

      // Ler os cabeçalhos a partir da 4ª linha (índice 4)
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

      console.log("headers processados:", headers);

      // Normaliza tanto os cabeçalhos esperados quanto os encontrados para comparação
      const normalizedHeaders = headers.map((h) =>
        h && typeof h === "string" ? normalizeHeader(h) : ""
      );
      const normalizedExpectedHeaders = expectedHeaders.map(normalizeHeader);

      const missingHeaders = expectedHeaders.filter((header) => {
        const normalizedHeader = normalizeHeader(header);
        return !normalizedHeaders.some(
          (h) => normalizeHeader(h) === normalizedHeader
        );
      });

      if (missingHeaders.length > 0) {
        console.log(
          "Cabeçalhos encontrados (normalizados):",
          normalizedHeaders
        );
        console.log(
          "Cabeçalhos esperados (normalizados):",
          normalizedExpectedHeaders
        );
        throw new Error(`Cabeçalhos ausentes: ${missingHeaders.join(", ")}`);
      }

      const data: T[] = [];

      // Itera as linhas a partir da 5ª linha (linha após o cabeçalho)
      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber < 5) return; // Pula as 4 primeiras linhas

        const rowData: Partial<T> = {};
        console.log(`\n--- Row ${rowNumber} ---`);

        row.eachCell((cell, colNumber) => {
          const portugueseHeader = headers[colNumber - 1] as string;
          const englishKey = headerMapping[portugueseHeader];
          if (englishKey) {
            // Split the key by dots and set the nested value
            const keys = englishKey.split(".");
            let current: any = rowData;

            for (let i = 0; i < keys.length - 1; i++) {
              const key = keys[i];
              if (!current[key]) {
                current[key] = {};
              }
              current = current[key];
            }

            current[keys[keys.length - 1]] = cell.value;
            console.log(
              `${portugueseHeader} (${String(englishKey)}):`,
              cell.value
            );
          }
        });

        const validatedRow = validator(rowData);
        console.log("Raw row data:", rowData);
        console.log("Validated row data:", validatedRow);

        if (validatedRow) {
          data.push(validatedRow);
        }
      });

      console.log("\nFinal imported data:", data);

      onDataImported(data);
    } catch (error) {
      console.error("Erro ao importar arquivo:", error);
      alert(
        error instanceof Error ? error.message : "Erro ao importar arquivo"
      );
    }
  };

  return (
    <div className="flex justify-start">
      <FileUpload
        onUpload={handleFileUpload}
        maxFiles={4}
        maxSize={10 * 1024 * 1024} // 10MB
        accept=".xlsx,.xls"
      />
    </div>
  );
}
