"use client";

import { useLeagues, type SortOption } from "@/lib/leagues-context";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "titleA", label: "Title A–Z" },
  { value: "titleZ", label: "Title Z–A" },
  { value: "location", label: "Location" },
  { value: "creationNewest", label: "Newest first" },
  { value: "creationOldest", label: "Oldest first" },
];

export function LeagueFilters() {
  const {
    sortOption,
    setSortOption,
    selectedLocation,
    setSelectedLocation,
    availableLocations,
  } = useLeagues();

  const activeFilterCount =
    (sortOption !== "titleA" ? 1 : 0) + (selectedLocation ? 1 : 0);

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Sort */}
      <Select
        value={sortOption}
        onValueChange={(v) => setSortOption(v as SortOption)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Sort">
            {SORT_OPTIONS.find((o) => o.value === sortOption)?.label}
          </SelectValue>
        </SelectTrigger>
        <SelectContent align="start">
          <SelectGroup>
            <SelectLabel>Sort by</SelectLabel>
            {SORT_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      {/* Location */}
      {availableLocations.length > 0 && (
        <Select
          value={selectedLocation ?? ""}
          onValueChange={(v) => setSelectedLocation(v || null)}
        >
          <SelectTrigger>
            <SelectValue placeholder="All locations" />
          </SelectTrigger>
          <SelectContent align="start">
            <SelectGroup>
              <SelectLabel>Location</SelectLabel>
              {availableLocations.map((loc) => (
                <SelectItem key={loc} value={loc}>
                  {loc}
                </SelectItem>
              ))}
            </SelectGroup>
            {selectedLocation && (
              <>
                <SelectSeparator />
                <SelectGroup>
                  <SelectItem value="">All locations</SelectItem>
                </SelectGroup>
              </>
            )}
          </SelectContent>
        </Select>
      )}

      {/* Clear filters */}
      {activeFilterCount > 0 && (
        <button
          onClick={() => {
            setSortOption("titleA");
            setSelectedLocation(null);
          }}
          className="text-xs text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}
