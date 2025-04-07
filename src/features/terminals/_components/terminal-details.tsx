import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Activity,
  ArrowLeft,
  BarChart2,
  Building2,
  Calendar,
  CreditCard,
  HardDrive,
  Server,
  Smartphone,
} from "lucide-react";
import Link from "next/link";

type TerminalDetailsProps = {
  terminal: {
    slug: string | null;
    logicalNumber: string | null;
    model: string | null;
    manufacturer: string | null;
    serialNumber: string | null;
    type: string | null;
    status: string | null;
    pinpadSerialNumber: string | null;
    pinpadFirmware: string | null;
    inactivationDate: string | null;
    dtinsert: string | null;
    slugMerchant: string | null;
    slugCustomer: string | null;
    merchantName: string | null;
    merchantCnpj: string | null;
    merchantEmail: string | null;
  };
};

export default function TerminalDetails({ terminal }: TerminalDetailsProps) {
  const formatDate = (date: string | null) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("pt-BR");
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card de Terminal */}
        <Card className="overflow-hidden border-0 shadow-md">
          <CardHeader className="pb-2 border-b">
            <CardTitle className="text-lg font-bold flex items-center gap-2 text-zinc-800">
              <HardDrive className="h-5 w-5 text-primary" />
              Terminal
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <BarChart2 className="h-4 w-4 text-gray-500" />
                    <h3 className="font-semibold text-sm text-gray-600">
                      Número Lógico
                    </h3>
                  </div>
                  <p className="text-base font-medium">
                    {terminal.logicalNumber || "-"}
                  </p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Server className="h-4 w-4 text-gray-500" />
                    <h3 className="font-semibold text-sm text-gray-600">
                      Número Serial
                    </h3>
                  </div>
                  <p className="text-base font-medium">
                    {terminal.serialNumber || "-"}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Smartphone className="h-4 w-4 text-gray-500" />
                    <h3 className="font-semibold text-sm text-gray-600">
                      Modelo
                    </h3>
                  </div>
                  <p className="text-base font-medium">
                    {terminal.model || "-"}
                  </p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <CreditCard className="h-4 w-4 text-gray-500" />
                    <h3 className="font-semibold text-sm text-gray-600">
                      Número de Patrimônio
                    </h3>
                  </div>
                  <p className="text-base font-medium">-</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Activity className="h-4 w-4 text-gray-500" />
                    <h3 className="font-semibold text-sm text-gray-600">
                      Status
                    </h3>
                  </div>
                  <Badge
                    variant={
                      terminal.status === "ACTIVE"
                        ? "success"
                        : terminal.status === "INACTIVE"
                        ? "destructive"
                        : terminal.status === "MAINTENANCE"
                        ? "pending"
                        : "default"
                    }
                    className="mt-1"
                  >
                    {terminal.status === "ACTIVE"
                      ? "Ativo"
                      : terminal.status === "INACTIVE"
                      ? "Inativo"
                      : terminal.status === "MAINTENANCE"
                      ? "Manutenção"
                      : terminal.status || "Desconhecido"}
                  </Badge>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Server className="h-4 w-4 text-gray-500" />
                    <h3 className="font-semibold text-sm text-gray-600">
                      Chip
                    </h3>
                  </div>
                  <p className="text-base font-medium">-</p>
                </div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <h3 className="font-semibold text-sm text-gray-600">
                    Data de Inativação
                  </h3>
                </div>
                <p className="text-base font-medium">
                  {terminal.inactivationDate
                    ? formatDate(terminal.inactivationDate)
                    : "-"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card de Estabelecimento */}
        <Card className="overflow-hidden border-0 shadow-md">
          <CardHeader className="pb-2 border-b">
            <CardTitle className="text-lg font-bold flex items-center gap-2 text-zinc-800">
              <Building2 className="h-5 w-5 text-primary" />
              Estabelecimento
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5">
            <div className="space-y-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Building2 className="h-4 w-4 text-gray-500" />
                  <h3 className="font-semibold text-sm text-gray-600">
                    Nome Fantasia
                  </h3>
                </div>
                <p className="text-base font-medium">
                  {terminal.merchantName || "-"}
                </p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <CreditCard className="h-4 w-4 text-gray-500" />
                  <h3 className="font-semibold text-sm text-gray-600">
                    CNPJ/CPF
                  </h3>
                </div>
                <p className="text-base font-medium">
                  {terminal.merchantCnpj || "-"}
                </p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <h3 className="font-semibold text-sm text-gray-600">
                    Data de Inclusão
                  </h3>
                </div>
                <p className="text-base font-medium">
                  {terminal.dtinsert ? formatDate(terminal.dtinsert) : "-"}
                </p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Server className="h-4 w-4 text-gray-500" />
                  <h3 className="font-semibold text-sm text-gray-600">ISO</h3>
                </div>
                <p className="text-base font-medium">-</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-start mt-4">
        <Link href="/portal/terminals">
          <Button
            variant="outline"
            className="flex items-center gap-2 rounded-md shadow-sm hover:shadow"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
        </Link>
      </div>
    </div>
  );
}
