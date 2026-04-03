import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-secondary grid place-items-center gap-2 py-6 mt-4">
      <p className="text-xl">&copy;dgputt</p>
      <div className="flex gap-3">
        <a
          href="https://www.instagram.com/dgputt/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src="/images/ig.png" alt="instagram" width={32} height={32} />
        </a>
        <a
          href="https://www.facebook.com/dgputt/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src="/images/fb.png" alt="facebook" width={32} height={32} />
        </a>
      </div>
      <Link href="/privacy-policy" className="text-primary underline">
        Privacy Policy
      </Link>
    </footer>
  );
}
