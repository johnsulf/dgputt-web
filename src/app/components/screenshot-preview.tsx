"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import { Dialog } from "@base-ui/react/dialog";
import { Cancel01Icon, ZoomInAreaIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { cn } from "@/lib/utils";

export function ScreenshotPreview({
  src,
  alt,
  children,
  className,
}: {
  src: string;
  alt: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Dialog.Root>
      <Dialog.Trigger
        aria-label={`Enlarge screenshot. ${alt}`}
        className={cn(
          "relative block cursor-zoom-in focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring",
          className,
        )}
      >
        {children}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute right-2 bottom-2 grid size-7 place-items-center rounded-full bg-black/75 text-white"
        >
          <HugeiconsIcon icon={ZoomInAreaIcon} size={16} />
        </span>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Popup aria-modal="true" className="fixed inset-0 z-50 bg-black text-white">
          <Dialog.Title className="sr-only">{alt}</Dialog.Title>
          <Dialog.Close
            aria-label="Close screenshot"
            className="relative block size-full cursor-zoom-out p-4 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-white sm:p-8"
          >
            <span className="relative block size-full">
              <Image
                src={src}
                alt=""
                fill
                sizes="100vw"
                className="object-contain"
                draggable={false}
              />
            </span>
            <span
              aria-hidden="true"
              className="absolute top-3 right-3 grid size-10 place-items-center rounded-full bg-black/75 ring-1 ring-white/30"
            >
              <HugeiconsIcon icon={Cancel01Icon} size={22} />
            </span>
          </Dialog.Close>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
