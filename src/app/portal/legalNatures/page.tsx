import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/layout/portal/PageHeader";
import PageSizeSelector from "@/components/page-size-selector";
import PaginationRecords from "@/components/pagination-Records";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LegalNatureDashboardContent } from "@/features/legalNature/_components/legalNature-dashboard-content";
import { LegalNatureFilter } from "@/features/legalNature/_components/legalNature-filter";
import LegalNaturelist from "@/features/legalNature/_components/legalNatures-list";
import { getLegalNatures } from "@/features/legalNature/server/legalNature-db";
import { checkPagePermission } from "@/lib/auth/check-permissions";
import { Plus, Search } from "lucide-react";
import Link from "next/link";

export const revalidate = 300;

type LegalNatureProps = {
  searchParams: {
    page?: string;
    pageSize?: string;
    search?: string;
    name?: string;
    code?: string;
    active?: string;
    sortBy?: string;
    sortOrder?: string;
  };
};

export default async function LegalNaturesPage({
  searchParams,
}: LegalNatureProps) {
  await checkPagePermission("Natureza Juridica");

  const page = parseInt(searchParams.page || "1");
  const pageSize = parseInt(searchParams.pageSize || "10");
  const search = searchParams.search || "";
  const name = searchParams.name || "";
  const code = searchParams.code || "";
  const active = searchParams.active || "";
  const sortBy = searchParams.sortBy || "id";
  const sortOrder =
    searchParams.sortOrder === "asc" || searchParams.sortOrder === "desc"
      ? searchParams.sortOrder
      : "desc";

  const legalNatures = await getLegalNatures(
    search,
    page,
    pageSize,
    name,
    code,
    active,
    { sortBy, sortOrder }
  );

  const totalRecords = legalNatures.totalCount;

  return (
    <div className="space-y-8">
      <PageHeader
        title="Formatos Jurídicos"
        description="Gerencie as naturezas legais utilizadas no sistema."
      >
        <Button asChild>
          <Link href="/portal/legalNatures/0">
            <Plus className="mr-2 h-4 w-4" />
            Novo Formato Jurídico
          </Link>
        </Button>
      </PageHeader>

      <LegalNatureDashboardContent
        totalLegalNatures={legalNatures.totalCount}
        activeLegalNatures={legalNatures.activeCount}
        inactiveLegalNatures={legalNatures.inactiveCount}
      />

      <Card>
        <CardHeader>
          <CardTitle>Lista de Formatos Jurídicos</CardTitle>
          <CardDescription>
            Filtre e visualize todos os formatos jurídicos cadastrados.
          </CardDescription>
          <div className="pt-4">
            <LegalNatureFilter
              nameIn={searchParams.name}
              codeIn={searchParams.code}
              activeIn={searchParams.active}
            />
          </div>
        </CardHeader>
        <CardContent>
          {legalNatures.legalNatures.length === 0 ? (
            <EmptyState
              icon={Search}
              title="Nenhum resultado encontrado"
              description="Tente ajustar seus filtros para encontrar o que procura."
            />
          ) : (
            <LegalNaturelist LegalNatures={legalNatures} />
          )}
        </CardContent>
        {totalRecords > 0 && (
          <CardFooter className="flex items-center justify-between">
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
          </CardFooter>
        )}
      </Card>
    </div>
  );
}