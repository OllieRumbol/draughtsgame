# Draughts Game web app redesign — Specification

> **What this document is for:** It answers *what are we building, and why?* It is agreed before any design or code, and it is the source of truth for requirements.

Status: Approved
Last updated: 2026-11-14 (section 6.1.2, item 7 added with the plan)

---

## 1. Purpose

Draughts Game is a free web game at `https://ollierumbol.github.io/draughtsgame`. Two people can play on one device, or one person can play against the computer at three levels.

This work rebuilds the web app on supported tools, adds automated build, test and deployment, fixes the known defects, and replaces the look and the wording of every page.

---

## 2. Background

### 2.1 House rules

The owner built the game in memory of their grandad, who died in 2020. The game uses the rules they played together. These rules are fixed for this work. They are the same rules that the API follows (source: the Draughts Game Function specification, section 2.1, approved 2026-11-06).

1. Captures are optional. A player may make a normal move when a capture is available.
2. A capture chain may stop after any jump.
3. Men move and capture diagonally forward only. Kings move and capture one square diagonally in any direction. There are no "flying" kings. During a capture chain, a king may land back on the square where the chain started, because it has left that square.
4. A man can capture only men. It cannot capture a king. A king can capture both men and kings.
5. A piece cannot be captured twice in the same chain.
6. A man that reaches the far row becomes a king, and the turn ends.
7. **The end of the game.** After every turn, both players are checked:
   * If neither player can move, the game is a tie.
   * If only one player can move, that player wins.

   A player with no pieces has no moves, so losing every piece is covered by this rule. A player can also give up. There is no other draw rule.

### 2.2 Terms

| Term | Meaning |
| --- | --- |
| Man | An ordinary piece. The game calls it a "man" (plural "men"), not a "single". The owner chose this on 2026-11-10. |
| King | A man that has reached the far row (section 2.1, item 6). |
| Jump | One capture: a piece moves two squares diagonally over an opponent piece, which is removed. |
| Chain | One or more jumps by the same piece in the same turn. |
| Turn | Everything one player does before the other player may act: one normal move, or one chain. |
| Move | The same as a turn, as the API uses the word: one start square, one end square, and the pieces captured on the way. |
| Target | A square that the selected piece can finish its next step on: a normal move, or the next jump of a chain. |
| Tip | A square that any piece of the current player can finish a turn on, as the API returns it (section 5.2). |

### 2.3 Board

The board is 8 rows by 8 columns. A square is written (row, column), with row 0 at the top and column 0 on the left. Pieces stand on dark squares only: odd columns on even rows, and even columns on odd rows.

* Player 1 has the light pieces. They start on rows 5 to 7 and move up, towards row 0.
* Player 2 has the dark pieces. They start on rows 0 to 2 and move down, towards row 7.

The API sends and receives the board as numbers (section 5.1).

| Value | Meaning |
| --- | --- |
| 0 | Light square. Never used in play. |
| 1 | Player 1 man |
| 2 | Player 2 man |
| 3 | Player 1 king |
| 4 | Player 2 king |
| 5 | Empty dark square |
| 6 | Empty dark square, highlighted. The old web app used it for tips. The API treats it as empty. |

Starting board:

```json
[[0,2,0,2,0,2,0,2],
 [2,0,2,0,2,0,2,0],
 [0,2,0,2,0,2,0,2],
 [5,0,5,0,5,0,5,0],
 [0,5,0,5,0,5,0,5],
 [1,0,1,0,1,0,1,0],
 [0,1,0,1,0,1,0,1],
 [1,0,1,0,1,0,1,0]]
```

### 2.4 Players, modes and levels

* **Two players:** two people take turns on one device, as player 1 and player 2.
* **Against the computer:** the person is player 1 and the computer is always player 2.
* The computer has three levels: **Easy**, **Normal** and **Hard**. The API names them `easy`, `normal` and `hard`. The old web app called the middle level "Medium". The owner chose "Normal" on 2026-11-13.
* Before a game, the player chooses who moves first.

### 2.5 Hosting

The web app is hosted on GitHub Pages at `https://ollierumbol.github.io/draughtsgame`, and stays there. The API accepts browser requests from the origin `https://ollierumbol.github.io` only (section 5.3). So the address of the live site cannot change without a change to the API.

### 2.6 Owner decisions

These decisions were made with the owner before this document was written. They are requirements in section 6.

