export function averageVolleys(player: X01Player): string {
    if(player.volleys.length === 0) return "0";
    const totalPoints = player.volleys.reduce((acc, volley) => {
        return acc + volley.reduce((volleyAcc, dart) => {
            if(dart === '') return volleyAcc;
            if(dart.includes('T')) {
                const points = parseInt(dart.replace('T', '')) || 0;
                return volleyAcc + points * 3;
            } else if(dart.includes('D')) {
                const points = parseInt(dart.replace('D', '')) || 0;
                return volleyAcc + points * 2;
            } else {
                const points = parseInt(dart) || 0;
                return volleyAcc + points;
            }
        }, 0);
    }, 0);
    return (totalPoints / player.volleys.length).toFixed(2);
}

export function nbThrowDarts(player: X01Player): number {
    return player.volleys.reduce((acc, volley) => {
        return acc + volley.filter(dart => dart !== '').length;
    }, 0);
}
