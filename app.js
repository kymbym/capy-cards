/*-------------------------------- Constants --------------------------------*/

const cardDeck = [
  "dA", "dQ", "dK", "dJ", "d10", "d09", "d08", "d07", "d06", "d05", "d04", "d03", "d02",
  "hA", "hQ", "hK", "hJ", "h10", "h09", "h08", "h07", "h06", "h05", "h04", "h03", "h02",
  "cA", "cQ", "cK", "cJ", "c10", "c09", "c08", "c07", "c06", "c05", "c04", "c03", "c02",
  "sA", "sQ", "sK", "sJ", "s10", "s09", "s08", "s07", "s06", "s05", "s04", "s03", "s02",
];

/*---------------------------- Variables (state) ----------------------------*/

const game = {
  player: {
    hand: [],
    score: 0,
    isBust: false, // starts as false in a neutral state to commence the game. if player exceed 21, bust is true
    isStanding: false, // player and computer can make decision to stand or hit. if player or computer stands, stand is true
    bank: 1000,
    bet: 0,
  },
  dealer: {
    hand: [],
    score: 0,
    isBust: false,
    isStanding: false,
  },
  message: "", // win $ or dealer win's or push
};

const shownBetCoins = {};

/*------------------------ Cached Element References ------------------------*/

const startPage = document.getElementById("start-page");
const gamePage = document.getElementById("game-page");
const bankCoins = document.getElementById("bank-coins");
const betCoins = document.getElementById("bet-coins");
const betAmount = document.getElementById("bet-display");
const dealButton = document.getElementById("deal-button");
const cardDisplay = document.getElementById("card-display");
const startButton = document.getElementById("start-button");
const hitButton = document.getElementById("hit-button");
const standButton = document.getElementById("stand-button");
const newGameButton = document.getElementById("new-game-button");
const nextRoundButton = document.getElementById("next-round-button");
const buttons = document.getElementById("buttons");

const bankCoinButton = document.querySelectorAll("#bank-coins .bank-coin");
const betCoinButton = document.querySelectorAll("#bet-coins .bet-coin");

const playerHand = document.querySelector("#player-hand");
const dealerHand = document.querySelector("#dealer-hand");

const playersTurn = document.getElementById("player-turn");
const dealersTurn = document.getElementById("dealer-turn");

const betPrompt = document.getElementById("bet-prompt");
const roundResult = document.getElementById("round-result");
const resultMessage = document.getElementById("result-message");
const closeResultMessage = document.getElementById("close-result");
const openRules = document.getElementById("open-rules");
const closeRules = document.getElementById("close-rules");
// const lost = document.getElementById("lost")
// const lostMessage = document.getElementById("lost-message");
// const closeLostMessage = document.getElementById("close-lost")

/*---------------------------- Render Functions -----------------------------*/

const renderBetAmount = () => {
  // render bet amount on display
  document.getElementById("bet-total").innerText = `bet: $${game.player.bet}`;
  getDealButton();
};

const renderplayerBank = () => {
  document.getElementById("bank-total").innerText = `bank: $${game.player.bank}`;};

const renderPlayerScore = () => {
  document.getElementById("player-score").innerText = `player's total: ${game.player.score}`;
};

const renderDealerScore = () => {
  document.getElementById("dealer-score").innerText = `dealer's total: ${game.dealer.score}`;
};

/*-------------------------------- Functions --------------------------------*/

const updateBankCoinVisibility = () => {
  // function to update visibility of bank coin buttons from player's bank amount
  const playerBank = game.player.bank; // determines how much the player is allowed to bet based on bank amount

  bankCoinButton.forEach((button) => {
    const coinValue = parseInt(button.getAttribute("data-value"));
    if (coinValue <= playerBank) {
      // if coinvalue is less or equal to bank amount then show coins
      button.style.display = "flex";
    } else {
      // but if the coinvalue is more than bank amount then it will hide because not enough money
      button.style.display = "none";
    }
  });
};

