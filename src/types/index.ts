// Re-export auth types
export * from './auth';

// User types (extended from auth)
export interface UserProfile {
  id: string;
  username: string;
  displayName: string;
  avatar?: string;
  points: number;
  level: number;
  joinedAt: Date;
  isVip: boolean;
  isModerator: boolean;
  isSubscriber: boolean;
  provider: 'kick';
}

// Leaderboard types
export interface LeaderboardEntry {
  rank: number;
  userId: string;
  username: string;
  avatar?: string;
  wager: number; // Total money wagered
  prize: number; // Total prize money won
}

// Giveaway types
export interface Giveaway {
  id: string;
  title: string;
  description: string;
  prize: string;
  imageUrl?: string;
  entries: GiveawayEntry[];
  maxEntries?: number;
  pointsCost: number;
  numberOfWinners: number; // How many winners will be selected
  startsAt: Date;
  endsAt: Date;
  isActive: boolean;
  winners?: GiveawayWinner[]; // Selected winners after giveaway ends
}

export interface GiveawayEntry {
  userId: string;
  username: string;
  enteredAt: Date;
}

export interface GiveawayWinner {
  userId: string;
  username: string;
  avatar?: string;
  wonAt: Date;
}

// Bonus Hunt types
// open: Streamer is preparing bonus list, players can predict
// started: Bonus opening has begun, predictions are closed
// completed: All bonuses opened, winners determined
export type BonusHuntStatus = 'open' | 'started' | 'completed';

export interface BonusHunt {
  id: string;
  name: string;
  startBalance: number;
  finalBalance?: number;
  bonuses: Bonus[];
  guesses: BonusHuntGuess[];
  status: BonusHuntStatus;
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  winners?: BonusHuntWinner[];
}

export interface Bonus {
  id: string;
  slotName: string;
  provider: string; // e.g., "Pragmatic Play", "NetEnt", etc.
  betSize: number;
  result?: number; // The payout when opened (null until revealed)
  isOpened: boolean;
  openedAt?: Date;
  multiplier?: number; // Calculated as result / betSize
}

export interface BonusHuntGuess {
  id: string;
  visibleUserId: string;
  userId: string;
  username: string;
  avatar?: string;
  guessedBalance: number;
  guessedAt: Date;
}

export interface BonusHuntWinner {
  rank: 1 | 2 | 3;
  visibleUserId: string;
  userId: string;
  username: string;
  avatar?: string;
  guessedBalance: number;
  difference: number; // How far off from actual
  prize: number; // Points won
}

// Stream info
export interface StreamInfo {
  isLive: boolean;
  title: string;
  game: string;
  viewerCount: number;
  startedAt?: Date;
  thumbnailUrl?: string;
}

// Notification types
export interface Notification {
  id: string;
  type: 'win' | 'giveaway' | 'bonus_hunt' | 'level_up' | 'system';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

// Tournament types
export interface Tournament {
  id: string;
  title: string;
  description: string;
  prize: string;
  tournamentType: 8 | 16; // Number of players
  maxParticipants?: number;
  participants: TournamentParticipant[];
  bracket?: TournamentBracketMatch[];
  startsAt: Date;
  endsAt: Date;
  isActive: boolean;
  winnerId?: string;
  winnerUsername?: string;
  leaderboard?: TournamentLeaderboardEntry[];
}

export interface TournamentBracketMatch {
  id: string;
  player1?: {
    id: string;
    username: string;
    avatar?: string;
  };
  player2?: {
    id: string;
    username: string;
    avatar?: string;
  };
  winner?: string; // player id
  round: 'quarterfinals' | 'semifinals' | 'finals' | 'round16';
}

export interface TournamentParticipant {
  userId: string;
  username: string;
  avatar?: string;
  seed?: number;
  joinedAt: Date;
}

export interface TournamentLeaderboardEntry {
  rank: number;
  userId: string;
  username: string;
  avatar?: string;
  score: number;
  prize?: number;
}

// Socket event types
export interface SocketEvents {
  // Giveaway events
  'giveaway:created': (giveaway: Giveaway) => void;
  'giveaway:entry': (giveawayId: string, entry: GiveawayEntry) => void;
  'giveaway:winner': (giveawayId: string, winnerId: string, winnerUsername: string) => void;

  // Bonus Hunt events
  'bonushunt:created': (hunt: BonusHunt) => void;
  'bonushunt:started': (huntId: string) => void;
  'bonushunt:guess': (huntId: string, guess: BonusHuntGuess) => void;
  'bonushunt:bonus_opened': (huntId: string, bonus: Bonus) => void;
  'bonushunt:completed': (huntId: string, finalBalance: number, winners: BonusHuntWinner[]) => void;

  // Tournament events
  'tournament:created': (tournament: Tournament) => void;
  'tournament:entry': (tournamentId: string, participant: TournamentParticipant) => void;
  'tournament:update': (tournamentId: string, leaderboard: TournamentLeaderboardEntry[]) => void;
  'tournament:completed': (tournamentId: string, winnerId: string, winnerUsername: string) => void;

  // User events
  'user:points_update': (userId: string, points: number) => void;
  'user:level_up': (userId: string, newLevel: number) => void;

  // Stream events
  'stream:status': (info: StreamInfo) => void;
}
