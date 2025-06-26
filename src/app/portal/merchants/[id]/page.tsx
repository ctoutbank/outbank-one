import BaseBody from "@/components/layout/base-body";
import BaseHeader from "@/components/layout/base-header";
import MerchantDisplay from "@/features/merchant/_components/merchant-display";
import MerchantTabs from "@/features/merchant/_components/merchant-tabs";
import { getConfigurationsByMerchantId } from "@/features/merchant/server/configurations";
import { getContactByMerchantId } from "@/features/merchant/server/contact";
import {
  getCnaeMccForDropdown,
  getEstablishmentFormatForDropdown,
  getLegalNaturesForDropdown,
  getMerchantById,
} from "@/features/merchant/server/merchant";
import { getMerchantBankAccountById } from "@/features/merchant/server/merchant-bank";
import {
  getAccountTypeForDropdown,
  getBankForDropdown,
  getMerchantPixAccountByMerchantId,
} from "@/features/merchant/server/merchantpixacount";
import { getMerchantPriceGroupsBymerchantPricetId } from "@/features/merchant/server/merchantpricegroup";
import { getUserMerchantsAccess } from "@/features/users/server/users";
import { checkPagePermission } from "@/lib/auth/check-permissions";
import { getFilesByEntity } from "@/server/upload";

