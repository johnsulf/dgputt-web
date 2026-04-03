"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useAuth } from "@/lib/auth-context";
import { fetchLeagues, fetchFavouriteLeagueIds } from "@/lib/league-service";
import type { LeagueInstance } from "@/app/interfaces/league";

type SortOption =
  | "titleA"
  | "titleZ"
  | "location"
  | "creationOldest"
  | "creationNewest";

interface LeaguesContextType {
  leagues: LeagueInstance[];
  archivedLeagues: LeagueInstance[];
  favouriteLeagueIds: string[];
  isLoading: boolean;
  hasError: boolean;
  errorMessage: string | null;
  searchTerm: string;
  sortOption: SortOption;
  filteredLeagues: LeagueInstance[];
  setSearchTerm: (term: string) => void;
  setSortOption: (option: SortOption) => void;
  refresh: () => Promise<void>;
}

const LeaguesContext = createContext<LeaguesContextType | undefined>(undefined);

export function LeaguesProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();

  const [allLeagues, setAllLeagues] = useState<LeagueInstance[]>([]);
  const [favouriteLeagueIds, setFavouriteLeagueIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState<SortOption>("titleA");

  const loadLeagues = useCallback(async () => {
    if (!user) {
      setAllLeagues([]);
      setFavouriteLeagueIds([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setHasError(false);
    setErrorMessage(null);

    try {
      const [leagues, favourites] = await Promise.all([
        fetchLeagues(),
        fetchFavouriteLeagueIds(user.uid),
      ]);

      setAllLeagues(leagues);
      setFavouriteLeagueIds(favourites);
    } catch (error) {
      setHasError(true);
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to load leagues",
      );
    }

    setIsLoading(false);
  }, [user]);

  useEffect(() => {
    loadLeagues();
  }, [loadLeagues]);

  const leagues = useMemo(
    () => allLeagues.filter((l) => !l.archived),
    [allLeagues],
  );

  const archivedLeagues = useMemo(
    () => allLeagues.filter((l) => l.archived),
    [allLeagues],
  );

  const filteredLeagues = useMemo(() => {
    const term = searchTerm.toLowerCase();
    let filtered = leagues.filter((l) =>
      l.title.toLowerCase().includes(term),
    );

    filtered.sort((a, b) => {
      switch (sortOption) {
        case "titleA":
          return a.title.toLowerCase().localeCompare(b.title.toLowerCase());
        case "titleZ":
          return b.title.toLowerCase().localeCompare(a.title.toLowerCase());
        case "location":
          if (!a.location && !b.location) return 0;
          if (!a.location) return 1;
          if (!b.location) return -1;
          return a.location.toLowerCase().localeCompare(b.location.toLowerCase());
        case "creationOldest":
          return a.id.localeCompare(b.id);
        case "creationNewest":
          return b.id.localeCompare(a.id);
      }
    });

    return filtered;
  }, [leagues, searchTerm, sortOption]);

  return (
    <LeaguesContext.Provider
      value={{
        leagues,
        archivedLeagues,
        favouriteLeagueIds,
        isLoading,
        hasError,
        errorMessage,
        searchTerm,
        sortOption,
        filteredLeagues,
        setSearchTerm,
        setSortOption,
        refresh: loadLeagues,
      }}
    >
      {children}
    </LeaguesContext.Provider>
  );
}

export function useLeagues() {
  const context = useContext(LeaguesContext);
  if (context === undefined) {
    throw new Error("useLeagues must be used within a LeaguesProvider");
  }
  return context;
}
