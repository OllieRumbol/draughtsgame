# Draughts Game web app redesign — Plan

> **What this document is for:** It answers *how will we build it?* It turns the approved requirements in spec.md into a design, and it is agreed before any code is written.

Status: Approved
Last updated: 2026-11-14

---

## 1. Approach

Rebuild the web app in the same repository, on Vite, React and TypeScript, and replace the Create React App code in `src/`. The game rules become one pure TypeScript module, ported from the API's move generator and tested on its own (spec section 3, goal 4). One reducer holds the game state. The board and pages are drawn from that state, with no changes in place (spec section 4.1, items 1 to 3). A GitHub Actions workflow checks every pull request and deploys `main` to GitHub Pages with no stored token (spec section 3, goal 2, and section 6.5, item 5).

The work runs in five phases:

1. **Tooling and delivery.** Replace the build tools and add the new workflow. The workflow checks every pull request. It does not deploy yet, so the old game stays live (section 8.3).
2. **Rules.** The rules module, with every rule example in spec section 6.2.1 as a test.
3. **Game.** The game state, the API service, the board, the computer's turn, undo, saving, and errors, in the new look.
4. **Pages.** Game setup, How to play and About, with the real content.
5. **Release.** Accessibility checks, the owner's sign-off, and the release.

### 1.1 Options considered

