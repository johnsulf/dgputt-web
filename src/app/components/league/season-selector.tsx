"use client";

import type { LeagueSeason } from "@/app/interfaces/league";
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

interface SeasonSelectorProps {
  seasons: LeagueSeason[];
  activeSeasonId?: string;
  selectedSeasonId: string | null;
  onSeasonChange: (seasonId: string | null) => void;
}

export function SeasonSelector({
  seasons,
  activeSeasonId,
  selectedSeasonId,
  onSeasonChange,
}: SeasonSelectorProps) {
  if (seasons.length === 0) return null;

  const activeSeason = seasons.find((s) => s.id === activeSeasonId);
  const selectedLabel =
    selectedSeasonId === null
      ? "All seasons"
      : seasons.find((s) => s.id === selectedSeasonId)?.title ??
        selectedSeasonId;

  return (
    <Select
      value={selectedSeasonId ?? "__all__"}
      onValueChange={(v) => onSeasonChange(v === "__all__" ? null : v)}
    >
      <SelectTrigger>
        <SelectValue placeholder="Season">{selectedLabel}</SelectValue>
      </SelectTrigger>
      <SelectContent align="start">
        <SelectGroup>
          <SelectLabel>Season</SelectLabel>
          <SelectItem value="__all__">All seasons</SelectItem>
          <SelectSeparator />
          {seasons.map((season) => (
            <SelectItem key={season.id} value={season.id}>
              {season.title}
              {season.id === activeSeasonId ? " (active)" : ""}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
