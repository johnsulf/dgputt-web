"use client";

import { HashRedirect } from "@/app/utils/hash-redirect";
import { useAuth } from "@/lib/auth-context";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
            <DropdownMenu>
              <DropdownMenuTrigger
                render={<Button variant="default">Menu</Button>}
              />
              <DropdownMenuContent className="w-40" align="start">
                <DropdownMenuGroup>
                  <DropdownMenuLabel>
                    {user.displayName || user.email}
                  </DropdownMenuLabel>
                  <DropdownMenuItem>
                    <Link href="/leagues">Leagues</Link>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => signOut()}>
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/auth">
              <Button>Login</Button>
            </Link>
          ))}
      </header>
    </>
  );
}
