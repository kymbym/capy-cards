# Capybara Blackjack

Welcome to capy-blackjack - a fun and quirky take on the classic card game, featuring capybara themed cards, all hand-drawn and styled by me!  The objective is simple: try to get a hand value as close to 21 as possible without going over. Be careful though - if your hand value exceeds 21, you bust and lose the round!

## Getting Started

**Start Page**

When you launch the game, you'll be greeted with the start page. Here, you can either:
- Start Game: Begin playing the game
- Rules: View the rules of the game

![start page](/assets%20/readme%20/start_page.png)

**Placing Bets**

After clicking start game, you'll be directed to the betting page. On this page:
- Place your bets by selecting the desired amount
- Adjust your bets before the round starts by adding or removing the bet amount by clicking the coins
- Once you're ready, click the deal button to start the game. At this point, cards will be dealt to both you and the dealer. Note that the dealer will have one card face-down and one card face-up

![betting page](/assets%20/readme%20/betting_page.png)
![deal button](/assets%20/readme%20/deal_button.png)

**Player Actions: Hit, Stand, New Game**

After the cards are dealt, you will have the following options:
- Hit: Draw another card to try and improve your hand. If you go over 21 (bust), the dealer's hidden card will be automatically revealed, and you'll lose the round
- Stand: Keep your current hand. When you stand, it becomes the dealer's turn to play. The dealer will reveal their hidden card and draw additional cards according to the rules. The winner is determined based on the hand values

![player actions](/assets%20/readme%20/dealt_cards.png)

**Winning and Losing**

After each round:
- If you win, your winnings will be added to your bank according to the payout rules (3:2 for Blackjack, 1:1 for a regular win)
- If you lose, the bet amount will be deducted from your bank
- If it's a tie (push), your bet will be returned

![win lose](/assets%20/readme%20/win_lose_screen.png)

You can then choose to start a new game or next round, where you can adjust your bets and play again!

![win lose](/assets%20/readme%20/buttons.png)

## Attributions & Credits

- All game cards are hand-drawn by Fong Kymmy

## Technologies Used

- HTML, CSS, JavaScript

## Next Steps

- Implement the Split Function: Currently, the game does not support splitting - this feature will be added in the next update