interface X01Game {
    stats: Array<{
        player: X01Player,
        points: number,
        volleys: Array<Array<string>>,
        sets: number,
        legs: number,
        average: number,
        nbThrows: number,
        nbDarts: number,
    }>
}