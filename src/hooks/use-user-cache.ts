"use client";

import { clearUserCache, getUserCache, setUserCache } from "@/lib/user-cache";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";

interface CachedUser {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  primaryEmailAddress: {
    emailAddress: string;
  };
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export function useUserCache() {
  const { user, isLoaded, isSignedIn } = useUser();
  const [cachedUser, setCachedUser] = useState<CachedUser | null>(null);
  const [isCacheLoaded, setIsCacheLoaded] = useState(false);

  // ✅ Carregar cache IMEDIATAMENTE, sem depender do isSignedIn
  useEffect(() => {
    const cached = getUserCache();
    if (cached) {
      setCachedUser(cached);
    }
    setIsCacheLoaded(true);
  }, []); // Executar apenas uma vez na montagem

  // Atualizar cache quando dados do Clerk mudarem
  useEffect(() => {
    if (user && isLoaded && isSignedIn) {
      setUserCache(user);
      setCachedUser({
        id: user.id,
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        fullName: user.fullName || "",
        primaryEmailAddress: {
          emailAddress: user.primaryEmailAddress?.emailAddress || "",
        },
        imageUrl: user.imageUrl,
        createdAt: user.createdAt?.toISOString() || "",
        updatedAt: user.updatedAt?.toISOString() || "",
      });
    } else if (isLoaded && !isSignedIn) {
      // ✅ Só limpar cache se o Clerk confirmar que não está logado
      clearUserCache();
      setCachedUser(null);
    }
  }, [user, isLoaded, isSignedIn]);

  // ✅ Garantir que sempre retorne um objeto válido
  const finalUser = cachedUser || user;
  const finalIsSignedIn = isSignedIn || !!cachedUser;
  const finalIsLoaded = isLoaded && isCacheLoaded;

  return {
    user: finalUser,
    isLoaded: finalIsLoaded,
    isSignedIn: finalIsSignedIn,
    isFromCache: !!cachedUser && !user,
  };
}
