"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MerchantTabsProps } from "@/features/merchant/server/types";
import { Edit } from "lucide-react";
import { useState } from "react";
import MerchantFormAuthorizers from "./merchant-form-authorizers";
import MerchantFormBank from "./merchant-form-bank";
import MerchantFormCompany from "./merchant-form-company";
import MerchantFormcontact from "./merchant-form-contact";
import MerchantFormDocuments from "./merchant-form-documents";
import MerchantFormOperations from "./merchant-form-operation";
import MerchantFormTax2 from "./merchant-form-tax2";

const InfoItem = ({
  label,
  value,
}: {
  label: string;
  value: string | number | null | undefined;
}) => (
  <div className="mb-2">
    <p className="text-sm text-gray-500">{label}</p>
    <p className="font-medium">{value || "-"}</p>
  </div>
);

export default function MerchantDisplay({
  merchant,
  address,
  Contacts,
  configurations,
  pixaccounts,
  cnaeMccList,
  legalNatures,
  establishmentFormatList,
  DDAccountType,
  DDBank,
  merchantPriceGroupProps,
  permissions,
}: MerchantTabsProps) {


  const [activeEditSection, setActiveEditSection] = useState<string | null>(
    null
  );

  const handleEditClick = (section: string) => {
    setActiveEditSection(section === activeEditSection ? null : section);
  };

  

  // Format dates for display
  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      {activeEditSection == null ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Company Card */}
          <Card className="shadow-sm">
            <CardHeader className="bg-gray-50 py-3 flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Dados da Empresa</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleEditClick("company")}
                className="flex items-center gap-1"
              >
                <Edit className="h-4 w-4" />
                Editar
              </Button>
            </CardHeader>
            <CardContent className="p-4">
              {activeEditSection === "company" ? (
                <MerchantFormCompany
                  merchant={{
                    ...merchant,
                    number: String(merchant.number),
                    revenue: String(merchant.revenue),
                    idMerchantPrice: merchant.idMerchantPrice || null,
                    establishmentFormat: merchant.establishmentFormat || "",
                    idCustomer: merchant.idCustomer || null,
                    dtdelete: "",
                  }}
                  address={address}
                  Cnae={merchant.cnae}
                  Mcc={merchant.mcc}
                  DDLegalNature={legalNatures}
                  DDCnaeMcc={cnaeMccList}
                  DDEstablishmentFormat={establishmentFormatList}
                  activeTab="company"
                  setActiveTab={() => {}}
                  permissions={permissions}
                />
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <InfoItem label="Nome Fantasia" value={merchant.name} />
                  <InfoItem
                    label="Razão Social"
                    value={merchant.corporateName}
                  />
                  <InfoItem label="CNPJ" value={merchant.idDocument} />
                  <InfoItem label="E-mail" value={merchant.email} />
                  <InfoItem
                    label="Formato do Estabelecimento"
                    value={
                      establishmentFormatList.find(
                        (f) => f.value === merchant.establishmentFormat
                      )?.label
                    }
                  />
                  <InfoItem
                    label="Natureza Jurídica"
                    value={
                      legalNatures.find(
                        (n) => n.value == merchant.idLegalNature
                      )?.label
                    }
                  />
                  <InfoItem
                    label="Receita"
                    value={
                      merchant.revenue
                        ? `R$ ${Number(merchant.revenue).toFixed(2)}`
                        : "-"
                    }
                  />
                  <InfoItem
                    label="Telefone"
                    value={
                      merchant.areaCode && merchant.number
                        ? `(${merchant.areaCode}) ${merchant.number}`
                        : "-"
                    }
                  />
                  <InfoItem label="CNAE" value={merchant.cnae} />
                  <InfoItem label="MCC" value={merchant.mcc} />
                  <InfoItem
                    label="Data de Abertura"
                    value={formatDate(merchant.openingDate)}
                  />
                  <InfoItem
                    label="Dias de Funcionamento"
                    value={merchant.openingDays}
                  />
                  <InfoItem
                    label="Horário de Funcionamento"
                    value={
                      merchant.openingHour && merchant.closingHour
                        ? `${merchant.openingHour} - ${merchant.closingHour}`
                        : "-"
                    }
                  />

                  <div className="col-span-2 mt-3 border-t pt-3">
                    <p className="font-medium mb-2">Endereço</p>
                    <p>
                      {address.streetAddress}, {address.streetNumber}
                      {address.complement ? `, ${address.complement}` : ""}
                    </p>
                    <p>
                      {address.neighborhood} - {address.city}/{address.state} -{" "}
                      {address.zipCode}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Contact Card */}
          <Card className="shadow-sm">
            <CardHeader className="bg-gray-50 py-3 flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Dados do Responsável</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleEditClick("contact")}
                className="flex items-center gap-1"
              >
                <Edit className="h-4 w-4" />
                Editar
              </Button>
            </CardHeader>
            <CardContent className="p-4">
              {activeEditSection === "contact" ? (
                <MerchantFormcontact
                  Contact={Contacts.contacts}
                  Address={Contacts.addresses}
                  idMerchant={merchant.id}
                  activeTab="contact"
                  setActiveTab={() => {}}
                  permissions={permissions}
                />
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <InfoItem label="Nome" value={Contacts?.contacts?.name} />
                  <InfoItem
                    label="CPF"
                    value={Contacts?.contacts?.idDocument}
                  />
                  <InfoItem label="E-mail" value={Contacts?.contacts?.email} />
                  <InfoItem
                    label="Telefone"
                    value={
                      Contacts?.contacts?.areaCode && Contacts?.contacts?.number
                        ? `(${Contacts.contacts.areaCode}) ${Contacts.contacts.number}`
                        : "-"
                    }
                  />
                  <InfoItem label="RG" value={Contacts?.contacts?.icNumber} />
                  <InfoItem
                    label="Data de Nascimento"
                    value={formatDate(Contacts?.contacts?.birthDate)}
                  />
                  <InfoItem
                    label="É sócio?"
                    value={Contacts?.contacts?.isPartnerContact ? "Sim" : "Não"}
                  />
                  <InfoItem
                    label="É PEP?"
                    value={Contacts?.contacts?.isPep ? "Sim" : "Não"}
                  />

                  <div className="col-span-2 mt-3 border-t pt-3">
                    <p className="font-medium mb-2">Endereço do Responsável</p>
                    <p>
                      {Contacts?.addresses?.streetAddress},{" "}
                      {Contacts?.addresses?.streetNumber}
                      {Contacts?.addresses?.complement
                        ? `, ${Contacts.addresses.complement}`
                        : ""}
                    </p>
                    <p>
                      {Contacts?.addresses?.neighborhood} -{" "}
                      {Contacts?.addresses?.city}/{Contacts?.addresses?.state} -{" "}
                      {Contacts?.addresses?.zipCode}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Operations Card */}
          <Card className="shadow-sm">
            <CardHeader className="bg-gray-50 py-3 flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Dados de Operação</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleEditClick("operation")}
                className="flex items-center gap-1"
              >
                <Edit className="h-4 w-4" />
                Editar
              </Button>
            </CardHeader>
            <CardContent className="p-4">
              {activeEditSection === "operation" ? (
                <MerchantFormOperations
                  Configuration={{
                    id: configurations?.configurations?.id || 0,
                    slug: configurations?.configurations?.slug || null,
                    active: configurations?.configurations?.active || null,
                    dtinsert: configurations?.configurations?.dtinsert || null,
                    dtupdate: configurations?.configurations?.dtupdate || null,
                    lockCpAnticipationOrder:
                      configurations?.configurations?.lockCpAnticipationOrder ||
                      null,
                    lockCnpAnticipationOrder:
                      configurations?.configurations
                        ?.lockCnpAnticipationOrder || null,
                    url: configurations?.configurations?.url || null,
                    anticipationRiskFactorCnp: configurations?.configurations
                      ?.anticipationRiskFactorCnp
                      ? Number(
                          configurations?.configurations
                            ?.anticipationRiskFactorCnp
                        )
                      : null,
                    waitingPeriodCnp: configurations?.configurations
                      ?.waitingPeriodCnp
                      ? Number(configurations?.configurations?.waitingPeriodCnp)
                      : null,
                    anticipationRiskFactorCp: configurations?.configurations
                      ?.anticipationRiskFactorCp
                      ? Number(
                          configurations?.configurations
                            ?.anticipationRiskFactorCp
                        )
                      : null,
                    waitingPeriodCp: configurations?.configurations
                      ?.waitingPeriodCp
                      ? Number(configurations?.configurations?.waitingPeriodCp)
                      : null,
                  }}
                  hasTaf={merchant.hasTef}
                  hastop={merchant.hasTop}
                  hasPix={merchant.hasPix}
                  merhcnatSlug={merchant.slugCategory || ""}
                  timezone={merchant.timezone || ""}
                  idMerchant={merchant.id}
                  activeTab="operation"
                  setActiveTab={() => {}}
                  permissions={permissions}
                  idConfiguration={merchant.idConfiguration || undefined}
                />
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <InfoItem
                    label="Possui Tef"
                    value={merchant.hasTef ? "Sim" : "Não"}
                  />
                  <InfoItem
                    label="Possui Top"
                    value={merchant.hasTop ? "Sim" : "Não"}
                  />
                  <InfoItem
                    label="Possui Pix"
                    value={merchant.hasPix ? "Sim" : "Não"}
                  />
                  <InfoItem label="Timezone" value={merchant.timezone} />

                  <div className="col-span-2 mt-2">
                    <p className="font-medium mb-2">Configurações</p>
                    <div className="grid grid-cols-2 gap-4">
                      <InfoItem
                        label="URL"
                        value={configurations?.configurations?.url}
                      />
                      <InfoItem
                        label="Bloquear Antecipação CP"
                        value={
                          configurations?.configurations
                            ?.lockCpAnticipationOrder
                            ? "Sim"
                            : "Não"
                        }
                      />
                      <InfoItem
                        label="Bloquear Antecipação CNP"
                        value={
                          configurations?.configurations
                            ?.lockCnpAnticipationOrder
                            ? "Sim"
                            : "Não"
                        }
                      />
                      <InfoItem
                        label="Fator de Risco Antecipação CP"
                        value={
                          configurations?.configurations
                            ?.anticipationRiskFactorCp
                        }
                      />
                      <InfoItem
                        label="Fator de Risco Antecipação CNP"
                        value={
                          configurations?.configurations
                            ?.anticipationRiskFactorCnp
                        }
                      />
                      <InfoItem
                        label="Período de Espera CP"
                        value={configurations?.configurations?.waitingPeriodCp}
                      />
                      <InfoItem
                        label="Período de Espera CNP"
                        value={configurations?.configurations?.waitingPeriodCnp}
                      />
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Bank Card */}
          {permissions?.includes("Configurar dados Bancários") && (
            <Card className="shadow-sm">
              <CardHeader className="bg-gray-50 py-3 flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Dados Bancários</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEditClick("bank")}
                  className="flex items-center gap-1"
                >
                  <Edit className="h-4 w-4" />
                  Editar
                </Button>
              </CardHeader>
              <CardContent className="p-4">
                {activeEditSection === "bank" ? (
                  <MerchantFormBank
                    merchantpixaccount={{
                      id: pixaccounts?.pixaccounts?.id || 0,
                      slug: pixaccounts?.pixaccounts?.slug || null,
                      active: pixaccounts?.pixaccounts?.active || null,
                      dtinsert: pixaccounts?.pixaccounts?.dtinsert || null,
                      idAccount: pixaccounts?.pixaccounts?.idAccount || null,
                      bankAccountType:
                        pixaccounts?.pixaccounts?.bankAccountType || null,
                      bankAccountStatus:
                        pixaccounts?.pixaccounts?.bankAccountStatus || null,
                      onboardingPixStatus:
                        pixaccounts?.pixaccounts?.onboardingPixStatus || null,
                      message: pixaccounts?.pixaccounts?.message || null,
                      dtupdate: pixaccounts?.pixaccounts?.dtupdate || null,
                      idMerchant: pixaccounts?.pixaccounts?.idMerchant || null,
                      slugMerchant:
                        pixaccounts?.pixaccounts?.slugMerchant || null,
                      idRegistration:
                        pixaccounts?.pixaccounts?.idRegistration || null,
                      bankNumber: pixaccounts?.pixaccounts?.bankNumber || null,
                      bankBranchNumber:
                        pixaccounts?.pixaccounts?.bankBranchNumber || null,
                      bankBranchDigit:
                        pixaccounts?.pixaccounts?.bankBranchDigit || null,
                      bankAccountNumber:
                        pixaccounts?.pixaccounts?.bankAccountNumber || null,
                      bankAccountDigit:
                        pixaccounts?.pixaccounts?.bankAccountDigit || null,
                      bankName: pixaccounts?.pixaccounts?.bankName || null,
                    }}
                    merchantcorporateName={merchant.corporateName || ""}
                    merchantdocumentId={merchant.idDocument || ""}
                    legalPerson={merchant.legalPerson || ""}
                    activeTab="bank"
                    idMerchant={merchant.id}
                    setActiveTab={() => {}}
                    DDAccountType={DDAccountType}
                    DDBank={DDBank}
                    permissions={permissions}
                  />
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    <InfoItem
                      label="Banco"
                      value={`${pixaccounts?.pixaccounts?.bankNumber || ""} - ${
                        pixaccounts?.pixaccounts?.bankName || ""
                      }`}
                    />
                    <InfoItem
                      label="Tipo de Conta"
                      value={
                        DDAccountType.find(
                          (t) =>
                            t.value ===
                            pixaccounts?.pixaccounts?.bankAccountType
                        )?.label || pixaccounts?.pixaccounts?.bankAccountType
                      }
                    />
                    <InfoItem
                      label="Agência"
                      value={`${
                        pixaccounts?.pixaccounts?.bankBranchNumber || ""
                      }${
                        pixaccounts?.pixaccounts?.bankBranchDigit
                          ? `-${pixaccounts?.pixaccounts?.bankBranchDigit}`
                          : ""
                      }`}
                    />
                    <InfoItem
                      label="Conta"
                      value={`${
                        pixaccounts?.pixaccounts?.bankAccountNumber || ""
                      }${
                        pixaccounts?.pixaccounts?.bankAccountDigit
                          ? `-${pixaccounts?.pixaccounts?.bankAccountDigit}`
                          : ""
                      }`}
                    />
                    <InfoItem
                      label="Status da Conta"
                      value={pixaccounts?.pixaccounts?.bankAccountStatus}
                    />
                    <InfoItem
                      label="Status Onboarding PIX"
                      value={pixaccounts?.pixaccounts?.onboardingPixStatus}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Authorizers Card */}
          <Card className="shadow-sm">
            <CardHeader className="bg-gray-50 py-3 flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Autorizados</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleEditClick("authorizers")}
                className="flex items-center gap-1"
              >
                <Edit className="h-4 w-4" />
                Editar
              </Button>
            </CardHeader>
            <CardContent className="p-4">
              {activeEditSection === "authorizers" ? (
                <MerchantFormAuthorizers />
              ) : (
                <div className="text-center py-4 text-gray-500">
                  <p>Clique em Editar para gerenciar autorizadores</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Taxes Card */}
          {permissions?.includes("Configurar Taxas do EC") && (
            <Card className="shadow-sm">
              <CardHeader className="bg-gray-50 py-3 flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Taxas de Transação</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEditClick("taxes")}
                  className="flex items-center gap-1"
                >
                  <Edit className="h-4 w-4" />
                  Editar
                </Button>
              </CardHeader>
              <CardContent className="p-4">
                {activeEditSection === "taxes" ? (
                  <MerchantFormTax2
                    merchantprice={[
                      {
                        id: merchantPriceGroupProps?.merchantPrice?.id || 0,
                        name:
                          merchantPriceGroupProps?.merchantPrice?.name || "",
                        active:
                          merchantPriceGroupProps?.merchantPrice?.active ||
                          false,
                        dtinsert:
                          merchantPriceGroupProps?.merchantPrice?.dtinsert ||
                          "",
                        dtupdate:
                          merchantPriceGroupProps?.merchantPrice?.dtupdate ||
                          "",
                        tableType:
                          merchantPriceGroupProps?.merchantPrice?.tableType ||
                          "",
                        slugMerchant:
                          merchantPriceGroupProps?.merchantPrice
                            ?.slugMerchant || "",
                        compulsoryAnticipationConfig:
                          merchantPriceGroupProps?.merchantPrice
                            ?.compulsoryAnticipationConfig || 0,
                        anticipationType:
                          merchantPriceGroupProps?.merchantPrice
                            ?.anticipationType || "",
                        eventualAnticipationFee:
                          merchantPriceGroupProps?.merchantPrice
                            ?.eventualAnticipationFee || 0,
                        cardPixMdr:
                          merchantPriceGroupProps?.merchantPrice?.cardPixMdr ||
                          0,
                        cardPixCeilingFee:
                          merchantPriceGroupProps?.merchantPrice
                            ?.cardPixCeilingFee || 0,
                        cardPixMinimumCostFee:
                          merchantPriceGroupProps?.merchantPrice
                            ?.cardPixMinimumCostFee || 0,
                        nonCardPixMdr:
                          merchantPriceGroupProps?.merchantPrice
                            ?.nonCardPixMdr || 0,
                        nonCardPixCeilingFee:
                          merchantPriceGroupProps?.merchantPrice
                            ?.nonCardPixCeilingFee || 0,
                        nonCardPixMinimumCostFee:
                          merchantPriceGroupProps?.merchantPrice
                            ?.nonCardPixMinimumCostFee || 0,
                        merchantpricegroup:
                          merchantPriceGroupProps?.merchantpricegroup || [],
                      },
                    ]}
                    idMerchantPrice={merchant.idMerchantPrice || 0}
                    permissions={permissions}
                  />
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    <InfoItem
                      label="Nome da Tabela"
                      value={merchantPriceGroupProps?.merchantPrice?.name}
                    />
                    <InfoItem
                      label="Tipo de Tabela"
                      value={merchantPriceGroupProps?.merchantPrice?.tableType}
                    />
                    <InfoItem
                      label="Tipo de Antecipação"
                      value={
                        merchantPriceGroupProps?.merchantPrice?.anticipationType
                      }
                    />
                    <InfoItem
                      label="Taxa de Antecipação Eventual"
                      value={`${
                        merchantPriceGroupProps?.merchantPrice
                          ?.eventualAnticipationFee || 0
                      }%`}
                    />

                    <div className="col-span-2 mt-2">
                      <p className="font-medium mb-2">Taxas PIX</p>
                      <div className="grid grid-cols-2 gap-4">
                        <InfoItem
                          label="MDR PIX com Cartão"
                          value={`${
                            merchantPriceGroupProps?.merchantPrice
                              ?.cardPixMdr || 0
                          }%`}
                        />
                        <InfoItem
                          label="Taxa Teto PIX com Cartão"
                          value={`R$ ${
                            merchantPriceGroupProps?.merchantPrice
                              ?.cardPixCeilingFee || 0
                          }`}
                        />
                        <InfoItem
                          label="Taxa Mínima PIX com Cartão"
                          value={`R$ ${
                            merchantPriceGroupProps?.merchantPrice
                              ?.cardPixMinimumCostFee || 0
                          }`}
                        />
                        <InfoItem
                          label="MDR PIX sem Cartão"
                          value={`${
                            merchantPriceGroupProps?.merchantPrice
                              ?.nonCardPixMdr || 0
                          }%`}
                        />
                        <InfoItem
                          label="Taxa Teto PIX sem Cartão"
                          value={`R$ ${
                            merchantPriceGroupProps?.merchantPrice
                              ?.nonCardPixCeilingFee || 0
                          }`}
                        />
                        <InfoItem
                          label="Taxa Mínima PIX sem Cartão"
                          value={`R$ ${
                            merchantPriceGroupProps?.merchantPrice
                              ?.nonCardPixMinimumCostFee || 0
                          }`}
                        />
                      </div>
                    </div>

                    {merchantPriceGroupProps?.merchantpricegroup?.length >
                      0 && (
                      <div className="col-span-2 mt-2">
                        <p className="font-medium mb-2">Grupos de Preço</p>
                        {merchantPriceGroupProps.merchantpricegroup.map(
                          (group, index) => (
                            <div key={index} className="mb-3 pb-2 border-b">
                              <p className="font-medium">{group.name}</p>
                              <p className="text-sm">
                                Total de taxas:{" "}
                                {group.listMerchantTransactionPrice?.length ||
                                  0}
                              </p>
                            </div>
                          )
                        )}
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Documents Card */}
          {permissions?.includes("Inserir documentos EC") && (
            <Card className="shadow-sm">
              <CardHeader className="bg-gray-50 py-3 flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Documentos</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEditClick("documents")}
                  className="flex items-center gap-1"
                >
                  <Edit className="h-4 w-4" />
                  Editar
                </Button>
              </CardHeader>
              <CardContent className="p-4">
                {activeEditSection === "documents" ? (
                  <MerchantFormDocuments
                    merchantId={merchant.id.toString()}
                    permissions={permissions}
                  />
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    <p>Clique em Editar para gerenciar documentos</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      ) : (
        <div>
          <div className="mb-6 flex items-center">
            <Button
              variant="outline"
              onClick={() => setActiveEditSection(null)}
              className="flex items-center gap-2"
            >
              Voltar
            </Button>
          </div>

          {activeEditSection === "company" && (
            <MerchantFormCompany
              merchant={{
                ...merchant,
                number: String(merchant.number),
                revenue: String(merchant.revenue),
                idMerchantPrice: merchant.idMerchantPrice || null,
                establishmentFormat: merchant.establishmentFormat || "",
                idCustomer: merchant.idCustomer || null,
                dtdelete: "",
              }}
              address={address}
              Cnae={merchant.cnae}
              Mcc={merchant.mcc}
              DDLegalNature={legalNatures}
              DDCnaeMcc={cnaeMccList}
              DDEstablishmentFormat={establishmentFormatList}
              activeTab="company"
              setActiveTab={() => {}}
              permissions={permissions}
            />
          )}

          {activeEditSection === "contact" && (
            <MerchantFormcontact
              Contact={Contacts.contacts}
              Address={Contacts.addresses}
              idMerchant={merchant.id}
              activeTab="contact"
              setActiveTab={() => {}}
              permissions={permissions}
            />
          )}

          {activeEditSection === "operation" && (
            <MerchantFormOperations
              Configuration={{
                id: configurations?.configurations?.id || 0,
                slug: configurations?.configurations?.slug || null,
                active: configurations?.configurations?.active || null,
                dtinsert: configurations?.configurations?.dtinsert || null,
                dtupdate: configurations?.configurations?.dtupdate || null,
                lockCpAnticipationOrder:
                  configurations?.configurations?.lockCpAnticipationOrder ||
                  null,
                lockCnpAnticipationOrder:
                  configurations?.configurations?.lockCnpAnticipationOrder ||
                  null,
                url: configurations?.configurations?.url || null,
                anticipationRiskFactorCnp: configurations?.configurations
                  ?.anticipationRiskFactorCnp
                  ? Number(
                      configurations?.configurations?.anticipationRiskFactorCnp
                    )
                  : null,
                waitingPeriodCnp: configurations?.configurations
                  ?.waitingPeriodCnp
                  ? Number(configurations?.configurations?.waitingPeriodCnp)
                  : null,
                anticipationRiskFactorCp: configurations?.configurations
                  ?.anticipationRiskFactorCp
                  ? Number(
                      configurations?.configurations?.anticipationRiskFactorCp
                    )
                  : null,
                waitingPeriodCp: configurations?.configurations?.waitingPeriodCp
                  ? Number(configurations?.configurations?.waitingPeriodCp)
                  : null,
              }}
              hasTaf={merchant.hasTef}
              hastop={merchant.hasTop}
              hasPix={merchant.hasPix}
              merhcnatSlug={merchant.slugCategory || ""}
              timezone={merchant.timezone || ""}
              idMerchant={merchant.id}
              activeTab="operation"
              setActiveTab={() => {}}
              permissions={permissions}
              idConfiguration={merchant.idConfiguration || undefined}
            />
          )}

          {activeEditSection === "bank" && (
            <MerchantFormBank
              merchantpixaccount={{
                id: pixaccounts?.pixaccounts?.id || 0,
                slug: pixaccounts?.pixaccounts?.slug || null,
                active: pixaccounts?.pixaccounts?.active || null,
                dtinsert: pixaccounts?.pixaccounts?.dtinsert || null,
                idAccount: pixaccounts?.pixaccounts?.idAccount || null,
                bankAccountType:
                  pixaccounts?.pixaccounts?.bankAccountType || null,
                bankAccountStatus:
                  pixaccounts?.pixaccounts?.bankAccountStatus || null,
                onboardingPixStatus:
                  pixaccounts?.pixaccounts?.onboardingPixStatus || null,
                message: pixaccounts?.pixaccounts?.message || null,
                dtupdate: pixaccounts?.pixaccounts?.dtupdate || null,
                idMerchant: pixaccounts?.pixaccounts?.idMerchant || null,
                slugMerchant: pixaccounts?.pixaccounts?.slugMerchant || null,
                idRegistration:
                  pixaccounts?.pixaccounts?.idRegistration || null,
                bankNumber: pixaccounts?.pixaccounts?.bankNumber || null,
                bankBranchNumber:
                  pixaccounts?.pixaccounts?.bankBranchNumber || null,
                bankBranchDigit:
                  pixaccounts?.pixaccounts?.bankBranchDigit || null,
                bankAccountNumber:
                  pixaccounts?.pixaccounts?.bankAccountNumber || null,
                bankAccountDigit:
                  pixaccounts?.pixaccounts?.bankAccountDigit || null,
                bankName: pixaccounts?.pixaccounts?.bankName || null,
              }}
              merchantcorporateName={merchant.corporateName || ""}
              merchantdocumentId={merchant.idDocument || ""}
              legalPerson={merchant.legalPerson || ""}
              activeTab="bank"
              idMerchant={merchant.id}
              setActiveTab={() => {}}
              DDAccountType={DDAccountType}
              DDBank={DDBank}
              permissions={permissions}
            />
          )}

          {activeEditSection === "authorizers" && <MerchantFormAuthorizers />}

          {activeEditSection === "taxes" && (
            <MerchantFormTax2
              merchantprice={[
                {
                  id: merchantPriceGroupProps?.merchantPrice?.id || 0,
                  name: merchantPriceGroupProps?.merchantPrice?.name || "",
                  active:
                    merchantPriceGroupProps?.merchantPrice?.active || false,
                  dtinsert:
                    merchantPriceGroupProps?.merchantPrice?.dtinsert || "",
                  dtupdate:
                    merchantPriceGroupProps?.merchantPrice?.dtupdate || "",
                  tableType:
                    merchantPriceGroupProps?.merchantPrice?.tableType || "",
                  slugMerchant:
                    merchantPriceGroupProps?.merchantPrice?.slugMerchant || "",
                  compulsoryAnticipationConfig:
                    merchantPriceGroupProps?.merchantPrice
                      ?.compulsoryAnticipationConfig || 0,
                  anticipationType:
                    merchantPriceGroupProps?.merchantPrice?.anticipationType ||
                    "",
                  eventualAnticipationFee:
                    merchantPriceGroupProps?.merchantPrice
                      ?.eventualAnticipationFee || 0,
                  cardPixMdr:
                    merchantPriceGroupProps?.merchantPrice?.cardPixMdr || 0,
                  cardPixCeilingFee:
                    merchantPriceGroupProps?.merchantPrice?.cardPixCeilingFee ||
                    0,
                  cardPixMinimumCostFee:
                    merchantPriceGroupProps?.merchantPrice
                      ?.cardPixMinimumCostFee || 0,
                  nonCardPixMdr:
                    merchantPriceGroupProps?.merchantPrice?.nonCardPixMdr || 0,
                  nonCardPixCeilingFee:
                    merchantPriceGroupProps?.merchantPrice
                      ?.nonCardPixCeilingFee || 0,
                  nonCardPixMinimumCostFee:
                    merchantPriceGroupProps?.merchantPrice
                      ?.nonCardPixMinimumCostFee || 0,
                  merchantpricegroup:
                    merchantPriceGroupProps?.merchantpricegroup || [],
                },
              ]}
              idMerchantPrice={merchant.idMerchantPrice || 0}
              permissions={permissions}
            />
          )}

          {activeEditSection === "documents" && (
            <MerchantFormDocuments
              merchantId={merchant.id.toString()}
              permissions={permissions}
            />
          )}
        </div>
      )}
    </div>
  );
}
