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
  "25"?: number;
  "5"?: number;
  "1"?: number;
}

export interface MoreMoney {
  "1000"?: { increaseAmount: number; currentAmount: number };
  "500"?: { increaseAmount: number; currentAmount: number };
  "100"?: { increaseAmount: number; currentAmount: number };
  "50"?: { increaseAmount: number; currentAmount: number };
  "25"?: { increaseAmount: number; currentAmount: number };
  "5"?: { increaseAmount: number; currentAmount: number };
  "1"?: { increaseAmount: number; currentAmount: number };
}

export type Values = "1" | "5" | "10" | "20" | "50" | "100" | "500" | "1000";
