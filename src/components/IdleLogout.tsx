'use client';
import { useClerk } from '@clerk/nextjs';
import { useIdleTimer } from 'react-idle-timer';

export default function IdleLogout() {
  const { signOut } = useClerk();

  useIdleTimer({
    timeout: 5 * 60 * 1000,
    onIdle: () => {
      signOut({ redirectUrl: '/sign-in' });
    },
    debounce: 500,
  });

  return null;
}