const getBetCoin = (coinValue) => {
  // getbetcoin function retrieves the bet coin button and displays or hides according to player's action

  const buttonArray = Array.from(betCoinButton);
  for (let i = 0; i < buttonArray.length; i++) {
    const buttonValue = parseInt(buttonArray[i].getAttribute("data-value"));
    if (buttonValue === coinValue) {
      return buttonArray[i];
    }
  }

  return undefined;
};

const getBetCoinDisplay = () => {
  for (let i = 0; i < betCoinButton.length; i++) {
    const button = betCoinButton[i];
    const coinValueString = button.getAttribute("data-value"); // gets the value as a string
    const coinValue = parseInt(coinValueString);
    shownBetCoins[coinValue] = 0;
    button.style.display = "none";
  }
};
getBetCoinDisplay();

const handleBankCoinClick = (event) => {
  const coinValueString = event.target.getAttribute("data-value");
  const coinValue = parseInt(coinValueString);

  if (game.player.bank >= coinValue) {
    game.player.bet += coinValue;
    game.player.bank -= coinValue;

    renderBetAmount();
    renderplayerBank();

    if (betCoins.style.display === "none") {
      betCoins.style.display = "flex";
    }

    const retrieveBetCoinButton = getBetCoin(coinValue); // retrieve bet coin button that matches the value of clicked bank coin button

    if (retrieveBetCoinButton) {
      retrieveBetCoinButton.style.display = "flex";
      shownBetCoins[coinValue]++;
    } else {
      console.log("no money for bets!");
    }
  }
  updateBankCoinVisibility();
  getDealButton();
};

const handleBetCoinClick = (event) => {
  // when player clicks a bet coin button, this is triggered
  const coinValueString = event.target.getAttribute("data-value"); // gets the value as a string
  const coinValue = parseInt(coinValueString);
  if (shownBetCoins[coinValue] > 0) {
    // checks if there are still coins for this value in the bet displayed
    if (game.player.bet >= coinValue) {
      // checks if player has sufficient money in bet to remove coin from bet
      game.player.bet -= coinValue; // removes coin value from player's bet
      game.player.bank += coinValue; // adds coin value to player's bank
      renderBetAmount();
      renderplayerBank();
      shownBetCoins[coinValue]--; // decreases count of coin value in the shownbetcoins object

      if (shownBetCoins[coinValue] === 0) {
        // hides the coin display if no more coin value of the coin is left
        event.target.style.display = "none";
      } else {
        // console.log("not enough coins in the bank to place this bet!");
      }
      updateBankCoinVisibility();
      getDealButton();
    }
  }
};

const getDealButton = () => {
  // deal button is displayed if player bet any amount of money (anything > 0)
  if (game.player.bet > 0) {
    dealButton.style.display = "flex";
  } else {
    // deal button is hidden if no bets placed
    dealButton.style.display = "none";
  }
};

const handleDealButton = () => {
  // when player clicks deal button, this is triggered
  dealCards();
  buttons.style.display = "flex";
  cardDisplay.style.display = "flex"; // cards are displayed
  dealButton.style.display = "none"; // deal button is hidden
  hitButton.style.display = "flex"; // hit button is displayed
  standButton.style.display = "flex"; // stand button is displayed
  newGameButton.style.display = "flex"; // new game button is displayed
  betPrompt.style.display = "none";
  playersTurn.style.display = "flex";

  // disable bank coins and bet coins after clicking deal button
  disableBankCoinButtons();
  disableBetCoinButtons();
};

// searched for the Fisher-Yates shuffle algorithm as i read that this method of shuffling is more shuffled than simply iterating through 52 cards
const shuffleDeck = (deck) => {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)); // generates random index from 0 to i
    [deck[i], deck[j]] = [deck[j], deck[i]]; // swaps card at index i with index j 
  }
  return deck;
};

let shuffledDeck = shuffleDeck(cardDeck.slice()); // stores a shuffled deck of cards into shuffledDeck

