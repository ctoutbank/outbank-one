"use server";

import { getFeeTableCode } from "@/features/newTax/server/fee-db";
import { db } from "@/server/db";
import { and, eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import {
  addresses,
  categories,
  contacts,
  legalNatures,
  merchantBankAccounts,
  merchants,
} from "../../../../drizzle/schema";
import { createMerchantPriceFromFeeAction } from "../_actions/create-merchant-price-action";
import { ImportData } from "../_components/merchant-import";
import {
  buscarMerchantCompletoRealParaAPI,
  getSlugById,
  insertAddress,
  insertMerchant,
  InsertMerchant1,
} from "./merchant";

interface ProcessedResult {
  success: boolean;
  created: number;
  skipped: {
    total: number;
    reasons: {
      alreadyExists: number;
      validationError: number;
      systemError: number;
    };
  };
  errors: {
    merchantName: string;
    taxId: string;
    error: string;
  }[];
}

// Verificar se um merchant existe com base no CNPJ/CPF
async function merchantExists(taxId: string): Promise<boolean> {
  // Normalizar o taxId removendo caracteres não numéricos
  const normalizedTaxId = taxId.replace(/[^0-9]/g, "");

  // Verificar no banco de dados se já existe estabelecimento com este documento
  const existingMerchants = await db
    .select()
    .from(merchants)
    .where(eq(merchants.idDocument, normalizedTaxId));

  const exists = existingMerchants.length > 0;

  return exists;
}

// Função para validar e formatar horários corretamente
function formatTimeString(timeString: string | undefined | null): string {
  if (!timeString) return "09:00"; // Horário padrão se não informado

  // Remover espaços extras
  const trimmed = timeString.trim().toLowerCase();

  // Verificar se já está no formato HH:MM
  if (/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(trimmed)) {
    return trimmed;
  }

  // Mapear termos comuns para horários padrão
  if (trimmed.includes("manhã") || trimmed.includes("manha")) {
    return "09:00";
  }
  if (trimmed.includes("tarde")) {
    return "14:00";
  }
  if (trimmed.includes("noite")) {
    return "19:00";
  }

  // Tentar extrair números que possam representar horas
  const hourMatch = trimmed.match(/([0-9]{1,2})[^0-9]*([0-9]{2})?/);
  if (hourMatch) {
    const hour = parseInt(hourMatch[1]);
    if (hour >= 0 && hour <= 23) {
      const minute = hourMatch[2] ? parseInt(hourMatch[2]) : 0;
      if (minute >= 0 && minute <= 59) {
        // Formato com zero à esquerda para horas e minutos
        return `${hour.toString().padStart(2, "0")}:${minute
          .toString()
          .padStart(2, "0")}`;
      }
    }
  }

  // Se não conseguir extrair um horário válido, retorna o padrão
  console.warn(
    `Formato de horário inválido: "${timeString}", usando padrão "09:00"`
  );
  return "09:00";
}

// Função para validar e converter datas com segurança
function safeParseDate(dateString: string | undefined | null): string | null {
  if (!dateString) return null;

  try {
    // Verificar se a data parece estar em um formato válido
    if (
      dateString.includes("+045757") ||
      dateString.length > 30 ||
      !dateString.match(/^\d{4}[-/]?\d{1,2}[-/]?\d{1,2}/) ||
      new Date(dateString).toString() === "Invalid Date"
    ) {
      console.warn(`Data inválida detectada: ${dateString}, usando null`);
      return null;
    }

    // Converter para ISO string, mas remover a parte do timezone se estiver problemática
    const date = new Date(dateString);
    const isoString = date.toISOString();

    // Verificar se o resultado é razoável (não muito no passado ou futuro)
    const year = date.getFullYear();
    if (year < 1900 || year > 2100) {
      console.warn(`Ano fora do intervalo razoável: ${year}, usando null`);
      return null;
    }

    return isoString;
  } catch (error) {
    console.error(`Erro ao processar data "${dateString}":`, error);
    return null;
  }
}

// Função para converter data do formato DD/MM/YYYY para YYYY-MM-DD
function formatBrazilianDateToISO(
  dateString: string | undefined | null
): string | null {
  if (!dateString) return null;

  try {
    // Verificar se está no formato DD/MM/YYYY
    const brazilianDateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    const match = dateString.trim().match(brazilianDateRegex);

    if (!match) {
      console.warn(
        `Formato de data inválido: "${dateString}". Esperado DD/MM/YYYY`
      );
      return null;
    }

    const [, day, month, year] = match;

    // Validar se os valores são válidos
    const dayNum = parseInt(day);
    const monthNum = parseInt(month);
    const yearNum = parseInt(year);

    if (dayNum < 1 || dayNum > 31) {
      console.warn(`Dia inválido: ${day}`);
      return null;
    }

    if (monthNum < 1 || monthNum > 12) {
      console.warn(`Mês inválido: ${month}`);
      return null;
    }

    if (yearNum < 1900 || yearNum > 2100) {
      console.warn(`Ano fora do intervalo razoável: ${year}`);
      return null;
    }

    // Verificar se a data é válida criando um objeto Date
    const testDate = new Date(yearNum, monthNum - 1, dayNum);
    if (
      testDate.getFullYear() !== yearNum ||
      testDate.getMonth() !== monthNum - 1 ||
      testDate.getDate() !== dayNum
    ) {
      console.warn(`Data inválida: ${dateString}`);
      return null;
    }

    // Retornar no formato YYYY-MM-DD
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  } catch (error) {
    console.error(`Erro ao processar data "${dateString}":`, error);
    return null;
  }
}

// Processar dias de funcionamento para o formato correto (1111100 = seg a sex, 1111111 = todos os dias)
function processBusinessDays(businessDays: string | undefined | null): string {
  if (!businessDays) {
    return "1111100"; // Padrão: segunda a sexta
  }

  const normalized = businessDays.toLowerCase().trim();

  // Se já estiver no formato binário correto (sequência de 0 e 1 com 7 dígitos)
  if (/^[01]{7}$/.test(normalized)) {
    return normalized;
  }

  // Padrões comuns
  if (
    normalized.includes("segunda") &&
    normalized.includes("sexta") &&
    !normalized.includes("sábado") &&
    !normalized.includes("sabado") &&
    !normalized.includes("domingo")
  ) {
    return "1111100"; // Segunda a sexta
  }

  if (
    (normalized.includes("segunda") && normalized.includes("sábado")) ||
    (normalized.includes("sabado") && !normalized.includes("domingo"))
  ) {
    return "1111110"; // Segunda a sábado
  }

  if (
    normalized.includes("todos") ||
    normalized.includes("todo dia") ||
    normalized.includes("todos os dias") ||
    normalized.includes("diariamente") ||
    (normalized.includes("segunda") && normalized.includes("domingo"))
  ) {
    return "1111111"; // Todos os dias da semana
  }

  // Processar dias individuais
  let days = "0000000";
  if (normalized.includes("segunda") || normalized.includes("seg")) {
    days = replaceCharAt(days, 0, "1");
  }
  if (
    normalized.includes("terça") ||
    normalized.includes("terca") ||
    normalized.includes("ter")
  ) {
    days = replaceCharAt(days, 1, "1");
  }
  if (normalized.includes("quarta") || normalized.includes("qua")) {
    days = replaceCharAt(days, 2, "1");
  }
  if (normalized.includes("quinta") || normalized.includes("qui")) {
    days = replaceCharAt(days, 3, "1");
  }
  if (normalized.includes("sexta") || normalized.includes("sex")) {
    days = replaceCharAt(days, 4, "1");
  }
  if (
    normalized.includes("sábado") ||
    normalized.includes("sabado") ||
    normalized.includes("sab")
  ) {
    days = replaceCharAt(days, 5, "1");
  }
  if (normalized.includes("domingo") || normalized.includes("dom")) {
    days = replaceCharAt(days, 6, "1");
  }

  // Se não detectou nenhum dia, assume padrão de segunda a sexta
  if (days === "0000000") {
    return "1111100";
  }

  return days;
}

// Função auxiliar para substituir um caractere em uma posição específica
function replaceCharAt(str: string, index: number, char: string): string {
  if (index < 0 || index >= str.length) return str;
  return str.substring(0, index) + char + str.substring(index + 1);
}

// Processar horário de funcionamento de forma mais robusta
function processBusinessHours(businessHours: string | undefined | null): {
  openingHour: string;
  closingHour: string;
} {
  if (!businessHours) {
    return { openingHour: "09:00", closingHour: "18:00" };
  }

  // Verificar se há um separador de intervalo (hífen, 'a', 'até', etc.)
  let parts: string[] = [];

  if (businessHours.includes("-")) {
    parts = businessHours.split("-");
  } else if (businessHours.includes("a")) {
    parts = businessHours.split("a");
  } else if (businessHours.includes("até")) {
    parts = businessHours.split("até");
  } else if (businessHours.includes("as")) {
    parts = businessHours.split("as");
  } else if (businessHours.includes("às")) {
    parts = businessHours.split("às");
  } else {
    // Se não há separador claro, tente verificar padrões comuns
    if (businessHours.toLowerCase().includes("Manhã")) {
      parts = ["8:00", "12:00"];
    } else if (businessHours.toLowerCase().includes("Tarde")) {
      parts = ["13:00", "18:00"];
    } else if (businessHours.toLowerCase().includes("Noite")) {
      parts = ["18:00", "22:00"];
    } else if (businessHours.toLowerCase().includes("Horário Comercial")) {
      parts = ["09:00", "18:00"];
    } else {
      // Se não conseguir identificar, use horário comercial padrão
      console.warn(
        `Não foi possível extrair intervalo de horário de: "${businessHours}", usando padrão comercial`
      );
      parts = ["09:00", "18:00"];
    }
  }

  // Garantir que temos duas partes
  if (parts.length < 2) {
    parts.push("18:00"); // Adicionar horário de fechamento padrão se faltando
  }

  // Formatar os horários
  const openingHour = formatTimeString(parts[0]);
  const closingHour = formatTimeString(parts[1]);

  return { openingHour, closingHour };
}

// Processar valor de receita para formato numérico
function processRevenue(revenue: string | undefined | null): string {
  if (!revenue) {
    return "0"; // Valor padrão se não informado
  }

  // Remover espaços, símbolos de moeda, etc.
  let normalized = revenue
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^0-9,.k]/g, "");

  // Tratar sufixos K (mil) e M (milhão)
  if (normalized.endsWith("k")) {
    normalized = normalized.replace("k", "");
    normalized = (parseFloat(normalized.replace(",", ".")) * 1000).toString();
  } else if (normalized.endsWith("m")) {
    normalized = normalized.replace("m", "");
    normalized = (
      parseFloat(normalized.replace(",", ".")) * 1000000
    ).toString();
  }

  // Tratar formato brasileiro (1.000,00) e internacional (1,000.00)
  if (normalized.includes(",") && normalized.includes(".")) {
    // Determinar qual é o separador decimal baseado na posição
    const lastCommaIndex = normalized.lastIndexOf(",");
    const lastDotIndex = normalized.lastIndexOf(".");

    if (lastCommaIndex > lastDotIndex) {
      // Formato brasileiro: 1.000,00
      normalized = normalized.replace(/\./g, "").replace(",", ".");
    } else {
      // Formato internacional: 1,000.00
      normalized = normalized.replace(/,/g, "");
    }
  } else if (normalized.includes(",")) {
    // Apenas vírgula, verificar se é decimal (0,5) ou separador de milhar (1,000)
    const parts = normalized.split(",");
    if (parts.length === 2 && parts[1].length <= 2) {
      // Provavelmente decimal no formato brasileiro
      normalized = normalized.replace(",", ".");
    } else {
      // Provavelmente separador de milhar
      normalized = normalized.replace(/,/g, "");
    }
  }

  // Tentar converter para número
  try {
    const num = parseFloat(normalized);
    if (isNaN(num)) {
      console.warn(`Valor de receita inválido: "${revenue}", usando 0`);
      return "0";
    }
    return num.toString();
  } catch (error) {
    console.warn(`Erro ao processar receita "${revenue}":`, error);
    return "0";
  }
}