| Date | Decision |
| --- | --- |
| 2026-11-10 | The look is "classic wood": a wood board, light and dark pieces, warm and traditional. It replaces the current look, which the owner finds childish. |
| 2026-11-10 | "Show tips" keeps calling the API. |
| 2026-11-10 | A capture chain has no "take again?" dialog. The player clicks the next jump, or ends the turn. |
| 2026-11-10 | How to play and About are kept, with new layout and wording. About loses its project plan cards. About gets the owner's grandad's name as its heading, a photo and the tribute text. |
| 2026-11-10 | The words are "man" and "men", and "the computer", not "PC". A short welcome line goes on the game setup screen. |
| 2026-11-13 | The selected piece's targets come from the web app's own rules, with no call to the API. |
| 2026-11-13 | Undo goes back to the start of the player's last turn. |
| 2026-11-14 | In a computer game, Undo is available only on the person's turn, or after the computer's move has failed. |
| 2026-11-13 | A game in progress survives a page refresh. |
| 2026-11-13 | Every page meets WCAG 2.2 AA, and the game can be played with a keyboard alone. |
| 2026-11-13 | The page has a light mode and a dark mode. It starts in the device's mode, and a switch on the page changes it. The owner first chose no switch, then asked for one after seeing the mockup on 2026-11-13. |
| 2026-11-13 | When the computer's move fails, a message and a "Try again" button are shown. |
| 2026-11-13 | The tribute starts from today's text. Light edits are suggested for the owner to accept or reject one by one. The heading is the name only, with no years. |

---

## 3. Goals and non-goals

### Goals

1. **Supported tools.** Every package is on a version that is supported on the date of the change. The site builds and runs on the current Node.js LTS release.
2. **Automated delivery.** Every pull request is checked automatically: type check, lint, tests and build. Every merge to `main` is checked and then deployed to the live site. A failed check stops the deployment.
3. **Correct play.** The web app follows the house rules in section 2.1. Every defect in section 4.1 is fixed, and each defect that changes play has a regression test.
4. **Rules tested on their own.** Every rule in section 2.1, and every worked example in section 6.2, is checked by an automated test that does not draw the page.
5. **A new look.** Every page uses the classic wood look (section 2.6), in light and dark mode, from a 320 px wide phone to a large desktop screen. The owner signs off the look.
6. **Accessible.** Every page meets WCAG 2.2 AA (section 6.6, item 1).
7. **The final API contract.** The web app asks for the computer's move with `Difficulty` and `Board` only (section 5.1).

### Non-goals

* Rule options, such as "men can take kings" or "force takes". They are a later feature, after this work.
* Changes to the API. This work needs none. Removing `Version` from the API (its stage 3) is separate backend work, after this release.
* Accounts, online play between two devices, game history, or saved games on a server.
* Sound.
* A "suggest my best move" feature, or a tutorial.
* The computer playing as player 1.
* Translation into other languages.
* Usage tracking or analytics.
* Installing the site as an app, or playing with no network. A two-player game still works without the API, except for "Show tips".

---

## 4. Current state of the code

Line numbers refer to `origin/main` at commit `da953ce`.

| Area | Purpose | State |
| --- | --- | --- |
| Build tools | Build, test and start the app | Create React App 4.0.1, React 17.0.1, React Router 5.2.0, react-bootstrap 1.4.0, Bootstrap 5.0.0-beta3, JavaScript. Every package is several major versions behind (`npm outdated`, 2026-11-10). |
| `src/components/home/CompleteBoard.js` | The board and almost all game logic | 660 lines. Move checks, captures, kings, chains, undo, give up and the computer's turn, in two `useEffect` blocks: one for each mode. |
| `src/logic/helpers/` | A copy of the move rules | Used only for the end-of-game check. It does not have the API's later rule fixes. |
| `src/logic/automatedPlayerV1.js` to `V3.js` | Old computer players | Not used by the app. Only tests use them. |
| `src/logic/api.js` | API calls | The API address is written in the code. The request sends `Version`, `Depth` and `Player`. |
| `src/components/howToPlay/HowToPlay.js` | How to play page | Rules are partly wrong (section 4.1, item 12). |
| `src/components/about/About.js` | About page | The tribute, a list of tools, and 15 project plan cards from 2021. |
| `.github/workflows/main_deploy.yml` | Build and deploy | Node 12, `actions/*@v1`, a `TOKEN` secret from January 2021. It failed at its deploy step on 2026-11-07. The last release was done by hand. |
| `src/test/` | Tests | 5 test files. `App.test.js` has two tests with the same name. No test covers a move. |
| `README.md` | Project front page | The Create React App template text. |

### 4.1 Defects and gaps

1. **Undo does not redraw the board.**
   `CompleteBoard.js:295` changes the board in place. In a computer game, the turn after undo is the same as before (`:312`), so nothing redraws until the next click. Confirmed in the running app on 2026-11-10.
2. **Undo does not cancel a computer move that is waiting.**
   The computer's move waits on a timer (`CompleteBoard.js:374`). Undo does not stop it, so the computer can play on the board that undo restored.
