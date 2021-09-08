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
