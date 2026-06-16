interface X01Player {
    id: number,
    pseudo: string,
    firstname: string,
    name: string,
    isActive: boolean,
    points: number,
    volleys: Array<Array<string>>,
    sets: number,
    legs: number,
    average: number,
    nbThrows: number,
    nbDarts: number,
}