3. **The board state is changed in place.**
   `CompleteBoard.js:15` keeps the imported starting board and changes it. So "Restart" has to reload the page (`ResultModal.js:10`).
4. **The computer's chain is shown in one step.**
   `CompleteBoard.js:392` to `:401` removes every captured piece and moves the piece at once.
5. **The target square is not marked.**
   Only the selected piece is marked. Selection uses a mouse-down listener on the whole document (`useOutsideAlerter.js:19`). Squares have no selected state.
6. **A text caret appears on pieces and squares.**
   Reported by the owner. Not reproduced on 2026-11-10. Pieces are plain `div` elements with large text (`Counter.js:20`). The likely cause is caret browsing in the browser.
7. **An error appears at the end of a game.**
   Reported by the owner. Not reproduced: taking the last piece makes no API call. Likely paths:
   * "Close" on the result dialog lets play continue (`ResultModal.js:9`), so the next turn asks the API for a move when the computer has none.
   * A capture can end the game and also offer another jump. Both dialogs open, and "No" calls the computer (`CompleteBoard.js:429`).
   * The web app's copy of the rules (`src/logic/helpers/`) can disagree with the API about whether player 2 can move.
8. **The computer's first move starts during drawing.**
   `CompleteBoard.js:586` calls the computer from the render code.
9. **Give up does nothing on the computer's turn.**
   `CompleteBoard.js:350` sets no result when it is the computer's turn.
10. **Errors are hidden.**
    `CompleteBoard.js:411` calls `setErrorMessage()` with no value. The page shows one general banner, and the game cannot continue.
11. **The rules exist in three places.**
    The hand-written checks in `CompleteBoard.js`, the copy in `src/logic/helpers/`, and the API. They can disagree.
12. **How to play gives wrong and missing rules.**
    `HowToPlay.js:60` says "Kings can only move up and down the board". The page does not say that captures are optional, that a chain may stop after any jump, that a man cannot capture a king, or that the game can be a tie.
13. **An invalid move opens a dialog.**
    `CompleteBoard.js:481` and `:571` open an "invalid move" dialog for any click that is not a legal move.
14. **A game is lost on navigation.**
    The game screen is re-created when the player opens How to play or About and comes back. A page refresh also loses the game.
15. **The About page has a typo.**
    `About.js:16`: "past away".

---

## 5. External interfaces

### 5.1 Get the computer's next move

```
POST https://func-draughts-game-chhwarhkf4hphjf0.uksouth-01.azurewebsites.net/api/GetNextMove
```

Request, as this work sends it, captured on 2026-11-13 with `BOARD` set to the starting board:

```json
{ "Difficulty": "hard", "Board": BOARD }
```

Response, HTTP 200:

```json
{
  "nextMove": {
    "currentHeight": 2,
    "currentWidth": 3,
    "nextHeight": 3,
    "nextWidth": 2,
    "takes": []
  },
  "successful": true,
  "errorMessage": null
}
```

Response when player 2 has no legal move, HTTP 400:

```json
{ "nextMove": null, "successful": false, "errorMessage": "Player 2 has no legal moves." }
```

Response for an unknown level, HTTP 400:

```json
{ "nextMove": null, "successful": false, "errorMessage": "Difficulty must be one of: easy, normal, hard" }
```

Notes:

* The request uses PascalCase names. The response uses camelCase names. Height is the row and width is the column.
* `takes` lists the squares of the captured pieces, as `{ "height": n, "width": n }`. They are in board order (by row, then column), not in the order of the jumps. Source: `DraughtsGameFunctionService/Helpers/FindMove.cs:46`, read on 2026-11-13.
* The response gives the start and end squares only. It does not give the squares the piece lands on during a chain.
* A king's chain can end on its start square, so `currentHeight` and `currentWidth` can equal `nextHeight` and `nextWidth`.
* The API still accepts `Version`, `Depth` and `Player`, but this work does not send them.
* The API sets its own time limit: at most 1 second of search for Hard. The first request after the app has been idle can take several seconds. On 2026-11-13, a first request took 2.5 s.
* HTTP 500 means an unexpected fault, with a general `errorMessage`.
* The API's owner can stop it, for example when its monthly cost limit is reached. Then a request gets no JSON response of the shape above.

### 5.2 Get the squares a player can move to (tips)

```
POST https://func-draughts-game-chhwarhkf4hphjf0.uksouth-01.azurewebsites.net/api/GetPotentialMoves
```

Request, captured on 2026-11-13:

```json
{ "Board": BOARD, "TipFor": 1 }
```

Response, HTTP 200:

