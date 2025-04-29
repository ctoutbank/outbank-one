// src/components/user-menu.tsx
"use client";

import { SignOutButton, useUser } from "@clerk/nextjs";
import { ChevronUp, LogOut, Settings } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user } = useUser();

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

  if (!user) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      {isOpen && (
        <div className="absolute bottom-full left-0 mb-2 w-64 origin-bottom-left rounded-xl bg-white p-1 shadow-lg ring-1 ring-black/5 transition-all">
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
              <button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium text-red-600 transition-colors hover:bg-red-50">
                <LogOut className="h-4 w-4" />
                <span>Sair</span>
              </button>
            </SignOutButton>
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-full bg-white px-3 py-2 shadow-sm transition-all hover:shadow-md"
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