// Criar um novo merchant
async function createMerchant(merchantData: ImportData): Promise<{
  success: boolean;
  message: string;
  merchantId?: number;
}> {
  try {
    // Garantir que o objeto responsible exista e tenha a estrutura correta
    if (!merchantData.responsible) {
      merchantData.responsible = {
        fullName: "",
        cpf: "",
        birthDate: "",
        email: "",
        pep: false,
        areaCode: "",
        phoneNumber: "",
        phoneType: "",
        motherName: "",

        address: {
          street: "",
          number: "",
          complement: "",
          neighborhood: "",
          postalCode: "",
          city: "",
          state: "",
          country: "",
        },
      };
    } else if (!merchantData.responsible.address) {
      merchantData.responsible.address = {
        street: "",
        number: "",
        complement: "",
        neighborhood: "",
        postalCode: "",
        city: "",
        state: "",
        country: "",
      };
    }

    // Validar dados obrigatórios
    if (!merchantData.establishment.name) {
      throw new Error("Nome do estabelecimento é obrigatório");
    }

    if (!merchantData.establishment.taxId) {
      throw new Error("CNPJ/CPF é obrigatório");
    }

    // Normalizar CNPJ/CPF
    const normalizedTaxId = merchantData.establishment.taxId.replace(
      /[^0-9]/g,
      ""
    );

    // Verificar se já existe
    const exists = await merchantExists(normalizedTaxId);
    if (exists) {
      throw new Error("Estabelecimento já existe no sistema");
    }

    // Passo 1: Criar o endereço do estabelecimento primeiro

    const addressData = {
      streetAddress: merchantData.establishment.address1.street || "",
      streetNumber: merchantData.establishment.address1.number || "",
      complement: merchantData.establishment.address1.complement || "",
      neighborhood: merchantData.establishment.address1.neighborhood || "",
      city: merchantData.establishment.address1.city || "",
      state: merchantData.establishment.address1.state || "",
      country: merchantData.establishment.address1.country || "Brasil",
      zipCode: merchantData.establishment.address1.postalCode || "",
    };

    // Usar a função existente de inserção de endereço que verifica duplicatas
    const addressId = await insertAddress(addressData);

    // Verificar se o endereço foi realmente criado
    const verifyAddress = await db
      .select()
      .from(addresses)
      .where(eq(addresses.id, addressId))
      .limit(1);

    if (verifyAddress.length === 0) {
      throw new Error(
        `Não foi possível encontrar o endereço criado com ID ${addressId}`
      );
    }

    // Passo 2: Buscar slugs necessários

    // Buscar ID da categoria baseado no CNAE - utilizar o primeiro disponível se não for especificado
    let categoryId = 0;
    if (merchantData.establishment.cnae) {
      const categoriesResult = await db
        .select()
        .from(categories)
        .where(eq(categories.cnae, merchantData.establishment.cnae))
        .limit(1);

      if (categoriesResult.length > 0) {
        categoryId = Number(categoriesResult[0].id);
      }
    }

    // Buscar ID da natureza jurídica baseado no código
    let legalNatureId = 0;
    if (merchantData.establishment.legalNatureCode) {
      // Normalizar o código removendo hífen e espaços
      const normalizedCode = merchantData.establishment.legalNatureCode.replace(
        /[-\s]/g,
        ""
      );

      // Buscar primeiro pelo código exato
      let legalNaturesResult = await db
        .select()
        .from(legalNatures)
        .where(
          eq(legalNatures.code, merchantData.establishment.legalNatureCode)
        )
        .limit(1);

      // Se não encontrar pelo código exato, tenta pelo código normalizado
      if (legalNaturesResult.length === 0) {
        legalNaturesResult = await db
          .select()
          .from(legalNatures)
          .where(
            sql`REPLACE(REPLACE(code, '-', ''), ' ', '') = ${normalizedCode}`
          )
          .limit(1);
      }

      if (legalNaturesResult.length > 0) {
        legalNatureId = Number(legalNaturesResult[0].id);
      } else {
        // Se ainda não encontrou, procura por descrição
        const legalNatureDesc = await db
          .select()
          .from(legalNatures)
          .where(sql`LOWER(name) LIKE LOWER('%Sociedade Empresária Limitada%')`)
          .limit(1);

        if (legalNatureDesc.length > 0) {
          legalNatureId = Number(legalNatureDesc[0].id);
        } else {
          console.error(
            `[createMerchant] Natureza Jurídica não encontrada para o código: ${merchantData.establishment.legalNatureCode}`
          );
          throw new Error(
            `Código de Natureza Jurídica não encontrado no banco de dados: ${merchantData.establishment.legalNatureCode}`
          );
        }
      }
    }

    // Buscar slugs utilizando função existente
    const [legalNatureSlug, categorySlug, configurationSlug] =
      await Promise.all([
        legalNatureId ? getSlugById(legalNatures, legalNatureId) : null,
        categoryId ? getSlugById(categories, categoryId) : null,
        null, // Configuration não está sendo usada no momento
      ]);

    // Passo 3: Criar o merchant
    // Gerar slug baseado no nome

    // Formatar o tipo de telefone
    const phoneType = merchantData.contact.phoneType
      ?.toUpperCase()
      ?.startsWith("P")
      ? "P"
      : merchantData.contact.phoneType?.toUpperCase()?.startsWith("R")
        ? "R"
        : "C";

    // Formatar a data de abertura
    const openingDate = merchantData.establishment.openingDate
      ? formatBrazilianDateToISO(merchantData.establishment.openingDate)
      : null;

    // Formatar a data de nascimento
    const birthDate = merchantData.responsible.birthDate
      ? {
          day: merchantData.responsible.birthDate.split("/")[0],
          month: merchantData.responsible.birthDate.split("/")[1],
          year: merchantData.responsible.birthDate.split("/")[2],
        }
      : null;

    const feeTableCode = await getFeeTableCode(merchantData.tax.tableCode);

    // Preparar payload do merchant com todos os campos necessários
    const merchantPayload = {
      slug: "",
      active: true,
      dtinsert: new Date().toISOString(),
      dtupdate: new Date().toISOString(),
      idMerchant: "", // Auto-gerado pelo sistema
      name: merchantData.establishment.name,
      idDocument: normalizedTaxId,
      corporateName: merchantData.establishment.corporateName,
      email: merchantData.contact.email,
      areaCode: merchantData.contact.areaCode,
      number: merchantData.contact.phoneNumber,
      birthDate: birthDate ? birthDate.toString() : null,
      phoneType,
      language: "pt-BR",
      timezone: "-0300",
      slugCustomer: "",
      riskAnalysisStatus: "PENDING",
      riskAnalysisStatusJustification: "",
      legalPerson: merchantData.establishment.establishmentType
        ?.toLowerCase()
        ?.includes("f")
        ? "PF"
        : "PJ",
      openingDate: openingDate ? new Date(openingDate) : null,
      inclusion: "",
      openingDays: processBusinessDays(merchantData.establishment.businessDays),
      ...processBusinessHours(merchantData.establishment.businessHours),
      municipalRegistration: "",
      stateSubcription: "",
      hasTef: merchantData.operation?.tefEnabled || false,
      hasPix: merchantData.operation?.pixEnabled || false,
      hasTop: merchantData.operation?.tapOnPhoneEnabled || false,
      establishmentFormat: merchantData.establishment.legalFormat || "",
      revenue: processRevenue(merchantData.establishment.revenue),
      idMerchantPrice: feeTableCode,
      idCategory: categoryId,
      slugCategory: categorySlug || "",
      idLegalNature: legalNatureId,
      slugLegalNature: legalNatureSlug || "",
      idSalesAgent: null,
      slugSalesAgent: "",
      idConfiguration: null,
      slugConfiguration: configurationSlug || "",
      idAddress: addressId, // ID do endereço criado no passo 1
    };

    // Usar a função existente para inserir o merchant
    const merchantId = await insertMerchant(merchantPayload as any);

    // Verificar se o merchant foi criado com o endereço correto
    const verifyMerchant = await db
      .select()
      .from(merchants)
      .where(eq(merchants.id, merchantId))
      .limit(1);

    if (verifyMerchant.length === 0) {
      throw new Error(
        `Não foi possível encontrar o merchant criado com ID ${merchantId}`
      );
    }

    // Verificar se o ID do endereço associado ao merchant é o mesmo que foi criado
    if (verifyMerchant[0].idAddress !== addressId) {
      console.error(
        `[createMerchant] ERRO: ID do endereço no merchant (${verifyMerchant[0].idAddress}) é diferente do esperado (${addressId})`
      );

      // Correção: atualizar o merchant com o ID do endereço correto
      await db
        .update(merchants)
        .set({ idAddress: addressId })
        .where(eq(merchants.id, merchantId));
    }

    // Passo 4: Criar o responsável (contato principal)
    if (merchantData.responsible) {
      try {
        // Verificar se temos pelo menos o nome ou cpf
        if (merchantData.responsible.fullName || merchantData.responsible.cpf) {
          // Verificar se a propriedade address existe
          if (!merchantData.responsible.address) {
            console.warn(
              "[createMerchant] Objeto responsible.address não existe, inicializando um vazio"
            );
            merchantData.responsible.address = {
              street: "",
              number: "",
              complement: "",
              neighborhood: "",
              postalCode: "",
              city: "",
              state: "",
              country: "",
            };
          }

          let responsibleAddressId;

          // Primeiro vamos comparar os dados do endereço do responsável com o do estabelecimento
          // Se forem iguais, reutilizamos o ID do endereço do merchant
          // Verifica se o endereço do responsável é o mesmo do estabelecimento:
          // 1. Se a rua do responsável não existe OU é igual à rua do estabelecimento E
          // 2. Se o número do responsável não existe OU é igual ao número do estabelecimento E
          // 3. Se o CEP do responsável não existe OU é igual ao CEP do estabelecimento
          const isSameAddress =
            (!merchantData.responsible?.address?.street ||
              merchantData.responsible?.address?.street ===
                merchantData.establishment.address1.street) &&
            (!merchantData.responsible?.address?.number ||
              merchantData.responsible?.address?.number ===
                merchantData.establishment.address1.number) &&
            (!merchantData.responsible?.address?.postalCode ||
              merchantData.responsible?.address?.postalCode ===
                merchantData.establishment.address1.postalCode);

          if (isSameAddress) {
            // Se o endereço for igual, reutilizamos o ID do endereço do merchant
            responsibleAddressId = addressId;
          } else {
            // Se o endereço for diferente, criamos um novo

            const responsibleAddressData = {
              streetAddress: merchantData.responsible?.address?.street || "",
              streetNumber: merchantData.responsible?.address?.number || "",
              complement: merchantData.responsible?.address?.complement || "",
              neighborhood:
                merchantData.responsible?.address?.neighborhood || "",
              city: merchantData.responsible?.address?.city || "",
              state: merchantData.responsible?.address?.state || "",
              country: merchantData.responsible?.address?.country || "Brasil",
              zipCode: merchantData.responsible?.address?.postalCode || "",
            };

            responsibleAddressId = await insertAddress(responsibleAddressData);
          }

          // Verificar se o endereço do responsável existe no banco
          const verifyResponsibleAddress = await db
            .select()
            .from(addresses)
            .where(eq(addresses.id, responsibleAddressId))
            .limit(1);

          if (verifyResponsibleAddress.length === 0) {
            console.error(
              `[createMerchant] ERRO: Endereço do responsável com ID ${responsibleAddressId} não encontrado no banco de dados.`
            );

            responsibleAddressId = addressId;
          }

          // Formatar a data de nascimento
          let birthDate = null;
          if (merchantData.responsible.birthDate) {
            birthDate = formatBrazilianDateToISO(
              merchantData.responsible.birthDate
            );
          }

          // Formatar a data de emissão do documento
          let icDateIssuance = null;
          if (merchantData.responsible.idIssueDate) {
            icDateIssuance = formatBrazilianDateToISO(
              merchantData.responsible.idIssueDate
            );
          }

          // Formatar o tipo de telefone
          // Se o responsável não tem tipo de telefone, reutilizamos o do contato principal
          const responsiblePhoneType = (
            merchantData.responsible.phoneType ||
            merchantData.contact.phoneType ||
            ""
          )
            ?.toUpperCase()
            ?.startsWith("P")
            ? "P"
            : (
                  merchantData.responsible.phoneType ||
                  merchantData.contact.phoneType ||
                  ""
                )
                  ?.toUpperCase()
                  ?.startsWith("R")
              ? "R"
              : "C";

          // Criar contato para o responsável

          const contactData = {
            name: merchantData.responsible.fullName || "Responsável",
            idDocument: merchantData.responsible.cpf
              ? merchantData.responsible.cpf.replace(/[^0-9]/g, "")
              : merchantData.establishment.taxId.replace(/[^0-9]/g, ""), // Usa o CNPJ como fallback
            email:
              merchantData.responsible.email ||
              merchantData.contact.email ||
              "",
            areaCode:
              merchantData.responsible.areaCode ||
              merchantData.contact.areaCode ||
              "",
            number:
              merchantData.responsible.phoneNumber ||
              merchantData.contact.phoneNumber ||
              "",
            phoneType: responsiblePhoneType,
            birthDate: birthDate ? new Date(birthDate) : null,
            mothersName: merchantData.responsible.motherName || "",
            isPartnerContact: true, // Define como sócio por padrão
            isPep: merchantData.responsible.pep || true,
            idMerchant: merchantId,
            slugMerchant: "",
            idAddress: responsibleAddressId,
            icNumber: merchantData.responsible.idNumber || "",
            icDateIssuance: icDateIssuance ? new Date(icDateIssuance) : null,
            icDispatcher: merchantData.responsible.issuingAuthority || "",
            icFederativeUnit: merchantData.responsible.idState || "",
          };

          // Garantir que os tipos de dados estejam corretos
          const formattedContactData = {
            ...contactData,
            birthDate: birthDate ? new Date(birthDate) : null,
            isPep: Boolean(contactData.isPep),
            isPartnerContact: Boolean(contactData.isPartnerContact),
            idMerchant: Number(contactData.idMerchant),
            idAddress: Number(contactData.idAddress),
            icDateIssuance: contactData.icDateIssuance
              ? new Date(contactData.icDateIssuance)
              : null,
          };

          try {
            // Inserir o contato formatado na tabela
            await db.insert(contacts).values({
              ...formattedContactData,
              birthDate: formattedContactData.birthDate?.toISOString() || null,
              icDateIssuance:
                formattedContactData.icDateIssuance?.toISOString() || null,
            });

            // Verificar se o contato foi inserido corretamente
            const verifyContact = await db
              .select()
              .from(contacts)
              .where(
                and(
                  eq(contacts.idMerchant, merchantId),
                  eq(contacts.name, formattedContactData.name)
                )
              )
              .limit(1);

            if (verifyContact.length > 0) {
              // Verificar se o ID do endereço é o esperado
              if (
                verifyContact[0].idAddress !== formattedContactData.idAddress
              ) {
                console.error(
                  `[createMerchant] AVISO: ID do endereço no contato (${verifyContact[0].idAddress}) é diferente do esperado (${formattedContactData.idAddress})`
                );

                // Corrigir o ID do endereço se necessário
                await db
                  .update(contacts)
                  .set({ idAddress: formattedContactData.idAddress })
                  .where(eq(contacts.id, verifyContact[0].id));
              }
            } else {
              console.warn(
                `[createMerchant] Não foi possível verificar o contato criado no banco de dados.`
              );
            }
          } catch (insertError) {
            console.error(
              "[createMerchant] Erro ao inserir contato:",
              insertError
            );
            throw insertError; // Propagar o erro para ser capturado pelo try/catch externo
          }
        }
      } catch (errorContact) {
        console.error(
          "[createMerchant] Erro ao criar responsável:",
          errorContact
        );
        // Não falhar a criação do merchant se houver erro no responsável
      }
    }

    // Passo 5: Criar dados bancários se disponíveis
    if (merchantData.bankData && merchantData.bankData.account) {
      try {
        // Verificar se temos os valores necessários
        const bankNumber = merchantData.bankData.bankCode || "";
        const bankName = merchantData.bankData.bank || "";

        if (!bankNumber) {
          console.warn(
            "[createMerchant] Código do banco não fornecido, usando valor padrão"
          );
        }

        if (!bankName) {
          console.warn(
            "[createMerchant] Nome do banco não fornecido, usando valor padrão"
          );
        }

        // Criar conta bancária para o merchant
        const bankAccountData = {
          slug: "",
          active: true,
          dtinsert: new Date().toISOString(),
          dtupdate: new Date().toISOString(),
          corporateName: merchantData.establishment.corporateName,
          legalPerson: merchantData.establishment.establishmentType
            ?.toLowerCase()
            ?.includes("f")
            ? "PF"
            : "PJ",
          documentId: merchantData.establishment.taxId.replace(/[^0-9]/g, ""),
          bankBranchNumber: merchantData.bankData.agency || "",
          bankBranchCheckDigit: merchantData.bankData.agencyDigit || "",
          accountNumber: merchantData.bankData.account || "",
          accountNumberCheckDigit: merchantData.bankData.accountDigit || "",
          accountType: merchantData.bankData.accountType || "CHECKING", // Padrão para conta corrente

          compeCode: merchantData.bankData.bankCode || "",
          idMerchant: merchantId,
        };

        // Garantir que temos um tipo de conta válido
        if (!bankAccountData.accountType) {
          console.warn(
            "[createMerchant] Tipo de conta não fornecido, usando CHECKING como padrão"
          );
          bankAccountData.accountType = "CHECKING";
        }

        // Inserir na tabela merchantbankaccount
        await db.insert(merchantBankAccounts).values(bankAccountData);
      } catch (errorBank) {
        console.error(
          "[createMerchant] Erro ao criar dados bancários:",
          errorBank
        );
        // Não falhar a criação do merchant se houver erro nos dados bancários
      }
    }

    // Passo 6: Clonar tabela de taxas automaticamente se foi fornecido um código de taxa
    if (merchantData.tax?.tableCode) {
      try {
        console.log(
          `[createMerchant] Iniciando processo de atribuição de taxa para merchant ${merchantId}`
        );

        // DEBUG: Verificar código da tabela de taxas
        console.log(
          `[createMerchant] Código da tabela fornecido: "${merchantData.tax.tableCode}"`
        );
        console.log(
          `[createMerchant] Tipo do código da tabela: ${typeof merchantData.tax.tableCode}`
        );

        // Buscar o ID da tabela de taxas
        const feeTableCode = await getFeeTableCode(merchantData.tax.tableCode);
        console.log(
          `[createMerchant] ID da tabela de taxas encontrado: ${feeTableCode}`
        );

        try {
          // 6.1: Clonar a fee e criar merchantPrice
          const cloneResult = await createMerchantPriceFromFeeAction({
            feeId: feeTableCode.toString(),
            merchantId: merchantId,
          });

          if (!cloneResult.success) {
            console.error(
              `[createMerchant] Erro ao clonar taxa: ${cloneResult.error}`
            );
            throw new Error(`Erro ao atribuir taxa: ${cloneResult.error}`);
          }

          console.log(
            `[createMerchant] Taxa clonada com sucesso para merchant ${merchantId}`
          );
        } catch (cloneError) {
          console.error(
            `[createMerchant] Erro específico na clonagem da taxa: ${cloneError instanceof Error ? cloneError.message : "Erro desconhecido"}`
          );
          throw cloneError; // Re-throw para ser capturado pelo catch externo
        }

        try {
          // 6.2: Buscar todos os dados completos do merchant criado
          const merchantAPIData =
            await buscarMerchantCompletoRealParaAPI(merchantId);

          if (!merchantAPIData) {
            throw new Error(
              "Merchant não encontrado ou dados incompletos no banco local após criação"
            );
          }

          console.log(
            `[createMerchant] Dados completos do merchant ${merchantId} obtidos, enviando para API`
          );

          // 6.3: Enviar todos os dados para a API
          await InsertMerchant1(merchantAPIData, merchantId);

          console.log(
            `[createMerchant] Merchant ${merchantId} enviado para API com sucesso`
          );
        } catch (apiError) {
          console.error(
            `[createMerchant] Erro específico na busca/envio para API: ${apiError instanceof Error ? apiError.message : "Erro desconhecido"}`
          );
          throw apiError; // Re-throw para ser capturado pelo catch externo
        }
      } catch (taxError) {
        console.error(
          `[createMerchant] Erro no processo de taxa/API para merchant ${merchantId}:`,
          taxError
        );
        // Não falhar a criação do merchant se houver erro na taxa ou API
        // O merchant já foi criado com sucesso no banco local
        console.warn(
          `[createMerchant] Merchant ${merchantId} criado no banco local, mas houve erro na taxa/API: ${taxError instanceof Error ? taxError.message : "Erro desconhecido"}`
        );
      }
    } else {
      console.log(
        `[createMerchant] Nenhum código de taxa fornecido para merchant ${merchantId}, pulando atribuição automática`
      );
    }

    // Log detalhado da estrutura completa criada no Excel/Importação
    console.log("=".repeat(80));
    console.log(`🎉 ESTABELECIMENTO CRIADO COM SUCESSO - ID: ${merchantId}`);
    console.log("=".repeat(80));
    console.log("📋 ESTRUTURA COMPLETA DO MERCHANT IMPORTADO:");
    console.log("");

    console.log("🏢 DADOS DO ESTABELECIMENTO:");
    console.log(`   Nome Fantasia: ${merchantData.establishment.name}`);
    console.log(`   Razão Social: ${merchantData.establishment.corporateName}`);
    console.log(`   CNPJ/CPF: ${merchantData.establishment.taxId}`);
    console.log(
      `   Tipo: ${merchantData.establishment.establishmentType || "N/A"}`
    );
    console.log(
      `   Código Natureza Jurídica: ${merchantData.establishment.legalNatureCode || "N/A"}`
    );
    console.log(`   CNAE: ${merchantData.establishment.cnae || "N/A"}`);
    console.log(
      `   Data de Abertura: ${merchantData.establishment.openingDate || "N/A"}`
    );
    console.log(`   Receita: ${merchantData.establishment.revenue || "N/A"}`);
    console.log(
      `   Dias de Funcionamento: ${merchantData.establishment.businessDays || "N/A"}`
    );
    console.log(
      `   Horário de Funcionamento: ${merchantData.establishment.businessHours || "N/A"}`
    );
    console.log("");

    console.log("📍 ENDEREÇO DO ESTABELECIMENTO:");
    console.log(
      `   Rua: ${merchantData.establishment.address1.street || "N/A"}`
    );
    console.log(
      `   Número: ${merchantData.establishment.address1.number || "N/A"}`
    );
    console.log(
      `   Complemento: ${merchantData.establishment.address1.complement || "N/A"}`
    );
    console.log(
      `   Bairro: ${merchantData.establishment.address1.neighborhood || "N/A"}`
    );
    console.log(
      `   Cidade: ${merchantData.establishment.address1.city || "N/A"}`
    );
    console.log(
      `   Estado: ${merchantData.establishment.address1.state || "N/A"}`
    );
    console.log(
      `   CEP: ${merchantData.establishment.address1.postalCode || "N/A"}`
    );
    console.log(
      `   País: ${merchantData.establishment.address1.country || "N/A"}`
    );
    console.log("");

    console.log("📞 DADOS DE CONTATO:");
    console.log(`   Email: ${merchantData.contact.email || "N/A"}`);
    console.log(`   DDD: ${merchantData.contact.areaCode || "N/A"}`);
    console.log(`   Telefone: ${merchantData.contact.phoneNumber || "N/A"}`);
    console.log(`   Tipo Telefone: ${merchantData.contact.phoneType || "N/A"}`);
    console.log("");

    console.log("👤 DADOS DO RESPONSÁVEL:");
    console.log(
      `   Nome Completo: ${merchantData.responsible?.fullName || "N/A"}`
    );
    console.log(`   CPF: ${merchantData.responsible?.cpf || "N/A"}`);
    console.log(
      `   Data Nascimento: ${merchantData.responsible?.birthDate || "N/A"}`
    );
    console.log(`   Email: ${merchantData.responsible?.email || "N/A"}`);
    console.log(`   DDD: ${merchantData.responsible?.areaCode || "N/A"}`);
    console.log(
      `   Telefone: ${merchantData.responsible?.phoneNumber || "N/A"}`
    );
    console.log(
      `   Nome da Mãe: ${merchantData.responsible?.motherName || "N/A"}`
    );
    console.log(`   PEP: ${merchantData.responsible?.pep ? "Sim" : "Não"}`);
    console.log(
      `   Número Documento: ${merchantData.responsible?.idNumber || "N/A"}`
    );
    console.log(
      `   Data Emissão: ${merchantData.responsible?.idIssueDate || "N/A"}`
    );
    console.log(
      `   Órgão Emissor: ${merchantData.responsible?.issuingAuthority || "N/A"}`
    );
    console.log(
      `   UF Documento: ${merchantData.responsible?.idState || "N/A"}`
    );
    console.log("");

    if (merchantData.responsible?.address) {
      console.log("📍 ENDEREÇO DO RESPONSÁVEL:");
      console.log(
        `   Rua: ${merchantData.responsible.address.street || "N/A"}`
      );
      console.log(
        `   Número: ${merchantData.responsible.address.number || "N/A"}`
      );
      console.log(
        `   Complemento: ${merchantData.responsible.address.complement || "N/A"}`
      );
      console.log(
        `   Bairro: ${merchantData.responsible.address.neighborhood || "N/A"}`
      );
      console.log(
        `   Cidade: ${merchantData.responsible.address.city || "N/A"}`
      );
      console.log(
        `   Estado: ${merchantData.responsible.address.state || "N/A"}`
      );
      console.log(
        `   CEP: ${merchantData.responsible.address.postalCode || "N/A"}`
      );
      console.log(
        `   País: ${merchantData.responsible.address.country || "N/A"}`
      );
      console.log("");
    }

    console.log("🏦 DADOS BANCÁRIOS:");
    console.log(`   Banco: ${merchantData.bankData?.bank || "N/A"}`);
    console.log(
      `   Código do Banco: ${merchantData.bankData?.bankCode || "N/A"}`
    );
    console.log(`   Agência: ${merchantData.bankData?.agency || "N/A"}`);
    console.log(
      `   Dígito Agência: ${merchantData.bankData?.agencyDigit || "N/A"}`
    );
    console.log(`   Conta: ${merchantData.bankData?.account || "N/A"}`);
    console.log(
      `   Dígito Conta: ${merchantData.bankData?.accountDigit || "N/A"}`
    );
    console.log(
      `   Tipo de Conta: ${merchantData.bankData?.accountType || "N/A"}`
    );
    console.log("");

    console.log("💰 DADOS DE TAXA:");
    console.log(`   Código da Tabela: ${merchantData.tax?.tableCode || "N/A"}`);
    console.log("");

    console.log("⚙️ OPERAÇÕES:");
    console.log(
      `   TEF Habilitado: ${merchantData.operation?.tefEnabled ? "Sim" : "Não"}`
    );
    console.log(
      `   PIX Habilitado: ${merchantData.operation?.pixEnabled ? "Sim" : "Não"}`
    );
    console.log(
      `   Tap on Phone Habilitado: ${merchantData.operation?.tapOnPhoneEnabled ? "Sim" : "Não"}`
    );
    console.log("");

    console.log("🆔 DADOS GERADOS:");
    console.log(`   Merchant ID: ${merchantId}`);
    console.log(`   Status: CRIADO COM SUCESSO`);
    console.log("=".repeat(80));

    return {
      success: true,
      message: "Estabelecimento criado com sucesso",
      merchantId,
    };
  } catch (error: any) {
    console.error(`[createMerchant] Erro ao criar merchant:`, error);
    return {
      success: false,
      message: error.message || "Erro ao criar estabelecimento",
    };
  }
}