```json
{
  "potentialMoves": [
    { "height": 4, "width": 1 },
    { "height": 4, "width": 3 },
    { "height": 4, "width": 5 },
    { "height": 4, "width": 7 }
  ],
  "successful": true,
  "errorMessage": null
}
```

Notes:

* The list holds every square that **any** piece of the player can finish a turn on, including each stop point of a chain. It does not say which piece can reach which square.
* Each square appears once. A square where a piece stands is never in the list.
* When the player has no legal move, the list is empty and `successful` is `true`.

### 5.3 Authentication and CORS

* Both endpoints are anonymous. There is no key or sign-in.
* A browser may call the API only from the origin `https://ollierumbol.github.io`. A preflight request from `http://localhost:5173` on 2026-11-13 got no `Access-Control-Allow-Origin` header. So a copy of the web app on a developer's computer cannot call the live API from the browser.

### 5.4 Hosting

GitHub Pages serves the site as static files at `https://ollierumbol.github.io/draughtsgame`. It has no server code.

---

## 6. Functional specification

### 6.1 Behaviour

#### 6.1.1 Game setup

1. THE SYSTEM SHALL let the player choose, before a game:
   * the opponent: two players, or the computer;
   * the level, Easy, Normal or Hard, only when the opponent is the computer;
   * who moves first.
2. The choices start as the old web app's defaults: two players, Easy, player 1 first.
3. The setup screen SHALL show one short welcome line that says what the game is, with a link to About.
4. WHEN the player starts the game, THE SYSTEM SHALL show the starting board (section 2.3), and the chosen first player SHALL move first.

#### 6.1.2 Taking a turn

1. Only the player whose turn it is may select a piece, and only one of their own. During the computer's turn, the player cannot select or move a piece.
2. WHEN the player selects a piece, THE SYSTEM SHALL mark the selected piece and every target of that piece (section 2.2). It SHALL work out the targets without calling the API.
3. WHEN the player chooses a marked target, THE SYSTEM SHALL make that move or jump.
4. WHEN the player selects another of their own pieces, THE SYSTEM SHALL select that piece instead, except during a chain (section 6.1.3, item 3).
5. WHEN the player chooses any other square, THE SYSTEM SHALL clear the selection, except during a chain, where it has no effect. It SHALL NOT show an error or a dialog.
6. A piece with no targets can be selected. It is marked, and no target is marked.
7. WHEN the player chooses the selected piece again, THE SYSTEM SHALL put it down and clear the selection, except during a chain. During a chain, choosing the piece again has no effect, and only "End turn" or a further jump moves the game on (section 6.1.3). The owner chose this on 2026-11-14.

#### 6.1.3 Capture chains

1. WHEN a jump ends on a square from which the same piece can jump again, THE SYSTEM SHALL keep the piece selected, mark its next jumps as targets, and show an "End turn" control.
2. The player may then jump again, or choose "End turn" (section 2.1, item 2).
3. During a chain, the player cannot select another piece.
4. WHEN no further jump is possible, the turn ends by itself.
5. WHEN a man reaches the far row, it becomes a king and the turn ends, even if a further jump would be possible (section 2.1, item 6).
6. No dialog asks whether to take again.

#### 6.1.4 Show tips

1. On a person's turn, a "Show tips" control SHALL ask the API for the tips of the current player (section 5.2) and mark every square in the response.
2. While the request runs, the control SHALL show that it is loading.
3. The tips SHALL be removed when the player hides them, when the turn ends, or when the board changes.
4. WHEN the request fails, THE SYSTEM SHALL say that tips are not available, and the game SHALL continue.
5. Tips and targets SHALL look different, so the player can tell them apart.

#### 6.1.5 The computer's turn

1. WHEN it is the computer's turn, THE SYSTEM SHALL send the current board and the chosen level to the API (section 5.1). The board sent SHALL contain only the values 0 to 5.
2. While it waits, THE SYSTEM SHALL show that the computer is thinking.
3. WHEN the response arrives, THE SYSTEM SHALL check that the move is legal under the house rules for the current board. A move that is not legal SHALL be treated as a failure (section 6.1.9).
4. THE SYSTEM SHALL show the computer's move one jump at a time, in an order that is a legal chain and that captures exactly the pieces in `takes`. Each captured piece SHALL be removed at its own jump. When more than one such order exists, any of them may be shown.
5. A normal move SHALL be shown as one step.
6. WHEN the computer's man reaches the far row, it SHALL become a king.
7. WHEN the move has been shown, the turn SHALL pass to the person, unless the game has ended (section 6.1.6).
8. WHEN the computer moves first, its move SHALL start after the board is shown.
9. After the computer's move has been shown, its start and end squares SHALL stay marked until the person makes their next move or jump. Undo and New game also remove the mark. Two-player games have no such mark. The owner chose this on 2026-11-13.

