type X01GameEventType = 'end_leg' | 'end_match'

interface X01Game {
    eventType: X01GameEventType,
    players: Array<X01Player>,
}