// Validar os dados do merchant
function validateMerchantData(merchantData: ImportData): string[] {
  const errors: string[] = [];

  // Log para depuração da estrutura do objeto responsible

  // Validar campos obrigatórios do estabelecimento
  if (!merchantData.establishment.name) {
    errors.push("Nome Fantasia é obrigatório");
  }

  if (!merchantData.establishment.corporateName) {
    errors.push("Razão Social é obrigatória");
  }

  if (!merchantData.establishment.taxId) {
    errors.push("CNPJ/CPF é obrigatório");
  } else {
    // Validação básica de formato de CNPJ/CPF (apenas verificamos se tem números suficientes)
    const normalizedTaxId = merchantData.establishment.taxId.replace(
      /[^0-9]/g,
      ""
    );
    if (normalizedTaxId.length !== 11 && normalizedTaxId.length !== 14) {
      errors.push("CNPJ/CPF precisa ter 11 (CPF) ou 14 (CNPJ) dígitos");
    }
  }

  // Validação adicional para legalNatureCode
  if (!merchantData.establishment.legalNatureCode) {
    errors.push("Código da Natureza Jurídica é obrigatório");
  } else {
    // Adicionar verificação adicional para o cliente - o sistema já verifica
    // na função createMerchant, mas é melhor informar o problema antes
    // NOTA: Esta validação não é completa, pois não faz a verificação no BD,
    // a verificação completa é feita em createMerchant
    if (
      merchantData.establishment.legalNatureCode.length < 2 ||
      merchantData.establishment.legalNatureCode.length > 10
    ) {
      errors.push(
        "Código de Natureza Jurídica deve ter entre 2 e 10 caracteres"
      );
    }
  }

  // Validar campos de contato essenciais
  if (!merchantData.contact.email) {
    errors.push("Email é obrigatório");
  } else if (!merchantData.contact.email.includes("@")) {
    errors.push("Email precisa ter um formato válido");
  }

  // Validar dados de endereço essenciais
  if (!merchantData.establishment.address1.street) {
    errors.push("Rua/Avenida é obrigatória");
  }

  if (!merchantData.establishment.address1.city) {
    errors.push("Cidade é obrigatória");
  }

  if (!merchantData.establishment.address1.state) {
    errors.push("Estado é obrigatório");
  }

  // Se temos dados do responsável, validamos
  if (merchantData.responsible.fullName) {
    // Se tem nome, verificamos CPF também
    if (!merchantData.responsible.cpf) {
      errors.push("CPF do responsável é obrigatório quando o nome é informado");
    }
  }

  // Se temos dados bancários, validamos os campos essenciais
  if (merchantData.bankData.account) {
    if (!merchantData.bankData.bankCode) {
      errors.push("Código do banco é obrigatório quando a conta é informada");
    }
    if (!merchantData.bankData.accountDigit) {
      errors.push("Dígito da conta é obrigatório quando a conta é informada");
    }
  }

  return errors;
}

