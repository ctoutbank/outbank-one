import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { User } from "lucide-react";
import type { FeeDetail } from "../server/category";

interface FeeViewProps {
  feeDetail: FeeDetail;
}

// Função para obter a imagem da bandeira (igual ao PricingSolicitationView)
const getCardImage = (cardName: string): string => {
  const cardMap: { [key: string]: string } = {
    MASTERCARD: "/mastercard.svg",
    MASTER: "/mastercard.svg",
    VISA: "/visa.svg",
    ELO: "/elo.svg",
    AMERICAN_EXPRESS: "/american-express.svg",
    HIPERCARD: "/hipercard.svg",
    AMEX: "/american-express.svg",
    CABAL: "/cabal.svg",
  };
  return cardMap[cardName?.toUpperCase()] || "";
};

export function FeeView({ feeDetail }: FeeViewProps) {
  if (!feeDetail) {
    return <div>Nenhuma tabela de taxas encontrada.</div>;
  }

  return (
    <div className="w-full min-h-screen box-border relative overflow-x-hidden">
      <div className="space-y-8 w-full max-w-full box-border overflow-x-hidden">
        {/* Card: Informações da Tabela */}
        <Card className="shadow-sm w-full max-w-full overflow-hidden">
          <CardHeader className="pb-3">
            <CardTitle className="text-xl flex items-center">
              <User className="h-5 w-5 mr-2 text-primary" />
              Tabela de Taxas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Nome:</label>
                  <div className="p-2 border rounded-md bg-gray-50">
                    {feeDetail.name || "-"}
                  </div>
                </div>
              </div>
              <div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Tipo:</label>
                  <div className="p-2 border rounded-md bg-gray-50">
                    {feeDetail.tableType || "-"}
                  </div>
                </div>
              </div>
              <div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Antecipação Obrigatória:
                  </label>
                  <div className="p-2 border rounded-md bg-gray-50">
                    {feeDetail.compulsoryAnticipationConfig ?? "-"}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card: Taxas Transações POS */}
        <Card className="shadow-sm w-full max-w-full overflow-hidden">
          <CardHeader className="pb-3">
            <CardTitle className="text-xl flex items-center">
              <User className="h-5 w-5 mr-2 text-primary" />
              Taxas Transações POS
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 max-w-full overflow-x-hidden">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-amber-100" />
              <span className="text-sm text-gray-600">
                Oferecido pelo Outbank
              </span>
            </div>
 

            <div className="overflow-y-hidden overflow-x-auto">
              <Table className="text-xs min-w-[800px] w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead
                      className="sticky left-0 z-20 bg-white w-20"
                      style={{ width: "20%", minWidth: "100px" }}
                    >
                      Bandeiras
                    </TableHead>
                    <TableHead className="text-center">
                      Tipo de Produto
                    </TableHead>
                    <TableHead className="text-center">
                      Taxa Transação Cartão
                    </TableHead>
                    <TableHead className="text-center">MDR Cartão</TableHead>
                    <TableHead className="text-center">
                      Taxa Transação Não Cartão
                    </TableHead>
                    <TableHead className="text-center">
                      MDR Não Cartão
                    </TableHead>
                    <TableHead className="text-center">
                      Parcela Inicial
                    </TableHead>
                    <TableHead className="text-center">Parcela Final</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {feeDetail.brands.map((brand) =>
                    brand.productTypes.map((pt, idx) => (
                      <TableRow key={`${brand.id}-${pt.id}`}>
                        {idx === 0 && (
                          <TableCell
                            rowSpan={brand.productTypes.length}
                            className="font-medium sticky left-0 z-20 bg-white"
                            style={{
                              minWidth: "120px",
                              verticalAlign: "middle",
                            }}
                          >
                            <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                              {getCardImage(brand.brand || "") && (
                                <img
                                  src={
                                    getCardImage(brand.brand || "") ||
                                    "/placeholder.svg"
                                  }
                                  alt={brand.brand || ""}
                                  width={40}
                                  height={24}
                                  className="object-contain w-8 h-5 sm:w-10 sm:h-6 flex-shrink-0"
                                />
                              )}
                              <span className="truncate">
                                {brand.brand || "-"}
                              </span>
                            </div>
                          </TableCell>
                        )}
                        <TableCell className="text-center">
                          {pt.name || "-"}
                        </TableCell>
                        <TableCell className="p-1 text-center">
                          <div className="flex items-center justify-center">
                            <div className="rounded-full py-1 px-2 inline-block min-w-[50px] max-w-[70px] text-center bg-amber-100 text-xs sm:text-sm">
                              {pt.cardTransactionFee
                                ? `${pt.cardTransactionFee}%`
                                : "-"}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="p-1 text-center">
                          <div className="flex items-center justify-center">
                            <div className="rounded-full py-1 px-2 inline-block min-w-[50px] max-w-[70px] text-center bg-amber-100 text-xs sm:text-sm">
                              {pt.cardTransactionMdr
                                ? `${pt.cardTransactionMdr}%`
                                : "-"}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="p-1 text-center">
                          <div className="flex items-center justify-center">
                            <div className="rounded-full py-1 px-2 inline-block min-w-[50px] max-w-[70px] text-center bg-amber-100 text-xs sm:text-sm">
                              {pt.nonCardTransactionFee
                                ? `${pt.nonCardTransactionFee}%`
                                : "-"}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="p-1 text-center">
                          <div className="flex items-center justify-center">
                            <div className="rounded-full py-1 px-2 inline-block min-w-[50px] max-w-[70px] text-center bg-amber-100 text-xs sm:text-sm">
                              {pt.nonCardTransactionMdr
                                ? `${pt.nonCardTransactionMdr}%`
                                : "-"}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          {pt.installmentTransactionFeeStart ?? "-"}
                        </TableCell>
                        <TableCell className="text-center">
                          {pt.installmentTransactionFeeEnd ?? "-"}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
