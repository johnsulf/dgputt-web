"use client";

import { useState } from "react";
import { HashRedirect } from "@/app/utils/hash-redirect";
import { useAuth } from "@/lib/auth-context";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
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
import {
  DataSourceToggle,
  DevDataBanner,
} from "@/app/components/layout/data-source";

const navLinks = [
  { href: "/about", label: "App Features" },
  { href: "/guide", label: "League guide" },
  { href: "/team", label: "Team" },
  { href: "/contact", label: "Contact" },
];
const liveScoresLink = { href: "/leagues", label: "Live scores" };
const loginLabel = "Log in for live league scores";

export default function Header() {
  const { user, loading, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const visibleNavLinks = !loading && user ? [...navLinks, liveScoresLink] : navLinks;

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
          {visibleNavLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop login/logout - right side */}
        <div className="hidden md:flex items-center gap-3 ml-auto">
          <DataSourceToggle />
          {!loading &&
            (user ? (
              <Button variant="ghost" size="sm" onClick={() => signOut()}>
                Log out
              </Button>
            ) : (
              <Link href="/auth" className={buttonVariants({ size: "sm" })}>
                {loginLabel}
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
                {visibleNavLinks.map((link) => (
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
                <DataSourceToggle className="self-start" />
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
                      render={
                        <Link
                          href="/auth"
                          className={cn(
                            buttonVariants(),
                            "h-auto min-h-11 w-full whitespace-normal py-2 text-center",
                          )}
                        />
                      }
                    >
                      {loginLabel}
                    </SheetClose>
                  ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </header>
      <DevDataBanner />
    </>
  );
}
