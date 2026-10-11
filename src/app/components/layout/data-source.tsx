"use client";

import { useState, type FormEvent } from "react";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Super admins can view league data from the dev database. These pieces show
// the switch and make it obvious when dev data is on screen.

/** PROD / DEV switch; renders nothing for everyone but super admins. */
export function DataSourceToggle({ className = "" }: { className?: string }) {
  const { canSwitchDataSource, dataSource, switchDataSource } = useAuth();
  if (!canSwitchDataSource) return null;

  return (
    <div
      role="group"
      aria-label="League database"
      title="Which database league pages read from (super admins only)"
      className={`inline-flex rounded-full bg-black/10 p-0.5 text-xs font-bold ${className}`}
    >
      {(["prod", "dev"] as const).map((source) => {
        const active = dataSource === source;
        return (
          <button
            key={source}
            type="button"
            aria-pressed={active}
            onClick={() => switchDataSource(source)}
            className={`rounded-full px-2.5 py-1 tracking-wide uppercase transition-colors ${
              active
                ? source === "dev"
                  ? "bg-[#CC3311] text-white"
                  : "bg-[#212121] text-white"
                : "text-[#212121]/70 hover:text-[#212121]"
            }`}
          >
            {source}
          </button>
        );
      })}
    </div>
  );
}

/**
 * Shown under the header while viewing dev data. Asks for a dev sign-in
 * first, since the dev project has its own accounts.
 */
export function DevDataBanner() {
  const { dataSource, devUser, loading, signInDev, switchDataSource } =
    useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (dataSource !== "dev") return null;

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await signInDev(email, password);
    } catch {
      setError("Could not sign in to dev. Check the email and password.");
      setBusy(false);
    }
  }

  return (
    <div className="bg-[#CC3311] px-4 py-2.5 text-sm text-white sm:px-8">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <span className="font-bold tracking-wide">DEV DATABASE</span>
        {loading ? null : devUser ? (
          <span className="text-white/85">
            League pages show dev data · signed in to dev as{" "}
            {devUser.email ?? devUser.uid}
          </span>
        ) : (
          <form onSubmit={submit} className="flex flex-wrap items-center gap-2">
            <span className="text-white/85">Sign in to the dev project:</span>
            <Input
              type="email"
              required
              autoComplete="username"
              placeholder="Dev email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-8 w-48 bg-white text-[#212121]"
            />
            <Input
              type="password"
              required
              autoComplete="current-password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-8 w-36 bg-white text-[#212121]"
            />
            <Button type="submit" size="sm" variant="secondary" disabled={busy}>
              {busy ? "Signing in…" : "Sign in"}
            </Button>
            {error && <span className="font-semibold">{error}</span>}
          </form>
        )}
        <button
          type="button"
          onClick={() => switchDataSource("prod")}
          className="ml-auto font-semibold underline underline-offset-2 hover:no-underline"
        >
          Back to prod
        </button>
      </div>
    </div>
  );
}

/** Small corner badge for the full-screen TV boards. */
export function DevDataBadge() {
  const { dataSource, devUser, loading } = useAuth();
  if (dataSource !== "dev") return null;
  return (
    <div className="fixed top-2 left-2 z-50 rounded-full bg-[#CC3311] px-3 py-1 text-xs font-bold tracking-wide text-white">
      DEV DATA
      {!loading && !devUser && " · sign in to dev on the event page"}
    </div>
  );
}
