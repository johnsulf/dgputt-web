import { cn } from "@/lib/utils";
import { ScreenshotPreview } from "./screenshot-preview";

export default function PhoneFrame({
  src,
  alt,
  caption,
  className,
}: {
  src: string;
  alt: string;
  caption?: string;
  className?: string;
}) {
  return (
    <figure className="flex flex-col items-center gap-2">
      <ScreenshotPreview src={src} alt={alt} className="rounded-[2.5rem] outline-1 border-6 border-neutral-800 outline-gray-500 overflow-hidden">
        <img src={src} alt={alt} className={cn("h-120 w-auto", className)} />
      </ScreenshotPreview>
      {caption && (
        <figcaption className="text-sm text-muted-foreground">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
