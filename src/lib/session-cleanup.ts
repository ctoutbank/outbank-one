
declare global {
  interface Window {
    Clerk?: {
      signOut: () => Promise<void>;
    };
  }
}

export async function clearAllSessions(): Promise<void> {
  if (typeof window === "undefined") return;

  try {
    if (window.Clerk) {
      await window.Clerk.signOut();
    }

    localStorage.clear();
    sessionStorage.clear();

    document.cookie.split(";").forEach((cookie) => {
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = `${name.trim()}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname}`;
      document.cookie = `${name.trim()}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=.${window.location.hostname}`;
    });

    console.log("All sessions and cache cleared successfully");
  } catch (error) {
    console.error("Error clearing sessions:", error);
  }
}

export function clearClerkSession(): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve();
      return;
    }

    try {
      if (window.Clerk) {
        window.Clerk.signOut().then(() => {
          localStorage.clear();
          sessionStorage.clear();
          resolve();
        });
      } else {
        localStorage.clear();
        sessionStorage.clear();
        resolve();
      }
    } catch (error) {
      console.error("Error clearing Clerk session:", error);
      resolve();
    }
  });
}

export function forcePageReload(): void {
  if (typeof window !== "undefined") {
    window.location.reload();
  }
}
