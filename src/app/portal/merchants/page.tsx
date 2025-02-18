import BaseBody from "@/components/layout/base-body";
import BaseHeader from "@/components/layout/base-header";
import PaginationRecords from "@/components/pagination-Records";
import MerchantList from "../../../features/merchant/_components/merchant-list";


import ListFilter from "@/components/filter";
import { getMerchants } from "@/features/merchant/server/merchant";



type MerchantProps = {
page:string
pageSize:string
search:string

}

export default async function MerchantsPage({
  searchParams,
}: {
  searchParams: MerchantProps;
}) {
  const page=parseInt(searchParams.page || "1");
  const pageSize=parseInt(searchParams.pageSize || "5");
  const search=searchParams.search || "";
  const merchants = await getMerchants(search,page, pageSize);
  const totalRecords = merchants.totalCount;

  
  
  return (
    <>
      <BaseHeader
        breadcrumbItems={[{ title: "Estabelecimentos", url: "/portal/merchants" }]}
      />

      <BaseBody
        title="Estabelecimentos"
        subtitle={`Visualização de todos os estabelecimentos`}
      >
        <ListFilter
         pageName="portal/merchants" search={search} linkHref={"/portal/merchants/0"} linkText={"Novo Estabelecimento"} />
      
        <MerchantList list={merchants} />
        {totalRecords > 0 && (
          <PaginationRecords
            totalRecords={totalRecords}
            currentPage={page}
            pageSize={pageSize}
            pageName="portal/merchants" >
            </PaginationRecords>
        )}
        

      </BaseBody>
    </>
  );
}
