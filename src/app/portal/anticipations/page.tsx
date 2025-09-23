import BaseBody from "@/components/layout/base-body";
import BaseHeader from "@/components/layout/base-header";
import AnticipationTabs from "@/features/anticipation/_components/anticipation-tabs";
import {
  getAnticipations,
  getEventualAnticipations,
  getMerchantDD,
} from "@/features/anticipations/server/anticipation";
import { checkPagePermission } from "@/lib/auth/check-permissions";

export const revalidate = 300;

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
  sortBy?: string;
  sortOrder?: string;
};

export default async function AntecipationsPage({
  searchParams,
}: {
  searchParams: Promise<AntecipationsProps>;
}) {
  // Verificar permissões primeiro
  await checkPagePermission("Antecipações de Recebíveis");

  const resolvedSearchParams = await searchParams;
  const search = resolvedSearchParams.search || "";
  const page = resolvedSearchParams.page || "1";
  const pageSize = resolvedSearchParams.pageSize || "10";
  const merchantSlug = resolvedSearchParams.merchantSlug || "";
  const type = resolvedSearchParams.type || "";
  const status = resolvedSearchParams.status || "";
  const startDate = resolvedSearchParams.startDate || "";
  const endDate = resolvedSearchParams.endDate || "";
  const expectedSettlementStartDate =
    resolvedSearchParams.expectedSettlementStartDate || "";
  const expectedSettlementEndDate =
    resolvedSearchParams.expectedSettlementEndDate || "";
  const sortBy = resolvedSearchParams.sortBy;
  const sortOrder = resolvedSearchParams.sortOrder as "asc" | "desc" | undefined;

  const merchantDD = await getMerchantDD();

  const anticipations = await getAnticipations(
    search,
    Number(page),
    Number(pageSize),
    startDate,
    endDate,
    merchantSlug,
    type,
    status,
    {
      sortBy,
      sortOrder,
    }
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
    expectedSettlementEndDate,
    {
      sortBy,
      sortOrder,
    }
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
