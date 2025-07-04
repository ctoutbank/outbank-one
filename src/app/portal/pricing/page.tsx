import { EmptyState } from "@/components/empty-state";
import BaseBody from "@/components/layout/base-body";
import BaseHeader from "@/components/layout/base-header";
import PaginationWithSizeSelector from "@/components/pagination-with-size-selector";
import FeeList from "@/features/newTax/_components/new-tax-list";
import { getFeesAction } from "@/features/newTax/server/fee-db";
import { Search } from "lucide-react";

export default async function NewTaxPage({ searchParams }: { searchParams: { page?: string; pageSize?: string } }) {
    const page = parseInt(searchParams.page || "1");
    const pageSize = parseInt(searchParams.pageSize || "10");

    const { fees, totalRecords, currentPage, pageSize: returnedPageSize } = await getFeesAction(page, pageSize) || { fees: [], totalRecords: 0, currentPage: 1, pageSize: 20 };

    return (
        <>
            <BaseHeader
                breadcrumbItems={[
                    { title: "Cadastro de Taxas de Cobrança", url: "/portal/pricing" },
                ]}
            />
            <BaseBody
                title="Cadastro de Taxas de Cobrança"
                subtitle="Taxas de cobrança que serão aplicadas nas transações"
            >
                {fees.length === 0 && (
                    <EmptyState
                        icon={Search}
                        title="Nenhuma taxa encontrada"
                        description="Nenhuma taxa encontrada"
                    />
                )}
                {fees.length > 0 && (
                    <FeeList fees={fees} />
                )}

                {totalRecords > 0 && (
                    <div className="mt-2">
                        <PaginationWithSizeSelector
                            totalRecords={totalRecords}
                            currentPage={currentPage}
                            pageSize={returnedPageSize}
                            pageName="portal/pricing"
                        />
                    </div>
                )}
            </BaseBody>
        </>
    );
}
