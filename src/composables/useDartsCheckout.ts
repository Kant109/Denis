import checkoutsJSON from '@/json/darts-checkouts.json';

interface CheckoutCombo {
  darts: number;
  combo: string[];
}

interface CheckoutEntry {
  score: number;
  combinations: CheckoutCombo[];
}

type CheckoutData = Record<string, CheckoutEntry>;

export function getCheckouts(number: number): Array<Array<string>> | null {

  const checkouts = checkoutsJSON as CheckoutData;

  if (!checkouts[number]) {
    return null;
  }

  return checkouts[number].combinations.slice(0, 5).map(combination => combination.combo);
}