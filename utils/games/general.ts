import { FaceNums } from "../../interfaces/app";

export const dealCards = (cards: number, max?: number) => {
  let dealtCards: Array<FaceNums> = [];
  for (let i = 0; i < cards; i++) {
    const values = ["C", "S", "D", "H"];
    const value = values[Math.floor(Math.random() * values.length)];
    const num = Math.ceil(Math.random() * 13 || max);
    //@ts-ignore
    dealtCards.push(value + num.toString());
  }
  return dealtCards;
};

export const getValue = (card: FaceNums | Array<FaceNums>) => {
  if (Array.isArray(card)) {
    const cardNums = card.map((value) => parseInt(value.split("")[1]));
    return cardNums.reduce((a, b) => a + b, 0);
  } else {
    return parseInt(card.split("")[1]);
  }
};