// deal card 
const dealCard = (handElement, card, faceDown = false) => { 
  const cardElement = document.createElement("div");
  cardElement.classList.add("card"); // stores card value in data attribute html

  if (faceDown) {
    cardElement.classList.add("face-down"); // add a class for the face down cards
    cardElement.innerText = "";
  } else {
    // cardElement.innerText = card; // displays card value of face-up cards
    cardElement.style.backgroundImage = `url(assets/images/${card}.jpeg)`;
  }

  cardElement.dataset.value = card; // stores card value in card attribute
  handElement.appendChild(cardElement); // add card element to player or dealer hand accordingly DOM!

  if (handElement === playerHand) {
    // if hand is player's hand
    game.player.score = calculateHandScore(playerHand); // calculates player's score with updated hand
    renderPlayerScore();
  } else if (handElement === dealerHand) {
    game.dealer.score = calculateHandScore(dealerHand, true);
    renderDealerScore();
  }
};

// deal initial cards
const dealCards = () => {
  // console.log(`shuffled deck: ${shuffledDeck}`);

  // deal first card to player
  dealCard(playerHand, shuffledDeck.pop());
  // displays card are player-hand html element, removes and returns the last cards from shuffledDeck and sends as a 'card' argument to dealCard(), face up card

  // deal second card to dealer (face down)
  dealCard(dealerHand, shuffledDeck.pop(), true); // handElementement1, card, facedown = true so second card of dealer should be faced down

  // deal third card to player
  dealCard(playerHand, shuffledDeck.pop());

  // deal fourth card to dealer
  dealCard(dealerHand, shuffledDeck.pop());
};

const handleHitButton = () => {
  if (!game.player.isStanding && !game.player.isBust) {
    // if player is not standing and not bust aka player hits
    dealCard(playerHand, shuffledDeck.pop(), false); // deals new card to the player's hand from shuffledDeck

    game.player.score = calculateHandScore(playerHand); // recalculates player total score with addition of card(s)
    renderPlayerScore();
    console.log(game.player.score);

    if (game.player.score > 21) {
      // if player bust > 21
      game.player.isBust = true; // isbust is set to true
      hitButton.style.display = "none"; // hides hit button
      standButton.style.display = "none"; // hides stand button
      playersTurn.style.display = "none";

      determineWinner();
      revealDealerSecondCard(); // reveals dealer's second card automatically if player busts
    }
  }
};

const calculateHandScore = (handElement, isDealer = false) => {
  const cards = handElement.querySelectorAll(".card");
  let score = 0; // score default is 0
  let hasAce = false; // tracks if card hasAce. true = hasAce

  cards.forEach((cardElement) => {
    if (!cardElement.classList.contains("face-down") || !isDealer) {
      // if card is not face-down or not dealer aka if card is face up and player
      const cardValue = cardElement.dataset.value; // retrieves stored card value
      const value = getCardValue(cardValue); // assigns value to card number
      // console.log(`Card: ${cardValue}, Value: ${value}`);
      score += value; // adds card's value to the total score
      if (cardValue.includes("A")) hasAce = true; // check if card has ace if it does then true then it goes down to if hasAce condition below
    }
  });

  /// ace adjustment!!! 21 or 1 depending on hand
  if (hasAce && score + 10 <= 21) {
    score += 10; // if hasAce which is 1, and + 10 will be <= 21, then we can add 10 to ace and treat it as 11. else ace = 1
  }
  return score;
};

const getCardValue = (card) => {
  if (card.includes("J") || card.includes("Q") || card.includes("K")) {
    return 10; // face card values = 10
  } else if (card.includes("A")) {
    return 1; // ace = 1 first and is adjusted when calculating hand score
  } else {
    value = parseInt(card.slice(1)); // using slice method will extract the numeric part of the card like d09 1 is the second index of 09
  }
  return value;
};

const handleStandButton = () => {
  game.player.isStanding = true; // player chooses stands
  hitButton.style.display = "none"; // hide hit button
  standButton.style.display = "none"; // hide stand button after clicking stand button
  playersTurn.style.display = "none";
  dealersTurn.style.display = "flex";
  revealDealerSecondCard(); // reveals dealer's second card automatically if player busts
  dealerTurn(); // dealer's turn
};

