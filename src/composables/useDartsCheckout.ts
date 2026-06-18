import checkoutsJSON from '@/json/darts-checkouts.json';

interface CheckoutModel {
  "score": number;
  "combinations": Array<CheckoutCombination>;
}

interface CheckoutCombination {
  "dart": number;
  "combo": Array<string>;
}

export function getCheckouts(number: number): Array<Array<string>> {

  const checkouts = checkoutsJSON as CheckoutModel[];

  return checkouts[number].combinations.slice(0, 5).map(combination => combination.combo);
}