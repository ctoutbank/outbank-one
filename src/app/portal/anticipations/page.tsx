import BaseBody from "@/components/layout/base-body";
import BaseHeader from "@/components/layout/base-header";
import AnticipationTabs from "@/features/anticipation/_components/anticipation-tabs";
import {
  getAnticipations,
  getEventualAnticipations,
  getMerchantDD,
} from "@/features/anticipations/server/anticipation";
import { checkPagePermission } from "@/lib/auth/check-permissions";

export const revalidate = 0;

type AntecipationsProps = {
  page: string;
  pageSize: string;
  search: string;
  merchantSlug: string;
  type: string;
  status: string;
  startDate: string;
  endDate: string;
  expectedSettlementStartDate: string;
  expectedSettlementEndDate: string;
};

export default async function AntecipationsPage({
  searchParams,
}: {
  searchParams: AntecipationsProps;
}) {
  // Verificar permissões primeiro
  await checkPagePermission("Antecipações de Recebíveis");

  const search = searchParams.search || "";
  const page = searchParams.page || "1";
  const pageSize = searchParams.pageSize || "10";
  const merchantSlug = searchParams.merchantSlug || "";
  const type = searchParams.type || "";
  const status = searchParams.status || "";
  const startDate = searchParams.startDate || "";
  const endDate = searchParams.endDate || "";
  const expectedSettlementStartDate =
    searchParams.expectedSettlementStartDate || "";
  const expectedSettlementEndDate =
    searchParams.expectedSettlementEndDate || "";

  const merchantDD = await getMerchantDD();

  const anticipations = await getAnticipations(
    search,
    Number(page),
    Number(pageSize),
    startDate,
    endDate,
    merchantSlug,
    type,
    status
  );

  const eventualAnticipations = await getEventualAnticipations(
    search,
    Number(page),
    Number(pageSize),
    startDate,
    endDate,
    merchantSlug,
    type,
    status,
    expectedSettlementStartDate,
    expectedSettlementEndDate
  );

  return (
    <>
      <BaseHeader
        breadcrumbItems={[
          { title: "Antecipações", url: "/portal/anticipations" },
        ]}
      />

      <BaseBody
        title="Antecipações"
        subtitle={`Visualização das Antecipações`}
        className="overflow-x-hidden"
      >
        <AnticipationTabs
          anticipations={anticipations}
          eventualAnticipations={eventualAnticipations}
          merchantDD={merchantDD}
          search={search}
          page={page}
          pageSize={pageSize}
          merchantSlug={merchantSlug}
          type={type}
          status={status}
          startDate={startDate}
          endDate={endDate}
          expectedSettlementStartDate={expectedSettlementStartDate}
          expectedSettlementEndDate={expectedSettlementEndDate}
        />
      </BaseBody>
    </>
  );
}