export default async function MerchantDetail({
  params,
}: {
  params: { id: string };
}) {
  const permissions = await checkPagePermission(
    "Estabelecimentos",
    "Atualizar"
  );

  const merchantId = parseInt(params.id);
  const userAccess = await getUserMerchantsAccess();

  const cnaeMccList = await getCnaeMccForDropdown();
  const establishmentFormatList = await getEstablishmentFormatForDropdown();
  const merchant = await getMerchantById(merchantId, userAccess);
  const DDAccountType = await getAccountTypeForDropdown();
  const DDBank = await getBankForDropdown();
  const merchantBankAccount = await getMerchantBankAccountById(
    merchant?.merchants.idMerchantBankAccount || 0
  );

  console.log("merchantBankAccount:", merchantBankAccount);

  // Buscar arquivos do merchant
  const merchantFiles =
    merchantId > 0 ? await getFilesByEntity("merchant", merchantId) : [];

  const legalNatures = await getLegalNaturesForDropdown();

  const contact = await getContactByMerchantId(merchant?.merchants.id || 0);
  const merchantPriceGroups = await getMerchantPriceGroupsBymerchantPricetId(
    merchant?.merchants.idMerchantPrice || 0
  );
  console.log("merchantPriceGroups:", merchantPriceGroups);
  console.log(
    "merchantPriceGroups:",
    JSON.stringify(merchantPriceGroups, null, 2)
  );
  const configurations = await getConfigurationsByMerchantId(
    merchant?.merchants.id || 0
  );
  console.log("configurations:", configurations);
  console.log("Valores de antecipação (debug):", {
    anticipationRiskFactorCp: configurations?.anticipationRiskFactorCp,
    anticipationRiskFactorCnp: configurations?.anticipationRiskFactorCnp,
    waitingPeriodCp: configurations?.waitingPeriodCp,
    waitingPeriodCnp: configurations?.waitingPeriodCnp,
    tipoAnticipationRiskFactorCp:
      typeof configurations?.anticipationRiskFactorCp,
    tipoAnticipationRiskFactorCnp:
      typeof configurations?.anticipationRiskFactorCnp,
  });
  const pixaccount = await getMerchantPixAccountByMerchantId(
    merchant?.merchants.id || 0
  );
  console.log("pixaccount:", pixaccount);

  const formattedMerchantPriceGroups = {
    merchantPrice: {
      id: merchantPriceGroups?.[0]?.merchantPrice?.id || 0,
      name: merchantPriceGroups?.[0]?.merchantPrice?.name || "",
      active: merchantPriceGroups?.[0]?.merchantPrice?.active || false,
      dtinsert: merchantPriceGroups?.[0]?.merchantPrice?.dtinsert || "",
      dtupdate: merchantPriceGroups?.[0]?.merchantPrice?.dtupdate || "",
      tableType: merchantPriceGroups?.[0]?.merchantPrice?.tableType || "",
      slugMerchant: merchantPriceGroups?.[0]?.merchantPrice?.slugMerchant || "",
      compulsoryAnticipationConfig:
        merchantPriceGroups?.[0]?.merchantPrice?.compulsoryAnticipationConfig ||
        0,
      eventualAnticipationFee:
        Number(
          merchantPriceGroups?.[0]?.merchantPrice?.eventualAnticipationFee
        ) || 0,
      nonCardPixMinimumCostFee:
        Number(
          merchantPriceGroups?.[0]?.merchantPrice?.nonCardPixMinimumCostFee
        ) || 0,
      anticipationType:
        merchantPriceGroups?.[0]?.merchantPrice?.anticipationType || "",
      cardPixMdr:
        Number(merchantPriceGroups?.[0]?.merchantPrice?.cardPixMdr) || 0,
      cardPixCeilingFee:
        Number(merchantPriceGroups?.[0]?.merchantPrice?.cardPixCeilingFee) || 0,
      cardPixMinimumCostFee:
        Number(
          merchantPriceGroups?.[0]?.merchantPrice?.cardPixMinimumCostFee
        ) || 0,
      nonCardPixMdr:
        Number(merchantPriceGroups?.[0]?.merchantPrice?.nonCardPixMdr) || 0,
      nonCardPixCeilingFee:
        Number(merchantPriceGroups?.[0]?.merchantPrice?.nonCardPixCeilingFee) ||
        0,
    },
    merchantpricegroup:
      merchantPriceGroups?.map((group) => ({
        id: group.priceGroup?.id || 0,
        name: group.priceGroup?.brand || "",
        active: group.priceGroup?.active || false,
        dtinsert: group.priceGroup?.dtinsert || "",
        dtupdate: group.priceGroup?.dtupdate || "",
        idMerchantPrice: group.merchantPrice?.id || 0,
        listMerchantTransactionPrice:
          typeof group.transactionPrices === "string"
            ? JSON.parse(group.transactionPrices)
            : group.transactionPrices || [],
      })) || [],
  };

  return (
    <>
      <BaseHeader
        breadcrumbItems={[
          { title: "Estabelecimentos", url: "/portal/merchants" },
        ]}
      />

      <BaseBody
        title="Estabelecimento"
        subtitle={
          merchant?.merchants.id
            ? "Editar Estabelecimento"
            : "Adicionar Estabelecimento"
        }
      >
        {params.id == "0" ? (
          <MerchantTabs
            merchant={{
              id: merchant?.merchants?.id || 0,
              name: merchant?.merchants?.name || "",
              slug: merchant?.merchants?.slug || "",
              active: merchant?.merchants?.active || false,
              idMerchantBankAccount:
                merchant?.merchants?.idMerchantBankAccount || 0,
              idMerchantPrice: merchant?.merchants?.idMerchantPrice || 0,
              establishmentFormat:
                merchant?.merchants?.establishmentFormat || "",
              idCategory: merchant?.merchants?.idCategory || 0,
              slugLegalNature: merchant?.merchants?.slugLegalNature || "",
              slugSalesAgent: merchant?.merchants?.slugSalesAgent || "",
              openingHour: merchant?.merchants?.openingHour || "",
              closingHour: merchant?.merchants?.closingHour || "",
              municipalRegistration:
                merchant?.merchants?.municipalRegistration || "",
              stateSubcription: merchant?.merchants?.stateSubcription || "",
              idDocument: merchant?.merchants?.idDocument || "",
              legalPerson: merchant?.merchants?.legalPerson || "",
              corporateName: merchant?.merchants?.corporateName || "",
              riskAnalysisStatusJustification:
                merchant?.merchants?.riskAnalysisStatusJustification || "",
              openingDate: merchant?.merchants?.openingDate || "",
              inclusion: merchant?.merchants?.inclusion || "",
              openingDays: merchant?.merchants?.openingDays || null,
              phoneType: merchant?.merchants?.phoneType || "",
              language: merchant?.merchants?.language || "",
              slugCustomer: merchant?.merchants?.slugCustomer || "",
              riskAnalysisStatus: merchant?.merchants?.riskAnalysisStatus || "",
              idAddress: merchant?.merchants?.idAddress || 0,
              idLegalNature: merchant?.merchants?.idLegalNature || 0,
              idSalesAgent: merchant?.merchants?.idSalesAgent || 0,
              areaCode: merchant?.merchants?.areaCode || "",
              number: merchant?.merchants?.number
                ? String(merchant?.merchants?.number)
                : "",
              email: merchant?.merchants?.email || "",
              dtinsert: merchant?.merchants?.dtinsert || "",
              dtupdate: merchant?.merchants?.dtupdate || "",
              idMerchant: String(merchant?.merchants?.id),
              idConfiguration: merchant?.configurations?.id || 0,
              hasTef: Boolean(merchant?.merchants?.hasTef || false),
              hasTop: Boolean(merchant?.merchants?.hasTop || false),
              hasPix: Boolean(merchant?.merchants?.hasPix || false),
              revenue: Number(merchant?.merchants.revenue),
              cnae: merchant?.categories?.cnae || "",
              mcc: merchant?.categories?.mcc || "",
              slugConfiguration: merchant?.configurations?.slug || "",

              registration: merchant?.merchants?.municipalRegistration || "",
              customer: merchant?.merchants?.slugCustomer || "",

              slugCategory: merchant?.merchants.slugCategory || null,
              timezone: merchant?.merchants.timezone || "",
              idCustomer: merchant?.merchants.idCustomer || null,
            }}
            address={{
              id: merchant?.addresses?.id || 0,
              streetAddress: merchant?.addresses?.streetAddress || "",
              streetNumber: merchant?.addresses?.streetNumber || "",
              complement: merchant?.addresses?.complement || "",
              neighborhood: merchant?.addresses?.neighborhood || "",
              city: merchant?.addresses?.city || "",
              state: merchant?.addresses?.state || "",
              country: merchant?.addresses?.country || "",
              zipCode: merchant?.addresses?.zipCode || "",
            }}
            cnaeMccList={cnaeMccList}
            legalNatures={legalNatures}
            Contacts={{
              contacts: contact?.[0]?.contacts || [],
              addresses: contact?.[0]?.addresses || {
                id: contact?.[0]?.addresses?.id || 0,
                streetAddress: contact?.[0]?.addresses?.streetAddress || "",
                streetNumber: contact?.[0]?.addresses?.streetNumber || "",
                complement: contact?.[0]?.addresses?.complement || "",
                neighborhood: contact?.[0]?.addresses?.neighborhood || "",
                city: contact?.[0]?.addresses?.city || "",
                state: contact?.[0]?.addresses?.state || "",
                country: contact?.[0]?.addresses?.country || "",
                zipCode: contact?.[0]?.addresses?.zipCode || "",
              },
            }}
            addresses={{
              id: contact?.[0]?.addresses?.id || 0,
              streetAddress: contact?.[0]?.addresses?.streetAddress || "",
              streetNumber: contact?.[0]?.addresses?.streetNumber || "",
              complement: contact?.[0]?.addresses?.complement || "",
              neighborhood: contact?.[0]?.addresses?.neighborhood || "",
              city: contact?.[0]?.addresses?.city || "",
              state: contact?.[0]?.addresses?.state || "",
              country: contact?.[0]?.addresses?.country || "",
              zipCode: contact?.[0]?.addresses?.zipCode || "",
            }}
            configurations={{
              configurations: {
                id: configurations?.id || 0,
                slug: configurations?.slug || "",
                active: configurations?.active || false,
                dtinsert: configurations?.dtinsert || "",
                dtupdate: configurations?.dtupdate || "",
                lockCpAnticipationOrder:
                  configurations?.lockCpAnticipationOrder === true
                    ? true
                    : false,
                lockCnpAnticipationOrder:
                  configurations?.lockCnpAnticipationOrder === true
                    ? true
                    : false,
                url: configurations?.url || "",
                anticipationRiskFactorCp:
                  configurations?.anticipationRiskFactorCp || "",
                anticipationRiskFactorCnp:
                  configurations?.anticipationRiskFactorCnp || "",
                waitingPeriodCp: configurations?.waitingPeriodCp || "",
                waitingPeriodCnp: configurations?.waitingPeriodCnp || "",
              },
            }}
            merchantBankAccount={{
              merchantBankAccount: {
                id: merchantBankAccount?.merchantBankAccount?.id || 0,
                documentId:
                  merchantBankAccount?.merchantBankAccount?.documentId || "",
                corporateName:
                  merchantBankAccount?.merchantBankAccount?.corporateName || "",
                legalPerson:
                  merchantBankAccount?.merchantBankAccount?.legalPerson ||
                  "JURIDICAL",
                bankBranchNumber:
                  merchantBankAccount?.merchantBankAccount?.bankBranchNumber ||
                  "",
                bankBranchCheckDigit:
                  merchantBankAccount?.merchantBankAccount
                    ?.bankBranchCheckDigit || "",
                accountNumber:
                  merchantBankAccount?.merchantBankAccount?.accountNumber || "",
                accountNumberCheckDigit:
                  merchantBankAccount?.merchantBankAccount
                    ?.accountNumberCheckDigit || "",
                accountType:
                  merchantBankAccount?.merchantBankAccount?.accountType || "",
                compeCode:
                  merchantBankAccount?.merchantBankAccount?.compeCode || "",
                dtinsert:
                  merchantBankAccount?.merchantBankAccount?.dtinsert || "",
                dtupdate:
                  merchantBankAccount?.merchantBankAccount?.dtupdate || "",
                slug: merchantBankAccount?.merchantBankAccount?.slug || "",
                active:
                  merchantBankAccount?.merchantBankAccount?.active || false,
              },
            }}
            merchantPixAccount={{
              pixaccounts: pixaccount || null,
              merchantcorporateName: merchant?.merchants.corporateName || "",
              merchantdocumentId: merchant?.merchants.idDocument || "",
              legalPerson: merchant?.merchants.legalPerson || "",
            }}
            merchantPriceGroupProps={{
              merchantPrice: {
                id: formattedMerchantPriceGroups.merchantPrice.id,
                name: formattedMerchantPriceGroups.merchantPrice.name,
                active: formattedMerchantPriceGroups.merchantPrice.active,
                dtinsert: formattedMerchantPriceGroups.merchantPrice.dtinsert,
                dtupdate: formattedMerchantPriceGroups.merchantPrice.dtupdate,
                tableType: formattedMerchantPriceGroups.merchantPrice.tableType,
                slugMerchant:
                  formattedMerchantPriceGroups.merchantPrice.slugMerchant,
                compulsoryAnticipationConfig:
                  formattedMerchantPriceGroups.merchantPrice
                    .compulsoryAnticipationConfig,
                anticipationType:
                  formattedMerchantPriceGroups.merchantPrice.anticipationType,
                eventualAnticipationFee:
                  formattedMerchantPriceGroups.merchantPrice
                    .eventualAnticipationFee,
                cardPixMdr:
                  formattedMerchantPriceGroups.merchantPrice.cardPixMdr,
                cardPixCeilingFee:
                  formattedMerchantPriceGroups.merchantPrice.cardPixCeilingFee,
                cardPixMinimumCostFee:
                  formattedMerchantPriceGroups.merchantPrice
                    .cardPixMinimumCostFee,
                nonCardPixMdr:
                  formattedMerchantPriceGroups.merchantPrice.nonCardPixMdr,
                nonCardPixCeilingFee:
                  formattedMerchantPriceGroups.merchantPrice
                    .nonCardPixCeilingFee,
                nonCardPixMinimumCostFee:
                  formattedMerchantPriceGroups.merchantPrice
                    .nonCardPixMinimumCostFee,
                merchantpricegroup:
                  formattedMerchantPriceGroups.merchantpricegroup,
              },
              merchantpricegroup:
                formattedMerchantPriceGroups.merchantpricegroup,
            }}
            establishmentFormatList={establishmentFormatList}
            DDAccountType={DDAccountType}
            DDBank={DDBank}
            permissions={permissions}
            merchantFiles={merchantFiles}
            isCreating={true}
          />
        ) : merchant?.merchants?.id ? (
          <MerchantDisplay
            merchant={{
              id: merchant?.merchants?.id || 0,
              name: merchant?.merchants?.name || "",
              slug: merchant?.merchants?.slug || "",
              active: merchant?.merchants?.active || true,
              idMerchantBankAccount:
                merchant?.merchants?.idMerchantBankAccount || 0,
              idMerchantPrice: merchant?.merchants?.idMerchantPrice || 0,
              establishmentFormat:
                merchant?.merchants?.establishmentFormat || "",
              idCategory: merchant?.merchants?.idCategory || 0,
              slugLegalNature: merchant?.merchants?.slugLegalNature || "",
              slugSalesAgent: merchant?.merchants?.slugSalesAgent || "",
              openingHour: merchant?.merchants?.openingHour || "",
              closingHour: merchant?.merchants?.closingHour || "",
              municipalRegistration:
                merchant?.merchants?.municipalRegistration || "",
              stateSubcription: merchant?.merchants?.stateSubcription || "",
              idDocument: merchant?.merchants?.idDocument || "",
              legalPerson: merchant?.merchants?.legalPerson || "",
              corporateName: merchant?.merchants?.corporateName || "",
              riskAnalysisStatusJustification:
                merchant?.merchants?.riskAnalysisStatusJustification || "",
              openingDate: merchant?.merchants?.openingDate || "",
              inclusion: merchant?.merchants?.inclusion || "",
              openingDays: merchant?.merchants?.openingDays || null,
              phoneType: merchant?.merchants?.phoneType || "",
              language: merchant?.merchants?.language || "",
              slugCustomer: merchant?.merchants?.slugCustomer || "",
              riskAnalysisStatus: merchant?.merchants?.riskAnalysisStatus || "",
              idAddress: merchant?.merchants?.idAddress || 0,
              idLegalNature: merchant?.merchants?.idLegalNature || 0,
              idSalesAgent: merchant?.merchants?.idSalesAgent || 0,
              areaCode: merchant?.merchants?.areaCode || "",
              number: merchant?.merchants?.number
                ? String(merchant?.merchants?.number)
                : "",
              email: merchant?.merchants?.email || "",
              dtinsert: merchant?.merchants?.dtinsert || "",
              dtupdate: merchant?.merchants?.dtupdate || "",
              idMerchant: String(merchant?.merchants?.id),
              idConfiguration: merchant?.configurations?.id || 0,
              hasTef: Boolean(merchant?.merchants?.hasTef || false),
              hasTop: Boolean(merchant?.merchants?.hasTop || false),
              hasPix: Boolean(merchant?.merchants?.hasPix || false),
              revenue: Number(merchant?.merchants.revenue),
              cnae: merchant?.categories?.cnae || "",
              mcc: merchant?.categories?.mcc || "",
              slugConfiguration: merchant?.configurations?.slug || "",

              registration: merchant?.merchants?.municipalRegistration || "",
              customer: merchant?.merchants?.slugCustomer || "",

              slugCategory: merchant?.merchants.slugCategory || null,
              timezone: merchant?.merchants.timezone || "",
              idCustomer: merchant?.merchants.idCustomer || null,
            }}
            address={{
              id: merchant?.addresses?.id || 0,
              streetAddress: merchant?.addresses?.streetAddress || "",
              streetNumber: merchant?.addresses?.streetNumber || "",
              complement: merchant?.addresses?.complement || "",
              neighborhood: merchant?.addresses?.neighborhood || "",
              city: merchant?.addresses?.city || "",
              state: merchant?.addresses?.state || "",
              country: merchant?.addresses?.country || "",
              zipCode: merchant?.addresses?.zipCode || "",
            }}
            cnaeMccList={cnaeMccList}
            legalNatures={legalNatures}
            Contacts={{
              contacts: contact?.[0]?.contacts || [],
              addresses: contact?.[0]?.addresses || {
                id: contact?.[0]?.addresses?.id || 0,
                streetAddress: contact?.[0]?.addresses?.streetAddress || "",
                streetNumber: contact?.[0]?.addresses?.streetNumber || "",
                complement: contact?.[0]?.addresses?.complement || "",
                neighborhood: contact?.[0]?.addresses?.neighborhood || "",
                city: contact?.[0]?.addresses?.city || "",
                state: contact?.[0]?.addresses?.state || "",
                country: contact?.[0]?.addresses?.country || "",
                zipCode: contact?.[0]?.addresses?.zipCode || "",
              },
            }}
            addresses={{
              id: contact?.[0]?.addresses?.id || 0,
              streetAddress: contact?.[0]?.addresses?.streetAddress || "",
              streetNumber: contact?.[0]?.addresses?.streetNumber || "",
              complement: contact?.[0]?.addresses?.complement || "",
              neighborhood: contact?.[0]?.addresses?.neighborhood || "",
              city: contact?.[0]?.addresses?.city || "",
              state: contact?.[0]?.addresses?.state || "",
              country: contact?.[0]?.addresses?.country || "",
              zipCode: contact?.[0]?.addresses?.zipCode || "",
            }}
            configurations={{
              configurations: {
                id: configurations?.id || 0,
                slug: configurations?.slug || "",
                active: configurations?.active || false,
                dtinsert: configurations?.dtinsert || "",
                dtupdate: configurations?.dtupdate || "",
                lockCpAnticipationOrder:
                  configurations?.lockCpAnticipationOrder === true
                    ? true
                    : false,
                lockCnpAnticipationOrder:
                  configurations?.lockCnpAnticipationOrder === true
                    ? true
                    : false,
                url: configurations?.url || "",
                anticipationRiskFactorCp:
                  configurations?.anticipationRiskFactorCp || "",
                anticipationRiskFactorCnp:
                  configurations?.anticipationRiskFactorCnp || "",
                waitingPeriodCp: configurations?.waitingPeriodCp || "",
                waitingPeriodCnp: configurations?.waitingPeriodCnp || "",
              },
            }}
            merchantBankAccount={{
              merchantBankAccount: {
                id: merchantBankAccount?.merchantBankAccount?.id || 0,
                documentId:
                  merchantBankAccount?.merchantBankAccount?.documentId || "",
                corporateName:
                  merchantBankAccount?.merchantBankAccount?.corporateName || "",
                legalPerson:
                  merchantBankAccount?.merchantBankAccount?.legalPerson ||
                  "JURIDICAL",
                bankBranchNumber:
                  merchantBankAccount?.merchantBankAccount?.bankBranchNumber ||
                  "",
                bankBranchCheckDigit:
                  merchantBankAccount?.merchantBankAccount
                    ?.bankBranchCheckDigit || "",
                accountNumber:
                  merchantBankAccount?.merchantBankAccount?.accountNumber || "",
                accountNumberCheckDigit:
                  merchantBankAccount?.merchantBankAccount
                    ?.accountNumberCheckDigit || "",
                accountType:
                  merchantBankAccount?.merchantBankAccount?.accountType || "",
                compeCode:
                  merchantBankAccount?.merchantBankAccount?.compeCode || "",
                dtinsert:
                  merchantBankAccount?.merchantBankAccount?.dtinsert || "",
                dtupdate:
                  merchantBankAccount?.merchantBankAccount?.dtupdate || "",
                slug: merchantBankAccount?.merchantBankAccount?.slug || "",
                active:
                  merchantBankAccount?.merchantBankAccount?.active || false,
              },
            }}
            merchantPixAccount={{
              pixaccounts: pixaccount || null,
              merchantcorporateName: merchant?.merchants.corporateName || "",
              merchantdocumentId: merchant?.merchants.idDocument || "",
              legalPerson: merchant?.merchants.legalPerson || "",
            }}
            merchantPriceGroupProps={{
              merchantPrice: {
                id: formattedMerchantPriceGroups.merchantPrice.id,
                name: formattedMerchantPriceGroups.merchantPrice.name,
                active: formattedMerchantPriceGroups.merchantPrice.active,
                dtinsert: formattedMerchantPriceGroups.merchantPrice.dtinsert,
                dtupdate: formattedMerchantPriceGroups.merchantPrice.dtupdate,
                tableType: formattedMerchantPriceGroups.merchantPrice.tableType,
                slugMerchant:
                  formattedMerchantPriceGroups.merchantPrice.slugMerchant,
                compulsoryAnticipationConfig:
                  formattedMerchantPriceGroups.merchantPrice
                    .compulsoryAnticipationConfig,
                anticipationType:
                  formattedMerchantPriceGroups.merchantPrice.anticipationType,
                eventualAnticipationFee:
                  formattedMerchantPriceGroups.merchantPrice
                    .eventualAnticipationFee,
                cardPixMdr:
                  formattedMerchantPriceGroups.merchantPrice.cardPixMdr,
                cardPixCeilingFee:
                  formattedMerchantPriceGroups.merchantPrice.cardPixCeilingFee,
                cardPixMinimumCostFee:
                  formattedMerchantPriceGroups.merchantPrice
                    .cardPixMinimumCostFee,
                nonCardPixMdr:
                  formattedMerchantPriceGroups.merchantPrice.nonCardPixMdr,
                nonCardPixCeilingFee:
                  formattedMerchantPriceGroups.merchantPrice
                    .nonCardPixCeilingFee,
                nonCardPixMinimumCostFee:
                  formattedMerchantPriceGroups.merchantPrice
                    .nonCardPixMinimumCostFee,
                merchantpricegroup:
                  formattedMerchantPriceGroups.merchantpricegroup,
              },
              merchantpricegroup:
                formattedMerchantPriceGroups.merchantpricegroup,
            }}
            establishmentFormatList={establishmentFormatList}
            DDAccountType={DDAccountType}
            DDBank={DDBank}
            permissions={permissions}
            merchantFiles={merchantFiles}
          />
        ) : (
          <div>
            <h1>Estabelecimento não encontrado</h1>
          </div>
        )}
      </BaseBody>
    </>
  );
}
