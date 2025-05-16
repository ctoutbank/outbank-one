import BaseBody from "@/components/layout/base-body";
import BaseHeader from "@/components/layout/base-header";
import { Button } from "@/components/ui/button";
import { TaxesList } from "@/features/taxes/taxes-list";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function TaxesPage() {
  return (
    <>
      <BaseHeader
        breadcrumbItems={[
          { title: "Solicitação de Taxas", url: "/portal/taxes" },
        ]}
      />
      <BaseBody
        title="Solicitação de Taxas"
        subtitle="Acompanhe suas solicitações de taxas"
        actions={
          <Link href="/portal/taxes/novo" passHref legacyBehavior>
            <Button
              asChild
              size="sm"
              className="gap-1 px-3 py-1.5 h-8 text-xs font-medium rounded bg-[#222] hover:bg-[#333] cursor-pointer"
              variant="default"
            >
              <span>
                <Plus className="h-4 w-4 mr-1" />
                Novo
              </span>
            </Button>
          </Link>
        }
      >
        <TaxesList />
      </BaseBody>
    </>
  );
}
