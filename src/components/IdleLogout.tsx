"use client";
import { useClerk } from "@clerk/nextjs";
import { useIdleTimer } from "react-idle-timer";

export default function IdleLogout() {
  const { signOut } = useClerk();

  useIdleTimer({
    timeout: 2 * 60 * 1000,
    onIdle: () => {
      signOut({ redirectUrl: "/auth/sign-in" });
    },
    debounce: 500,
  });

  return null;
}