| Option | Pros | Cons |
| --- | --- | --- |
| Refactor the current Create React App code step by step | Keeps working code at every step | Create React App is deprecated ([React blog, 2025-02-14](https://react.dev/blog/2025/02/14/sunsetting-create-react-app)). Almost every file changes anyway: JavaScript to TypeScript, the logic split, the redesign. |
| **Rebuild in the same repository** | Current tools from the start. The history, the issues and the GitHub Pages address stay. | The live site keeps the old app until phase 5. |
| A new repository | A clean start | Loses the history and the Pages address `ollierumbol.github.io/draughtsgame`, which the API's CORS rule depends on (spec section 2.5). |

Chosen: rebuild in the same repository. The old app stays live from the `gh-pages` branch until the new app is ready (section 8.3).

| Option | Pros | Cons |
| --- | --- | --- |
| **Vite single-page app** | Static files, which GitHub Pages serves as they are (spec section 5.4). The current default for a single-page app with static hosting (`~/.claude/rules/react.md`). | None for this site. |
| Next.js | Server rendering and server routes | GitHub Pages cannot run server code. The site has no search-engine need. |

Chosen: Vite.

---

## 2. Configuration

Nothing in this site is secret (spec section 6.5, item 5). Every setting is in the repository.

| Setting | Value | Where | Notes |
| --- | --- | --- | --- |
| `VITE_API_BASE_URL` | `https://func-draughts-game-chhwarhkf4hphjf0.uksouth-01.azurewebsites.net/api` | `.env.production` | Read once in `src/services/api.ts`. Spec section 5.1. |
| `VITE_API_BASE_URL` | `/api` | `.env.development` | The Vite dev server forwards `/api` to the live API (section 3.5, decision 9). |
| Vite `base` | `/draughtsgame/` | `vite.config.ts` | The site is served under this path (spec section 2.5). |
| Dev proxy target | The production base URL, without `/api` | `vite.config.ts` | Used by `npm run dev` only. |
| Request time limit | 15,000 ms | `src/services/api.ts` | Spec section 6.1.9, item 5. A constant, not a setting, because it changes only with the spec. |
| Animation timings | See section 3.6, "Motion" | `src/components/board/timings.ts` | Constants. One file, so they can be tuned in one place. |
| Saved game key | `draughts.game.v1` | `src/services/storage.ts` | The `v1` lets a later version discard old saves (spec section 6.1.8, item 5). |
| Theme key | `draughts.theme` | `src/services/storage.ts` | `"light"` or `"dark"`. Missing means "use the device" (spec section 6.4.1, item 2). |
| Node.js | 26 (the current LTS, checked on 2026-11-14) | `.nvmrc` and the workflow | Spec section 3, goal 1. Every chosen package also supports Node 24, which the owner's computer has today. |

Vite exposes only variables that start with `VITE_` to the browser ([Vite env docs](https://vite.dev/guide/env-and-mode)). None of them is secret.

---

## 3. Architecture

### 3.1 Components

The folders follow "Project structure" in `~/.claude/rules/react.md`, plus `src/game/` for the rules and the game state, which are plain TypeScript.

```
src/
  main.tsx                  Start-up: fonts, theme, router
  routes.tsx                All routes, in one place (section 3.3.5)
  game/                     Plain TypeScript. Imports nothing from React.
    board.ts                Board type, square helpers, starting board
    rules.ts                Legal moves, steps of a chain, applying a move, end of the game
    path.ts                 The jump order of the computer's move (spec section 6.1.5, item 4)
    game-state.ts           The reducer: the whole game, undo history and phases
    saved-game.ts           Checking a saved game read back from storage
  services/
    api.ts                  GetNextMove and GetPotentialMoves (spec section 5)
    storage.ts              localStorage, wrapped so that a failure never breaks the game
  hooks/
    useComputerTurn.ts      Asks the API, with time limit and cancel
    useTips.ts              Show tips
    useSavedGame.ts         Load on start, save after every turn
    useTheme.ts             Light or dark, and the switch
    usePrefersReducedMotion.ts
  components/
    board/                  Board, Square, Piece, marks, animation, keyboard
    layout/                 Header, navigation, theme switch, footer
    live-region/            Screen reader announcements
  pages/
    play/                   Setup, game screen, status, controls, captured stacks
    how-to-play/            Rules text and the small board pictures
    about/                  Tribute, photo, how it's built
    not-found/
  styles/
    tokens.css              Colours, type, spacing, motion, for light and dark
    global.css
  types/
e2e/                        Playwright tests (section 7)
```

What each part depends on:

* `game/` depends on nothing else in the app. It is the rules engine that spec section 3, goal 4 requires to be testable without drawing the page.
* `services/` depends on `game/` for types only.
* `hooks/` connect `services/` and `game/` to React.
* `components/` and `pages/` draw the state and send actions. They do not contain rules.

### 3.2 Existing code to follow or reuse

* `DraughtsGameFunctionService/Engine/MoveGenerator.cs` in the API repository (read on 2026-11-14). `rules.ts` ports its logic, so that the web app and the API agree (spec section 6.2.1):
  * simple moves, and capture chains found depth first, with each landing square as a separate move;
  * a captured piece stays on its square until the move ends. So it cannot be captured twice, and no piece can land on its square;
  * a king may land on the square where its chain started;
  * a man that reaches the far row becomes a king, and its chain stops;
  * two chains with the same start, end and captured set are one move.
* `DraughtsGameFunctionTests/` in the API repository. The worked examples in spec section 6.2.1 come from it, and the tests here use the same boards.
* `src/logic/api.js` on `main` shows the request and response field names. It is replaced, not reused.
* Nothing else from the old `src/` is reused. `src/logic/helpers/` has the defects in spec section 4.1, item 11. `src/logic/automatedPlayerV*.js` is unused.

### 3.3 Interfaces and contracts

#### 3.3.1 Game types (`src/game/board.ts`)

```ts
// The API's encoding (spec section 2.3). The web app never uses 6.
export type Cell = 0 | 1 | 2 | 3 | 4 | 5;
export type Board = readonly (readonly Cell[])[]; // 8 rows of 8
export type Player = 1 | 2;
export type Position = { row: number; col: number };

export type Move = {
  from: Position;
  to: Position;
  captured: Position[]; // in jump order
  path: Position[]; // every landing square, in order. One item for a simple move.
};
```

#### 3.3.2 Rules (`src/game/rules.ts`, `src/game/path.ts`)

```ts
export function legalMoves(board: Board, player: Player): Move[];
export function hasMove(board: Board, player: Player): boolean;

// The next steps for one piece. During a chain, only further jumps by the same piece.
export type Step = { to: Position; captured: Position | null };
export type ChainSoFar = { start: Position; captured: Position[] };
export function nextSteps(board: Board, from: Position, chain: ChainSoFar | null): Step[];

// Applies a whole move: removes the captured pieces and promotes a man on the far row.
export function applyMove(board: Board, move: Move): Board;

// Spec section 2.1, item 7. Checked after every turn.
export type Outcome = { kind: "playing" } | { kind: "win"; winner: Player } | { kind: "tie" };
export function outcome(board: Board): Outcome;

// Spec section 6.1.5, items 3 and 4. Null when no legal chain matches, which counts as a failure.
export function findPath(board: Board, player: Player, from: Position, to: Position, takes: Position[]): Move | null;
```

`findPath` checks legality and finds the jump order in one step. It searches the chains from `from`, under the same rules as `legalMoves`, for one that ends on `to` and captures exactly the squares in `takes`, in any order. The first one found is used (spec section 6.1.5, item 4, and example 17).

#### 3.3.3 Game state (`src/game/game-state.ts`)

```ts
export type Settings = {
  opponent: "twoPlayers" | "computer";
  level: "easy" | "normal" | "hard"; // the API names (spec section 2.4)
  firstPlayer: Player;
};

export type Phase =
  | { kind: "turn"; selected: Position | null; chain: ChainSoFar | null }
  | { kind: "computerThinking"; requestId: number }
  | { kind: "computerMoving"; move: Move; step: number }
  | { kind: "computerFailed"; requestId: number }
  | { kind: "over"; result: Result };

export type Snapshot = { board: Board; toMove: Player; capturedBy: Record<Player, number> };

export type GameState = {
  settings: Settings;
  board: Board;
  toMove: Player;
  capturedBy: Record<Player, number>;
  history: Snapshot[]; // the start of each turn, for Undo
  lastComputerMove: { from: Position; to: Position } | null;
  phase: Phase;
};

export type Action =
  | { type: "select"; at: Position }
  | { type: "chooseTarget"; at: Position }
  | { type: "endTurn" }
  | { type: "undo" }
  | { type: "giveUp" }
  | { type: "computerMoveReceived"; requestId: number; move: Move }
  | { type: "computerMoveFailed"; requestId: number }
  | { type: "computerStepShown" }
  | { type: "retry" };

export function newGame(settings: Settings): GameState;
export function gameReducer(state: GameState, action: Action): GameState;
export function canUndo(state: GameState): boolean;
```

Rules that the reducer enforces:

* **Select.** `select` on the selected piece clears the selection. `select` on another own piece switches to it. Any other square clears the selection. During a chain, `select` and a click on a square that is not a target do nothing (spec sections 6.1.2 and 6.1.3).
* **Moves and chains.** `chooseTarget` applies one step. When further jumps exist, and the man has not just become a king, the phase keeps `chain` (spec section 6.1.3). Otherwise the turn ends.
* **End of a turn.** At the end of every turn, the reducer pushes the turn's starting `Snapshot` to `history`, then checks `outcome` (spec section 6.1.6, item 1). Then:
  * if the game is over, the phase becomes `over`;
  * if it is the computer's turn, the phase becomes `computerThinking`;
  * otherwise, the phase becomes `turn` for the next player.
* **Undo** (spec section 6.1.7):
  * In a computer game, it pops snapshots until the snapshot is for the person's turn. So it removes the computer's reply and the person's turn together.
  * During a chain, it restores the start of the current turn.
  * `canUndo` is false while the phase is `computerThinking` or `computerMoving`, or after the person gives up.
* **Stale responses.** `requestId` goes up by one for every request. A `computerMoveReceived` or `computerMoveFailed` with an old `requestId` is ignored (spec section 6.6, item 5).
* **Purity.** The reducer is pure. It never calls the API or storage. Hooks do that (section 3.3.4).

#### 3.3.4 API service (`src/services/api.ts`)

```ts
export type Level = "easy" | "normal" | "hard";

export type ApiFailure =
  | { kind: "network" }
  | { kind: "timeout" }
  | { kind: "http"; status: number }
  | { kind: "badBody" }
  | { kind: "unsuccessful" }; // successful: false in the body

export type ApiResult<T> = { ok: true; value: T } | { ok: false; failure: ApiFailure };

export type ApiMove = { from: Position; to: Position; takes: Position[] };

export function getNextMove(board: Board, level: Level, signal: AbortSignal): Promise<ApiResult<ApiMove>>;
export function getTips(board: Board, player: Player, signal: AbortSignal): Promise<ApiResult<Position[]>>;
```

How the service behaves:

* **Requests.** It sends `{ "Difficulty": level, "Board": board }` and `{ "Board": board, "TipFor": player }` (spec sections 5.1 and 5.2).
* **Body check.** It checks the body by hand, with a small type guard for each response. It returns a typed result and never throws. A library such as Zod is not needed for two small response shapes.
* **Time limit.** It combines the caller's signal with `AbortSignal.timeout(15000)` through `AbortSignal.any` ([MDN](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal/any_static)). This works in every browser that spec section 6.5, item 2 lists.
* **Who calls it.** `useComputerTurn` calls `getNextMove` while the phase is `computerThinking`. Then it runs `findPath`, and dispatches `computerMoveReceived` or `computerMoveFailed`. Its effect cleanup aborts the request when the phase changes, for example on Give up or New game.

#### 3.3.5 Routes (`src/routes.tsx`)

React Router's hash router keeps the old addresses working (spec section 6.1.10). GitHub Pages serves one `index.html`, so a hash router needs no 404 workaround.

| Address | Page |
| --- | --- |
| `#/` | Play |
| `#/howtoplay` | How to play |
| `#/about` | About |
| anything else | Not found |

#### 3.3.6 Board component

```ts
type BoardProps = {
  state: GameState;
  dispatch: (action: Action) => void;
  tips: Position[]; // from useTips
};
```

The board uses the ARIA grid pattern: `role="grid"`, with rows and `gridcell`s, and one roving `tabindex`. The arrow keys move the focus, and Enter or Space act on the focused cell. Escape clears the selection ([ARIA APG grid pattern](https://www.w3.org/WAI/ARIA/apg/patterns/grid/)). Each cell's accessible name follows spec section 6.4.3, item 2. Announcements go to one polite live region.

### 3.4 Data model

**Saved game (`localStorage`, key `draughts.game.v1`).** The `GameState` from section 3.3.3, saved as JSON after every action that ends a turn, and at game over.

* The phases `computerThinking` and `computerMoving` are saved as `computerThinking`. So a refresh asks the API again (spec section 6.1.8, item 3).
* A selection is not saved. After a refresh, no piece is selected.
* A chain in progress is not saved. Saving happens only at the end of a turn, so a refresh mid-chain returns to the start of that turn.

`saved-game.ts` checks the parsed JSON before it is used:

* 8 rows of 8 cells, with values 0 to 5;
* the settings values;
* every snapshot in the history.

Anything that fails a check is discarded (spec section 6.1.8, item 5).

**Theme (`localStorage`, key `draughts.theme`).** `"light"` or `"dark"`, written only when the player uses the switch.

**Storage failures.** Every read and write is wrapped in `try`/`catch`. If storage is not available, the game runs without saving (spec section 6.6, item 10).

### 3.5 Key decisions

| # | Decision | Choice | Why | Alternatives rejected |
| --- | --- | --- | --- | --- |
| 1 | Language | TypeScript 6.0, `strict` | `~/.claude/rules/react.md`. TypeScript 7.0 is the newest version, but `typescript-eslint` 8.72 supports only versions below 6.1 (its `peerDependencies`, checked on 2026-11-14). | TypeScript 7.0, until `typescript-eslint` supports it |
| 2 | Memoization | React Compiler through Babel (`@rolldown/plugin-babel` and `babel-plugin-react-compiler`) | The rules file enables it in new projects. The `@vitejs/plugin-react` 6.3 README marks the native compiler option "experimental", and the Babel route is the stable one. | The native compiler option; manual `useMemo` |
| 3 | State | One `useReducer` over `GameState`, in the Play page | Many values change together (board, turn, history, phase). This fixes spec section 4.1, items 1 to 3. | Context for all state; a state library |
| 4 | Rules location | `src/game/`, ported from the API | One copy of the rules in the web app, matching the API (spec section 4.1, item 11, and section 6.2.1) | Calling the API for every check: slow, and it needs the network |
| 5 | Styling | CSS Modules, with tokens as CSS variables in `tokens.css` | Built into Vite, with no extra package. Bootstrap's look is on the avoid list (section 3.6). | react-bootstrap; Tailwind; CSS-in-JS |
| 6 | Animation | CSS transitions and the Web Animations API | The motion is small and fixed (section 3.6), so no library is needed. | Framer Motion; React Spring |
| 7 | Fonts | Served by the site through `@fontsource-variable/fraunces` and `@fontsource-variable/source-sans-3` | No request to Google, which keeps spec section 6.5, item 6 (no tracking). Both fonts use the SIL Open Font License. | Google Fonts links |
| 8 | Routing | React Router 8, hash router | Section 3.3.5. One file of routes. | Paths with a GitHub Pages 404 workaround; hand-written hash routing |
| 9 | Local API calls | The Vite dev server proxies `/api` to the live API | The API allows only `ollierumbol.github.io` in a browser (spec section 5.3). A dev-server proxy calls it from Node.js, where CORS does not apply ([Vite `server.proxy`](https://vite.dev/config/server-options#server-proxy)). On 2026-11-14, a POST with `Origin: http://localhost:5173`, sent from outside a browser, got the normal tips response, so the API does not reject such requests. No change to the API is needed. | Add `localhost` to the API's CORS; run the API locally |
| 10 | Deployment | GitHub Actions, with `actions/upload-pages-artifact` and `actions/deploy-pages` | It needs no stored token, only the workflow's `pages: write` and `id-token: write` permissions ([GitHub Docs: custom workflows for Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)). This meets spec section 6.5, item 5. | The `gh-pages` package with the 2021 `TOKEN` secret |
| 11 | Tests | Vitest and React Testing Library for units and components; MSW for the API; Playwright and `@axe-core/playwright` for end-to-end and accessibility | `~/.claude/rules/react.md`. The accessibility checks in spec section 6.5, item 1 need a real browser for colour contrast, which jsdom cannot compute. | jsdom-only accessibility checks; Cypress |
| 12 | Old code | Remove the old `src/` in the tooling phase. The old app stays live from `gh-pages` until the release. | The new tools cannot build JSX in `.js` files. The owner chose on 2026-11-14 to keep the old game live, rather than show a placeholder (section 8.3). | Keeping both apps side by side; a placeholder page on the live site |
| 13 | A captured piece during the person's chain | Fades away at its jump, as the computer's do. `rules.ts` still treats its square as taken until the turn ends. | Matches the API (section 3.2), so both give the same moves. The square can only matter in rare king loops. | Keeping captured pieces on the board until the turn ends |
| 14 | Package updates | Dependabot version updates, weekly, for npm and GitHub Actions | Keeps spec section 6.5, items 5 and 7 true after the release, at no cost | Updating by hand |

### 3.6 Design direction

The owner made these choices between 2026-11-10 and 2026-11-14, from the mockups shown in the session.

| Item | Choice |
| --- | --- |
| References | A real wooden draughts board: grain, brass, worn edges, pieces you could almost pick up. A photo of the owner's family board, if the owner supplies one, sets the exact wood colours. |
| Character | Warm, traditional, calm, made with care |
| Signature | **The family board leads.** Wood grain on every square, and a walnut frame with a thin brass inlay. Three details support it and stay small: "For Ernest" with a crown set into the bottom edge of the frame; turned pieces with lathe rings; and captured men stacked beside the board. |
| Type | Fraunces (variable, weight 500) for the wordmark and headings. Source Sans 3 (variable, weights 400 and 600) for everything else. Scale: 14, 16, 20, 24 and 32 px. Body text 16 px, line height 1.5. |
| Colour | See the table below. |
| Motion | See the motion table below. |
| Avoid | Childish colours (bright primaries, mustard, hot pink, sky blue); flashy effects (glows, confetti, sparkles, bouncing banners); the default Bootstrap look (dark badges, big blue buttons, every block in a card); glossy plastic pieces. |
| Approved design | `docs/design/game-screen.html`, an interactive mockup of the game screen. The owner approved it on 2026-11-14. It shows the board, the pieces, every mark, the motion, light and dark mode, and the desktop and phone layouts. The comment at the top of the file lists where it differs from the real site. Where it and this plan differ, this plan wins. |
| Content | Spec section 6.1.11. The How to play text is drafted from spec section 2.1 and approved by the owner. The About tribute starts from `About.js` on `main`, with edits the owner accepts one by one. The owner supplies the photo. |

**Colour tokens.** The board and pieces use the same colours in both modes. Contrast was measured with the WCAG 2.2 formula on 2026-11-14. The rule for graphics needs at least 3 to 1, and the rule for text needs at least 4.5 to 1.

| Token | Light | Dark | Use | Contrast |
| --- | --- | --- | --- | --- |
| `--page` | `#F6EFE3` | `#1C1814` | Page background | — |
| `--surface` | `#FBF7F0` | `#26201A` | Cards and panels | — |
| `--border` | `#E3D5BE` | `#3A3027` | Hairlines | — |
| `--text` | `#3B2A1A` | `#EFE6D8` | Body text | 11.99, 14.27 |
| `--text-muted` | `#7A6650` | `#B8A890` | Labels, captions | 4.78, 7.60 |
| `--button` | `#EFE4D2` | `#302820` | Secondary buttons | — |
| `--button-primary` | `#5A3A22` | `#C9A25A` | One main action per view | Text on it: 9.53 (light) |
| `--brass` | `#9C7424` | `#C9A25A` | King band, current page, small details | 3.72 on the light page, 7.39 on the dark page |
| `--maple` | `#E8D3A9` | same | Light squares | — |
| `--walnut` | `#8A5A36` | same | Dark squares | — |
| `--frame` | `#5A3A22` | same | Board frame | — |
| `--man-light` | `#F4EBDD`, edge `#BFA884` | same | Player 1 pieces | 4.94 on walnut |
| `--man-dark` | `#1E140E`, edge `#0A0604` | same | Player 2 pieces | 3.10 on walnut |
| `--cream` | `#FFF6E2` | same | Target dots, last-move line | 5.43 on walnut |
| `--stack-light-edge` | `#8A7458` | `#BFA884` | Edge of the captured ivory men stacked beside the board | 3.89 on the light page |
| `--stack-dark-edge` | `#0A0604` | `#8A7A68` | Edge of the captured dark men stacked beside the board | 4.26 on the dark page. Without it, dark men vanish on the dark page. |

**How each board mark looks.** Spec section 6.4.2, item 5 requires that each mark looks different from the others.

| Mark | Look |
| --- | --- |
| King | Two men stacked, the top one offset, with a `--brass` band on the top man's edge. It differs from a man by shape and by the band, not by colour alone (spec section 6.4.2, item 6). |
| Selected piece | Lifted: it rises a few pixels, grows to 110% and casts a soft shadow. The player's other pieces fade to 70% (3.32 to 1 on walnut). The fade is the same during a chain. A stronger fade would drop the pieces below 3 to 1, and the board must stay readable. |
| Target | A cream dot, 30% of the square, which fades in |
| Computer's last move | A 2 px cream line inside the start and end squares |
| Tip | A cream ring, 60% of the square, with no fill. A target is a solid dot, so the two look different. |
| Keyboard focus | A two-tone ring around the square: 2 px `--cream` inside 2 px `--man-dark`. Brass alone is too close to walnut (1.37 to 1). Each tone passes 3 to 1 on one of the squares: the dark tone on maple (12.33) and on walnut (3.10), and the cream on walnut (5.43). It sits outside the other marks. |

**Motion.** Every timing is in `timings.ts`.

| What | How | Time |
| --- | --- | --- |
| Lift on select | Rises and grows, with a small overshoot (`cubic-bezier(.2,.9,.3,1.25)`) | 180 ms |
| Put down | Reverses the lift | 180 ms |
| Target dots | Fade and grow in | 180 ms |
| The computer's jump | Slides to the landing square and grows to 116% halfway | 380 ms each, then a 180 ms pause |
| The person's move or jump | The same slide | 200 ms |
| Captured piece | Fades and shrinks to 50%, starting halfway through the jump | 60% of the jump time |
| Promotion (crowning) | The piece rises and grows (180 ms). The second disc and the brass band appear, and one soft brass ripple spreads out from the piece (420 ms). The piece settles back down with a small dip (260 ms). The owner chose this on 2026-11-14, over a man dropped on top and a band drawn around the edge. The same animation is used for the computer's men. | About 600 ms in all |
| Reduced motion | When the device asks for reduced motion, slides, lifts and the crowning are instant. Fades stay, shortened to 100 ms. The computer's jumps are still shown one at a time, with the pause, so captures can still be counted. | — |

The design is checked against these choices before the owner signs off (spec section 6.4.1, item 1). The owner decides matters of taste.

---

## 4. Error handling

| Situation | Behaviour |
| --- | --- |
| GetNextMove: no network, or the request is rejected | `{ kind: "network" }`. The phase becomes `computerFailed`, with the message and "Try again" (spec section 6.1.9). |
| GetNextMove: no answer in 15 s | `{ kind: "timeout" }`. Same as above. |
| GetNextMove: HTTP 400 (for example "Player 2 has no legal moves."), any other 4xx, or 5xx | `{ kind: "http" }`. Same as above. The `errorMessage` is not shown (spec section 6.1.9, item 4). |
| GetNextMove: HTTP 403 or another non-JSON page, for example when the API app is stopped | `{ kind: "badBody" }`. Same as above. |
| GetNextMove: HTTP 200 with `successful: false` | `{ kind: "unsuccessful" }`. Same as above. |
| GetNextMove: a legal-looking body, but `findPath` returns null | Same as above (spec section 6.1.9). |
| GetNextMove: cancelled by Give up or New game | The abort is expected. Nothing is shown. A late response is ignored, by `requestId` (spec section 6.6, item 5). |
| Try again | Sends the same request again. Every request is a read with no side effects, so a repeat is safe. |
| GetPotentialMoves: any failure above | A short note beside "Show tips": "Tips aren't available right now." The game goes on (spec section 6.1.4, item 4). |
| GetPotentialMoves: the answer arrives after the board or the turn changed | Ignored. `useTips` aborts the request when the board changes (spec section 6.6, item 15). |
| `localStorage` throws, or is full | Caught. The game goes on without saving (spec section 6.6, item 10). |
| Saved data fails the check | Discarded, and game setup is shown (spec section 6.1.8, item 5). |
| An unexpected exception while drawing | An error boundary around each page shows "Something went wrong" with "New game", which clears the saved game. The header and the other pages keep working. React 19 still needs a class component for an error boundary, and `~/.claude/rules/react.md` forbids class components, so the boundary comes from `react-error-boundary` (6.1.6, which supports React 19). |

No request is retried by itself. Spec section 6.1.9 asks for a "Try again" control, not automatic retries.

---

## 5. Observability

The site has no analytics and no logging service (spec section 3, non-goals, and section 6.5, item 6).

How to tell whether it works:

* **Every pull request:** the workflow's checks (section 8.2) show pass or fail on the pull request.
* **Every deploy:** the "github-pages" environment on GitHub shows each deployment, its commit and its URL.
* **API calls:** the API's own logs (Application Insights, in its repository) record each request with its status and duration. A normal game shows only HTTP 200s (spec section 9).
* **In the browser:** an API failure is shown to the player (section 4), and never only in the console. `console.log` calls are removed before a commit (`~/.claude/rules/react.md`). The lint rule `no-console` enforces this.

---

## 6. Security

| Item | Decision |
| --- | --- |
| Secrets | None in the site. The API is anonymous (spec section 5.3), and its URL is public. |
| CI credentials | No personal access token. The deploy job uses the workflow token, with `pages: write` and `id-token: write` on that job only. The other jobs get `contents: read`. The old secrets `EMAIL`, `TOKEN` and `USERNAME` (from 2021) are deleted after the first deploy from Actions (section 8.3). |
| Third-party actions | First-party `actions/*` are pinned to a major version. Any third-party action is pinned to a full commit SHA. This follows the API repository's workflow. |
| Content Security Policy | A `<meta http-equiv="Content-Security-Policy">` tag, because GitHub Pages cannot set headers: `default-src 'self'; connect-src 'self' https://func-draughts-game-chhwarhkf4hphjf0.uksouth-01.azurewebsites.net; img-src 'self' data:; style-src 'self' 'unsafe-inline'; font-src 'self'; script-src 'self'; base-uri 'self'; form-action 'none'`. `'unsafe-inline'` for styles is needed for the inline `style` attributes that place pieces. A small Vite plugin (`transformIndexHtml`) writes the tag at build time, with the host taken from `VITE_API_BASE_URL`, so the address is set in one place. |
| Untrusted input | API responses (section 3.3.4) and saved data (section 3.4) are checked before use. No HTML is rendered from data. |
| Personal data | None. Storage holds only the game and the theme (spec section 6.5, item 6). |
| Vulnerabilities | `npm audit` runs in CI with no `audit-level`, so any vulnerability fails the job ([npm audit docs, exit code](https://docs.npmjs.com/cli/commands/npm-audit)) (spec section 6.5, item 5). An owner-approved exception is recorded in `docs/audit-exceptions.md`, with the package, the reason and a review date. CI reads it through an `npm audit` wrapper script. |
| Branch protection | A ruleset on `main`, as `~/.claude/rules/github.md` sets out, made after the new workflow has run once. The owner makes it, because it is a repository setting. |

---

## 7. Testing

### 7.1 Principles

* **Rules:** Vitest unit tests for `src/game/`, with no rendering (spec section 3, goal 4). Every example in spec section 6.2.1 is a test, with the same board.
* **Reducer:** Vitest unit tests that send `Action`s to `gameReducer` and check the next `GameState`. These cover undo, chains, phases, and stale responses.
* **Components:** React Testing Library with `user-event`. Elements are found by role and accessible name. The API is mocked at the HTTP boundary with MSW.
* **End to end:** Playwright, against a production build served by `vite preview`, with the API mocked by Playwright's `page.route`. No test calls the live API, so CI never depends on it, or costs it anything.
* **Accessibility:** `@axe-core/playwright` on each page and game state in spec section 6.5, item 1, in light and dark mode, at 320 px and 1280 px wide. The keyboard and screen reader games are owner steps.
* **Time and randomness:** the tests use Vitest's fake timers for animation timings and the 15 s limit. The web app uses no randomness.
* **Old tests:** removed with the old code. They test the old JavaScript files.

### 7.2 Tests

| # | Test | Spec | Defect it catches |
| --- | --- | --- | --- |
| 1 | Starting board and square helpers: dark squares, and rows 0 to 7 | 2.3 | Wrong board set-up |
| 2 | `legalMoves`, examples 1 to 6, each as a set of moves (start, end, captured set) | 6.2.1 #1–6 | Any rule differing from the API: king directions, man takes king, loops, chains that end where they began |
| 3 | Example 7: tips from `legalMoves` match the API's tip list, so the web app's rules and the API agree | 6.2.1 #7 | Drift between the two rule sets |
| 4 | `nextSteps`: example 8 (targets), example 11 (switching pieces), and that a piece with no moves gives none | 6.1.2; 6.2.1 #8, #11 | Wrong targets marked |
| 5 | Chains: example 9 (stays selected, next jump shown), example 10 (End turn) | 6.1.3; 6.2.1 #9–10 | Forced continuation; a lost "End turn" |
| 6 | Promotion ends a chain: example 12 | 2.1 item 6; 6.2.1 #12 | A new king jumping again |
| 7 | A captured square blocks landing until the turn ends (decision 13) | 3.2 | A chain that the API would not allow |
| 8 | `outcome`: examples 13 and 14, a player with no pieces, and a player blocked by their own move | 2.1 item 7; 6.2.1 #13–14 | Spec 4.1, item 7: the API asked for a move after the game ended |
| 9 | `findPath`: examples 15 to 18, including `takes` in board order and an illegal response | 6.1.5 items 3–4; 6.2.2 | Spec 4.1, item 4: the chain shown in one step; illegal moves accepted |
| 10 | Reducer: select, select again (put down), switch, choose a non-target | 6.1.2 | Spec 4.1, item 13: the invalid-move dialog |
| 11 | Reducer: undo in a computer game (example 19), in a two-player game (example 21), and mid-chain (example 22) | 6.1.7; 6.2.3 #19, #21, #22 | Spec 4.1, item 1: undo in place |
| 12 | Reducer: `canUndo` is false while thinking or moving (example 20), and true after a failure (example 24) | 6.1.7 items 4, 6 | Spec 4.1, item 2: undo racing the computer |
| 13 | Reducer: undo after a win or tie continues the game; not after Give up | 6.1.7 item 7 | Wrong final state |
| 14 | Reducer: give up in each mode, including while the computer is thinking | 6.1.6 item 4 | Spec 4.1, item 9: give up did nothing |
| 15 | Reducer: a stale `requestId` is ignored | 6.6 item 5 | A late move played on a new game |
| 16 | Reducer: the reducer never changes its input. The test deep-freezes the input state. | 3, goal 4 | Spec 4.1, item 3: state changed in place |
| 17 | `api.ts` with MSW: success, 400, 500, 403 HTML, `successful: false`, a bad body, network error, timeout and abort, each giving the right `ApiResult` | 5.1, 5.2, 6.1.9 | Spec 4.1, item 10: hidden errors |
| 18 | `api.ts`: the request body is exactly `Difficulty` and `Board`, with no 6 in the board | 3, goal 7; 6.1.5 item 1 | Old fields sent; tips sent to the API |
| 19 | `saved-game.ts`: a good save, a damaged JSON, a wrong board size, a bad cell value, an old key | 6.1.8 item 5; 6.6 item 9 | A broken save breaking the game |
| 20 | `storage.ts`: storage that throws on read and write | 6.6 item 10 | Private windows breaking the game |
| 21 | Component: setup defaults, level shown only for the computer, and Start game | 6.1.1 | Wrong defaults |
| 22 | Component: Show tips loads, marks squares, hides on a turn change, and shows a note on failure | 6.1.4 | Tips left on the board |
| 23 | Component: the computer's move is shown one jump at a time (fake timers), with captures removed at their own jumps, then the last-move mark | 6.1.5 items 4, 9 | Spec 4.1, item 4 |
| 24 | Component: failure shows the message and "Try again"; Try again succeeds (examples 24 and 25) | 6.1.9; 6.2.3 #24–25 | Spec 4.1, item 10 |
| 25 | Component: the board grid's keyboard use (arrows, Enter, Space, Escape) and square names | 6.4.3 | Keyboard play missing |
| 26 | Component: announcements in the live region for a move, a capture, the computer's move and the result | 6.4.3 item 3 | Silent screen reader |
| 27 | Component: the theme switch, its name and state, and that it is remembered | 6.4.1 item 2 | Theme not kept |
| 28 | Component: routes `#/`, `#/howtoplay`, `#/about` and an unknown address | 6.1.10 | Broken old links |
| 29 | Component: the About page has no project cards and no old tools list, and has the placeholder until the photo exists | 6.1.11 items 5–6 | Old content left in |
| 30 | E2E: a two-player game from setup to a win, with no network | 6.1.1–6.1.6 | The main flow broken |
| 31 | E2E: a computer game with the mocked API, refresh mid-game (example 23), and New game | 6.1.8 | Spec 4.1, item 14: game lost on refresh or navigation |
| 32 | E2E: the game is not lost when moving to How to play and back | 6.1.8 item 7 | Spec 4.1, item 14 |
| 33 | E2E: the person takes the computer's last piece; no API call is made (example 26) | 6.1.6 item 2 | Spec 4.1, item 7 |
| 34 | E2E with axe: every page and game state, light and dark, at 320 px and 1280 px | 6.5 item 1 | Contrast and ARIA faults |
| 35 | E2E: no sideways scroll at 320 px, and at 200% zoom at 1280 px | 6.4.1 item 3; 6.6 item 14 | Layout overflow |
| 36 | E2E: clicking a piece and a square leaves no text selection and no caret (`user-select` and `caret-color` are checked) | 6.4.2 item 7 | Spec 4.1, item 6 |
| 37 | CI: `npm audit` fails the build on a known vulnerability. The first run is checked by hand against a package with a known advisory. | 6.5 item 5 | Vulnerable packages released |

---

## 8. Infrastructure and deployment

### 8.1 Hosting and cost

| Resource | Plan | Free allowance | Expected use |
| --- | --- | --- | --- |
| GitHub Pages | Free, public repository | Sites up to 1 GB, and a soft limit of 100 GB of bandwidth a month ([GitHub Docs: Pages limits](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits), checked on 2026-11-14) | A few MB of files, and hobby traffic |
| GitHub Actions | Free, public repository | Standard GitHub-hosted runners are free for public repositories ([GitHub Docs: GitHub Actions billing](https://docs.github.com/en/billing/concepts/product-billing/github-actions), checked on 2026-11-14) | A few minutes for each pull request |
| Azure | None new | — | The API is unchanged. Its CORS origin `https://ollierumbol.github.io` stays the same, because the site's address does not change. |

This work has no cost (spec section 6.5, item 4).

### 8.2 Workflow (`.github/workflows/ci.yml`)

It runs on `pull_request`, on `push` to `main`, and on `workflow_dispatch`. It has no path filter, so its required check always runs (`~/.claude/rules/github.md`).

| Job | Steps | When |
| --- | --- | --- |
| `check` | `npm ci`, `npm audit` (with the exceptions file), `tsc -b`, `eslint`, `prettier --check`, `vitest run`, `vite build` | Every run |
| `e2e` | Install the Playwright browsers, `vite build`, run `e2e/` against `vite preview` | Every run, after `check` |
| `deploy` | `actions/configure-pages`, `actions/upload-pages-artifact` with `dist/`, `actions/deploy-pages` to the `github-pages` environment | `push` to `main` and `workflow_dispatch` only, after `check` and `e2e` pass, and only when the repository variable `DEPLOY_ENABLED` is `true` (section 8.3) |

A failed `check` or `e2e` stops `deploy` (spec section 3, goal 2). Concurrency: one deploy at a time. A newer pull request run cancels an older one on the same branch.

`.github/workflows/main_deploy.yml` is deleted in the same pull request that adds `ci.yml`.

### 8.3 Switch-over and release

The live site must not show a half-built game. The order:

The owner chose on 2026-11-14 to keep the old game live until the release, rather than show a placeholder.

1. **Tooling phase.** `ci.yml` is added and the old workflow is deleted. `DEPLOY_ENABLED` is not set, so `deploy` is skipped. Pages stays on "Deploy from a branch" (`gh-pages`), and the old app stays live. After `ci.yml` has run once, the owner makes the ruleset on `main` (section 6).
2. **Release.**
   1. The last pull request of the game merges to `main`. `deploy` is still skipped.
   2. The owner changes Settings → Pages → Source from "Deploy from a branch" to "GitHub Actions", and sets the repository variable `DEPLOY_ENABLED` to `true`.
   3. The owner runs the workflow on `main` by hand (`workflow_dispatch`). It deploys the new app.
   4. The owner plays the games in spec section 9 on the live site.
3. **After the release.** The owner deletes the `EMAIL`, `TOKEN` and `USERNAME` secrets, and the `gh-pages` branch. The API's stage 3 (removing `Version`) can then go ahead in the API repository (spec section 3, non-goals).

Steps 2.2 and 2.3 are minutes apart. The GitHub documentation ([configuring a publishing source](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site), read on 2026-11-14) does not say whether the old site stays up between the source change and the first deploy from Actions. So the gap is kept to a few minutes, and the release checks the live site straight after step 2.3. This is accepted for a hobby site.

**Rollback.** Run the workflow by hand (`workflow_dispatch`) on an earlier commit of `main`, or revert the pull request. Until `gh-pages` is deleted, the owner can also point Pages back to that branch.

---

## 9. Risks

| # | Risk | Likelihood | Mitigation |
| --- | --- | --- | --- |
| 1 | The deploy from Actions is first used at the release, so a fault in it shows up late | Medium | Every pull request builds the same `dist/` that `deploy` uploads, and the end-to-end tests run against it. At the release, rollback is to point Pages back to `gh-pages`, which still holds the old app (section 8.3). |
| 2 | The web app's rules and the API's rules drift apart | Medium | Tests 2 and 3 use the API's own examples. A port of `MoveGenerator.cs`, not a rewrite from memory. A difference shows as an illegal computer move, which the web app treats as a failure (section 4). |
| 3 | A captured square that stays blocked during a chain confuses a player, because it looks empty | Low: only in king loops | Decision 13 and test 7. If it is ever reported, show captured pieces as faint until the turn ends. |
| 4 | `typescript-eslint` holds TypeScript at 6.0 | Medium | Decision 1. Dependabot raises the update when support arrives. |
| 5 | Playwright tests fail now and then in CI | Medium | The tests use the mocked API, wait for elements to be visible (not fixed sleeps), and retry once in CI. A failure is recorded, not ignored (`~/.claude/CLAUDE.md`, "Working on a task", step 5). |
| 6 | `npm audit` reports a build-only advisory with no fix, and blocks every pull request | Medium | The exceptions file in section 6, approved by the owner, with a review date |
| 7 | The wood grain, the stacked kings and the marks look busy at 320 px | Medium | The design is checked at 320 px before sign-off. The grain and the rings can be turned down in `tokens.css` alone. |
| 8 | The dark pieces' contrast (3.10 to 1) is close to the limit | Low | Measured. Test 34 checks it in every state. A darker edge is the fallback. |
| 9 | The owner's photo or tribute edits come late | Medium | The About page ships with a visible placeholder. The definition of done (spec section 9) lists the owner's sign-off. |
| 10 | The API is stopped by its cost limit during the work | Low | The tests never call the live API. Only the owner's final games need it. |
