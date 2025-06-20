"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import MerchantFormBank from "@/features/merchant/_components/merchant-form-bank";
import MerchantFormBankAccount from "@/features/merchant/_components/merchant-form-bank-account";
import { MerchantTabsProps } from "@/features/merchant/server/types";
import { Edit, ExternalLink, FileText, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import MerchantFormAuthorizers from "./merchant-form-authorizers";
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
  merchantBankAccount,
  cnaeMccList,
  legalNatures,
  establishmentFormatList,
  DDAccountType,
  DDBank,
  merchantPriceGroupProps,
  permissions,
  merchantPixAccount,
  merchantFiles = [],
}: MerchantTabsProps) {
  const router = useRouter();
  const [activeEditSection, setActiveEditSection] = useState<string | null>(
    null
  );
  const [isDeleting, setIsDeleting] = useState(false);

  const handleEditClick = (section: string) => {
    setActiveEditSection(section === activeEditSection ? null : section);
  };

  // Format dates for display
  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString();
  };

  const handleSoftDelete = async () => {
    try {
      setIsDeleting(true);
      const response = await fetch(
        `/api/merchants/soft-delete/${merchant.id}`,
        {
          method: "DELETE",
        }
      );

      const result = await response.json();

      if (response.ok) {
        toast.success(
          result.message || "Estabelecimento desativado com sucesso"
        );
        // Redirecionar para a lista de merchants após desativar
        router.push("/portal/merchants");
      } else {
        toast.error(result.error || "Erro ao desativar estabelecimento");
      }
    } catch (error) {
      console.error("Erro ao desativar estabelecimento:", error);
      toast.error("Ocorreu um erro ao desativar o estabelecimento");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Cabeçalho com botão de desativar */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">{merchant.name}</h2>
        {merchant.active && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                size="sm"
                className="flex items-center gap-1"
              >
                <Trash2 className="h-4 w-4" />
                Desativar Estabelecimento
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Desativar Estabelecimento</AlertDialogTitle>
                <AlertDialogDescription>
                  Tem certeza que deseja desativar o Estabelecimento{" "}
                  {merchant.name}?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleSoftDelete}
                  disabled={isDeleting}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {isDeleting ? "Desativando..." : "Desativar"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>

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
                    idMerchantBankAccount: null,
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
                  <MerchantFormBankAccount
                    merchantBankAccount={{
                      id: merchantBankAccount?.merchantBankAccount?.id || 0,
                      documentId:
                        merchantBankAccount?.merchantBankAccount?.documentId ||
                        "",
                      corporateName:
                        merchantBankAccount?.merchantBankAccount
                          ?.corporateName || "",
                      legalPerson:
                        merchantBankAccount?.merchantBankAccount?.legalPerson ||
                        "JURIDICAL",
                      bankBranchNumber:
                        merchantBankAccount?.merchantBankAccount
                          ?.bankBranchNumber || "",
                      bankBranchCheckDigit:
                        merchantBankAccount?.merchantBankAccount
                          ?.bankBranchCheckDigit || "",
                      accountNumber:
                        merchantBankAccount?.merchantBankAccount
                          ?.accountNumber || "",
                      accountNumberCheckDigit:
                        merchantBankAccount?.merchantBankAccount
                          ?.accountNumberCheckDigit || "",
                      accountType:
                        merchantBankAccount?.merchantBankAccount?.accountType ||
                        "",
                      compeCode:
                        merchantBankAccount?.merchantBankAccount?.compeCode ||
                        "",
                      dtinsert:
                        merchantBankAccount?.merchantBankAccount?.dtinsert ||
                        "",
                      dtupdate:
                        merchantBankAccount?.merchantBankAccount?.dtupdate ||
                        "",
                      active:
                        merchantBankAccount?.merchantBankAccount?.active ||
                        null,
                      slug:
                        merchantBankAccount?.merchantBankAccount?.slug || null,
                    }}
                    DDBank={DDBank}
                    idMerchant={merchant.id}
                    accountTypeDD={DDAccountType}
                    permissions={permissions}
                    merchantcorporateName={merchant.corporateName || ""}
                    merchantdocumentId={merchant.idDocument || ""}
                    activeTab={""}
                    setActiveTab={() => {}}
                    hasPix={merchant.hasPix || false}
                    merchantpixaccount={merchantPixAccount?.pixaccounts}
                  />
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <InfoItem
                      label="Banco"
                      value={`${
                        merchantBankAccount?.merchantBankAccount
                          ?.bankBranchNumber || ""
                      } - ${
                        merchantBankAccount?.merchantBankAccount
                          ?.bankBranchCheckDigit || ""
                      }`}
                    />
                    <InfoItem
                      label="Tipo de Conta"
                      value={
                        DDAccountType.find(
                          (t) =>
                            t.value ===
                            merchantBankAccount?.merchantBankAccount
                              ?.accountType
                        )?.label ||
                        merchantBankAccount?.merchantBankAccount?.accountType
                      }
                    />
                    <InfoItem
                      label="Agência"
                      value={`${
                        merchantBankAccount?.merchantBankAccount
                          ?.bankBranchNumber || ""
                      }${
                        merchantBankAccount?.merchantBankAccount
                          ?.bankBranchCheckDigit
                          ? `-${merchantBankAccount?.merchantBankAccount?.bankBranchCheckDigit}`
                          : ""
                      }`}
                    />
                    <InfoItem
                      label="Conta"
                      value={`${
                        merchantBankAccount?.merchantBankAccount
                          ?.accountNumber || ""
                      }${
                        merchantBankAccount?.merchantBankAccount
                          ?.accountNumberCheckDigit
                          ? `-${merchantBankAccount?.merchantBankAccount?.accountNumberCheckDigit}`
                          : ""
                      }`}
                    />
                    <InfoItem
                      label="Status da Conta"
                      value={
                        merchantBankAccount?.merchantBankAccount?.active
                          ? "Ativo"
                          : "Inativo"
                      }
                    />
                    <InfoItem
                      label="Código do Banco"
                      value={
                        merchantBankAccount?.merchantBankAccount?.compeCode ||
                        ""
                      }
                    />
                    <InfoItem
                      label="Tipo de Pessoa"
                      value={
                        merchantBankAccount?.merchantBankAccount
                          ?.legalPerson === "JURIDICAL"
                          ? "Pessoa Jurídica"
                          : "Pessoa Física"
                      }
                    />
                    <InfoItem
                      label="Cnpj"
                      value={
                        merchantBankAccount?.merchantBankAccount?.documentId ||
                        ""
                      }
                    />
                    <InfoItem
                      label="Nome Corporativo"
                      value={
                        merchantBankAccount?.merchantBankAccount
                          ?.corporateName || ""
                      }
                    />
                    <InfoItem
                      label="Data de Inserção"
                      value={formatDate(
                        merchantBankAccount?.merchantBankAccount?.dtinsert
                      )}
                    />
                    <InfoItem
                      label="Última Atualização"
                      value={formatDate(
                        merchantBankAccount?.merchantBankAccount?.dtupdate
                      )}
                    />
                  </div>
                )}

                <CardContent className="mt-2 p-0">
                  {merchant.hasPix && (
                    <>
                      <div className="col-span-2 mt-2 border-t pt-2"> </div>
                      <p className="font-medium mb-1 text-sm">Dados PIX</p>
                      {activeEditSection === "bank" ? (
                        <MerchantFormBank
                          merchantpixaccount={{
                            id: merchantPixAccount?.pixaccounts?.id || 0,
                            slug: merchantPixAccount?.pixaccounts?.slug || null,
                            active:
                              merchantPixAccount?.pixaccounts?.active || null,
                            dtinsert:
                              merchantPixAccount?.pixaccounts?.dtinsert || null,
                            idAccount:
                              merchantPixAccount?.pixaccounts?.idAccount ||
                              null,
                            bankAccountType:
                              merchantPixAccount?.pixaccounts
                                ?.bankAccountType || null,
                            bankAccountStatus:
                              merchantPixAccount?.pixaccounts
                                ?.bankAccountStatus || null,
                            onboardingPixStatus:
                              merchantPixAccount?.pixaccounts
                                ?.onboardingPixStatus || null,
                            message:
                              merchantPixAccount?.pixaccounts?.message || null,
                            dtupdate:
                              merchantPixAccount?.pixaccounts?.dtupdate || null,
                            idMerchant:
                              merchantPixAccount?.pixaccounts?.idMerchant ||
                              null,
                            slugMerchant:
                              merchantPixAccount?.pixaccounts?.slugMerchant ||
                              null,
                            idRegistration:
                              merchantPixAccount?.pixaccounts?.idRegistration ||
                              null,
                            bankNumber:
                              merchantPixAccount?.pixaccounts?.bankNumber ||
                              null,
                            bankBranchNumber:
                              merchantPixAccount?.pixaccounts
                                ?.bankBranchNumber || null,
                            bankBranchDigit:
                              merchantPixAccount?.pixaccounts
                                ?.bankBranchDigit || null,
                            bankAccountNumber:
                              merchantPixAccount?.pixaccounts
                                ?.bankAccountNumber || null,
                            bankAccountDigit:
                              merchantPixAccount?.pixaccounts
                                ?.bankAccountDigit || null,
                            bankName:
                              merchantPixAccount?.pixaccounts?.bankName || null,
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
                            value={`${
                              merchantPixAccount?.pixaccounts?.bankNumber || ""
                            } - ${
                              merchantPixAccount?.pixaccounts?.bankName || ""
                            }`}
                          />
                          <InfoItem
                            label="Tipo de Conta"
                            value={
                              DDAccountType.find(
                                (t) =>
                                  t.value ===
                                  merchantPixAccount?.pixaccounts
                                    ?.bankAccountType
                              )?.label ||
                              merchantPixAccount?.pixaccounts?.bankAccountType
                            }
                          />
                          <InfoItem
                            label="Agência"
                            value={`${
                              merchantPixAccount?.pixaccounts
                                ?.bankBranchNumber || ""
                            }${
                              merchantPixAccount?.pixaccounts?.bankBranchDigit
                                ? `-${merchantPixAccount?.pixaccounts?.bankBranchDigit}`
                                : ""
                            }`}
                          />
                          <InfoItem
                            label="Conta"
                            value={`${
                              merchantPixAccount?.pixaccounts
                                ?.bankAccountNumber || ""
                            }${
                              merchantPixAccount?.pixaccounts?.bankAccountDigit
                                ? `-${merchantPixAccount?.pixaccounts?.bankAccountDigit}`
                                : ""
                            }`}
                          />
                          <InfoItem
                            label="Status da Conta"
                            value={
                              merchantPixAccount?.pixaccounts?.bankAccountStatus
                            }
                          />
                          <InfoItem
                            label="Status Onboarding PIX"
                            value={
                              merchantPixAccount?.pixaccounts
                                ?.onboardingPixStatus
                            }
                          />
                        </div>
                      )}
                    </>
                  )}
                </CardContent>
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
                idMerchantBankAccount: null,
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
            <MerchantFormBankAccount
              merchantBankAccount={merchantBankAccount?.merchantBankAccount}
              merchantcorporateName={merchant.corporateName || ""}
              merchantdocumentId={merchant.idDocument || ""}
              activeTab={"bank"}
              idMerchant={merchant.id}
              DDBank={DDBank}
              setActiveTab={() => {}}
              permissions={permissions}
              accountTypeDD={DDAccountType}
              hasPix={merchant.hasPix || false}
              merchantpixaccount={merchantPixAccount?.pixaccounts}
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