#### 6.1.6 End of the game

1. After every turn, THE SYSTEM SHALL check the end-of-game rule (section 2.1, item 7) before the next turn starts.
2. WHEN the game ends, THE SYSTEM SHALL show the result, keep the final board on view, and allow no further moves. It SHALL NOT call the API again for that game, unless Undo continues it (section 6.1.7, item 7).
3. The result SHALL offer "New game", and Undo as section 6.1.7, item 7 says.
4. **Give up.**
   * In a two-player game, the player whose turn it is may give up. The other player wins.
   * In a computer game, the person may give up at any time, including while the computer is thinking. A computer move that has not been shown yet is cancelled. The computer wins.

#### 6.1.7 Undo

1. One Undo SHALL return the game to the start of the last turn of the person who pressed it:
   * In a two-player game, it removes the last turn.
   * In a computer game, it removes the computer's last reply and the person's last turn. It is then the person's turn again.
2. Undo can be repeated back to the start of the game.
3. During a chain, Undo SHALL return to the start of the current turn.
4. In a computer game, Undo SHALL NOT be available while the computer is thinking or showing its move. So a person can undo only on their own turn. WHEN the computer's move has failed (section 6.1.9), Undo SHALL be available again. It removes the person's last turn, because the computer has not replied. The owner chose this on 2026-11-14.
5. The board, the turn and the count of captured pieces SHALL all be restored, and the board SHALL be redrawn at once.
6. WHEN there is nothing to undo, or Undo is not available (item 4), the Undo control SHALL be shown as not available, and assistive technology SHALL be told so. In a two-player game, Undo is available on every turn once there is something to undo.
7. WHEN the game has ended because a player cannot move (section 2.1, item 7), the result SHALL also offer Undo. Undo then works as item 1 says, and the game continues. After a player gives up, Undo is not offered. The owner chose this on 2026-11-13.

#### 6.1.8 Saving the game in the browser

1. THE SYSTEM SHALL save the game in progress in this browser after every turn: the settings, the board, the turn, the captured counts and the undo history.
2. WHEN the page opens and a saved game exists, THE SYSTEM SHALL show that game, as it was.
3. WHEN a saved game was waiting for the computer's move, THE SYSTEM SHALL ask the API again.
4. "New game" SHALL clear the saved game and show game setup.
5. WHEN the saved data cannot be read, THE SYSTEM SHALL discard it and show game setup, with no error.
6. A finished game SHALL be saved too. A refresh shows the final board, the result and its controls, until "New game" is chosen. The owner chose this on 2026-11-13.
7. Moving to How to play or About and back SHALL keep the game.
8. Nothing SHALL be sent to a server, except the requests in section 5.

#### 6.1.9 When the API fails

A request fails when there is no response, the response is not the JSON shape in section 5, `successful` is `false`, or the computer's move is not legal (section 6.1.5, item 3).

1. WHEN the computer's move fails, THE SYSTEM SHALL keep the board as it was and show, beside the board, a message such as "The computer couldn't move. Check your connection and try again." with a "Try again" control.
2. "Try again" SHALL send the same request again.
3. While the message is shown, Undo, Give up and New game SHALL still work.
4. THE SYSTEM SHALL NOT show the API's `errorMessage` to the player.
5. A request to either endpoint that has not been answered within 15 seconds SHALL count as failed. The owner chose this on 2026-11-13.

#### 6.1.10 Pages and navigation

1. The site has three pages: Play (game setup and the game), How to play, and About. Every page can reach the other two.
2. The old addresses `#/`, `#/howtoplay` and `#/about` SHALL still open the matching page, so that existing links keep working.
3. An unknown address SHALL show a short "page not found" message with a link to Play.

#### 6.1.11 Content

1. **Words.** The game says "man" and "men", "king", "the computer", "Easy", "Normal" and "Hard". It does not say "single", "PC" or "Medium".
2. **Players.** In a two-player game, the players are "Player 1" and "Player 2". In a computer game, they are "You" and "The computer".
3. **How to play** has these parts, in this order:
   1. The goal of the game.
   2. The rules in section 2.1, in short steps. Each rule has a small board picture: a move, a capture, a chain, a king, and the end of the game.
   3. "Our house rules": how these rules differ from standard English draughts. It links to About.
   4. "Using the game": how to select a piece, move, continue or end a chain, show tips, undo and give up, with the mouse, by touch and with the keyboard.
