import { FaceNums, Games, offlineOptions } from "../../interfaces/app";
import { FaceValues, Nums } from "../../interfaces/app";
import { dealCards, getValue } from "./general";

export interface returnStruct {
  gain: number;
  win: { hand: Array<string>; winner: string };
}

type GameFunc = (betAmount: number, alwaysBet: boolean) => returnStruct;

const runBlackjack = (betAmount: number, alwaysBet: boolean): returnStruct => {
  let dealerCards = dealCards(2, 10);
  let playerCards = dealCards(2, 10);
  const faceUp = getValue(dealerCards[0]);
  //Player main loop
  let playerSum = getValue(playerCards);
  while (playerSum < 21) {
    if (
      // Basic strategy for blackjack
      playerSum <= 11 ||
      (playerSum === 12 && faceUp <= 3) ||
      (playerSum <= 16 && faceUp <= 7)
    ) {
      playerCards.push(...dealCards(1));
    } else {
      break;
    }

    playerSum = getValue(playerCards);
  }

  let dealerSum = getValue(dealerCards);
  while (dealerSum <= 17) {
    dealerCards.push(...dealCards(1));
    dealerSum = getValue(dealerCards);
  }
  const win = {
    gain: betAmount * 2,
    win: { hand: [playerSum.toString()], winner: "P" },
  };
  const lose = {
    gain: -betAmount,
    win: { hand: [dealerSum.toString()], winner: "D" },
  };
  if (dealerSum > 21 && playerSum < 21) {
    return win;
  }
  if (playerSum <= 21 && playerSum > dealerSum) {
    return win;
  } else {
    return lose;
  }
};

const lookupFuncs = {
  blackjack: runBlackjack,
};

export const runGame = (gameType: Games, options: offlineOptions) => {
  //Each game sim will return a gain amount, as well as the cards that they get
  //(assuming the user has set alwaysBet to true)
  //If they haven't then we check whether the bet is favourable, and place the bet
  let winnings = 0;
  let winningHands: Array<{ hand: Array<string>; winner: string }> = [];
  for (let i = 0; i < options.simulations; i++) {
    const gameFunc = lookupFuncs[gameType] as GameFunc;
    const gameInfo = gameFunc(options.betAmount, options.alwaysBet);
    winnings += gameInfo.gain;
    winningHands.push(gameInfo.win);
  }
  return {
    gain: winnings,
    winningHands,
  };
};

console.log(
  runGame("blackjack", { simulations: 1, betAmount: 10, alwaysBet: true })
);
