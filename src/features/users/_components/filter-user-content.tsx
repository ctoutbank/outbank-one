"use client";

import { Button } from "@/components/ui/button";
import ComboboxDemo from "@/components/ui/dropdownSearch";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import {useEffect, useRef, useState} from "react";
import { DD } from "../server/users";

type FilterUserContentProps = {
  // Input values
  merchantIn?: string;
  customerIn?: string;
  emailIn?: string;
  firstNameIn?: string;
  lastNameIn?: string;
  profileIn?: string;

  // Dropdown options
  merchantOptions?: DD[];
  customerOptions?: DD[];
  profileOptions?: DD[];

  // Callback functions
  onFilter: (filters: {
    merchant: string;
    customer: string;
    email: string;
    firstName: string;
    lastName: string;
    profile: string;
  }) => void;
  onClose: () => void;
};

export function FilterUserContent({
  merchantIn = "",
  customerIn = "",
  emailIn = "",
  firstNameIn = "",
  lastNameIn = "",
  profileIn = "",
  merchantOptions = [],
  customerOptions = [],
  profileOptions = [],
  onFilter,
  onClose,
}: FilterUserContentProps) {
  const [merchant, setMerchant] = useState(merchantIn);
  const [customer, setCustomer] = useState(customerIn);
  const [email, setEmail] = useState(emailIn);
  const [firstName, setFirstName] = useState(firstNameIn);
  const [lastName, setLastName] = useState(lastNameIn);
  const [profile, setProfile] = useState(profileIn);

  const filterRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (e: MouseEvent) => {
    if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
      onClose(); // Fecha o filtro se o clique for fora do conteúdo
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);


  return (
    <div ref={filterRef} className="absolute left-0 mt-2 bg-background border rounded-lg p-4 shadow-md min-w-[1100px]">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* First Name - Input */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Nome</h3>
          <Input
            placeholder="Nome do usuário"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>

        {/* Last Name - Input */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Sobrenome</h3>
          <Input
            placeholder="Sobrenome do usuário"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>

        {/* Email - Input */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Email</h3>
          <Input
            placeholder="Email do usuário"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Merchant - Dropdown Search */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Estabelecimento</h3>
          <ComboboxDemo
            frameworks={
              merchantOptions
                ? merchantOptions.map((merchantItem) => ({
                    value: String(merchantItem.id),
                    label: merchantItem.name || "",
                  }))
                : []
            }
            onChange={setMerchant}
            value={merchant}
          />
        </div>

        {/* Customer - Dropdown Search */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Cliente</h3>
          <ComboboxDemo
            frameworks={
              customerOptions
                ? customerOptions.map((customerItem) => ({
                    value: String(customerItem.id),
                    label: customerItem.name || "",
                  }))
                : []
            }
            onChange={setCustomer}
            value={customer}
          />
        </div>

        {/* Profile - Dropdown Search */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Perfil</h3>
          <ComboboxDemo
            frameworks={
              profileOptions
                ? profileOptions.map((profileItem) => ({
                    value: String(profileItem.id),
                    label: profileItem.name || "",
                  }))
                : []
            }
            onChange={setProfile}
            value={profile}
          />
        </div>
      </div>

      <div className="flex justify-end pt-4 mt-4 border-t">
        <Button
          onClick={() => {
            onFilter({
              merchant,
              customer,
              email,
              firstName,
              lastName,
              profile,
            });
            onClose();
          }}
          className="flex items-center gap-2"
        >
          <Search className="h-4 w-4" />
          Filtrar
        </Button>
      </div>
    </div>
  );
}
