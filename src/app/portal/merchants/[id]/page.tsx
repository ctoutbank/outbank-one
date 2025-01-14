import BaseBody from "@/components/layout/base-body";
import BaseHeader from "@/components/layout/base-header";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import MerchantForm from "@/features/merchant/_components/merchant-form";
import { getMerchantById } from "@/features/merchant/server/merchant";
import { MerchantSchema } from "@/features/merchant/schema/merchant-schema";

export default async function MerchantDetail({
  params,
}: {
  params: { id: string };
}) {
  let merchantDetail: MerchantSchema | null = null;

  try {
    const data = await getMerchantById(BigInt(params.id));
    if (data) {
      merchantDetail = {
        id: data.id,
        slug: data.slug,
        active: data.active,
        dtinsert: data.dtinsert,
        dtupdate: data.dtupdate,
        idMerchant: data.id_merchant,
        name: data.name,
        idDocument: data.id_document,
        corporateName: data.corporate_name,
        email: data.email,
        areaCode: data.area_code,
        number: data.number,
        phoneType: data.phone_type,
        language: data.language,
        timezone: data.timezone,
        slugCustomer: data.slug_customer,
        riskAnalysisStatus: data.risk_analysis_status,
        riskAnalysisStatusJustification:
          data.risk_analysis_status_justification,
        legalPerson: data.legal_person,
        openingDate: data.opening_date,
        inclusion: data.inclusion,
        openingDays: data.opening_days ? data.opening_days.split(",") : [],
        openingHour: data.opening_hour,
        closingHour: data.closing_hour,
        municipalRegistration: data.municipal_registration,
        stateSubcription: data.state_subcription,
        hasTef: data.has_tef,
        hasPix: data.has_pix,
        hasTop: data.has_top,
        establishmentFormat: data.establishment_format,
        revenue: data.revenue,
        idCategory: data.id_category,
        slugCategory: data.slug_category,
        idLegalNature: data.id_legal_nature,
        slugLegalNature: data.slug_legal_nature,
        idSalesAgent: data.id_sales_agent,
        slugSalesAgent: data.slug_sales_agent,
        idConfiguration: data.id_configuration,
        slugConfiguration: data.slug_configuration,
        idAddress: data.id_address,
      };
    }
  } catch (error) {
    console.error("Error fetching merchant:", error);
  }

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
          merchantDetail?.id
            ? "Editar Estabelecimento"
            : "Adicionar Estabelecimento"
        }
      >
        <div className="">
          <Tabs defaultValue="company" className="space-y-4 w-full">
            <TabsContent value="company">
              <MerchantForm merchant={merchantDetail || undefined} />
            </TabsContent>
          </Tabs>
        </div>
      </BaseBody>
    </>
  );
}
