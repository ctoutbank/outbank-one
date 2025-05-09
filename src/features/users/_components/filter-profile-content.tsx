"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import {useEffect, useRef, useState} from "react";

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
    <div ref={filterRef} className="absolute left-0 mt-2 bg-background border rounded-lg p-4 shadow-md min-w-[400px]">
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