// Server action principal para processar a importação de merchants
export async function processMerchantImportDirect(
  merchantsData: ImportData[]
): Promise<ProcessedResult> {
  // Buscar todas as naturezas jurídicas para debug
  try {
    await db.select().from(legalNatures);
  } catch (error) {
    console.error(
      "[processMerchantImportDirect] Erro ao buscar naturezas jurídicas:",
      error
    );
  }

  // Removendo a validação de autorizadores - vamos prosseguir mesmo sem autorizadores
  // para não bloquear o fluxo de criação

  const result: ProcessedResult = {
    success: false,
    created: 0,
    skipped: {
      total: 0,
      reasons: {
        alreadyExists: 0,
        validationError: 0,
        systemError: 0,
      },
    },
    errors: [],
  };

  // Processar cada merchant
  for (const merchantData of merchantsData) {
    try {
      // Verificar se já existe
      const exists = await merchantExists(merchantData.establishment.taxId);
      if (exists) {
        result.skipped.total++;
        result.skipped.reasons.alreadyExists++;
        result.errors.push({
          merchantName: merchantData.establishment.name,
          taxId: merchantData.establishment.taxId,
          error: "Estabelecimento já existe no sistema",
        });
        continue;
      }

      // Validar os dados
      const validationErrors = validateMerchantData(merchantData);
      if (validationErrors.length > 0) {
        result.skipped.total++;
        result.skipped.reasons.validationError++;
        result.errors.push({
          merchantName: merchantData.establishment.name,
          taxId: merchantData.establishment.taxId,
          error: `Erro de validação: ${validationErrors.join(", ")}`,
        });
        continue;
      }

      // Criar o merchant
      const createResult = await createMerchant(merchantData);
      if (createResult.success) {
        result.created++;
        console.log(
          `✅ [IMPORTAÇÃO] Merchant criado com sucesso: ${merchantData.establishment.name} (ID: ${createResult.merchantId})`
        );
      } else {
        result.skipped.total++;
        result.skipped.reasons.systemError++;
        result.errors.push({
          merchantName: merchantData.establishment.name,
          taxId: merchantData.establishment.taxId,
          error: createResult.message,
        });
      }
    } catch (error) {
      console.error(`[processMerchantImportDirect] Erro não tratado:`, error);
      result.skipped.total++;
      result.skipped.reasons.systemError++;
      result.errors.push({
        merchantName: merchantData.establishment.name,
        taxId: merchantData.establishment.taxId,
        error: error instanceof Error ? error.message : "Erro desconhecido",
      });
    }
  }

  // Atualizar status final
  result.success = result.created > 0;

  // Log do resultado final
  console.log(
    `[processMerchantImportDirect] Resultado: ${result.created} criados, ${result.skipped.total} ignorados`
  );

  // Revalidar a página para mostrar os novos dados
  revalidatePath("/portal/merchants");

  return result;
}
