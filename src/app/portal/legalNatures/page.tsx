import BaseBody from "@/components/layout/base-body";
import BaseHeader from "@/components/layout/base-header";
import PageSizeSelector from "@/components/page-size-selector";

import { EmptyState } from "@/components/empty-state";
import PaginationRecords from "@/components/pagination-Records";
import { Button } from "@/components/ui/button";
import { LegalNatureDashboardContent } from "@/features/legalNature/_components/legalNature-dashboard-content";
import { LegalNatureFilter } from "@/features/legalNature/_components/legalNature-filter";
import LegalNaturelist from "@/features/legalNature/_components/legalNatures-list";
import { getLegalNatures } from "@/features/legalNature/server/legalNature-db";
import { checkPagePermission } from "@/lib/auth/check-permissions";
import { Plus, Search } from "lucide-react";
import Link from "next/link";

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
  await checkPagePermission("Natureza Juridica");

  const page = parseInt(searchParams.page || "1");
  const pageSize = parseInt(searchParams.pageSize || "10");
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
          { title: "Formato Jurídico", url: "/portal/legalNatures" },
        ]}
      />

      <BaseBody
        title="Formato Jurídico"
        subtitle={`Visualização de Todos Formatos Jurídicos`}
      >
        <div className="flex flex-col space-y-4">
          <div className="mb-1 flex items-center justify-between">
            <div className="flex-1">
              <LegalNatureFilter
                nameIn={searchParams.name}
                codeIn={searchParams.code}
                activeIn={searchParams.active}
              />
            </div>
            <Button asChild className="ml-2">
              <Link href="/portal/legalNatures/0">
                <Plus className="h-4 w-4 mr-1" />
                Novo Formato Jurídico
              </Link>
            </Button>
          </div>

          <div className="flex items-start justify-between gap-4 mb-2">
            <div className="flex-grow">
              <LegalNatureDashboardContent
                totalLegalNatures={legalNatures.totalCount}
                activeLegalNatures={legalNatures.activeCount}
                inactiveLegalNatures={legalNatures.inactiveCount}
              />
            </div>
          </div>
          {legalNatures.legalNatures.length === 0 ? (
            <EmptyState
              icon={Search}
              title="Nenhum resultado encontrado"
              description=""
            />
          ) : (
            <LegalNaturelist LegalNatures={legalNatures} />
          )}

          {totalRecords > 0 && (
            <div className="flex items-center justify-between mt-4">
              <PageSizeSelector
                currentPageSize={pageSize}
                pageName="portal/legalNatures"
              />
              <PaginationRecords
                totalRecords={totalRecords}
                currentPage={page}
                pageSize={pageSize}
                pageName="portal/legalNatures"
              />
            </div>
          )}
        </div>
      </BaseBody>
    </>
  );
}
