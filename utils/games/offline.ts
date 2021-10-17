import { FaceNums, Games, offlineOptions } from "../../interfaces/app";
import { FaceValues, Nums } from "../../interfaces/app";
import { initCards, getValue, processHand, flipCoins } from "./general";
import * as ps from "pokersolver";
const Hand = ps.Hand;

export interface returnStruct {
  gain: number;
  win: { hand: string | FaceNums; winner: string };
}

type GameFunc = (betAmount: number, alwaysBet: boolean) => returnStruct;

const runBlackjack = (betAmount: number, alwaysBet: boolean): returnStruct => {
  const dealCards = initCards();
  let dealerCards = dealCards(2, 10);
  let playerCards = dealCards(2, 10);
  const faceUp = getValue(dealerCards[0]);
  //Player main loop
  let playerSum = getValue(playerCards, true);
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

    playerSum = getValue(playerCards, true);
  }

  let dealerSum = getValue(dealerCards, true);
  while (dealerSum <= 17) {
    dealerCards.push(...dealCards(1));
    dealerSum = getValue(dealerCards, true);
  }
  const win = {
    gain: betAmount,
    win: { hand: playerSum <= 21 ? playerSum.toString() : "Bust", winner: "P" },
  };
  const lose = {
    gain: -betAmount,
    win: { hand: dealerSum <= 21 ? dealerSum.toString() : "Bust", winner: "D" },
  };
  if (dealerSum > 21 && playerSum <= 21) {
    return win;
  }
  if (playerSum <= 21 && playerSum > dealerSum) {
    return win;
  } else {
    return lose;
  }
};

const runTexas = (betAmount: number, alwaysBet: boolean): returnStruct => {
  const dealCards = initCards();
  const playerCards = dealCards(2);
  const dealerCards = dealCards(2);
  const tableCards = dealCards(5);
  let playerIn = 0;
  for (let i = 0; i < tableCards.length; i++) {
    const playerCardsCurrent = [...playerCards, ...tableCards.slice(0, i)];
    const hand = Hand.solve(processHand(playerCardsCurrent));
    if (alwaysBet) {
      playerIn += betAmount;
      //Bet if good hand
    } else if (hand.rank > 1) {
      playerIn += betAmount;
    }
  }
  const playerCardsTotal = processHand([...playerCards, ...tableCards]);
  const dealerCardsTotal = processHand([...dealerCards, ...tableCards]);
  let playerResult = Hand.solve(playerCardsTotal);
  playerResult.winner = "P";
  let dealerResult = Hand.solve(dealerCardsTotal);
  dealerResult.winner = "D";
  const winner = Hand.winners([playerResult, dealerResult]);
  if (winner[0].winner === "D") {
    return {
      gain: -playerIn,
      win: {
        hand: dealerResult.name,
        winner: "D",
      },
    };
  } else {
    return {
      gain: playerIn,
      win: {
        hand: playerResult.name,
        winner: "P",
      },
    };
  }
};

const runTwoup = (betAmount: number, alwaysBet: boolean): returnStruct => {
  const options = ["HH", "TT", "HT", "TH"];

  const playerBet = options[Math.floor(Math.random() * options.length)];
  const dealerBet = options[Math.round(Math.random() * options.length)];

  const result = flipCoins(2).join("");
  if (dealerBet === result) {
    return {
      gain: -betAmount,
      win: {
        hand: result,
        winner: "D",
      },
    };
  } else if (playerBet === result) {
    return {
      gain: betAmount,
      win: {
        hand: result,
        winner: "P",
      },
    };
  } else {
    return {
      gain: 0,
      win: {
        hand: "No One",
        winner: "P",
      },
    };
  }
};

const runAceydeucy = (betAmount: number, alwaysBet: boolean): returnStruct => {
  const dealCards = initCards();

  const cards = dealCards(2);
  const cardValues = getValue(cards) as number[];

  const biggest = Math.max(...cardValues);
  const smallest = Math.min(...cardValues);

  const diff = biggest - smallest;

  let bet = 0;
  if (alwaysBet || diff > 8) {
    bet = betAmount;
  }

  const [third] = dealCards(1);

  if (getValue(third) > smallest && getValue(third) < biggest) {
    return {
      gain: bet,
      win: {
        winner: "P",
        hand: [...cards, third].join(", "),
      },
    };
  } else {
    return {
      gain: -bet,
      win: {
        winner: "D",
        hand: "Loss",
      },
    };
  }
};

const lookupFuncs: { [key in Games]: GameFunc } = {
  blackjack: runBlackjack,
  texas: runTexas,
  twoup: runTwoup,
  aceyduecy: runAceydeucy,
};

export const runGame = (gameType: Games, options: offlineOptions) => {
  //Each game sim will return a gain amount, as well as the cards that they get
  //(assuming the user has set alwaysBet to true)
  //If they haven't then we check whether the bet is favourable, and place the bet
  let winnings = 0;
  let winningHands: Array<{ hand: string; winner: string; earnings: number }> =
    [];
  for (let i = 0; i < options.simulations; i++) {
    const gameFunc = lookupFuncs[gameType];
    const gameInfo = gameFunc(options.betAmount, options.alwaysBet);
    console.log(winnings, gameInfo.gain);
    winnings += gameInfo.gain;
    const result = { ...gameInfo.win, earnings: gameInfo.gain };
    winningHands.push(result);
  }
  return {
    gain: winnings,
    winningHands,
  };
};
