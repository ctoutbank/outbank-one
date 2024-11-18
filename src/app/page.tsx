import { SignedIn, UserButton } from "@clerk/nextjs";

import { SignInButton } from "@clerk/nextjs";

import { SignedOut } from "@clerk/nextjs";

export default function Home() {
  return (
    <div>
      Outbank one
      <SignedOut>
        <SignInButton />
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </div>
  );
}
