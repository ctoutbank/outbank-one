// Utilitário para cache do usuário em cookies

interface UserCacheData {
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

const USER_CACHE_COOKIE = "user_cache";
const CACHE_EXPIRY_DAYS = 1; // Cache válido por 1 dia

export function setUserCache(user: any): void {
  if (typeof window === "undefined") return;

  const userData: UserCacheData = {
    id: user.id,
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    fullName: user.fullName || "",
    primaryEmailAddress: {
      emailAddress: user.primaryEmailAddress?.emailAddress || "",
    },
    imageUrl: user.imageUrl,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };

  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + CACHE_EXPIRY_DAYS);

  const cacheData = {
    user: userData,
    expiresAt: expiryDate.toISOString(),
  };

  // Salvar em cookie
  document.cookie = `${USER_CACHE_COOKIE}=${encodeURIComponent(JSON.stringify(cacheData))}; expires=${expiryDate.toUTCString()}; path=/; SameSite=Strict`;
}

export function getUserCache(): UserCacheData | null {
  if (typeof window === "undefined") return null;

  try {
    const cookies = document.cookie.split(";");
    const userCookie = cookies.find((cookie) =>
      cookie.trim().startsWith(`${USER_CACHE_COOKIE}=`)
    );

    if (!userCookie) return null;

    const cookieValue = userCookie.split("=")[1];
    const cacheData = JSON.parse(decodeURIComponent(cookieValue));
    const expiryDate = new Date(cacheData.expiresAt);

    // Verificar se o cache expirou
    if (new Date() > expiryDate) {
      clearUserCache();
      return null;
    }

    return cacheData.user;
  } catch (error) {
    console.warn("Erro ao ler cache do usuário:", error);
    clearUserCache();
    return null;
  }
}

export function clearUserCache(): void {
  if (typeof window === "undefined") return;

  // Remover cookie definindo expiração no passado
  document.cookie = `${USER_CACHE_COOKIE}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}
