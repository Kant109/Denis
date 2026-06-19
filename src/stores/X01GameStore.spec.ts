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
})
