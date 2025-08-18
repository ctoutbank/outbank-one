"use client";

import { Button } from "@/components/ui/button";
import ComboboxDemo from "@/components/ui/dropdownSearch";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";
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
  profileOptions = [],
  onFilter,
  onClose,
}: FilterUserContentProps) {
  const [merchant, setMerchant] = useState(merchantIn);
  const customer = customerIn;
  const [email, setEmail] = useState(emailIn);
  const [firstName, setFirstName] = useState(firstNameIn);
  const [lastName, setLastName] = useState(lastNameIn);
  const [profile, setProfile] = useState(profileIn);

  // Função auxiliar para acionar o filtro ao pressionar Enter
  function handleKeyDown(
    e: React.KeyboardEvent<HTMLInputElement | HTMLDivElement>
  ) {
    if (e.key === "Enter") {
      onFilter({ merchant, customer, email, firstName, lastName, profile });
      onClose();
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-in fade-in-0 duration-200"
      onClick={onClose}
    >
      <div
        className="bg-background border rounded-lg p-6 shadow-xl min-w-[900px] max-w-[90vw] max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Filtros</h2>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-md hover:bg-gray-100 flex items-center justify-center text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* First Name - Input */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Nome</h3>
            <Input
              placeholder="Nome do usuário"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>

          {/* Last Name - Input */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Sobrenome</h3>
            <Input
              placeholder="Sobrenome do usuário"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>

          {/* Email - Input */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Email</h3>
            <Input
              placeholder="Email do usuário"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={handleKeyDown}
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
    </div>
  );
}
