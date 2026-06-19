import { describe, it, expect } from 'vitest'
import { X01MatchStatsSchema } from '@/common/X01StatsValidationSchema'
import type { X01PlayerMatchStatsAPI } from '@/interfaces/X01MatchStatsInterface'

describe('X01MatchStats - Validation Schema', () => {
  describe('Valid X01MatchStats payloads', () => {
    it('should validate a complete X01MatchStats with valid data', () => {
      const validPayload = {
        mode: '501',
        setsTarget: 3,
        legsTarget: 5,
        eventsCount: 12,
        legsPlayed: 8,
        winnerPlayerId: 1,
        players: [
          {
            playerId: 1,
            legsWon: 3,
            setsWon: 1
          },
          {
            playerId: 2,
            legsWon: 2,
            setsWon: 0
          }
        ]
      }

      const result = X01MatchStatsSchema.safeParse(validPayload)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.mode).toBe('501')
        expect(result.data.winnerPlayerId).toBe(1)
        expect(result.data.players).toHaveLength(2)
      }
    })

    it('should validate X01MatchStats with mode 301', () => {
      const validPayload = {
        mode: '301',
        setsTarget: 2,
        legsTarget: 3,
        eventsCount: 5,
        legsPlayed: 4,
        winnerPlayerId: 2,
        players: [
          {
            playerId: 1,
            legsWon: 1,
            setsWon: 0
          },
          {
            playerId: 2,
            legsWon: 3,
            setsWon: 1
          }
        ]
      }

      const result = X01MatchStatsSchema.safeParse(validPayload)
      expect(result.success).toBe(true)
    })
  })

  describe('Invalid X01MatchStats payloads', () => {
    it('should reject invalid mode value', () => {
      const invalidPayload = {
        mode: '1001',
        setsTarget: 3,
        legsTarget: 5,
        eventsCount: 12,
        legsPlayed: 8,
        winnerPlayerId: 1,
        players: []
      }

      const result = X01MatchStatsSchema.safeParse(invalidPayload)
      expect(result.success).toBe(false)
    })

    it('should reject missing required fields', () => {
      const incompletePayload = {
        mode: '501',
        setsTarget: 3,
        legsTarget: 5
        // missing eventsCount, legsPlayed, winnerPlayerId, players
      }

      const result = X01MatchStatsSchema.safeParse(incompletePayload)
      expect(result.success).toBe(false)
    })

    it('should reject non-numeric setsTarget', () => {
      const invalidPayload = {
        mode: '501',
        setsTarget: 'three',
        legsTarget: 5,
        eventsCount: 12,
        legsPlayed: 8,
        winnerPlayerId: 1,
        players: []
      }

      const result = X01MatchStatsSchema.safeParse(invalidPayload)
      expect(result.success).toBe(false)
    })

    it('should reject empty players array for multi-player game', () => {
      const invalidPayload = {
        mode: '501',
        setsTarget: 3,
        legsTarget: 5,
        eventsCount: 12,
        legsPlayed: 8,
        winnerPlayerId: 1,
        players: [] // Should have at least 2 players
      }

      const result = X01MatchStatsSchema.safeParse(invalidPayload)
      expect(result.success).toBe(false)
    })

    it('should reject X01PlayerMatchStats with missing playerId', () => {
      const invalidPayload = {
        mode: '501',
        setsTarget: 3,
        legsTarget: 5,
        eventsCount: 12,
        legsPlayed: 8,
        winnerPlayerId: 1,
        players: [
          {
            // missing playerId
            legsWon: 3,
            setsWon: 1
          }
        ]
      }

      const result = X01MatchStatsSchema.safeParse(invalidPayload)
      expect(result.success).toBe(false)
    })

    it('should reject negative values for legsWon/setsWon', () => {
      const invalidPayload = {
        mode: '501',
        setsTarget: 3,
        legsTarget: 5,
        eventsCount: 12,
        legsPlayed: 8,
        winnerPlayerId: 1,
        players: [
          {
            playerId: 1,
            legsWon: -1,
            setsWon: 1
          }
        ]
      }

      const result = X01MatchStatsSchema.safeParse(invalidPayload)
      expect(result.success).toBe(false)
    })
  })
})

