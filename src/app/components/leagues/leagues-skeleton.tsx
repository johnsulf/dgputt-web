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

function SkeletonSection({ cards = 3 }: { cards?: number }) {
  return (
    <div className="flex flex-col gap-2">
      <Skeleton className="h-7 w-40" />
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: cards }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </div>
  );
}

export function LeaguesSkeleton() {
  return (
    <div className="flex flex-col gap-4 p-4">
      {/* Starred */}
      <SkeletonSection cards={2} />

      {/* Search + filters */}
      <Skeleton className="h-9 w-full rounded-4xl" />
      <div className="flex gap-2">
        <Skeleton className="h-8 w-28 rounded-3xl" />
        <Skeleton className="h-8 w-36 rounded-3xl" />
      </div>

      {/* All leagues */}
      <SkeletonSection cards={6} />
    </div>
  );
}
