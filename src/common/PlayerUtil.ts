export function getPlayerLibelle(player: Player): string {
  return `${player.firstName}${player.pseudo}${player.name}`;
};

export function getPlayerFullName(player: Player): string {
  return `${player.firstName} ${player.name}`;
}
