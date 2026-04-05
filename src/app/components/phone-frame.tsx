import { cn } from "@/lib/utils";

export default function PhoneFrame({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    <div className="rounded-[2.5rem] outline-1 border-6 border-neutral-800 outline-gray-500 overflow-hidden">
      <img src={src} alt={alt} className={cn("h-120 w-auto", className)} />
    </div>
  );
}
