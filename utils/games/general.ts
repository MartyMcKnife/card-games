import { FaceNums, RPlayers } from "../../interfaces/app";

const clamp = (num: number, min: number, max: number) =>
  Math.min(Math.max(num, min), max);

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
  totalArr: boolean = false,
  max: number = 13
) => {
  if (Array.isArray(card)) {
    const cardNums = card.map((value) =>
      clamp(parseInt(value.slice(1)), 0, max)
    );
    if (totalArr) {
      return cardNums.reduce((a, b) => a + b, 0);
    } else {
      return cardNums;
    }
  } else {
    return clamp(parseInt(card.slice(1)), 0, max);
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

export const flipCoins = (amount: number) => {
  const faces = ["H", "T"];
  let coins = [];
  for (let i = 0; i < amount; i++) {
    coins.push(faces[Math.floor(Math.random() * amount)]);
  }
  return coins;
};

export const getUsername = (uid: string, players: RPlayers[]) => {
  return players.find((player) => player.userID === uid).username;
};

//Because i am idoit, i name all the cards back to front
//This fixes that
export const swapCards = (cardValue: FaceNums) => {
  const arr = cardValue.split("");
  //Get suite
  const suite = arr[0];
  //Push to back, and remove it from the front
  arr.shift();
  arr.push(suite);
  return arr.join("");
};

export const getMax = (nums: number[], max: number = 0) => {
  let numbers = nums;
  if (max) {
    numbers = nums.filter((num) => num <= max);
  }
  return Math.max(...numbers);
};