4. The How to play text is drafted from section 2.1. The owner approves the wording.
5. **About** has these parts, in this order:
   1. The heading "Ernest Rumbol", with no years.
   2. A photo that the owner supplies. Until then, a visible placeholder.
   3. The tribute. It starts from the text in `About.js` on `origin/main`, with "past away" corrected to "passed away". Any other edit is suggested to the owner one line at a time, and only accepted edits are used.
   4. "How it's built": a short paragraph with links to the web app's repository and the API's repository.
6. The About page SHALL NOT show the project plan cards or the old list of tools.
7. Every text the player reads is in UK English.

### 6.2 Worked examples

#### 6.2.1 Rules

Examples 1 to 7 are copied from the Draughts Game Function specification, section 6.2 (examples 3, 4, 17, 18, 19, 20 and 21). "Every other dark square empty" applies to each. The web app's rules SHALL give the same results.

| # | Board | Expected result | Notes |
| --- | --- | --- | --- |
| 1 | Player 2 king at (3,2), player 1 men at (4,3) and (2,3). Legal moves for player 2. | 4 moves: (2,1) and (4,1) with no captures, (5,4) capturing (4,3), and (1,4) capturing (2,3) | A king captures in every direction |
| 2 | Player 1 man at (6,1), player 2 men at (5,2) and (3,4). Legal moves for player 1. | 3 moves: (5,0) with no capture, (4,3) capturing (5,2), and (2,5) capturing (5,2) and (3,4) | A chain may stop after the first jump |
| 3 | Player 1 man at (6,1), player 2 king at (5,2). Legal moves for player 1. | 1 move: (5,0) with no capture | A man cannot capture a king |
| 4 | Player 1 king at (6,1), player 2 king at (5,2). Legal moves for player 1. | 4 moves: (5,0), (7,0) and (7,2) with no captures, and (4,3) capturing (5,2) | A king can capture a king |
| 5 | Player 2 king at (1,2), player 1 men at (2,3), (4,3), (4,1) and (2,1). Legal moves for player 2. | 9 moves: (0,1) and (0,3) with no captures; (3,4) capturing (2,3); (5,2) capturing (2,3), (4,3); (3,0) capturing (2,3), (4,3), (4,1); (3,0) capturing (2,1); (5,2) capturing (2,1), (4,1); (3,4) capturing (2,1), (4,1), (4,3); and (1,2) capturing all four | A chain may end where it began |
| 6 | Player 2 king at (7,4), player 1 men at (6,3), (4,1), (4,3), (2,1) and (2,3). Legal moves for player 2. | 9 moves, with no piece captured twice: (6,5) with no capture, then 8 capture moves. The longest is (5,2) capturing all five. | A chain that loops |
| 7 | The board in example 5, tips for player 2 | 5 squares: (0,1), (0,3), (3,0), (3,4), (5,2). Not (1,2). | The API's tips never include a square where a piece stands (section 5.2) |
| 8 | Starting board, player 1 selects the man at (5,2) | Targets (4,1) and (4,3) | Section 6.1.2, item 2 |
| 9 | Player 1 man at (6,1), player 2 men at (5,2) and (3,4). Player 1 jumps to (4,3). | The man stays selected. Target (2,5). "End turn" is shown. | Section 6.1.3 |
| 10 | As example 9, then "End turn" | The turn passes to player 2. The man stays on (4,3). (3,4) is not captured. | Section 2.1, item 2 |
| 11 | Starting board. Player 1 selects the man at (5,2), then the man at (5,4). | The man at (5,4) is selected. Targets (4,3) and (4,5). | Section 6.1.2, item 4 |
| 12 | Player 1 man at (2,3), player 2 man at (1,2). Player 1 jumps to (0,1). | The man becomes a king and the turn ends. | Section 2.1, item 6 |
| 13 | Player 2 man at (3,2). Player 1 men at (4,1), (5,0), (5,2) and (5,4). Computer game, player 1's turn. Player 1 moves (5,2) to (4,3). | Player 2 has no legal move, so player 1 wins. No API call is made. | Section 2.1, item 7; section 4.1, item 7 |
| 14 | No piece of either player can move | Tie | Section 2.1, item 7 |

#### 6.2.2 Showing the computer's chain

| # | Board and response | Expected steps | Notes |
| --- | --- | --- | --- |
| 15 | Player 2 man at (0,1), player 1 men at (1,2) and (3,4). Response: from (0,1) to (4,5), `takes` (1,2), (3,4). | (0,1) → (2,3), (1,2) removed; then (2,3) → (4,5), (3,4) removed | Board order and jump order agree |
| 16 | Player 2 king at (5,2), player 1 men at (4,3) and (2,3). Response: from (5,2) to (1,2), `takes` (2,3), (4,3). | (5,2) → (3,4), (4,3) removed; then (3,4) → (1,2), (2,3) removed | `takes` is in board order, the reverse of the jump order |
| 17 | The board in example 5. Response: from (1,2) to (1,2), `takes` all four. | Four jumps that start and end on (1,2), going either way round | Either order is correct (section 6.1.5, item 4) |
| 18 | Any board. Response: a move from a square that holds no player 2 piece. | Treated as a failure. "Try again" is shown. | Section 6.1.9 |

