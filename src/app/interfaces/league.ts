export interface LeagueInstance {
  id: string;
  title: string;
  location?: string;
  contactEmail?: string;
  archived?: boolean;
  isFeatured?: boolean;
  seasonsEnabled?: boolean;
  activeSeasonId?: string;
  divisions?: string[];
}
