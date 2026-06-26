/**
 * X01 Match Statistics Interfaces
 * 
 * This module defines two interface variants:
 * 1. X01PlayerMatchStats & X01MatchStats: Full detailed stats (internal/storage)
 * 2. X01PlayerMatchStatsAPI: Minimal API payload (for validation/transmission)
 * 
 * The API variant is used for:
 * - Backend API validation (schema via X01StatsValidationSchema)
 * - Frontend/backend communication
 * - Deserialized JSON payloads
 */

/**
 * Detailed player statistics in an X01 match
 * 
 * Used internally for comprehensive game tracking and statistics calculation.
 * Contains all performance metrics including darts thrown, volleys, averages, etc.
 */
export interface X01PlayerMatchStats {
    playerId: number,
    pseudo: string,
    firstname: string,
    name: string,
    displayName: string,
    setsWon: number,
    legsWon: number,
    dartsThrown: number,
    volleysPlayed: number,
    totalPoints: number,
    averagePerVolley: number,
    bestVolley: number,
    isWinner: boolean,
}

/**
 * Complete X01 Match Statistics
 * 
 * Used for tracking game state and persistence within the system.
 * Contains detailed player stats and full match metadata.
 */
export interface X01MatchStats {
    mode: '301' | '501',
    setsTarget: number,
    legsTarget: number,
    eventsCount: number,
    legsPlayed: number,
    winnerPlayerId: number | null,
    players: Array<X01PlayerMatchStats>,
}

/**
 * Minimal X01 Player Match Stats for API validation
 * 
 * Used in API payloads and for schema validation.
 * Contains only core required fields: playerId, legs/sets won.
 * 
 * This is the contract used by:
 * - X01MatchStats API endpoints (POST /match-stats)
 * - Frontend match completion data transmission
 * - Zod schema validation (X01StatsValidationSchema)
 * 
 * @example
 * {
 *   playerId: 1,
 *   legsWon: 3,
 *   setsWon: 1
 * }
 */
export interface X01PlayerMatchStatsAPI {
    playerId: number,
    legsWon: number,
    setsWon: number
}


export interface X01PlayerStats {
    playerId: string,
    pseudo: string,
    firstname: string,
    name: string,
    displayName: string,
    matchesPlayed: number,
    wins: number,
    losses: number,
    winRate: number,
    setsWon: number,
    legsWon: number,
    dartsThrown: number,
    volleysPlayed: number,
    totalPoints: number,
    averagePerVolley: number,
    bestVolley: number
}