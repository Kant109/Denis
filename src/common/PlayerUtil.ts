export function getPlayerLibelle(player: Player): string {
  return `${player.firstName}${player.pseudo}${player.name}`;
}
export function getPlayerRankingLibelle(player: PlayerRanking): string {
  return `${player.name}${player.pseudo}${player.lastName}`;
}
export function getPlayerFullName(player: Player): string {
  return `${player.firstName} ${player.name}`;
}
export function getPlayerRankingFullName(player: PlayerRanking): string {
  return `${player.name} ${player.name}`;
}

export function winrate(nbGame: number, nbWin: number): string {
  return((nbWin / nbGame) * 100).toFixed(1).replace('.', ',');
};