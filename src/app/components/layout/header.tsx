import { HashRedirect } from "@/app/utils/hash-redirect";
import { Button } from "@/components/ui/button";

import Link from "next/link";

export default function Header() {
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
        <Button>Sign In</Button>
      </header>
    </>
  );
}
