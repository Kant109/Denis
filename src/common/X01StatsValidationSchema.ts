/**
 * Validation Schema for X01 Match Statistics
 * 
 * Provides Zod schemas for runtime validation of X01MatchStats API payloads,
 * ensuring data integrity for both frontend and backend.
 * 
 * Usage:
 *   const result = X01MatchStatsSchema.safeParse(data)
 *   if (result.success) {
 *     // Use result.data
 *   } else {
 *     // Handle result.error
 *   }
 */

import { z } from 'zod'
import type { X01PlayerMatchStatsAPI } from '@/interfaces/X01MatchStatsInterface'

/**
 * Schema for X01PlayerMatchStats API validation
 * 
 * Validates minimal required player stats:
 * - playerId: positive integer
 * - legsWon: non-negative integer
 * - setsWon: non-negative integer
 * 
 * Note: `.strict()` prevents additional fields from being accepted,
 * ensuring clean API contracts.
 */
export const X01PlayerMatchStatsAPISchema = z.object({
  playerId: z
    .number()
    .int()
    .positive('playerId must be a positive integer'),
  legsWon: z
    .number()
    .int()
    .nonnegative('legsWon must be a non-negative integer'),
  setsWon: z
    .number()
    .int()
    .nonnegative('setsWon must be a non-negative integer')
}).strict()

/**
 * Schema for X01MatchStats API payload validation
 * 
 * Validates the match-level data:
 * - mode: must be '301' (beginner) or '501' (standard)
 * - setsTarget & legsTarget: positive integers (game targets)
 * - eventsCount & legsPlayed: non-negative integers (match statistics)
 * - winnerPlayerId: positive integer (must reference a valid player)
 * - players: array with minimum 2 players (required for competitive match)
 * 
 * Constraints:
 * - `.strict()` rejects unknown fields
 * - `.min(2)` on players array ensures minimum valid match structure
 */
export const X01MatchStatsSchema = z.object({
  mode: z
    .enum(['301', '501'])
    .refine(
      (mode) => ['301', '501'].includes(mode),
      { message: "mode must be either '301' or '501'" }
    ),
  setsTarget: z
    .number()
    .int()
    .positive('setsTarget must be a positive integer'),
  legsTarget: z
    .number()
    .int()
    .positive('legsTarget must be a positive integer'),
  eventsCount: z
    .number()
    .int()
    .nonnegative('eventsCount must be a non-negative integer'),
  legsPlayed: z
    .number()
    .int()
    .nonnegative('legsPlayed must be a non-negative integer'),
  winnerPlayerId: z
    .number()
    .int()
    .positive('winnerPlayerId must be a positive integer'),
  players: z
    .array(X01PlayerMatchStatsAPISchema)
    .min(2, 'A match requires at least 2 players')
}).strict()

/** 
 * Inferred TypeScript type from the validation schema
 * Use this for runtime-validated X01MatchStats objects
 */
export type X01MatchStatsValidated = z.infer<typeof X01MatchStatsSchema>
