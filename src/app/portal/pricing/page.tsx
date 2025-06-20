import BaseHeader from "@/components/layout/base-header";
import BaseBody from "@/components/layout/base-body";
import FeeList from "@/features/newTax/_components/new-tax-list";
import PaginationWithSizeSelector from "@/components/pagination-with-size-selector";
import { getFeesAction } from "@/features/newTax/server/fee-db"

export default async function NewTaxPage({ searchParams }: { searchParams: { page?: string; pageSize?: string } }) {
    const page = parseInt(searchParams.page || "1");
    const pageSize = parseInt(searchParams.pageSize || "20");

    const { fees, totalRecords, currentPage, pageSize: returnedPageSize } = await getFeesAction(page, pageSize);

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
                <FeeList fees={fees} />

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
