"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { states, UF } from "@/lib/lookuptables/lookuptables";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronDown, ChevronUp, Plus, Trash2, User } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { addresses, contacts } from "../../../../drizzle/schema";
import {
  insertContactFormAction,
  updateContactFormAction,
} from "../_actions/contact-formActions";
import {
  insertAddressFormAction,
  updateAddressFormAction,
} from "../_actions/merchant-formActions";
import { ContactSchema, schemaContact } from "../schema/contact-schema";
import { AddressSchema, schemaAddress } from "../schema/merchant-schema";
import { getContactByMerchantId } from "../server/contact";

interface MerchantProps {
  Contact: typeof contacts.$inferSelect;
  Address: typeof addresses.$inferSelect;
  activeTab: string;
  idMerchant: number;
  setActiveTab: (tab: string) => void;
  permissions: string[];
}

interface ContactFormItemProps {
  id: number;
  initialData: any;
  initialAddress: any;
  idMerchant: number;
  onRemove: (id: number) => void;
  isRemovable: boolean;
  onFormReady: (
    id: number,
    contactForm: UseFormReturn<ContactSchema>,
    addressForm: UseFormReturn<AddressSchema>
  ) => void;
}

function ContactFormItem({
  id,
  initialData,
  initialAddress,
  idMerchant,

  onFormReady,
}: ContactFormItemProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const contactForm = useForm<ContactSchema>({
    resolver: zodResolver(schemaContact),
    defaultValues: {
      id: initialData?.id ? Number(initialData.id) : undefined,
      idMerchant: idMerchant,
      name: initialData?.name || "",
      idDocument: initialData?.idDocument || "",
      email: initialData?.email || "",
      areaCode: initialData?.areaCode || "",
      number: initialData?.number || "",
      phoneType: initialData?.phoneType || "",
      birthDate: initialData?.birthDate
        ? new Date(initialData.birthDate)
        : undefined,
      mothersName: initialData?.mothersName || "",
      isPartnerContact: initialData?.isPartnerContact || false,
      isPep: initialData?.isPep || false,
      slugMerchant: initialData?.slugMerchant || "",
      idAddress: initialData?.idAddress,
      icNumber: initialData?.icNumber || "",
      icDateIssuance: initialData?.icDateIssuance
        ? new Date(initialData.icDateIssuance)
        : undefined,
      icDispatcher: initialData?.icDispatcher || "",
      icFederativeUnit: initialData?.icFederativeUnit || "",
    },
  });

  const addressForm = useForm<AddressSchema>({
    resolver: zodResolver(schemaAddress),
    defaultValues: {
      id: initialAddress?.id ? Number(initialAddress.id) : undefined,
      zipCode: initialAddress?.zipCode || "",
      street: initialAddress?.streetAddress || "",
      number: initialAddress?.streetNumber || "",
      complement: initialAddress?.complement || "",
      neighborhood: initialAddress?.neighborhood || "",
      city: initialAddress?.city || "",
      state: initialAddress?.state || "",
      country: initialAddress?.country || "Brasil",
    },
  });

  const {
    register: registerContact,
    formState: { errors: errorsContact },
    watch: watchContact,
    trigger: triggerContact,
  } = contactForm;

  const {
    register: registerAddress,
    formState: { errors: errorsAddress },
    watch: watchAddress,
    trigger: triggerAddress,
  } = addressForm;

  useEffect(() => {
    if (watchContact("name") && watchContact("idDocument")) {
      triggerContact("name");
      triggerContact("idDocument");
    }
  }, [watchContact, triggerContact]);

  useEffect(() => {
    if (
      watchAddress("zipCode") &&
      watchAddress("street") &&
      watchAddress("number")
    ) {
      triggerAddress("zipCode");
      triggerAddress("street");
      triggerAddress("number");
    }
  }, [watchAddress, triggerAddress]);

  useEffect(() => {
    onFormReady(id, contactForm, addressForm);
  }, [id, onFormReady, contactForm, addressForm]);

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <div>
              <Label htmlFor={`name-${id}`}>
                Nome <span className="text-red-500">*</span>
              </Label>
              <Input
                id={`name-${id}`}
                placeholder="Nome completo"
                {...registerContact("name")}
              />
              {errorsContact.name && (
                <p className="text-sm text-red-500 mt-1">
                  {errorsContact.name.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor={`idDocument-${id}`}>
                CPF <span className="text-red-500">*</span>
              </Label>
              <Input
                id={`idDocument-${id}`}
                placeholder="000.000.000-00"
                {...registerContact("idDocument")}
              />
              {errorsContact.idDocument && (
                <p className="text-sm text-red-500 mt-1">
                  {errorsContact.idDocument.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor={`icNumber-${id}`}>RG</Label>
                <Input
                  id={`icNumber-${id}`}
                  placeholder="00.000.000-0"
                  {...registerContact("icNumber")}
                />
                {errorsContact.icNumber && (
                  <p className="text-sm text-red-500 mt-1">
                    {errorsContact.icNumber.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor={`icDateIssuance-${id}`}>Data de emissão</Label>
                <Input
                  id={`icDateIssuance-${id}`}
                  type="date"
                  {...registerContact("icDateIssuance", {
                    setValueAs: (value) =>
                      value ? new Date(value) : undefined,
                  })}
                />
                {errorsContact.icDateIssuance && (
                  <p className="text-sm text-red-500 mt-1">
                    {errorsContact.icDateIssuance.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2">
                <Label htmlFor={`icDispatcher-${id}`}>Órgão expedidor</Label>
                <Input
                  id={`icDispatcher-${id}`}
                  placeholder="SSP"
                  {...registerContact("icDispatcher")}
                />
                {errorsContact.icDispatcher && (
                  <p className="text-sm text-red-500 mt-1">
                    {errorsContact.icDispatcher.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor={`icFederativeUnit-${id}`}>UF</Label>
                <Select
                  onValueChange={(value) =>
                    contactForm.setValue("icFederativeUnit", value)
                  }
                  value={watchContact("icFederativeUnit") || ""}
                >
                  <SelectTrigger id={`icFederativeUnit-${id}`}>
                    <SelectValue placeholder="UF" />
                  </SelectTrigger>
                  <SelectContent>
                    {UF.map((uf) => (
                      <SelectItem key={uf.value} value={uf.value}>
                        {uf.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errorsContact.icFederativeUnit && (
                  <p className="text-sm text-red-500 mt-1">
                    {errorsContact.icFederativeUnit.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor={`email-${id}`}>
                Email <span className="text-red-500">*</span>
              </Label>
              <Input
                id={`email-${id}`}
                type="email"
                placeholder="email@exemplo.com"
                {...registerContact("email")}
              />
              {errorsContact.email && (
                <p className="text-sm text-red-500 mt-1">
                  {errorsContact.email.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor={`areaCode-${id}`}>
                  DDD <span className="text-red-500">*</span>
                </Label>
                <Input
                  id={`areaCode-${id}`}
                  placeholder="00"
                  maxLength={2}
                  {...registerContact("areaCode")}
                />
                {errorsContact.areaCode && (
                  <p className="text-sm text-red-500 mt-1">
                    {errorsContact.areaCode.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor={`number-${id}`}>
                  Telefone <span className="text-red-500">*</span>
                </Label>
                <Input
                  id={`number-${id}`}
                  placeholder="000000000"
                  maxLength={9}
                  {...registerContact("number")}
                />
                {errorsContact.number && (
                  <p className="text-sm text-red-500 mt-1">
                    {errorsContact.number.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>É sócio?</Label>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id={`isPartnerContact-yes-${id}`}
                      checked={watchContact("isPartnerContact") === true}
                      onChange={() =>
                        contactForm.setValue("isPartnerContact", true)
                      }
                      className="h-4 w-4"
                    />
                    <Label
                      htmlFor={`isPartnerContact-yes-${id}`}
                      className="text-sm"
                    >
                      Sim
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id={`isPartnerContact-no-${id}`}
                      checked={watchContact("isPartnerContact") === false}
                      onChange={() =>
                        contactForm.setValue("isPartnerContact", false)
                      }
                      className="h-4 w-4"
                    />
                    <Label
                      htmlFor={`isPartnerContact-no-${id}`}
                      className="text-sm"
                    >
                      Não
                    </Label>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>É PEP?</Label>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id={`isPep-yes-${id}`}
                      checked={watchContact("isPep") === true}
                      onChange={() => contactForm.setValue("isPep", true)}
                      className="h-4 w-4"
                    />
                    <Label htmlFor={`isPep-yes-${id}`} className="text-sm">
                      Sim
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id={`isPep-no-${id}`}
                      checked={watchContact("isPep") === false}
                      onChange={() => contactForm.setValue("isPep", false)}
                      className="h-4 w-4"
                    />
                    <Label htmlFor={`isPep-no-${id}`} className="text-sm">
                      Não
                    </Label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-md font-medium">Endereço</h3>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center space-x-1"
          >
            {isExpanded ? (
              <>
                <ChevronUp className="h-4 w-4" />
                <span className="text-sm">Recolher</span>
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4" />
                <span className="text-sm">Expandir</span>
              </>
            )}
          </Button>
        </div>

        {isExpanded && (
          <div className="border rounded-md p-4 bg-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor={`zipCode-${id}`}>
                  CEP <span className="text-red-500">*</span>
                </Label>
                <Input
                  id={`zipCode-${id}`}
                  placeholder="00000-000"
                  {...registerAddress("zipCode")}
                />
                {errorsAddress.zipCode && (
                  <p className="text-sm text-red-500 mt-1">
                    {errorsAddress.zipCode.message}
                  </p>
                )}
              </div>

              <div className="md:col-span-2">
                <Label htmlFor={`street-${id}`}>
                  Rua <span className="text-red-500">*</span>
                </Label>
                <Input
                  id={`street-${id}`}
                  placeholder="Nome da rua"
                  {...registerAddress("street")}
                />
                {errorsAddress.street && (
                  <p className="text-sm text-red-500 mt-1">
                    {errorsAddress.street.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div>
                <Label htmlFor={`number-address-${id}`}>
                  Número <span className="text-red-500">*</span>
                </Label>
                <Input
                  id={`number-address-${id}`}
                  placeholder="123"
                  {...registerAddress("number")}
                />
                {errorsAddress.number && (
                  <p className="text-sm text-red-500 mt-1">
                    {errorsAddress.number.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor={`complement-${id}`}>Complemento</Label>
                <Input
                  id={`complement-${id}`}
                  placeholder="Apto, Bloco, etc."
                  {...registerAddress("complement")}
                />
                {errorsAddress.complement && (
                  <p className="text-sm text-red-500 mt-1">
                    {errorsAddress.complement.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor={`neighborhood-${id}`}>
                  Bairro <span className="text-red-500">*</span>
                </Label>
                <Input
                  id={`neighborhood-${id}`}
                  placeholder="Nome do bairro"
                  {...registerAddress("neighborhood")}
                />
                {errorsAddress.neighborhood && (
                  <p className="text-sm text-red-500 mt-1">
                    {errorsAddress.neighborhood.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div>
                <Label htmlFor={`city-${id}`}>
                  Cidade <span className="text-red-500">*</span>
                </Label>
                <Input
                  id={`city-${id}`}
                  placeholder="Nome da cidade"
                  {...registerAddress("city")}
                />
                {errorsAddress.city && (
                  <p className="text-sm text-red-500 mt-1">
                    {errorsAddress.city.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor={`state-${id}`}>
                  Estado <span className="text-red-500">*</span>
                </Label>
                <Select
                  onValueChange={(value) =>
                    addressForm.setValue("state", value)
                  }
                  value={watchAddress("state") || ""}
                >
                  <SelectTrigger id={`state-${id}`}>
                    <SelectValue placeholder="Selecione o estado" />
                  </SelectTrigger>
                  <SelectContent>
                    {states.map((state) => (
                      <SelectItem key={state.value} value={state.value}>
                        {state.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errorsAddress.state && (
                  <p className="text-sm text-red-500 mt-1">
                    {errorsAddress.state.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor={`country-${id}`}>
                  País <span className="text-red-500">*</span>
                </Label>
                <Input
                  id={`country-${id}`}
                  placeholder="País"
                  defaultValue="Brasil"
                  {...registerAddress("country")}
                />
                {errorsAddress.country && (
                  <p className="text-sm text-red-500 mt-1">
                    {errorsAddress.country.message}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function MerchantFormcontact({
  Contact,
  Address,
  activeTab,
  idMerchant,
  setActiveTab,
  permissions,
}: MerchantProps) {
  const router = useRouter();
  const [contacts, setContacts] = useState<
    Array<{
      id: number;
      data: any;
      address: any;
    }>
  >([{ id: 1, data: Contact, address: Address }]);
  const [nextId, setNextId] = useState(2);

  // Armazenar referências aos formulários
  const formRefs = useRef<{
    [key: number]: {
      contactForm: UseFormReturn<ContactSchema>;
      addressForm: UseFormReturn<AddressSchema>;
    };
  }>({});

  const handleFormReady = useCallback(
    (
      id: number,
      contactForm: UseFormReturn<ContactSchema>,
      addressForm: UseFormReturn<AddressSchema>
    ) => {
      formRefs.current[id] = { contactForm, addressForm };
    },
    []
  );

  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams || "");

  // Carregar contatos existentes do merchant
  useEffect(() => {
    const loadContacts = async () => {
      try {
        // Buscar todos os contatos do merchant
        const merchantContacts = await getContactByMerchantId(idMerchant);

        if (merchantContacts && merchantContacts.length > 0) {
          console.log("Contatos carregados:", merchantContacts);

          // Inicializar a lista de contatos com os dados do banco
          const contactsList = merchantContacts.map((contact, index) => ({
            id: index + 1,
            data: contact.contacts,
            address: contact.addresses,
          }));

          // Atualizar o estado com todos os contatos
          setContacts(contactsList);

          // Atualizar o próximo ID
          setNextId(contactsList.length + 1);
        } else if (Contact && Contact.id) {
          // Se não encontrou contatos mas temos um contato inicial
          console.log("Usando contato inicial:", Contact);
        }
      } catch (error) {
        console.error("Erro ao carregar contatos:", error);
      }
    };

    loadContacts();
  }, [idMerchant, Contact]);

  const refreshPage = (id: number) => {
    params.set("tab", activeTab);
    setActiveTab(activeTab);
    router.push(`/portal/merchants/${id}?${params.toString()}`);
  };

  const addNewContact = () => {
    setContacts([
      ...contacts,
      {
        id: nextId,
        data: null,
        address: null,
      },
    ]);
    setNextId(nextId + 1);
  };

  const removeContact = (id: number) => {
    setContacts(contacts.filter((contact) => contact.id !== id));
    // Remover referência ao formulário
    delete formRefs.current[id];
  };

  const onSubmit = async () => {
    try {
      // Validar todos os formulários
      const formIds = Object.keys(formRefs.current).map(Number);
      const formValidations = await Promise.all(
        formIds.map(async (formId) => {
          const { contactForm, addressForm } = formRefs.current[formId];
          const isContactValid = await contactForm.trigger();
          const isAddressValid = await addressForm.trigger();
          return isContactValid && isAddressValid;
        })
      );

      if (!formValidations.every((isValid) => isValid)) {
        console.error("Formulários inválidos");
        return;
      }

      // Verificar se estamos atualizando contatos existentes
      const hasExistingContacts = contacts.some((contact) => contact.data?.id);

      // Processar cada formulário
      for (const formId of formIds) {
        const { contactForm, addressForm } = formRefs.current[formId];
        const contactData = contactForm.getValues();
        const addressData = addressForm.getValues();

        // Processar endereço - atualizar existente ou criar novo
        let addressId;
        if (addressData.id) {
          await updateAddressFormAction(addressData);
          addressId = addressData.id;
        } else {
          // Criar o endereço
          addressId = await insertAddressFormAction(addressData);
        }

        // Atualizar contato com o ID do endereço
        const contactWithAddress = {
          ...contactData,
          idAddress: addressId,
          idMerchant: idMerchant,
          phoneType: contactData.number?.startsWith("9") ? "C" : "P",
        };

        if (contactData.id) {
          await updateContactFormAction(contactWithAddress);
        } else {
          await insertContactFormAction(contactWithAddress);
        }
      }

      // Se temos contatos existentes, apenas atualize a página
      if (hasExistingContacts) {
        alert("Dados salvos com sucesso!");
        router.refresh();
      } else {
        // Se estamos criando novos contatos, navegue para a próxima aba
        refreshPage(idMerchant);
      }
    } catch (error) {
      console.error("Erro ao submeter formulários:", error);
      alert("Erro ao salvar os dados: " + error);
    }
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {contacts.map((contact, index) => (
          <Card
            key={contact.id}
            className="w-full shadow-sm hover:shadow-md transition-shadow"
          >
            <CardHeader className="flex flex-row items-center justify-between bg-gray-50 py-3">
              <div className="flex flex-row items-center space-x-2">
                <User className="w-5 h-5 text-primary" />
                <CardTitle className="text-lg">
                  {contact.data?.name || `Responsável ${index + 1}`}
                </CardTitle>
              </div>
              {contacts.length > 1 && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeContact(contact.id)}
                  title="Remover responsável"
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              )}
            </CardHeader>
            <CardContent className="p-4">
              <ContactFormItem
                id={contact.id}
                initialData={contact.data}
                initialAddress={contact.address}
                idMerchant={idMerchant}
                onRemove={removeContact}
                isRemovable={contacts.length > 1}
                onFormReady={handleFormReady}
              />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-center mt-6">
        <Button
          type="button"
          onClick={addNewContact}
          className="flex items-center space-x-2"
          variant="outline"
        >
          <Plus className="w-4 h-4" />
          <span>Adicionar Responsável</span>
        </Button>
      </div>
      {permissions?.includes("Atualizar") && (
        <div className="flex justify-end mt-8">
          <Button type="submit" onClick={onSubmit} className="px-6">
            {contacts.some((contact) => contact.data?.id)
              ? "Salvar"
              : "Avançar"}
          </Button>
        </div>
      )}
    </div>
  );
}