const revealDealerSecondCard = () => {
  const dealerCards = dealerHand.querySelectorAll(".card"); // selects all of dealer's cards
  if (dealerCards.length > 1) {
    // if there is more than 1 card (aka retrieves the face-down card)
    // reveal dealer's face down card
    const faceDownCard = dealerCards[0]; // reveals first face-down card of dealer
    faceDownCard.classList.remove("face-down"); // removes face-down and reveals card
    faceDownCard.style.backgroundImage = `url(images/${faceDownCard.dataset.value}.jpeg)`; // reveals card image
    game.dealer.score = calculateHandScore(dealerHand, false); // recalculate score with all of dealer's cards now
    renderDealerScore();
  }
};

const drawDealerCard = () => {
  dealCard(dealerHand, shuffledDeck.pop(), false); // deal a new card to dealer
  game.dealer.score = calculateHandScore(dealerHand); // recalculate dealer's hand score
  renderDealerScore();
};

const dealerTurn = () => {
  revealDealerSecondCard();

  // if not
  const dealerDrawCards = () => {
    const initialPlayerHand = Array.from(playerHand.querySelectorAll(".card"));
    const initialPlayerScore = initialPlayerHand.length === 2 && calculateHandScore(playerHand, false);
    // console.log(initialPlayerScore);

    if (game.dealer.score < game.player.score && game.dealer.score <= 16 && initialPlayerScore != 21) {
      // if initial player score is 21, do not draw and player wins
      // need to adjust this to if game.dealer.score < game.player.score but not sure how so i put 17 first
      setTimeout(drawDealerCard, 1000); // draw card if conditions met!
      setTimeout(dealerDrawCards, 2000); // setTimeout() from MDN - waits 3 seconds before drawing next card
    } else if (initialPlayerScore === 21) {
      determineWinner(); // if initial hand of player === 21 then dealer should not draw
    } else {
      determineWinner();
    } // after dealer turn over, determine winner
  };
  dealerDrawCards();
};

const determineWinner = () => {
  game.player.isBust = game.player.score > 21;
  game.dealer.isBust = game.dealer.score > 21;

  if (game.player.isBust || (game.player.score < game.dealer.score && game.dealer.score <= 21)) {
    handlePayout(false);
  } else if (game.dealer.isBust || (game.player.score > game.dealer.score && game.player.score <= 21)) {
    // dealer bust or game player score higher than dealer
    handlePayout(true);
  } else {
    // tie
    handlePayout(null);
  }
  dealersTurn.style.display = "none";
};

const handlePayout = (playerWins) => {
  if (playerWins === true) {
    const initialPlayerHand = Array.from(playerHand.querySelectorAll(".card"));
    const initialPlayerScore = initialPlayerHand.length === 2 && calculateHandScore(playerHand, false);
    if (initialPlayerScore === 21) {
      displayRoundResult(game.player.bet * 1.5, true);
      game.player.bank += game.player.bet * 2.5;
      game.player.bet -= game.player.bet;
    } else {
      displayRoundResult(game.player.bet, true);
      game.player.bank += game.player.bet * 2;
      game.player.bet -= game.player.bet;
    }
  } else if (playerWins === false) {
    displayRoundResult(game.player.bet, false);
    game.player.bet -= game.player.bet;
  } else {
    displayRoundResult(game.player.bet - game.player.bet, null);
    game.player.bank += game.player.bet;
    game.player.bet -= game.player.bet;
  }
  renderplayerBank();
  renderBetAmount(); // deal button is showing up because of render bet amount and it contains getDealButton(); hm but it's not showing up now
};

const handleNextRound = () => {
  resetGameState();
  resetUI();
  enableBankCoinButtons();
  enableBetCoinButtons();
  shuffledDeck = shuffleDeck(cardDeck.slice());
  betPrompt.style.display = "flex";
  updateBankCoinVisibility();
  renderplayerBank();
  renderBetAmount();
  getBetCoinDisplay();
};

const handleNewGame = () => {
  // new game button function
  resetGameState();
  resetUI();
  game.player.bank = 1000;
  game.player.bet = 0;
  renderplayerBank();
  renderBetAmount();
  updateBankCoinVisibility();
  enableBankCoinButtons();
  enableBetCoinButtons();
  shuffledDeck = shuffleDeck(cardDeck.slice());
  getBetCoinDisplay();

  startPage.style.display = "flex";
  gamePage.style.display = "none"; // game default page is the start page
};

