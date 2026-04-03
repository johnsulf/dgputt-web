import { Skeleton } from "@/components/ui/skeleton";

function SkeletonCard() {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4">
      <Skeleton className="size-12 rounded-full" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
      <div className="flex gap-1.5">
        <Skeleton className="h-5 w-14 rounded-full" />
      </div>
    </div>
  );
}

export function LeaguesSkeleton() {
  return (
    <div className="flex flex-col gap-4 p-4">
      {/* Search bar */}
      <Skeleton className="h-9 w-full rounded-4xl" />

      {/* Section */}
      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-24" />
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
