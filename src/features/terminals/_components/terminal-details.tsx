import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Link } from "lucide-react";

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
    slugMerchant: string | null;
    slugCustomer: string | null;
  };
};

export default function TerminalDetails({ terminal }: TerminalDetailsProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/portal/terminals">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h2 className="text-2xl font-bold">Terminal {terminal.slug}</h2>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-sm text-muted-foreground">
                  Número Lógico
                </h3>
                <p className="text-lg">{terminal.logicalNumber || "-"}</p>
              </div>
              <div>
                <h3 className="font-semibold text-sm text-muted-foreground">
                  Modelo
                </h3>
                <p className="text-lg">{terminal.model || "-"}</p>
              </div>
              <div>
                <h3 className="font-semibold text-sm text-muted-foreground">
                  Fabricante
                </h3>
                <p className="text-lg">{terminal.manufacturer || "-"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-sm text-muted-foreground">
                  Número de Série
                </h3>
                <p className="text-lg">{terminal.serialNumber || "-"}</p>
              </div>
              <div>
                <h3 className="font-semibold text-sm text-muted-foreground">
                  Tipo
                </h3>
                <p className="text-lg">{terminal.type || "-"}</p>
              </div>
              <div>
                <h3 className="font-semibold text-sm text-muted-foreground">
                  Status
                </h3>
                <p className="text-lg">{terminal.status || "-"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-sm text-muted-foreground">
                  Número de Série do Pinpad
                </h3>
                <p className="text-lg">{terminal.pinpadSerialNumber || "-"}</p>
              </div>
              <div>
                <h3 className="font-semibold text-sm text-muted-foreground">
                  Firmware do Pinpad
                </h3>
                <p className="text-lg">{terminal.pinpadFirmware || "-"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-sm text-muted-foreground">
                  Estabelecimento
                </h3>
                <p className="text-lg">{terminal.slugMerchant || "-"}</p>
              </div>
              <div>
                <h3 className="font-semibold text-sm text-muted-foreground">
                  Cliente
                </h3>
                <p className="text-lg">{terminal.slugCustomer || "-"}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
