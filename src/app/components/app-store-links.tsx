import Image from "next/image";
import { cn } from "@/lib/utils";

const stores = [
  {
    href: "https://apps.apple.com/us/app/dgputt/id1536711552",
    image: "/images/app_store.png",
    label: "Download dgputt on the App Store",
  },
  {
    href: "https://play.google.com/store/apps/details?id=com.erlendjohnsen.dgputt",
    image: "/images/play_store.png",
    label: "Get dgputt on Google Play",
  },
];

export function AppStoreLinks({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {stores.map(({ href, image, label }) => (
        <a key={href} href={href} target="_blank" rel="noopener noreferrer">
          <span className="block w-fit max-w-full overflow-hidden rounded-md border border-neutral-300 bg-white">
            <Image
              src={image}
              alt={label}
              width={281}
              height={86}
              className="h-auto w-40 [filter:invert(1)_brightness(1.15)]"
            />
          </span>
        </a>
      ))}
    </div>
  );
}
