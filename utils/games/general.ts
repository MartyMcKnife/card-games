import { FaceNums } from "../../interfaces/app";

const dealCard = (dealtCards: Array<FaceNums>, max?: number): FaceNums => {
  const values = ["C", "S", "D", "H"];
  const value = values[Math.floor(Math.random() * values.length)];
  const num = Math.ceil(Math.random() * 13 || max);
  let card = (value + num.toString()) as FaceNums;
  if (dealtCards.includes(card)) {
    card = dealCard(dealtCards, max);
    return card;
  }
  dealtCards.push(card);
  return card;
};
export const initCards = () => {
  let dealtCards: Array<FaceNums> = [];
  return (cards: number, max?: number) => {
    let returnCards: Array<FaceNums> = [];
    for (let i = 0; i < cards; i++) {
      let card = dealCard(dealtCards, max);
      returnCards.push(card);
    }
    return returnCards;
  };
};

export const getValue = (
  card: FaceNums | Array<FaceNums>,
  totalArr: boolean = false
) => {
  if (Array.isArray(card)) {
    const cardNums = card.map((value) => parseInt(value.slice(1)));
    if (totalArr) {
      return cardNums.reduce((a, b) => a + b, 0);
    } else {
      return cardNums;
    }
  } else {
    return parseInt(card.slice(1));
  }
};

export const getFaces = (card: FaceNums | Array<FaceNums>): Array<string> => {
  if (Array.isArray(card)) {
    return card.map((value) => value.split("")[0]);
  } else {
    return [card];
  }
};

export const processHand = (hand: Array<FaceNums>) => {
  // For any card library which requires cards in the format A, 2, 3, 4, 5, 6, 7, 8, 9, T, J, Q, K
  const suite = getFaces(hand);
  const pSuite = suite.map((suit) => suit.toLowerCase());
  const value = getValue(hand);
  return hand.map((card, i) => {
    switch (value[i]) {
      case 1:
        return `A${pSuite[i]}`;
      case 10:
        return `T${pSuite[i]}`;
      case 11:
        return `J${pSuite[i]}`;
      case 12:
        return `Q${pSuite[i]}`;
      case 13:
        return `K${pSuite[i]}`;
      default:
        return `${value[i]}${pSuite[i]}`;
    }
  });
};
