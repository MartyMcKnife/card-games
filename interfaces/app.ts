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
