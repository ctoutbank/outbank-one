// src/components/user-menu.tsx
"use client";

import { useUserCache } from "@/hooks/use-user-cache";
import { clearUserCache } from "@/lib/user-cache";
import { SignOutButton } from "@clerk/nextjs";
import { ChevronUp, LogOut, Settings } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, isLoaded, isFromCache } = useUserCache(); // ✅ Removido isSignedIn que não estava sendo usado

  const router = useRouter();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // ✅ Mostrar skeleton APENAS se não há cache e ainda está carregando
  if (!isLoaded && !user && !isFromCache) {
    return (
      <div className="flex items-center gap-2 rounded-full px-3 py-2">
        <div className="h-8 w-8 animate-pulse rounded-full bg-gray-200" />
        <div className="hidden h-4 w-20 animate-pulse rounded bg-gray-200 md:block" />
      </div>
    );
  }

  // ✅ Se não há usuário e não está carregando, não mostrar nada
  if (!user && !isFromCache) return null;

  // ✅ Garantir que user existe antes de usar
  if (!user) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-64 origin-top-right rounded-xl bg-white p-1 shadow-lg ring-1 ring-black/5 transition-all z-50">
          <div className="p-3">
            <div className="mb-2 flex items-center gap-3">
              <div className="h-12 w-12 overflow-hidden rounded-full bg-gradient-to-r from-purple-500 to-indigo-600">
                {user.imageUrl ? (
                  <img
                    src={user.imageUrl}
                    alt={user.fullName || "Avatar"}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xl font-medium text-white">
                    {user.firstName?.[0]}
                  </div>
                )}
              </div>
              <div>
                <h3 className="font-semibold">{user.fullName}</h3>
                <p className="text-xs text-gray-500">
                  {user.primaryEmailAddress?.emailAddress}
                </p>
              </div>
            </div>

            <div className="mt-4 space-y-1">
              <button
                onClick={() => {
                  router.push("/portal/myProfile");
                  setIsOpen(false);
                }}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-gray-100"
              >
                <Settings className="h-4 w-4 text-gray-500" />
                <span>Configuração de conta</span>
              </button>
            </div>
          </div>

          <div className="border-t border-gray-100 p-1">
            <SignOutButton>
              <button
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
                onClick={() => {
                  // Limpar cache no logout
                  clearUserCache();
                }}
              >
                <LogOut className="h-4 w-4" />
                <span>Sair</span>
              </button>
            </SignOutButton>
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-full px-3 py-2 transition-all hover:bg-accent"
      >
        <div className="h-8 w-8 overflow-hidden rounded-full bg-gradient-to-r from-purple-500 to-indigo-600">
          {user.imageUrl ? (
            <img
              src={user.imageUrl}
              alt={user.fullName || "Avatar"}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-white">
              {user.firstName?.[0]}
            </div>
          )}
        </div>
        <span className="hidden text-sm font-medium md:block">
          {user.fullName}
        </span>
        <ChevronUp
          className={`h-4 w-4 transition-transform ${
            isOpen ? "" : "rotate-180"
          }`}
        />
      </button>
    </div>
  );
}
