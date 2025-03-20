"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatCurrency } from "@/lib/utils";

interface TaxasDashboardContentProps {
  totalTaxas: number;
  activeTaxas: number;
  inactiveTaxas: number;
  avgValor: number;
}

export function TaxasDashboardContent({
  totalTaxas,
  activeTaxas,
  inactiveTaxas,
  avgValor,
}: TaxasDashboardContentProps) {
  return (
    <Tabs defaultValue="summary" className="w-full">
      <TabsList className="mb-4">
        <TabsTrigger value="summary">Resumo</TabsTrigger>
        <TabsTrigger value="status">Status</TabsTrigger>
        <TabsTrigger value="values">Valores</TabsTrigger>
      </TabsList>

      <TabsContent value="summary">
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Total de Taxas
              </CardTitle>
              <CardDescription>Total de taxas cadastradas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalTaxas}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Valor Médio</CardTitle>
              <CardDescription>Média de valores das taxas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(avgValor)}
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="status">
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Taxas Ativas
              </CardTitle>
              <CardDescription>Total de taxas ativas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeTaxas}</div>
              <p className="text-xs text-muted-foreground">
                {totalTaxas > 0
                  ? `${Math.round((activeTaxas / totalTaxas) * 100)}% do total`
                  : "0% do total"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Taxas Inativas
              </CardTitle>
              <CardDescription>Total de taxas inativas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{inactiveTaxas}</div>
              <p className="text-xs text-muted-foreground">
                {totalTaxas > 0
                  ? `${Math.round(
                      (inactiveTaxas / totalTaxas) * 100
                    )}% do total`
                  : "0% do total"}
              </p>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="values">
        <div className="grid grid-cols-1 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Valor Médio das Taxas
              </CardTitle>
              <CardDescription>
                Valor médio das taxas cadastradas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(avgValor)}
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
    </Tabs>
  );
}
