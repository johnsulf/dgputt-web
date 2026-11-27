import Image from "next/image";
import { cn } from "@/lib/utils";

const stores = [
  {
    href: "https://apps.apple.com/us/app/dgputt/id1536711552",
    image: "/images/app_store.png",
    label: "Download dgputt on the App Store",
    rating: 4.8,
  },
  {
    href: "https://play.google.com/store/apps/details?id=com.erlendjohnsen.dgputt",
    image: "/images/play_store.png",
    label: "Get dgputt on Google Play",
    rating: 4.7,
  },
];

export function AppStoreLinks({
  className,
  showRatings = false,
}: {
  className?: string;
  showRatings?: boolean;
}) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {stores.map(({ href, image, label, rating }) => (
        <a
          key={href}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={
            showRatings
              ? "group flex min-w-0 flex-col items-center gap-2 rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
              : undefined
          }
        >
          <span
            className={cn(
              "block w-fit max-w-full overflow-hidden rounded-md border border-neutral-300 bg-white",
              showRatings && "transition-colors group-hover:border-neutral-500",
            )}
          >
            <Image
              src={image}
              alt={label}
              width={281}
              height={86}
              className="h-auto w-40 [filter:invert(1)_brightness(1.15)]"
            />
          </span>
          {showRatings && (
            <span className="flex items-center gap-2 text-sm leading-none font-semibold tabular-nums">
              <span aria-hidden="true" className="relative text-base leading-none tracking-[0.04em] whitespace-nowrap text-foreground/20">
                ★★★★★
                <span
                  className="absolute inset-y-0 left-0 overflow-hidden text-yellow-400"
                  style={{ width: `${(rating / 5) * 100}%` }}
                >
                  ★★★★★
                </span>
              </span>
              <span>
                <span className="sr-only">Rated </span>
                {rating.toFixed(1)}
              </span>
            </span>
          )}
        </a>
      ))}
    </div>
  );
}