#### 6.2.3 Undo, saving and failures

| # | Situation | Action | Expected result |
| --- | --- | --- | --- |
| 19 | Computer game. The person moves, the computer replies. | Undo | Both turns are removed. The board is redrawn at once. It is the person's turn. |
| 20 | Computer game. The person moves. The computer is thinking. | Undo | Undo is not available. The computer's move is shown as normal, and then Undo is available. |
| 21 | Two-player game. Player 1 moves, then player 2 moves. | Undo | Player 2's turn is removed. It is player 2's turn again. |
| 22 | Player 1 is in a chain, after the first of two jumps. | Undo | The board returns to the start of player 1's turn. |
| 23 | A computer game in progress. | Refresh the page | The same board, turn, level, captured counts and undo history are shown. |
| 24 | The API is stopped. Computer game, the person moves. | — | The board stays as it was after the person's move. The message and "Try again" are shown. Undo, Give up and New game work. Undo removes the person's move. |
| 25 | As example 24, then the API is started again. | Try again | The computer's move is shown. The game continues. |
| 26 | Computer game. The person captures the computer's last piece. | — | "You win" is shown. No API call is made. |

### 6.3 Outcomes and states

| State | Meaning |
| --- | --- |
| Setup | The player chooses the settings (section 6.1.1). |
| Person's turn | A person may select a piece. Sub-states: nothing selected, a piece selected, in a chain. |
| Tips loading | "Show tips" is waiting for the API. The person can still play. |
| Computer thinking | The request for the computer's move is waiting. |
| Computer moving | The computer's move is being shown step by step. |
| Computer failed | The computer's move failed. The message and "Try again" are shown. |
| Game over | The result is shown. No move is allowed. |

| Result | Shown as |
| --- | --- |
| Player 1 or player 2 wins, two-player game | "Player 1 wins" or "Player 2 wins", and the reason: no pieces, no moves, or the other player gave up |
| The person wins, computer game | "You win", and the reason |
| The computer wins | "The computer wins", and the reason |
| Tie | "It's a tie. Neither player can move." |

The exact wording of each message is drafted with the design and approved by the owner.

### 6.4 User interface

#### 6.4.1 Every page

1. The look is "classic wood" (section 2.6). The owner signs off the look.
2. The page has a light mode and a dark mode. The board and the pieces look the same in both modes.
   * On the first visit, the page uses the device's light or dark setting.
   * Every page has a switch between light and dark. The switch has an accessible name, and it says which mode is on.
   * The player's choice is remembered in this browser, on every page and after a refresh. From then on, the device's setting is not used.
   * There is no option to follow the device again, other than clearing the site's data in the browser.
3. Every page works from 320 px to 2560 px wide, with no sideways scrolling.
4. Every page has one main heading, and a link to each of the other pages.

#### 6.4.2 Play page

1. **Setup:** the choices in section 6.1.1, the welcome line, and a "Start game" control.
2. **Game:**
   * the board;
   * whose turn it is, or that the computer is thinking, or the result;
   * the mode, and the level in a computer game;
   * the number of pieces each player has captured;
   * the controls: Show tips, Undo, Give up, New game, and End turn during a chain.
3. The board is the largest item on the page. On a phone in portrait it fills the width of the screen, less the page margins.
4. Each square on the board is at least 24 by 24 CSS pixels at 320 px wide (WCAG 2.2, success criterion 2.5.8).
5. The board shows these marks, and each looks different from the others: the selected piece, a target, a tip, the keyboard focus, and the computer's last move (section 6.1.5, item 9).
6. A king looks different from a man in a way that does not depend on colour alone.
7. Clicking or tapping a piece or a square SHALL NOT show a text caret, and SHALL NOT select text (section 4.1, item 6).

#### 6.4.3 Keyboard and screen reader

1. The whole game can be played with a keyboard alone:
   * Tab moves between the controls and into the board.
   * The arrow keys move the focus from square to square inside the board.
   * Enter or Space selects a piece, or chooses a target.
   * Escape clears the selection.
2. Each square has a name that a screen reader reads: its row and column, counted from 1 at the top left, then what stands on it. For example, square (7,0) in section 2.3 is "Row 8, column 1, your man". Moves are announced with the same names. The owner chose this on 2026-11-13.
3. A screen reader announces each move, including the computer's moves and captures, the start of each turn, a failure, and the result.
4. The focus is always visible.

