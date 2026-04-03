"use client";

import { HashRedirect } from "@/app/utils/hash-redirect";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Header() {
  const { user, loading, signOut } = useAuth();

  return (
    <>
      <HashRedirect />
      <header className="bg-secondary px-8 py-4 flex justify-between items-center">
        <Link href="/">
          <img
            src="/images/logo_plain.png"
            alt="dgputt logo"
            width={60}
            height={60}
          />
        </Link>
        {!loading &&
          (user ? (
            <div className="flex items-center gap-4">
              <span className="text-sm hidden sm:inline">
                {user.displayName || user.email}
              </span>
              <Button variant="outline" onClick={() => signOut()}>
                Logout
              </Button>
            </div>
          ) : (
            <Link href="/auth">
              <Button>Login</Button>
            </Link>
          ))}
      </header>
    </>
  );
}
