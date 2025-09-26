import { PageHeader } from "@/components/layout/portal/PageHeader";
import AnticipationTabs from "@/features/anticipation/_components/anticipation-tabs";
import {
  getAnticipations,
  getEventualAnticipations,
  getMerchantDD,
} from "@/features/anticipations/server/anticipation";
import { checkPagePermission } from "@/lib/auth/check-permissions";

export const revalidate = 300;

type AntecipationsProps = {
  searchParams: {
    page?: string;
    pageSize?: string;
    search?: string;
    merchantSlug?: string;
    type?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
    expectedSettlementStartDate?: string;
    expectedSettlementEndDate?: string;
    sortBy?: string;
    sortOrder?: string;
  };
};

export default async function AntecipationsPage({
  searchParams,
}: AntecipationsProps) {
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
  const sortBy = searchParams.sortBy;
  const sortOrder = searchParams.sortOrder as "asc" | "desc" | undefined;

  const [merchantDD, anticipations, eventualAnticipations] = await Promise.all([
    getMerchantDD(),
    getAnticipations(
      search,
      Number(page),
      Number(pageSize),
      startDate,
      endDate,
      merchantSlug,
      type,
      status,
      { sortBy, sortOrder }
    ),
    getEventualAnticipations(
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
      { sortBy, sortOrder }
    ),
  ]);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Antecipações"
        description="Visualize e gerencie suas antecipações de recebíveis."
      />
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
    </div>
  );
}