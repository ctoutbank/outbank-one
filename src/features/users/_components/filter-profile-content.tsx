"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useState } from "react";

type FilterProfileContentProps = {
  profileNameIn?: string;
  onFilter: (filters: { profileName: string }) => void;
  onClose: () => void;
};

export function FilterProfileContent({
  profileNameIn,
  onFilter,
  onClose,
}: FilterProfileContentProps) {
  const [profileName, setProfileName] = useState(profileNameIn || "");

  return (
    <div className="absolute left-0 mt-2 bg-background border rounded-lg p-4 shadow-md min-w-[400px]">
      <div className="space-y-2">
        <h3 className="text-sm font-medium">Nome do Perfil</h3>
        <Input
          placeholder="Nome do perfil"
          value={profileName}
          onChange={(e) => setProfileName(e.target.value)}
        />
      </div>

      <div className="flex justify-end pt-4 mt-4 border-t">
        <Button
          onClick={() => {
            onFilter({ profileName });
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