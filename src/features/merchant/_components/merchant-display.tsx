"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MerchantTabsProps } from "@/features/merchant/server/types";
import { Edit, ExternalLink, FileText } from "lucide-react";
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
  <div className="mb-1">
    <p className="text-xs text-gray-500">{label}</p>
    <p className="text-sm font-medium">{value || "-"}</p>
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
  merchantFiles = [],
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
    <div className="space-y-4">
      {activeEditSection == null ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Company Card */}
          <Card className="shadow-sm">
            <CardHeader className="bg-gray-50 py-2 flex flex-row items-center justify-between">
              <CardTitle className="text-base">Dados da Empresa</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleEditClick("company")}
                className="flex items-center gap-1 h-7"
              >
                <Edit className="h-3 w-3" />
                Editar
              </Button>
            </CardHeader>
            <CardContent className="p-3">
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
                <div className="grid grid-cols-2 gap-2">
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
                    value={
                      merchant.openingDays
                        ? merchant.openingDays
                            .split("")
                            .map((day, index) => {
                              const dias = [
                                "Dom",
                                "Seg",
                                "Ter",
                                "Qua",
                                "Qui",
                                "Sex",
                                "Sáb",
                              ];
                              return day === "1" ? dias[index] : null;
                            })
                            .filter(Boolean)
                            .join(", ")
                        : "-"
                    }
                  />
                  <InfoItem
                    label="Horário de Funcionamento"
                    value={
                      merchant.openingHour && merchant.closingHour
                        ? `Das ${merchant.openingHour} As ${merchant.closingHour}`
                        : "-"
                    }
                  />

                  <div className="col-span-2 mt-2 border-t pt-2">
                    <p className="font-medium mb-1 text-sm">Endereço</p>
                    <div className="grid grid-cols-2 gap-2">
                      <InfoItem label="CEP" value={address.zipCode} />
                      <InfoItem
                        label="Logradouro"
                        value={address.streetAddress}
                      />
                      <InfoItem label="Número" value={address.streetNumber} />
                      <InfoItem
                        label="Complemento"
                        value={address.complement}
                      />
                      <InfoItem label="Bairro" value={address.neighborhood} />
                      <InfoItem label="Cidade" value={address.city} />
                      <InfoItem label="Estado" value={address.state} />
                      <InfoItem label="País" value={address.country} />
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Contact Card */}
          <Card className="shadow-sm">
            <CardHeader className="bg-gray-50 py-2 flex flex-row items-center justify-between">
              <CardTitle className="text-base">Dados do Responsável</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleEditClick("contact")}
                className="flex items-center gap-1 h-7"
              >
                <Edit className="h-3 w-3" />
                Editar
              </Button>
            </CardHeader>
            <CardContent className="p-3">
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
                <div className="grid grid-cols-2 gap-2">
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
                    label="Sócio ou Proprietário"
                    value={Contacts?.contacts?.isPartnerContact ? "Sim" : "Não"}
                  />
                  <InfoItem
                    label="PEP"
                    value={Contacts?.contacts?.isPep ? "Sim" : "Não"}
                  />

                  <div className="col-span-2 mt-2 border-t pt-2">
                    <p className="font-medium mb-1 text-sm">
                      Endereço do Responsável
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      <InfoItem
                        label="CEP"
                        value={Contacts?.addresses?.zipCode}
                      />
                      <InfoItem
                        label="Logradouro"
                        value={Contacts?.addresses?.streetAddress}
                      />
                      <InfoItem
                        label="Número"
                        value={Contacts?.addresses?.streetNumber}
                      />
                      <InfoItem
                        label="Complemento"
                        value={Contacts?.addresses?.complement}
                      />
                      <InfoItem
                        label="Bairro"
                        value={Contacts?.addresses?.neighborhood}
                      />
                      <InfoItem
                        label="Cidade"
                        value={Contacts?.addresses?.city}
                      />
                      <InfoItem
                        label="Estado"
                        value={Contacts?.addresses?.state}
                      />
                      <InfoItem
                        label="País"
                        value={Contacts?.addresses?.country}
                      />
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Operations Card */}
          <Card className="shadow-sm">
            <CardHeader className="bg-gray-50 py-2 flex flex-row items-center justify-between">
              <CardTitle className="text-base">Dados de Operação</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleEditClick("operation")}
                className="flex items-center gap-1 h-7"
              >
                <Edit className="h-3 w-3" />
                Editar
              </Button>
            </CardHeader>
            <CardContent className="p-3">
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
                <div className="grid grid-cols-2 gap-2">
                  <InfoItem
                    label="Terminal TEF"
                    value={merchant.hasTef ? "Sim" : "Não"}
                  />
                  <InfoItem
                    label="Terminal Tap On Phone"
                    value={merchant.hasTop ? "Sim" : "Não"}
                  />
                  <InfoItem
                    label="Pix"
                    value={merchant.hasPix ? "Sim" : "Não"}
                  />
                  <InfoItem
                    label="Timezone"
                    value={
                      merchant.timezone
                        ? merchant.timezone === "-0300"
                          ? "(UTC-03:00) Brasilia"
                          : merchant.timezone
                        : "-"
                    }
                  />

                  <div className="col-span-2 mt-2">
                    <p className="font-medium mb-1 text-sm">Configurações</p>
                    <div className="grid grid-cols-2 gap-2">
                      <InfoItem
                        label="URL"
                        value={configurations?.configurations?.url}
                      />
                      <InfoItem
                        label="Bloqueio da Antecipação CP"
                        value={
                          configurations?.configurations
                            ?.lockCpAnticipationOrder
                            ? "Ativo"
                            : "Bloqueado"
                        }
                      />
                      <InfoItem
                        label="Bloqueio da Antecipação CNP"
                        value={
                          configurations?.configurations
                            ?.lockCnpAnticipationOrder
                            ? "Ativo"
                            : "Bloqueado"
                        }
                      />
                      <InfoItem
                        label="Valor Cartão Presente antecipável"
                        value={
                          configurations?.configurations
                            ?.anticipationRiskFactorCp
                            ? `${configurations?.configurations?.anticipationRiskFactorCp}%`
                            : "-"
                        }
                      />
                      <InfoItem
                        label="Valor Cartão Presente antecipável"
                        value={
                          configurations?.configurations
                            ?.anticipationRiskFactorCnp
                            ? `${configurations?.configurations?.anticipationRiskFactorCnp}%`
                            : "-"
                        }
                      />
                      <InfoItem
                        label="Carência de Antecipação Cartão Presente"
                        value={
                          configurations?.configurations?.waitingPeriodCp
                            ? `${configurations?.configurations?.waitingPeriodCp} dias`
                            : "-"
                        }
                      />
                      <InfoItem
                        label="Carência de Antecipação Cartão Presente"
                        value={
                          configurations?.configurations?.waitingPeriodCnp
                            ? `${configurations?.configurations?.waitingPeriodCnp} dias`
                            : "-"
                        }
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
              <CardHeader className="bg-gray-50 py-2 flex flex-row items-center justify-between">
                <CardTitle className="text-base">Dados Bancários</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEditClick("bank")}
                  className="flex items-center gap-1 h-7"
                >
                  <Edit className="h-3 w-3" />
                  Editar
                </Button>
              </CardHeader>
              <CardContent className="p-3">
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
                  <div className="grid grid-cols-2 gap-2">
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

          {/* Taxes Card */}
          {permissions?.includes("Configurar Taxas do EC") && (
            <Card className="shadow-sm col-span-1 md:col-span-2">
              <CardHeader className="bg-gray-50 py-2 flex flex-row items-center justify-between">
                <CardTitle className="text-base">Taxas de Transação</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEditClick("taxes")}
                  className="flex items-center gap-1 h-7"
                >
                  <Edit className="h-3 w-3" />
                  Editar
                </Button>
              </CardHeader>
              <CardContent className="p-3">
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
                  <div className="scale-[0.85] transform origin-top-left w-[117%] overflow-x-auto">
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
                            merchantPriceGroupProps?.merchantPrice
                              ?.cardPixMdr || 0,
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
                      permissions={[]}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Documents and Authorizers Cards Row */}
          <div className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Documents Card */}
            {permissions?.includes("Inserir documentos EC") && (
              <Card className="shadow-sm">
                <CardHeader className="bg-gray-50 py-2 flex flex-row items-center justify-between">
                  <CardTitle className="text-base">Documentos</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditClick("documents")}
                    className="flex items-center gap-1 h-7"
                  >
                    <Edit className="h-3 w-3" />
                    Editar
                  </Button>
                </CardHeader>
                <CardContent className="p-3">
                  {activeEditSection === "documents" ? (
                    <MerchantFormDocuments
                      merchantId={merchant.id.toString()}
                      permissions={permissions}
                    />
                  ) : (
                    <div className="py-2">
                      {merchantFiles.length > 0 ? (
                        <div className="space-y-2">
                          <p className="text-sm font-medium">
                            Documentos disponíveis:
                          </p>
                          <div className="grid grid-cols-1 gap-2 mt-2">
                            {merchantFiles.map((file) => (
                              <div
                                key={file.id}
                                className="flex items-center border p-2 rounded-md"
                              >
                                <FileText className="h-5 w-5 mr-2 text-gray-500" />
                                <span className="text-sm flex-1 truncate">
                                  {file.fileName}
                                </span>
                                <a
                                  href={file.fileUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-primary hover:text-primary/80 ml-2"
                                >
                                  <ExternalLink className="h-4 w-4" />
                                </a>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-4 text-gray-500">
                          <p>Clique em Editar para gerenciar documentos</p>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Authorizers Card */}
            <Card className="shadow-sm">
              <CardHeader className="bg-gray-50 py-2 flex flex-row items-center justify-between">
                <CardTitle className="text-base">Autorizados</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEditClick("authorizers")}
                  className="flex items-center gap-1 h-7"
                >
                  <Edit className="h-3 w-3" />
                  Editar
                </Button>
              </CardHeader>
              <CardContent className="p-3">
                {activeEditSection === "authorizers" ? (
                  <MerchantFormAuthorizers />
                ) : (
                  <div className="text-center py-3 text-gray-500 text-sm">
                    <p>Clique em Editar para gerenciar autorizadores</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        <div>
          <div className="mb-4 flex items-center">
            <Button
              variant="outline"
              onClick={() => setActiveEditSection(null)}
              className="flex items-center gap-1 text-sm h-8"
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
