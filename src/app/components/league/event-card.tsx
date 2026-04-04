import type { LeagueEvent } from "@/app/interfaces/league";
import { Badge } from "@/components/ui/badge";
import {
  formatEventDate,
  formatLabel,
  playerModeLabel,
} from "@/lib/event-utils";
import Link from "next/link";

interface EventCardProps {
  event: LeagueEvent;
  leagueId: string;
  variant?: "default" | "highlight" | "ongoing" | "incomplete";
}

export function EventCard({
  event,
  leagueId,
  variant = "default",
}: EventCardProps) {
  const playerCount = event.players ? Object.keys(event.players).length : 0;

  const bgClass = {
    default: "bg-card",
    highlight: "bg-primary/10 border-primary/30",
    ongoing: "bg-green-500/10 border-green-500/30",
    incomplete: "bg-destructive/10 border-destructive/30",
  }[variant];

  return (
    <Link href={`/leagues/${leagueId}/events/${event.id}`}>
      <div
        className={`rounded-2xl border p-4 ${bgClass} transition-colors hover:bg-muted/50`}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="font-semibold">{event.title || "Untitled Event"}</p>

            {event.date && (
              <p className="mt-0.5 text-sm text-muted-foreground">
                {formatEventDate(event.date)}
              </p>
            )}

            {event.location && (
              <p className="text-sm text-muted-foreground">{event.location}</p>
            )}

            {event.description && (
              <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                {event.description}
              </p>
            )}
          </div>

          <div className="flex shrink-0 flex-col items-end gap-1">
            {event.format && (
              <Badge variant="secondary">{formatLabel(event.format)}</Badge>
            )}
            {event.playerMode && event.playerMode !== "singles" && (
              <Badge variant="outline">
                {playerModeLabel(event.playerMode)}
              </Badge>
            )}
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          {playerCount > 0 && (
            <span>
              {playerCount} player{playerCount !== 1 ? "s" : ""}
            </span>
          )}

          {event.finished && (
            <Badge variant="outline" className="text-xs">
              Finished
            </Badge>
          )}

          {!event.finished && (event.currentRound ?? 0) > 0 && (
            <Badge className="text-xs bg-green-500/20 text-green-700 border-green-500/30">
              Round {event.currentRound}
              {event.rounds ? ` / ${event.rounds}` : ""}
            </Badge>
          )}

          {event.seasonId && (
            <span className="rounded-full bg-muted px-2 py-0.5">Season</span>
          )}
        </div>
      </div>
    </Link>
  );
}
