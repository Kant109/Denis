import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useX01GameStore } from './X01GameStore'

function createPlayer(overrides: Partial<any> = {}) {
  return {
    id: 1,
    pseudo: 'TheBull',
    firstname: 'Denis',
    name: 'R.',
    isActive: true,
    points: 120,
    volleys: [['T20', 'T20', 'D20']],
    sets: 0,
    legs: 0,
    average: 0,
    nbThrows: 0,
    nbDarts: 0,
    ...overrides,
  }
}

describe('X01GameStore - history events', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('stores end_leg by default', () => {
    const store = useX01GameStore()
    const players = [createPlayer()]

    store.addFinishedGame(players)

    expect(store.games).toHaveLength(1)
    expect(store.games[0].eventType).toBe('end_leg')
  })

  it('stores explicit end_match event type', () => {
    const store = useX01GameStore()
    const players = [createPlayer()]

    store.addFinishedGame(players, 'end_match')

    expect(store.games).toHaveLength(1)
    expect(store.games[0].eventType).toBe('end_match')
  })

  it('registers a leg end with explicit store action', () => {
    const store = useX01GameStore()
    const players = [createPlayer()]

    store.registerLegEnd(players)

    expect(store.games).toHaveLength(1)
    expect(store.games[0].eventType).toBe('end_leg')
  })

  it('does not add history when registerLegEnd is not called', () => {
    const store = useX01GameStore()
    const players = [createPlayer()]

    players[0].points = 41

    expect(store.games).toHaveLength(0)
  })

  it('registers a match end with explicit store action', () => {
    const store = useX01GameStore()
    const players = [createPlayer({ points: 0, sets: 2, legs: 0 })]

    store.registerMatchEnd(players)

    expect(store.games).toHaveLength(1)
    expect(store.games[0].eventType).toBe('end_match')
  })

  it('keeps end_leg then end_match order on final leg', () => {
    const store = useX01GameStore()
    const players = [createPlayer({ points: 0, sets: 2, legs: 0 })]

    store.registerLegEnd(players)
    store.registerMatchEnd(players)

    expect(store.games).toHaveLength(2)
    expect(store.games[0].eventType).toBe('end_leg')
    expect(store.games[1].eventType).toBe('end_match')
  })

  it('stores an immutable snapshot of players and volleys', () => {
    const store = useX01GameStore()
    const players = [createPlayer()]

    store.addFinishedGame(players, 'end_leg')

    players[0].firstname = 'Changed'
    players[0].volleys[0][0] = '1'

    expect(store.games[0].players[0].firstname).toBe('Denis')
    expect(store.games[0].players[0].volleys[0][0]).toBe('T20')
  })

  it('computes reusable match stats without counting final leg twice', () => {
    const store = useX01GameStore()
    const firstLegWinner = createPlayer({
      id: 1,
      points: 0,
      sets: 0,
      legs: 1,
      volleys: [['20', '20', 'D20']],
    })
    const opponentAfterFirstLeg = createPlayer({
      id: 2,
      pseudo: 'Opponent',
      firstname: 'Bob',
      name: 'Two',
      points: 80,
      volleys: [['20', '20', '20']],
    })
    const finalLegWinner = createPlayer({
      id: 1,
      points: 0,
      sets: 1,
      legs: 0,
      volleys: [['T20', 'T20', 'D20']],
    })
    const opponentAfterFinalLeg = createPlayer({
      id: 2,
      pseudo: 'Opponent',
      firstname: 'Bob',
      name: 'Two',
      points: 60,
      sets: 0,
      legs: 0,
      volleys: [['20', '20', '20']],
    })

    store.mode = '301'
    store.sets = 1
    store.legs = 2

    store.registerLegEnd([firstLegWinner, opponentAfterFirstLeg])
    store.registerLegEnd([finalLegWinner, opponentAfterFinalLeg])
    store.setWinner(finalLegWinner)
    store.registerMatchEnd([finalLegWinner, opponentAfterFinalLeg])

    store.computeMatchStats()

    expect(store.matchStats).not.toBeNull()
    expect(store.matchStats?.legsPlayed).toBe(2)
    expect(store.matchStats?.eventsCount).toBe(3)
    expect(store.matchStats?.winnerPlayerId).toBe(1)

    const winnerStats = store.matchStats?.players.find((player) => player.playerId === 1)
    expect(winnerStats?.totalPoints).toBe(240)
    expect(winnerStats?.dartsThrown).toBe(6)
  })

  it('clears reusable match stats on reset', () => {
    const store = useX01GameStore()
    const players = [createPlayer({ points: 0 })]

    store.registerLegEnd(players)
    store.setWinner(players[0])
    store.registerMatchEnd(players)
    store.computeMatchStats()

    store.reset()

    expect(store.matchStats).toBeNull()
    expect(store.games).toHaveLength(0)
  })
})
