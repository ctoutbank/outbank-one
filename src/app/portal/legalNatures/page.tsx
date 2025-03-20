import BaseBody from "@/components/layout/base-body";
import BaseHeader from "@/components/layout/base-header";

import PaginationRecords from "@/components/pagination-Records";
import { Button } from "@/components/ui/button";
import { LegalNatureDashboardButton } from "@/features/legalNature/_components/legalNature-dashboard-button";
import { LegalNatureDashboardContent } from "@/features/legalNature/_components/legalNature-dashboard-content";
import { LegalNatureFilter } from "@/features/legalNature/_components/legalNature-filter";
import LegalNaturelist from "@/features/legalNature/_components/legalNatures-list";
import { Plus } from "lucide-react";
import { getLegalNatures } from "@/features/legalNature/server/legalNature-db";
import Link from "next/link";
import { checkPagePermission } from "@/lib/auth/check-permissions";

export const revalidate = 0;

type LegalNatureProps = {
  page: string;
  pageSize: string;
  search: string;
  name: string;
  code: string;
  active: string;
};

export default async function LegalNaturesPage({
  searchParams,
}: {
  searchParams: LegalNatureProps;
}) {
  await checkPagePermission("Naturezas Jurídicas");

  const page = parseInt(searchParams.page || "1");
  const pageSize = parseInt(searchParams.pageSize || "5");
  const search = searchParams.search || "";
  const name = searchParams.name || "";
  const code = searchParams.code || "";
  const active = searchParams.active || "";

  const legalNatures = await getLegalNatures(
    search,
    page,
    pageSize,
    name,
    code,
    active
  );

  const totalRecords = legalNatures.totalCount;

  return (
    <>
      <BaseHeader
        breadcrumbItems={[
          { title: "Natureza Jurídica", url: "/portal/legalNatures" },
        ]}
      />

      <BaseBody
        title="Natureza Jurídica"
        subtitle={`visualização de todas Natureza Jurídica`}
      >
        <div className="flex flex-col space-y-4 ">
          <div className="flex items-start justify-between gap-4 mb-2">
            <div className="flex items-start gap-4 flex-1">
              <LegalNatureFilter
                nameIn={searchParams.name}
                codeIn={searchParams.code}
                activeIn={searchParams.active}
              />
              <LegalNatureDashboardButton>
                <div>
                  <LegalNatureDashboardContent
                    totalLegalNatures={legalNatures.totalCount}
                    activeLegalNatures={legalNatures.activeCount}
                    inactiveLegalNatures={legalNatures.inactiveCount}
                  />
                </div>
              </LegalNatureDashboardButton>
            </div>
            <Button asChild className="shrink-0">
              <Link href="/portal/legalNatures/0">
                <Plus className="h-4 w-4" />
                Nova Natureza Jurídica
              </Link>
            </Button>
          </div>

          <LegalNaturelist LegalNatures={legalNatures} />
          {totalRecords > 0 && (
            <PaginationRecords
              totalRecords={totalRecords}
              currentPage={page}
              pageSize={pageSize}
              pageName="portal/legalNatures"
            />
          )}
        </div>
      </BaseBody>
    </>
  );
}
