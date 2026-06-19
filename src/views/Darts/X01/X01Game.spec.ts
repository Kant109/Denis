import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { ref } from 'vue'
import X01Game from './X01Game.vue'
import { useX01GameStore } from '@/stores/X01GameStore'

const pushMock = vi.fn()

vi.mock('vue-router', () => ({
  useRouter: () => ({ push: pushMock }),
}))

vi.mock('@/composables/useWebSocket', () => ({
  useWebSocket: () => ({
    send: vi.fn(),
    status: ref('OPEN'),
  }),
}))

describe('X01Game history events UI', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    pushMock.mockReset()
  })

  it('does not render history panel when there are no events', () => {
    const store = useX01GameStore()
    store.games = []

    const wrapper = mount(X01Game, {
      global: {
        stubs: {
          Header: true,
          X01Player: true,
          X01Board: true,
        },
      },
    })

    expect(wrapper.find('.legs-history').exists()).toBe(false)
  })

  it('renders latest event first and highlights end_match entries', () => {
    const store = useX01GameStore()

    store.games = [
      {
        eventType: 'end_leg',
        players: [
          {
            id: 1,
            pseudo: 'A',
            firstname: 'Alice',
            name: 'One',
            isActive: false,
            points: 0,
            volleys: [['T20', 'T20', 'D20']],
            sets: 0,
            legs: 1,
            average: 0,
            nbThrows: 0,
            nbDarts: 0,
          },
        ],
      },
      {
        eventType: 'end_match',
        players: [
          {
            id: 2,
            pseudo: 'B',
            firstname: 'Bob',
            name: 'Two',
            isActive: false,
            points: 0,
            volleys: [['T20', 'T19', 'D12']],
            sets: 1,
            legs: 0,
            average: 0,
            nbThrows: 0,
            nbDarts: 0,
          },
        ],
      },
    ]

    const wrapper = mount(X01Game, {
      global: {
        stubs: {
          Header: true,
          X01Player: true,
          X01Board: true,
        },
      },
    })

    const labels = wrapper.findAll('.event-label').map(node => node.text())

    expect(labels[0]).toBe('Fin de match')
    expect(labels[1]).toContain('Fin de leg')

    const firstItem = wrapper.findAll('.legs-history-item')[0]
    expect(firstItem.classes()).toContain('is-match-end')
  })
})
