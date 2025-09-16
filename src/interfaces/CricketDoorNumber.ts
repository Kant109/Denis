const doorNumbers = [
  15, 16, 17, 18, 19, 20, 25
] as const;
export type CricketDoorNumber = (typeof doorNumbers)[number];
