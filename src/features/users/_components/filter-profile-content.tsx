"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";

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

    // Fechar ao apertar ESC
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                onClose();
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [onClose]);

    return (
        <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-in fade-in-0 duration-200"
            onClick={onClose}
        >
            <div
                className="bg-background border rounded-lg p-6 shadow-xl min-w-[500px] max-w-[90vw] animate-in zoom-in-95 duration-200"
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
        </div>
    );
}
