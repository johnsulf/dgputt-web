"use client";

import { useState } from "react";
import { HashRedirect } from "@/app/utils/hash-redirect";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import { HugeiconsIcon } from "@hugeicons/react";
import { Menu02Icon } from "@hugeicons/core-free-icons";
import Link from "next/link";

const navLinks = [
  { href: "/about", label: "About" },
  { href: "/guide", label: "Guide" },
  { href: "/team", label: "Team" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const { user, loading, signOut } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <>
      <HashRedirect />
      <header className="bg-secondary px-8 py-4 flex items-center">
        <Link href="/">
          <img
            src="/images/logo_plain.png"
            alt="dgputt logo"
            width={60}
            height={60}
          />
        </Link>

        {/* Desktop nav - left side */}
        <nav className="hidden md:flex items-center gap-6 ml-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              {link.label}
            </Link>
          ))}
          {!loading && user && (
            <Link
              href="/leagues"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Leagues
            </Link>
          )}
        </nav>

        {/* Desktop login/logout - right side */}
        <div className="hidden md:flex items-center ml-auto">
          {!loading &&
            (user ? (
              <Button variant="ghost" size="sm" onClick={() => signOut()}>
                Log out
              </Button>
            ) : (
              <Link href="/auth">
                <Button size="sm">Login</Button>
              </Link>
            ))}
        </div>

        {/* Mobile menu */}
        <div className="md:hidden ml-auto">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              render={
                <Button variant="ghost" size="icon">
                  <HugeiconsIcon icon={Menu02Icon} size={24} />
                  <span className="sr-only">Open menu</span>
                </Button>
              }
            />
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>
                  {!loading && user ? user.displayName || user.email : "Menu"}
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-2 px-6">
                {!loading && user && (
                  <SheetClose
                    nativeButton={false}
                    render={
                      <Link
                        href="/leagues"
                        className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-muted transition-colors"
                      />
                    }
                  >
                    Leagues
                  </SheetClose>
                )}
                {navLinks.map((link) => (
                  <SheetClose
                    key={link.href}
                    nativeButton={false}
                    render={
                      <Link
                        href={link.href}
                        className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-muted transition-colors"
                      />
                    }
                  >
                    {link.label}
                  </SheetClose>
                ))}
                <div className="my-2 h-px bg-border" />
                {!loading &&
                  (user ? (
                    <Button
                      variant="ghost"
                      className="justify-start"
                      onClick={() => {
                        signOut();
                        setOpen(false);
                      }}
                    >
                      Log out
                    </Button>
                  ) : (
                    <SheetClose
                      nativeButton={false}
                      render={<Link href="/auth" className="w-full" />}
                    >
                      <Button className="w-full">Login</Button>
                    </SheetClose>
                  ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </header>
    </>
  );
}
