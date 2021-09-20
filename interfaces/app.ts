export interface User {
  userID: string;
  userName: string;
  email: string;
  balance: Balance;
}

export interface Balance {
  "1000"?: number;
  "500"?: number;
  "100"?: number;
  "50"?: number;
  "20"?: number;
  "5"?: number;
  "1"?: number;
}

export interface MoreMoney {
  "1000"?: MoreMoneyShape;
  "500"?: MoreMoneyShape;
  "100"?: MoreMoneyShape;
  "50"?: MoreMoneyShape;
  "20"?: MoreMoneyShape;
  "5"?: MoreMoneyShape;
  "1"?: MoreMoneyShape;
}
interface MoreMoneyShape {
  increaseAmount: number;
  currentAmount: number;
}

export type Values = "1" | "5" | "20" | "50" | "100" | "500" | "1000";

export interface offlineOptions {
  simulations: number;
  betAmount: number;
  alwaysBet: boolean;
}

export interface offlineResults {
  gain: number;
  winningHands: {
    hand: string[];
    winner: string;
  }[];
}

export type Games = "blackjack" | "texas" | "twoup" | "aceyduecy";

export type FaceValues = "C" | "S" | "H" | "D";
export type Nums = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13;
export type FaceNums = `${FaceValues}${Nums}`;
