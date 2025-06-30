"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getCardImage } from "./card-image-utils";
import type {
  CreditSubType,
  OrganizedFeeGroup,
  PixFeeData,
  PixFeeField,
  PixFeeType,
  TransactionField,
  TransactionType,
} from "./tax-types";

export interface TaxManagementProps {
  feeData: OrganizedFeeGroup[];
  pixFees: PixFeeData;
  pixFeesOnline: PixFeeData;
  selectedTab: string;
  isEditing: boolean;
  permissions: string[];
  onTabChange: (value: string) => void;
  onStartEditing: () => void;
  onCancelEditing: () => void;
  onSubmit: () => void;
  onFeeDataChange: (newData: OrganizedFeeGroup[]) => void;
  onPixFeeChange: (
    field: PixFeeField,
    value: string,
    type?: PixFeeType
  ) => void;
}

export default function TaxManagementView({
  feeData,
  pixFees,
  pixFeesOnline,
  selectedTab,
  isEditing,
  permissions,
  onTabChange,
  onStartEditing,
  onCancelEditing,
  onSubmit,
  onFeeDataChange,
  onPixFeeChange,
}: TaxManagementProps) {
  console.log(feeData);
  const handleFeeChange = (
    groupId: number,
    transactionType: TransactionType,
    subType: CreditSubType | null,
    field: TransactionField,
    value: string
  ) => {
    const newFeeData = [...feeData];
    const groupIndex = newFeeData.findIndex((g) => g.id === groupId);

    if (groupIndex !== -1) {
      const group = newFeeData[groupIndex];
      const numericValue = parseFloat(value) || 0;
      console.log(numericValue);
      console.log(group);

      if (transactionType === "credit" && subType) {
        // Para crédito com subtipos (vista, parcela2_6, parcela7_12)
        const creditTransaction = group.transactions.credit[subType];
        if (creditTransaction) {
          // Type assertion segura para campos conhecidos
          if (field === "mdr") {
            creditTransaction.mdr = numericValue;
          } else if (field === "cardTransactionMdr") {
            creditTransaction.cardTransactionMdr = numericValue;
          } else if (field === "nonCardTransactionMdr") {
            creditTransaction.nonCardTransactionMdr = numericValue;
          } else if (field === "cardTransactionFee") {
            creditTransaction.cardTransactionFee = numericValue;
          } else if (field === "nonCardTransactionFee") {
            creditTransaction.nonCardTransactionFee = numericValue;
          }
        }
      } else if (transactionType === "debit" || transactionType === "prepaid") {
        // Para débito e prepaid
        const transaction = group.transactions[transactionType];
        if (transaction) {
          // Type assertion segura para campos conhecidos
          if (field === "mdr") {
            transaction.mdr = numericValue;
          } else if (field === "cardTransactionMdr") {
            transaction.cardTransactionMdr = numericValue;
          } else if (field === "nonCardTransactionMdr") {
            transaction.nonCardTransactionMdr = numericValue;
          } else if (field === "cardTransactionFee") {
            transaction.cardTransactionFee = numericValue;
          } else if (field === "nonCardTransactionFee") {
            transaction.nonCardTransactionFee = numericValue;
          }
        }
      }

      onFeeDataChange(newFeeData);
    }
  };
  console.log("feeData", feeData);
  return (
    <div className="w-full mx-auto p-4">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="h-6 w-6 bg-black rounded flex items-center justify-center text-white text-sm">
          $
        </div>
        <h1 className="text-xl font-semibold">Taxas de Transação</h1>
      </div>

      <Tabs value={selectedTab} className="w-full" onValueChange={onTabChange}>
        <TabsList className="flex gap-4 mb-2">
          <TabsTrigger value="todas">
            <span className="flex items-center gap-2">
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
              >
                <path
                  d="M4 6h16M4 12h16M4 18h16"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              Todas as Transações
            </span>
          </TabsTrigger>
          <TabsTrigger
            value="pos"
            className="data-[state=active]:bg-white rounded-md"
          >
            <span className="flex items-center gap-2">
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
              >
                <rect
                  x="3"
                  y="6"
                  width="18"
                  height="12"
                  rx="2"
                  strokeWidth="2"
                />
                <path d="M8 12h8" strokeWidth="2" strokeLinecap="round" />
              </svg>
              Transações no POS
            </span>
          </TabsTrigger>
          <TabsTrigger
            value="online"
            className="data-[state=active]:bg-white rounded-md"
          >
            <span className="flex items-center gap-2">
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
              >
                <circle cx="12" cy="12" r="10" strokeWidth="2" />
                <path
                  d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"
                  strokeWidth="2"
                />
              </svg>
              Transações Online
            </span>
          </TabsTrigger>
        </TabsList>

        <div className="mt-6 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
            >
              <circle cx="12" cy="12" r="10" strokeWidth="2" />
              <path d="M12 6v6l4 2" strokeWidth="2" strokeLinecap="round" />
            </svg>
            Última Atualização: 11/12/2024 - 15h30
          </div>
          {permissions?.includes("Atualizar") && (
            <div className="flex items-center gap-2">
              {isEditing ? (
                <>
                  <Button
                    variant="outline"
                    className="bg-white text-black"
                    onClick={onCancelEditing}
                  >
                    Cancelar
                  </Button>
                  <Button onClick={onSubmit}>Salvar Alterações</Button>
                </>
              ) : (
                <Button onClick={onStartEditing}>Alterar Taxas</Button>
              )}
            </div>
          )}
        </div>

        <TabsContent value="todas">
          <div className="bg-gray-50 rounded-lg p-4 mb-5">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 bg-gray-100 p-2 rounded">
              Taxas Transações no POS
            </h3>

            <table className="w-full ">
              <thead>
                <tr>
                  <th className="text-left py-2 px-4">Bandeira</th>
                  <th className="text-left py-2 px-4">Crédito à vista</th>
                  <th className="text-left py-2 px-4">Crédito 2-6x</th>
                  <th className="text-left py-2 px-4">Crédito 7-12x</th>
                  <th className="text-left py-2 px-4">Débito</th>
                  <th className="text-left py-2 px-4">Pré-pago</th>
                </tr>
              </thead>
              <tbody>
                {feeData.map((group) => (
                  <tr key={group.id} className="border-t border-gray-200">
                    <td className="py-2 px-4">
                      <div className="flex items-center gap-2">
                        {getCardImage(group.name) && (
                          <img
                            src={getCardImage(group.name)}
                            alt={group.name}
                            width={40}
                            height={24}
                            className="object-contain"
                          />
                        )}
                        <span>{group.name}</span>
                      </div>
                    </td>
                    {/* Crédito à vista */}
                    <td className="py-2 px-4">
                      {isEditing ? (
                        <Input
                          value={group.transactions.credit.vista?.mdr || ""}
                          onChange={(e) =>
                            handleFeeChange(
                              group.id,
                              "credit",
                              "vista",
                              "mdr",
                              e.target.value
                            )
                          }
                          className="w-24 h-8 text-sm border rounded px-2"
                        />
                      ) : (
                        <div className="px-3 py-1 text-sm w-24">
                          {group.transactions.credit.vista?.mdr}%
                        </div>
                      )}
                    </td>
                    {/* Crédito 2-6x */}
                    <td className="py-2 px-4">
                      {isEditing ? (
                        <Input
                          value={
                            group.transactions.credit.parcela2_6?.mdr || ""
                          }
                          onChange={(e) =>
                            handleFeeChange(
                              group.id,
                              "credit",
                              "parcela2_6",
                              "mdr",
                              e.target.value
                            )
                          }
                          className="w-24 h-8 text-sm border rounded px-2"
                        />
                      ) : (
                        <div className="px-3 py-1 text-sm w-24">
                          {group.transactions.credit.parcela2_6?.mdr}%
                        </div>
                      )}
                    </td>
                    {/* Crédito 7-12x */}
                    <td className="py-2 px-4">
                      {isEditing ? (
                        <Input
                          value={
                            group.transactions.credit.parcela7_12?.mdr || ""
                          }
                          onChange={(e) =>
                            handleFeeChange(
                              group.id,
                              "credit",
                              "parcela7_12",
                              "mdr",
                              e.target.value
                            )
                          }
                          className="w-24 h-8 text-sm border rounded px-2"
                        />
                      ) : (
                        <div className="px-3 py-1 text-sm w-24">
                          {group.transactions.credit.parcela7_12?.mdr}%
                        </div>
                      )}
                    </td>
                    {/* Débito */}
                    <td className="py-2 px-4">
                      {isEditing ? (
                        <Input
                          value={group.transactions.debit?.mdr || ""}
                          onChange={(e) =>
                            handleFeeChange(
                              group.id,
                              "debit",
                              null,
                              "mdr",
                              e.target.value
                            )
                          }
                          className="w-24 h-8 text-sm border rounded px-2"
                        />
                      ) : (
                        <div className="px-3 py-1 text-sm w-24">
                          {group.transactions.debit?.mdr}%
                        </div>
                      )}
                    </td>
                    {/* Pré-pago */}
                    <td className="py-2 px-4">
                      {isEditing ? (
                        <Input
                          value={group.transactions.prepaid?.mdr || ""}
                          onChange={(e) =>
                            handleFeeChange(
                              group.id,
                              "prepaid",
                              null,
                              "mdr",
                              e.target.value
                            )
                          }
                          className="w-24 h-8 text-sm border rounded px-2"
                        />
                      ) : (
                        <div className="px-3 py-1 text-sm w-24">
                          {group.transactions.prepaid?.mdr}%
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-8 bg-gray-50 rounded-lg p-4 ">
              <h2 className="text-lg font-semibold mb-6 text-gray-800">
                Taxa Pix
              </h2>
              <div className="flex gap-10">
                <div className="flex flex-col items-center">
                  <p className="text-sm text-gray-600 mb-2">MDR</p>
                  {isEditing ? (
                    <Input
                      value={pixFees.mdr}
                      onChange={(e) =>
                        onPixFeeChange("mdr", e.target.value, "pos")
                      }
                      className="w-24 h-8 text-sm border rounded px-2"
                    />
                  ) : (
                    <div className="px-3 py-1 text-sm w-24">{pixFees.mdr}%</div>
                  )}
                </div>
                <div className="flex flex-col items-center">
                  <p className="text-sm text-gray-600 mb-2">Custo Mínimo</p>
                  {isEditing ? (
                    <Input
                      value={pixFees.custoMinimo}
                      onChange={(e) =>
                        onPixFeeChange("custoMinimo", e.target.value, "pos")
                      }
                      className="w-24 h-8 text-sm border rounded px-2"
                    />
                  ) : (
                    <div className="px-3 py-1 text-sm w-24">
                      R$ {pixFees.custoMinimo}
                    </div>
                  )}
                </div>
                <div className="flex flex-col items-center">
                  <p className="text-sm text-gray-600 mb-2">Custo Máximo</p>
                  {isEditing ? (
                    <Input
                      value={pixFees.custoMaximo}
                      onChange={(e) =>
                        onPixFeeChange("custoMaximo", e.target.value, "pos")
                      }
                      className="w-24 h-8 text-sm border rounded px-2"
                    />
                  ) : (
                    <div className="px-3 py-1 text-sm w-24">
                      R$ {pixFees.custoMaximo}
                    </div>
                  )}
                </div>
                <div className="flex flex-col items-center">
                  <p className="text-sm text-gray-600 mb-2">Antecipação</p>
                  {isEditing ? (
                    <Input
                      value={pixFees.antecipacao}
                      onChange={(e) =>
                        onPixFeeChange("antecipacao", e.target.value, "pos")
                      }
                      className="w-24 h-8 text-sm border rounded px-2"
                    />
                  ) : (
                    <div className="px-3 py-1 text-sm min-w-fit whitespace-nowrap">
                      {pixFees.antecipacao}% ao mês
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3 bg-gray-100 p-2 rounded">
            Taxas Transações Online
          </h3>
          <div className="bg-gray-50 rounded-lg p-4">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left py-2 px-4">Bandeira</th>
                  <th className="text-left py-2 px-4">Crédito à vista</th>
                  <th className="text-left py-2 px-4">Crédito 2-6x</th>
                  <th className="text-left py-2 px-4">Crédito 7-12x</th>
                  <th className="text-left py-2 px-4">Débito</th>
                  <th className="text-left py-2 px-4">Pré-pago</th>
                </tr>
              </thead>
              <tbody>
                {feeData.map((group) => (
                  <tr key={group.id} className="border-t border-gray-200">
                    <td className="py-2 px-4">
                      <div className="flex items-center gap-2">
                        {getCardImage(group.name) && (
                          <img
                            src={getCardImage(group.name)}
                            alt={group.name}
                            width={40}
                            height={24}
                            className="object-contain"
                          />
                        )}
                        <span>{group.name}</span>
                      </div>
                    </td>
                    {/* Crédito à vista */}
                    <td className="py-2 px-4">
                      {isEditing ? (
                        <Input
                          value={
                            group.transactions.credit.vista
                              ?.nonCardTransactionMdr || ""
                          }
                          onChange={(e) =>
                            handleFeeChange(
                              group.id,
                              "credit",
                              "vista",
                              "nonCardTransactionMdr",
                              e.target.value
                            )
                          }
                          className="w-24 h-8 text-sm border rounded px-2"
                        />
                      ) : (
                        <div className="px-3 py-1 text-sm w-24">
                          {
                            group.transactions.credit.vista
                              ?.nonCardTransactionMdr
                          }
                          %
                        </div>
                      )}
                    </td>
                    {/* Crédito 2-6x */}
                    <td className="py-2 px-4">
                      {isEditing ? (
                        <Input
                          value={
                            group.transactions.credit.parcela2_6
                              ?.nonCardTransactionMdr || ""
                          }
                          onChange={(e) =>
                            handleFeeChange(
                              group.id,
                              "credit",
                              "parcela2_6",
                              "nonCardTransactionMdr",
                              e.target.value
                            )
                          }
                          className="w-24 h-8 text-sm border rounded px-2"
                        />
                      ) : (
                        <div className="px-3 py-1 text-sm w-24">
                          {
                            group.transactions.credit.parcela2_6
                              ?.nonCardTransactionMdr
                          }
                          %
                        </div>
                      )}
                    </td>
                    {/* Crédito 7-12x */}
                    <td className="py-2 px-4">
                      {isEditing ? (
                        <Input
                          value={
                            group.transactions.credit.parcela7_12
                              ?.nonCardTransactionMdr || ""
                          }
                          onChange={(e) =>
                            handleFeeChange(
                              group.id,
                              "credit",
                              "parcela7_12",
                              "nonCardTransactionMdr",
                              e.target.value
                            )
                          }
                          className="w-24 h-8 text-sm border rounded px-2"
                        />
                      ) : (
                        <div className="px-3 py-1 text-sm w-24">
                          {
                            group.transactions.credit.parcela7_12
                              ?.nonCardTransactionMdr
                          }
                          %
                        </div>
                      )}
                    </td>
                    {/* Débito */}
                    <td className="py-2 px-4">
                      {isEditing ? (
                        <Input
                          value={
                            group.transactions.debit?.nonCardTransactionMdr ||
                            ""
                          }
                          onChange={(e) =>
                            handleFeeChange(
                              group.id,
                              "debit",
                              null,
                              "nonCardTransactionMdr",
                              e.target.value
                            )
                          }
                          className="w-24 h-8 text-sm border rounded px-2"
                        />
                      ) : (
                        <div className="px-3 py-1 text-sm w-24">
                          {group.transactions.debit?.nonCardTransactionMdr}%
                        </div>
                      )}
                    </td>
                    {/* Pré-pago */}
                    <td className="py-2 px-4">
                      {isEditing ? (
                        <Input
                          value={
                            group.transactions.prepaid?.nonCardTransactionMdr ||
                            ""
                          }
                          onChange={(e) =>
                            handleFeeChange(
                              group.id,
                              "prepaid",
                              null,
                              "nonCardTransactionMdr",
                              e.target.value
                            )
                          }
                          className="w-24 h-8 text-sm border rounded px-2"
                        />
                      ) : (
                        <div className="px-3 py-1 text-sm w-24">
                          {group.transactions.prepaid?.nonCardTransactionMdr}%
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-8 bg-gray-50 rounded-lg p-4 ">
              <h2 className="text-lg font-semibold mb-6 text-gray-800">
                Taxa Pix
              </h2>
              <div className="flex gap-10">
                <div className="flex flex-col items-left">
                  <p className="text-sm text-gray-600 mb-2">MDR</p>
                  {isEditing ? (
                    <Input
                      value={pixFeesOnline.mdr}
                      onChange={(e) =>
                        onPixFeeChange("mdr", e.target.value, "online")
                      }
                      className="w-24 h-8 text-sm border rounded px-2"
                    />
                  ) : (
                    <div className="px-3 py-1 text-sm w-24">
                      {pixFeesOnline.mdr}%
                    </div>
                  )}
                </div>
                <div className="flex flex-col items-center">
                  <p className="text-sm text-gray-600 mb-2">Custo Mínimo</p>
                  {isEditing ? (
                    <Input
                      value={pixFeesOnline.custoMinimo}
                      onChange={(e) =>
                        onPixFeeChange("custoMinimo", e.target.value, "online")
                      }
                      className="w-24 h-8 text-sm border rounded px-2"
                    />
                  ) : (
                    <div className="px-3 py-1 text-sm w-24">
                      R$ {pixFeesOnline.custoMinimo}
                    </div>
                  )}
                </div>
                <div className="flex flex-col items-center">
                  <p className="text-sm text-gray-600 mb-2">Custo Máximo</p>
                  {isEditing ? (
                    <Input
                      value={pixFeesOnline.custoMaximo}
                      onChange={(e) =>
                        onPixFeeChange("custoMaximo", e.target.value, "online")
                      }
                      className="w-24 h-8 text-sm border rounded px-2"
                    />
                  ) : (
                    <div className="px-3 py-1 text-sm w-24">
                      R$ {pixFeesOnline.custoMaximo}
                    </div>
                  )}
                </div>
                <div className="flex flex-col items-center">
                  <p className="text-sm  text-gray-600 mb-2">Antecipação</p>
                  {isEditing ? (
                    <Input
                      value={pixFees.antecipacao}
                      onChange={(e) =>
                        onPixFeeChange("antecipacao", e.target.value, "online")
                      }
                      className="w-24 h-8 text-sm border rounded px-2"
                    />
                  ) : (
                    <div className="px-3 py-1 text-sm min-w-fit whitespace-nowrap">
                      {pixFees.antecipacao}% ao mês
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="pos">
          <div className="bg-gray-50 rounded-lg p-4 mb-5">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 bg-gray-100 p-2 rounded">
              Taxas Transações no POS
            </h3>
            <table className="w-full ">
              <thead>
                <tr>
                  <th className="text-left py-2 px-4">Bandeira</th>
                  <th className="text-left py-2 px-4">Crédito à vista</th>
                  <th className="text-left py-2 px-4">Crédito 2-6x</th>
                  <th className="text-left py-2 px-4">Crédito 7-12x</th>
                  <th className="text-left py-2 px-4">Débito</th>
                  <th className="text-left py-2 px-4">Pré-pago</th>
                </tr>
              </thead>
              <tbody>
                {feeData.map((group, index) => (
                  <tr key={index} className="border-t border-gray-200">
                    <td className="py-2 px-4">
                      <div className="flex items-center gap-2">
                        {getCardImage(group.name) && (
                          <img
                            src={getCardImage(group.name)}
                            alt={group.name}
                            width={40}
                            height={24}
                            className="object-contain"
                          />
                        )}
                        <span>{group.name}</span>
                      </div>
                    </td>
                    {/* Crédito à vista */}
                    <td className="py-2 px-4">
                      {isEditing ? (
                        <Input
                          value={group.transactions.credit.vista?.mdr || ""}
                          onChange={(e) =>
                            handleFeeChange(
                              group.id,
                              "credit",
                              "vista",
                              "mdr",
                              e.target.value
                            )
                          }
                          className="w-24 h-8 text-sm border rounded px-2"
                        />
                      ) : (
                        <div className="px-3 py-1 text-sm w-24">
                          {group.transactions.credit.vista?.mdr}%
                        </div>
                      )}
                    </td>
                    {/* Crédito 2-6x */}
                    <td className="py-2 px-4">
                      {isEditing ? (
                        <Input
                          value={
                            group.transactions.credit.parcela2_6?.mdr || ""
                          }
                          onChange={(e) =>
                            handleFeeChange(
                              group.id,
                              "credit",
                              "parcela2_6",
                              "mdr",
                              e.target.value
                            )
                          }
                          className="w-24 h-8 text-sm border rounded px-2"
                        />
                      ) : (
                        <div className="px-3 py-1 text-sm w-24">
                          {group.transactions.credit.parcela2_6?.mdr}%
                        </div>
                      )}
                    </td>
                    {/* Crédito 7-12x */}
                    <td className="py-2 px-4">
                      {isEditing ? (
                        <Input
                          value={
                            group.transactions.credit.parcela7_12?.mdr || ""
                          }
                          onChange={(e) =>
                            handleFeeChange(
                              group.id,
                              "credit",
                              "parcela7_12",
                              "mdr",
                              e.target.value
                            )
                          }
                          className="w-24 h-8 text-sm border rounded px-2"
                        />
                      ) : (
                        <div className="px-3 py-1 text-sm w-24">
                          {group.transactions.credit.parcela7_12?.mdr}%
                        </div>
                      )}
                    </td>
                    {/* Débito */}
                    <td className="py-2 px-4">
                      {isEditing ? (
                        <Input
                          value={group.transactions.debit?.mdr || ""}
                          onChange={(e) =>
                            handleFeeChange(
                              group.id,
                              "debit",
                              null,
                              "mdr",
                              e.target.value
                            )
                          }
                          className="w-24 h-8 text-sm border rounded px-2"
                        />
                      ) : (
                        <div className="px-3 py-1 text-sm w-24">
                          {group.transactions.debit?.mdr}%
                        </div>
                      )}
                    </td>
                    {/* Pré-pago */}
                    <td className="py-2 px-4">
                      {isEditing ? (
                        <Input
                          value={group.transactions.prepaid?.mdr || ""}
                          onChange={(e) =>
                            handleFeeChange(
                              group.id,
                              "prepaid",
                              null,
                              "mdr",
                              e.target.value
                            )
                          }
                          className="w-24 h-8 text-sm border rounded px-2"
                        />
                      ) : (
                        <div className="px-3 py-1 text-sm w-24">
                          {group.transactions.prepaid?.mdr}%
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-8 bg-gray-50 rounded-lg p-4 ">
              <h2 className="text-lg font-semibold mb-6 text-gray-800">
                Taxa Pix
              </h2>
              <div className="flex gap-10">
                <div className="flex flex-col items-center">
                  <p className="text-sm text-gray-600 mb-2">MDR</p>
                  {isEditing ? (
                    <Input
                      value={pixFees.mdr}
                      onChange={(e) =>
                        onPixFeeChange("mdr", e.target.value, "pos")
                      }
                      className="w-24 h-8 text-sm border rounded px-2"
                    />
                  ) : (
                    <div className="px-3 py-1 text-sm w-24">{pixFees.mdr}%</div>
                  )}
                </div>
                <div className="flex flex-col items-center">
                  <p className="text-sm text-gray-600 mb-2">Custo Mínimo</p>
                  {isEditing ? (
                    <Input
                      value={pixFees.custoMinimo}
                      onChange={(e) =>
                        onPixFeeChange("custoMinimo", e.target.value, "pos")
                      }
                      className="w-24 h-8 text-sm border rounded px-2"
                    />
                  ) : (
                    <div className="px-3 py-1 text-sm w-24">
                      R$ {pixFees.custoMinimo}
                    </div>
                  )}
                </div>
                <div className="flex flex-col items-center">
                  <p className="text-sm text-gray-600 mb-2">Custo Máximo</p>
                  {isEditing ? (
                    <Input
                      value={pixFees.custoMaximo}
                      onChange={(e) =>
                        onPixFeeChange("custoMaximo", e.target.value, "pos")
                      }
                      className="w-24 h-8 text-sm border rounded px-2"
                    />
                  ) : (
                    <div className="px-3 py-1 text-sm w-24">
                      R$ {pixFees.custoMaximo}
                    </div>
                  )}
                </div>
                <div className="flex flex-col items-center">
                  <p className="text-sm text-gray-600 mb-2">Antecipação</p>
                  {isEditing ? (
                    <Input
                      value={pixFees.antecipacao}
                      onChange={(e) =>
                        onPixFeeChange("antecipacao", e.target.value, "pos")
                      }
                      className="w-24 h-8 text-sm border rounded px-2"
                    />
                  ) : (
                    <div className="px-3 py-1 text-sm min-w-fit whitespace-nowrap">
                      {pixFees.antecipacao}% ao mês
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="online">
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 bg-gray-100 p-2 rounded">
              Taxas Transações Online
            </h3>
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left py-2 px-4">Bandeira</th>
                  <th className="text-left py-2 px-4">Crédito à vista</th>
                  <th className="text-left py-2 px-4">Crédito 2-6x</th>
                  <th className="text-left py-2 px-4">Crédito 7-12x</th>
                  <th className="text-left py-2 px-4">Débito</th>
                  <th className="text-left py-2 px-4">Pré-pago</th>
                </tr>
              </thead>
              <tbody>
                {feeData.map((group) => (
                  <tr key={group.id} className="border-t border-gray-200">
                    <td className="py-2 px-4">
                      <div className="flex items-center gap-2">
                        {getCardImage(group.name) && (
                          <img
                            src={getCardImage(group.name)}
                            alt={group.name}
                            width={40}
                            height={24}
                            className="object-contain"
                          />
                        )}
                        <span>{group.name}</span>
                      </div>
                    </td>
                    {/* Crédito à vista */}
                    <td className="py-2 px-4">
                      {isEditing ? (
                        <Input
                          value={
                            group.transactions.credit.vista
                              ?.nonCardTransactionMdr || ""
                          }
                          onChange={(e) =>
                            handleFeeChange(
                              group.id,
                              "credit",
                              "vista",
                              "nonCardTransactionMdr",
                              e.target.value
                            )
                          }
                          className="w-24 h-8 text-sm border rounded px-2"
                        />
                      ) : (
                        <div className="px-3 py-1 text-sm w-24">
                          {
                            group.transactions.credit.vista
                              ?.nonCardTransactionMdr
                          }
                          %
                        </div>
                      )}
                    </td>
                    {/* Crédito 2-6x */}
                    <td className="py-2 px-4">
                      {isEditing ? (
                        <Input
                          value={
                            group.transactions.credit.parcela2_6
                              ?.nonCardTransactionMdr || ""
                          }
                          onChange={(e) =>
                            handleFeeChange(
                              group.id,
                              "credit",
                              "parcela2_6",
                              "nonCardTransactionMdr",
                              e.target.value
                            )
                          }
                          className="w-24 h-8 text-sm border rounded px-2"
                        />
                      ) : (
                        <div className="px-3 py-1 text-sm w-24">
                          {
                            group.transactions.credit.parcela2_6
                              ?.nonCardTransactionMdr
                          }
                          %
                        </div>
                      )}
                    </td>
                    {/* Crédito 7-12x */}
                    <td className="py-2 px-4">
                      {isEditing ? (
                        <Input
                          value={
                            group.transactions.credit.parcela7_12
                              ?.nonCardTransactionMdr || ""
                          }
                          onChange={(e) =>
                            handleFeeChange(
                              group.id,
                              "credit",
                              "parcela7_12",
                              "nonCardTransactionMdr",
                              e.target.value
                            )
                          }
                          className="w-24 h-8 text-sm border rounded px-2"
                        />
                      ) : (
                        <div className="px-3 py-1 text-sm w-24">
                          {
                            group.transactions.credit.parcela7_12
                              ?.nonCardTransactionMdr
                          }
                          %
                        </div>
                      )}
                    </td>
                    {/* Débito */}
                    <td className="py-2 px-4">
                      {isEditing ? (
                        <Input
                          value={
                            group.transactions.debit?.nonCardTransactionMdr ||
                            ""
                          }
                          onChange={(e) =>
                            handleFeeChange(
                              group.id,
                              "debit",
                              null,
                              "nonCardTransactionMdr",
                              e.target.value
                            )
                          }
                          className="w-24 h-8 text-sm border rounded px-2"
                        />
                      ) : (
                        <div className="px-3 py-1 text-sm w-24">
                          {group.transactions.debit?.nonCardTransactionMdr}%
                        </div>
                      )}
                    </td>
                    {/* Pré-pago */}
                    <td className="py-2 px-4">
                      {isEditing ? (
                        <Input
                          value={
                            group.transactions.prepaid?.nonCardTransactionMdr ||
                            ""
                          }
                          onChange={(e) =>
                            handleFeeChange(
                              group.id,
                              "prepaid",
                              null,
                              "nonCardTransactionMdr",
                              e.target.value
                            )
                          }
                          className="w-24 h-8 text-sm border rounded px-2"
                        />
                      ) : (
                        <div className="px-3 py-1 text-sm w-24">
                          {group.transactions.prepaid?.nonCardTransactionMdr}%
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-8 bg-gray-50 rounded-lg p-4 ">
              <h2 className="text-lg font-semibold mb-6 text-gray-800">
                Taxa Pix
              </h2>
              <div className="flex gap-10">
                <div className="flex flex-col items-left">
                  <p className="text-sm text-gray-600 mb-2">MDR</p>
                  {isEditing ? (
                    <Input
                      value={pixFeesOnline.mdr}
                      onChange={(e) =>
                        onPixFeeChange("mdr", e.target.value, "online")
                      }
                      className="w-24 h-8 text-sm border rounded px-2"
                    />
                  ) : (
                    <div className="px-3 py-1 text-sm w-24">
                      {pixFeesOnline.mdr}%
                    </div>
                  )}
                </div>
                <div className="flex flex-col items-center">
                  <p className="text-sm text-gray-600 mb-2">Custo Mínimo</p>
                  {isEditing ? (
                    <Input
                      value={pixFeesOnline.custoMinimo}
                      onChange={(e) =>
                        onPixFeeChange("custoMinimo", e.target.value, "online")
                      }
                      className="w-24 h-8 text-sm border rounded px-2"
                    />
                  ) : (
                    <div className="px-3 py-1 text-sm w-24">
                      R$ {pixFeesOnline.custoMinimo}
                    </div>
                  )}
                </div>
                <div className="flex flex-col items-center">
                  <p className="text-sm text-gray-600 mb-2">Custo Máximo</p>
                  {isEditing ? (
                    <Input
                      value={pixFeesOnline.custoMaximo}
                      onChange={(e) =>
                        onPixFeeChange("custoMaximo", e.target.value, "online")
                      }
                      className="w-24 h-8 text-sm border rounded px-2"
                    />
                  ) : (
                    <div className="px-3 py-1 text-sm w-24">
                      R$ {pixFeesOnline.custoMaximo}
                    </div>
                  )}
                </div>
                <div className="flex flex-col items-center">
                  <p className="text-sm  text-gray-600 mb-2">Antecipação</p>
                  {isEditing ? (
                    <Input
                      value={pixFees.antecipacao}
                      onChange={(e) =>
                        onPixFeeChange("antecipacao", e.target.value, "online")
                      }
                      className="w-24 h-8 text-sm border rounded px-2"
                    />
                  ) : (
                    <div className="px-3 py-1 text-sm min-w-fit whitespace-nowrap">
                      {pixFees.antecipacao}% ao mês
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
