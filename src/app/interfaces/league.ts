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
  competitionType?: string;
  format?: string;
  validRounds?: number;
  admins?: string[];
  events?: LeagueEvent[];
  seasons?: LeagueSeason[];
  imagePath?: string;
}

export interface LeagueEvent {
  id: string;
  title?: string;
  date?: string;
  location?: string;
  description?: string;
  finished?: boolean;
  currentRound?: number;
  rounds?: number;
  competitionType?: string;
  format?: string;
  playerMode?: string;
  limit?: number;
  seasonId?: string;
  divisionsEnabled?: boolean;
  divisions?: string[];
  players?: Record<string, LeagueEventPlayer>;
  formatConfig?: Record<string, unknown>;
  dstIndex?: number;
  matches?: LeagueEventMatch[];
}

export interface LeagueEventPlayer {
  displayName?: string;
  name?: string;
  isDummy?: boolean;
  division?: string;
  pairId?: string;
  rounds?: LeagueEventRound[];
}

export interface LeagueEventRound {
  hits?: number;
  putts?: number;
  dns?: boolean;
  dnf?: boolean;
  hitsPerSequence?: number[];
  puttsPerSequence?: number[];
}

export interface MatchSide {
  uid?: string;
  score?: number;
  winner?: boolean;
  sequences?: number[];
  members?: { uid?: string; sequences?: number[] }[];
}

export interface LeagueEventMatch {
  player1: MatchSide;
  player2: MatchSide;
  finished?: boolean;
}

export interface LeagueSeason {
  id: string;
  title: string;
}
