# Pig Game

Pig game implemented in under 1024 bytes.

Note, this code was written for the JS1024 code golf competition. I used as many tricks and techniques as possible to keep the size within the 1024 byte budget.

## Rules

Players take turns to roll a die, tallying the sum of their rolls within a single turn. Players can roll as many times as they want per turn. However, if a player rolls a '1', all points collected within that turn are forfeited and the turn ends. Players can also opt to "hold", at which point the turn's points get added to their overall score. The gameplay continues until one player achieves a total score of 100 points.

## Features

- Human vs AI
- Uses JS proxies to update UI when game state changes
- Playable on mobile
- Incorporates 2023 theme "luck"