const handleOpenRules = () => {
  document.getElementById("rules").showModal();
};

const handleCloseRules = () => {
  document.getElementById("rules").close();
};

/*----------------------------- Event Listeners -----------------------------*/

dealButton.style.display = "none";
buttons.style.display = "none";
betPrompt.style.display = "none";
gamePage.style.display = "none"; // game default page is the start page
playersTurn.style.display = "none";
dealersTurn.style.display = "none";
startButton.addEventListener("click", () => {
  // click start button to hide start page and show game page
  startPage.style.display = "none";
  hitButton.style.display = "none";
  standButton.style.display = "none";
  newGameButton.style.display = "none";
  dealButton.style.display = "none";
  betCoins.style.display = "none";
  nextRoundButton.style.display = "none";
  gamePage.style.display = "flex";
  betPrompt.style.display = "flex";
});

bankCoinButton.forEach((button) => {
  button.addEventListener("click", handleBankCoinClick);
});
// iterates over each bank coin button

betCoinButton.forEach((button) => {
  button.addEventListener("click", handleBetCoinClick);
});

dealButton.addEventListener("click", handleDealButton);

hitButton.addEventListener("click", handleHitButton);

standButton.addEventListener("click", handleStandButton);

newGameButton.addEventListener("click", handleNewGame);

nextRoundButton.addEventListener("click", handleNextRound);

openRules.addEventListener("click", handleOpenRules);

closeRules.addEventListener("click", handleCloseRules);

/*----------------------------- Helper Functions -----------------------------*/

const resetUI = () => {
  playerHand.innerHTML = "";
  dealerHand.innerHTML = "";
  cardDisplay.style.display = "none";
  dealButton.style.display = "none";
  hitButton.style.display = "none";
  standButton.style.display = "none";
  newGameButton.style.display = "none";
  nextRoundButton.style.display = "none";
  betCoins.style.display = "none";
  betCoinButton.forEach((button) => (button.style.display = "none"));
};

const resetGameState = () => {
  const resetEntity = (entity) => {
    entity.hand = [];
    entity.score = 0;
    entity.isBust = false;
    entity.isStanding = false;
  };
  resetEntity(game.player);
  resetEntity(game.dealer);
};

// enable bank coin buttons
const enableBankCoinButtons = () => {
  bankCoinButton.forEach((button) => {
    button.addEventListener("click", handleBankCoinClick);
    button.disabled = false;
  });
};

// enable bet coin buttons
const enableBetCoinButtons = () => {
  betCoinButton.forEach((button) => {
    button.addEventListener("click", handleBetCoinClick);
    button.disabled = false;
  });
};

// disable bank coin buttons
const disableBankCoinButtons = () => {
  bankCoinButton.forEach((button) => {
    button.removeEventListener("click", handleBankCoinClick);
    button.disabled = true;
  });
};

// enable bet coin buttons
const disableBetCoinButtons = () => {
  betCoinButton.forEach((button) => {
    button.removeEventListener("click", handleBetCoinClick);
    button.disabled = true;
  });
};

const displayRoundResult = (amount, win) => {
  setTimeout(() => {
    roundResult.showModal(); // round result dialog pops up
    if (win === true) {
      resultMessage.textContent = `wow! you won $${amount}`;
    } else if (win === false) {
      resultMessage.textContent = `boo! you lost $${amount - game.player.bet}!`; // is this correct in the automatic 21 hand logic?
    } else {
      resultMessage.textContent = `push!`;
    }
  }, 1000);

const getNextRoundbutton = () => {
  nextRoundButton.style.display = "flex";
};

const updateNextRoundButton = () => {
  if (game.player.bank > 0) {
    getNextRoundbutton();
  } else {
    nextRoundButton.style.display = "none";
  }
};

closeResultMessage.addEventListener("click", () => {
  roundResult.close();
  updateNextRoundButton();
});
}

// split pair