#### 6.4.4 How to play and About

The content is in section 6.1.11. Each board picture on How to play has a text alternative that describes it.

### 6.5 Non-functional requirements

1. **Accessibility.** Every page meets WCAG 2.2 AA:
   * An automated accessibility check finds no violation on each page, in light and dark mode, at 320 px and 1280 px wide, and in each game state in section 6.3.
   * The owner, or a person they choose, plays a full game with the keyboard alone, and a full game with a screen reader.
2. **Supported browsers.** The current and the previous major version of Chrome, Edge, Firefox and Safari, on desktop, and Chrome on Android and Safari on iOS.
3. **Response.** Selecting a piece and marking its targets needs no network request.
4. **Cost.** The web app stays on GitHub Pages at no cost. This work creates no Azure resource and no paid service.
5. **Security.**
   * The site holds no secret. Everything in it is public.
   * No deployment password or personal access token is stored in the repository or in GitHub secrets.
   * A known vulnerability of any severity, in any package, including build-only tools, stops the build. The only exception is one the owner approves in writing, which names the package, the reason and a date to check it again. The owner chose this on 2026-11-13.
6. **Privacy.** The site stores the saved game (section 6.1.8) and the light or dark choice (section 6.4.1, item 2) in this browser only. It stores no personal data, and it uses no cookies and no tracking.
7. **Supported versions.** All packages are on versions that are supported on the date of the change.
8. **Documentation.** `README.md` says what the project is, how to run it, how to test it, and how it is deployed.

### 6.6 Edge cases

1. A piece that has no legal move is selected (section 6.1.2, item 6).
2. A king's chain ends on its start square (examples 5 and 17).
3. A man becomes a king during a chain, and the chain ends (example 12).
4. The computer has no legal move after the person's turn. The game ends, with no API call (examples 13 and 26).
5. The person gives up or chooses New game while the computer's move is waiting or being shown. The computer's move is cancelled. A response that arrives later is ignored.
6. Several clicks arrive quickly, or during the computer's move. Only the clicks that section 6.1.2 allows have an effect.
7. The API is slow on a cold start. The "thinking" state stays until the response arrives or the time limit passes (section 6.1.9, item 5).
8. The API is stopped or the network drops (examples 24 and 25).
9. The saved game in the browser is missing, old or damaged (section 6.1.8, item 5).
10. The browser does not allow storage, for example in some private windows. The game works, but is not saved.
11. The page is open in two tabs of the same browser. Each tab saves after every turn, and the latest save is kept. A tab does not update when the other tab plays. The owner chose this on 2026-11-13.
12. Tips are shown, and then the player selects a piece. Both kinds of mark are shown, and they look different.
13. The device switches between light and dark mode during a game. If the player has not used the switch, the page follows. If they have, the page keeps their choice. The game is not affected either way.
14. The person changes the browser zoom up to 200%. The page still works, with no sideways scrolling at 1280 px wide.
15. A tips response arrives after the turn has ended or the board has changed. It is ignored.

---

## 7. Open questions

None. All questions were resolved with the owner on 2026-11-13.

---

## 8. Assumptions

1. The API is live and follows the contract in section 5 for the whole of this work.
2. The owner supplies the photo for the About page before the About page is finished. Until then, a visible placeholder is shown.
3. The site stays at `https://ollierumbol.github.io/draughtsgame` (section 2.5).
4. The owner can change the repository's GitHub settings, such as the Pages source and branch rules, when this work needs it.
5. Nobody depends on the old site's look, its text, or its `gh-pages` branch, other than for the release of this work.
6. The live site needs the API only for the computer's move and for tips.

---

## 9. Definition of done

* The live site at `https://ollierumbol.github.io/draughtsgame` runs the redesigned web app.
* A pull request runs the type check, lint, tests and build automatically, and shows the result on the pull request.
* A merge to `main` deploys to the live site automatically. A failed check stops the deployment.
* No deployment password or personal access token is stored in the repository or in GitHub secrets.
* Every package is on a supported version, and the build reports no known vulnerability, other than an exception the owner has approved (section 6.5, item 5).
* Every defect in section 4.1 is fixed. Items 1 to 5, 7, 8, 9, 13 and 14 each have a regression test.
* Every worked example in section 6.2 passes as an automated test.
* The automated accessibility check passes as section 6.5, item 1 says, and the keyboard and screen reader games have been played.
* The owner has played a full game at each level, and a two-player game, on the live site, on a phone and on a desktop.
* The owner has signed off the look, the How to play text and the About text.
* The web app sends `Difficulty` and `Board` only, and the API's logs show no failed requests from a normal game.
* `README.md` is true for the new project.
