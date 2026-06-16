interface X01Game {
    id: number,
    players: Array<X01Player>,
    mode: '301' | '501',
    sets: number,
    legs: number,
}

interface X01GameSession extends X01Game {
    status: 'active' | 'finished',
    startedAt: string,
    endedAt?: string,
    winnerPlayer?: X01Player,
}