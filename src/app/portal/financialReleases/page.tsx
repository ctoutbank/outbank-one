import BaseBody from "@/components/layout/base-body";
import BaseHeader from "@/components/layout/base-header";
import { Card, CardContent } from "@/components/ui/card";

export default function FinancialReleasesPage() {
  return (
    <>
      <BaseHeader
        breadcrumbItems={[
          {
            title: "Lançamentos Financeiros",
            url: "/portal/financialReleases",
          },
        ]}
      />

      <BaseBody
        title="Lançamentos Financeiros"
        subtitle="Visualização de Todos os Lançamentos Financeiros"
      >
        <div className="flex flex-col space-y-4">
          <Card className="w-full">
            <CardContent>
              <div className="flex items-center justify-center p-8">
                <p className="text-muted-foreground text-center text-lg">
                  Em desenvolvimento...
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </BaseBody>
    </>
  );
}
