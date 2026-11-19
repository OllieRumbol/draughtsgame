# Draughts Game web app redesign — Tasks

> **What this document is for:** It answers *what do we do next?* It splits the approved design into small, verifiable steps and tracks progress against them.

Last updated: 2026-11-15

<!--
How to use this file
* This file holds the order of work and its progress. It does not repeat the requirements or the design.
* In "Refs", "spec 6.2" means spec.md section 6.2, and "plan 3.1" means plan.md section 3.1.
  "Test N" refers to the numbered tests in plan section 7.2. "Design" means docs/design/site.html.
* One task is one working session and one pull request.
* A task that grows beyond that is split into smaller tasks here.
* Tick a task only when every "Done when" item is true, "Verify" has passed and, for a task that changes behaviour, the review has no open blockers.
* Record deviations from the spec or plan in "Notes", and update that document to match.
* If a session ends before the task is done, write a checkpoint in "Notes": what is done, decisions and why, what failed, and the next step.
* When a task is ticked, cut its "Notes" to at most 5 short lines. Put the evidence, the review rounds and the final report in the pull request description.
* The first unticked task whose dependencies are done is the next task.
* Tasks marked (manual) change a repository setting or the live site, or need the owner's own judgement. The owner does them, or approves each step. Claude can prepare and check them.
-->

Unless a task says otherwise, run commands from the repository root. Task branches start from `main`, and their pull requests merge into `main`.

T1 adds the first two scripts to `package.json`, and T2 adds `npm run e2e`. Later tasks use them:

| Script | What it runs |
| --- | --- |
| `npm run check` | Type check, lint, format check, unit and component tests, build |
| `npm run audit` | `npm audit`, with the approved exceptions in `docs/audit-exceptions.md` (plan 6) |
| `npm run e2e` | Builds the site, then runs the Playwright tests in `e2e/` against `vite preview` |

**From T3 on, `main` is protected.** Every task ends with a pull request, including a manual task. Its pull request ticks the task and holds the evidence.

**Until T21, a merge to `main` does not deploy.** The old game stays live from the `gh-pages` branch (plan 8.3).

## Phase 1 — Tooling and delivery

Goal: the repository builds on Vite, React and TypeScript, with current packages; every pull request is checked automatically; `main` is protected; and the old game is still live.

- [x] **T1 — Replace Create React App with Vite, React and TypeScript**
  - Refs: spec 3 goal 1, spec 4, spec 6.5 items 5, 7 and 8, plan 1, plan 1.1, plan 2, plan 3.1, plan 3.5 decisions 1, 2, 5, 7, 9, 12 and 15, plan 5 (`no-console`), plan 6 (Content Security Policy), plan 7.1
  - Depends on: —
  - Done when:
    - The old `src/`, `public/`, `.eslintcache`, `.vscode/snipsnap.code-snippets` and the old tests are removed. No file from the old app remains, other than `README.md`, which is rewritten.
    - The project builds with Vite and TypeScript 6.0 in `strict` mode, with the React Compiler through Babel (plan 3.5 decisions 1 and 2).
    - The folders in plan 3.1 exist. `src/main.tsx` renders one placeholder page that says "Draughts", served under the `/draughtsgame/` base.
    - ESLint (flat config, `typescript-eslint`, `eslint-plugin-react-hooks` recommended rules, `no-console`), Prettier and Vitest with React Testing Library are set up, with one passing placeholder test of the page.
    - `.nvmrc` says 26. `.env.development`, `.env.production` and `.env.test` hold `VITE_API_BASE_URL` as plan 2 says, and the Vite dev server proxies `/api` (plan 3.5 decision 9). The check for an empty value in plan 2 is added with `api.ts` in T8.
    - Imports from `src` use a path alias (`~/.claude/rules/react.md`). React Router comes from the `react-router` package (plan 3.5 decision 8).
    - `.gitignore` is rewritten for the new tools: `node_modules/`, `dist/`, `playwright-report/` and `test-results/`.
    - The fonts come from `@fontsource-variable/fraunces` and `@fontsource-variable/source-sans-3` (plan 3.5 decision 7).
    - A small Vite plugin writes the Content Security Policy tag at build time, with the API host from `VITE_API_BASE_URL` (plan 6).
    - `npm run check` and `npm run audit` exist. `npm run audit` reads `docs/audit-exceptions.md`, in the format in plan 6, which starts with no rows.
    - `README.md` says what the project is, how to install, run, test and build it, and that deployment is described in plan 8. The Create React App text is gone.
    - `LICENSE` holds the MIT licence, and the README says that it covers the code only, not the About tribute or the photos (plan 3.5 decision 15).
  - Verify: `npm ci`, then `npm run audit`, then `npm run check`; then `npm outdated` lists no direct dependency other than the holds in plan 3.5 decision 1, with the output in the pull request; then `npm run dev` and a POST of the spec 5.2 request to `http://localhost:5173/api/GetPotentialMoves` returns the four squares; then the built `dist/index.html` contains the Content Security Policy tag with the API host
  - Notes:
    - `minimatch` is overridden to 11 for `@typescript-eslint/typescript-estree` only (GHSA-g3hv-75wg-m249). Remove the override when `typescript-eslint` uses `minimatch` 11. The owner approved this and the other plan differences in PR 62 on 2026-11-16.
    - T2 deletes `.github/workflows/main_deploy.yml` and its line in `.prettierignore`. `.gitattributes` keeps LF, so the Prettier check passes on Windows.
    - T10 deletes `src/pages/placeholder/`. The site has no icon since `public/` went; T10 decides. Delete each `.gitkeep` when its folder gets a file.
    - The Content Security Policy is build-only, after `<meta charset>`, and fails the build on an empty `VITE_API_BASE_URL`. T8 still adds the check in `api.ts`.
    - Vitest: jsdom, no globals (`src/test-setup.ts` cleans up), skips `e2e/`. Build-time code is in `config/`. `no-console` is off in `scripts/` only.

- [x] **T2 — Add the CI workflow, and remove the old one**
  - Refs: spec 3 goal 2, spec 6.5 items 5 and 7, spec 9, plan 3.5 decisions 10, 11 and 14, plan 6 (CI credentials, third-party actions, vulnerabilities), plan 7.1, plan 8.2, test 37, risk 6
  - Depends on: T1
  - Done when:
    - `.github/workflows/ci.yml` has the `check`, `e2e` and `deploy` jobs in plan 8.2, with the triggers, permissions, concurrency and action pinning that plan 6 and plan 8.2 set out.
    - `deploy` runs only on `push` to `main` or `workflow_dispatch`, after `check` and `e2e`, only when `github.ref` is `refs/heads/main`, and only when the repository variable `DEPLOY_ENABLED` is `true`. The variable is not set.
    - Playwright is installed with the browser projects in plan 7.1, `npm run e2e` exists, and `e2e/` holds one smoke test that opens the placeholder page.
    - `.github/dependabot.yml` asks for weekly version updates for npm and GitHub Actions, and ignores the `typescript` updates in plan 3.5 decision 14.
    - `.github/workflows/main_deploy.yml` is deleted.
    - Test 37: the pull request records a probe in which a package with a known advisory made `npm run audit` fail, and the probe was removed.
  - Verify: the workflow passes on this task's pull request; after the merge, the run on `main` shows `deploy` as skipped, and `https://ollierumbol.github.io/draughtsgame` still serves the old game
  - Notes:
    - Firefox could not start on the owner's Windows computer when run from Claude's tools ("spawn UNKNOWN", "Accessing a corrupted shared library"), even after a reinstall. Smart App Control is off and Defender has no detection. The other four pass locally. In CI, on Node 26.13.1, all five passed (PR 63).
    - `e2e` uploads the `dist/` it tested as the `site` artifact, and `deploy` publishes exactly that, with no checkout or install. Plan 8.2 does not say where `deploy` gets `dist/`. The Playwright browsers are not cached: a few minutes a run, kept simple on purpose.
    - Dependabot groups npm minor and patch updates, and ignores `@types/node` major updates. Update those by hand when `.nvmrc` moves to a newer Node.js LTS.
    - The phone projects use the `Pixel 7` and `iPhone 17` presets of Playwright 1.65. The smoke test fails on any console error, so a Content Security Policy violation fails it.
    - For T3: the required checks are the jobs named `check` and `e2e`. T1's carried points are done: the `.prettierignore` line is removed, and the README says Node.js 26 is used in CI.

- [x] **T3 — Protect `main` with a ruleset (manual)**
  - Refs: plan 6 (branch protection), `~/.claude/rules/github.md`
  - Depends on: T2
  - Done when:
    - The owner has made a ruleset on `main` with the settings in `~/.claude/rules/github.md`: a pull request with 0 approvals, the `check` and `e2e` jobs as required status checks, no bypass, and force pushes and deletion blocked.
    - "Automatically delete head branches" is on for the repository.
    - This task's pull request is the first one that the ruleset checks. It ticks this task.
  - Verify: `gh api repos/OllieRumbol/draughtsgame/rulesets` lists the ruleset, and `gh api repos/OllieRumbol/draughtsgame/rulesets/<id>` shows the settings above; `gh repo view --json deleteBranchOnMerge` shows `true`; the pull request page shows the two required checks
  - Notes:
    - The owner made the ruleset "Protect main" on 2026-11-16: the default branch, a pull request with 0 approvals, the required checks `check` and `e2e` from GitHub Actions, no bypass, and deletion and force pushes blocked. "Require branches to be up to date" is off.
    - GitHub set `require_extra_approval_for_unattributed_changes` to `true` by itself. Its docs say it only affects pull requests that Copilot opens, and only with a non-zero approval count. If it ever blocks a merge, set it to `false`.
    - "Automatically delete head branches" is on. Job names `check` and `e2e` must stay the same, or the required checks never pass.

## Phase 2 — Rules

Goal: `src/game/` holds the house rules, matching the API, and every rule example in spec 6.2.1 and 6.2.2 passes as a test with no rendering.

- [x] **T4 — Add the board and the legal moves**
  - Refs: spec 2.1, spec 2.3, spec 4.1 item 11, spec 6.1.2 items 2 and 6, spec 6.1.3 items 4 and 5, spec 6.2.1 examples 1–6, 8, 11 and 12, plan 3.2, plan 3.3.1, plan 3.3.2, plan 3.5 decisions 4 and 13, tests 1, 2, 4, 6 and 7, risk 2
  - Depends on: T1
  - Done when:
    - `src/game/board.ts` has the types in plan 3.3.1 and the starting board in spec 2.3.
    - `src/game/rules.ts` has `legalMoves`, `hasMove`, `nextSteps` and `applyMove`, ported from the API's `MoveGenerator.cs` as plan 3.2 lists. A captured piece blocks its square until the move ends (plan 3.5 decision 13).
    - `src/game/` imports nothing from React.
    - Tests 1, 2, 4, 6 and 7 pass, with the boards copied from spec 6.2.1.
  - Verify: `npm run check`
  - Notes:
    - Ported from `MoveGenerator.cs` with its direction order (up-left, up-right, down-left, down-right), so both find chains in the same order. Duplicate chains keep the first one found. The expected lists for examples 5 and 6 come from the API's `MoveGeneratorTests.cs`.
    - `nextSteps` takes the board with the piece on `from`. During a chain, the captured pieces may still be drawn or already faded. Either way they cannot be captured again. T6 can remove them at each jump. It cannot tell that a man became a king during the chain, so T6 ends the chain on promotion before it asks for more steps (plan 3.3.3).
    - Test 7 differs from plan 7.2: a chain can never land on a square it captured (landings are an even number of rows from the start, captured pieces an odd number; checked on 20,000 random boards). So test 7 checks that a captured piece cannot be captured again, drawn or faded. The owner approved the new wording of plan test 7, decision 13 and risk 3 on 2026-11-17.
    - The search keeps a man unpromoted until `applyMove`, as the API does. A man has no forward jump from its far row, so its chain stops there (test 6). T5's `findPath` can rely on this.
    - `src/game/test-boards.ts` holds board helpers for the rules tests, for T5 too. Nothing in the app imports it, so it is not in the build. An ESLint rule stops `src/game/` importing React or the rest of the app.

- [x] **T5 — Add the end of the game and the computer's jump order**
  - Refs: spec 2.1 item 7, spec 4.1 items 4 and 7, spec 6.1.5 items 3 and 4, spec 6.1.6 item 1, spec 6.2.1 examples 7, 13 and 14, spec 6.2.2, plan 3.3.2, tests 3, 8 and 9
  - Depends on: T4
  - Done when:
    - `rules.ts` has `outcome`, and `src/game/path.ts` has `findPath`, as plan 3.3.2 sets out.
    - `findPath` returns null for a response that is not a legal move (spec 6.2.2 example 18).
    - `outcome` follows spec 2.1 item 7: the player to move with no legal move loses, and there is no tie.
    - Tests 3, 8 and 9 pass.
  - Verify: `npm run check`
  - Notes:
    - `findPath` picks the matching move from `legalMoves`, so it uses exactly the same rules and cannot disagree with them. Plan 3.3.2 says it searches the chains from `from`. The result is the same. When several chains match, the first one found is used.
    - `takes` is compared with the captured pieces as a sorted list, so a response that names the same piece twice does not match.
    - `outcome` gives the reason `noPieces` when the player to move has no pieces left, and `noMoves` otherwise. T6 and T14 show it (spec 6.3).
    - Test 3 works out the tips from `legalMoves` inside the test. The web app gets its tips from the API (T16), so it needs no tips function.

## Phase 3 — Game

Goal: a full game can be played in the new look, against another person or the computer, with undo, saving, tips and every failure handled.

- [x] **T6 — Add the game reducer for turns and chains**
  - Refs: spec 4.1 items 3 and 13, spec 6.1.1 item 4, spec 6.1.2, spec 6.1.3, spec 6.1.6 items 1–3, spec 6.3, spec 6.2.1 examples 9 and 10, plan 3.3.3, plan 3.5 decision 3, tests 5, 10 and 16
  - Depends on: T5
  - Done when:
    - `src/game/game-state.ts` has `newGame`, `gameReducer` and the types in plan 3.3.3, for the `turn` and `over` phases: select, select again, switch, choose a target, chains with End turn, promotion, the end of a turn and the outcome check.
    - During a chain, `select` and a click on a square that is not a target do nothing (spec 6.1.2 items 5 and 7).
    - When the computer is to move, the reducer moves to `computerThinking`. The other computer actions are left to T7.
    - Tests 5, 10 and 16 pass.
  - Verify: `npm run check`
  - Notes:
    - Not in plan 3.3.3: `GameState` has `requestCount`, the number of requests for the computer's move so far. The next request gets `requestCount + 1`, so T7 can ignore a late answer by its id. The owner approved adding it to plan 3.3.3 on 2026-11-18.
    - `chooseTarget` on a square that is not a target does what `select` would do, so a stray click never shows an error. During a chain, both do nothing.
    - A step that makes a man a king ends the turn before the reducer asks `nextSteps` for more, as the T4 Notes asked. A captured piece is removed from `board` at its own jump; `chain.captured` still counts it.
    - For T7: the reducer lists `undo`, `giveUp` and the computer actions by name and ignores them; a `never` check fails the type check if an action is left out. `lastComputerMove` stays `null`. In the `over` phase every action is ignored (T7 then made Undo work after a win).
    - For T9: `saved-game.ts` must check `requestCount` too (a whole number, 0 or more), although plan 3.4 does not list it yet. `STARTING_BOARD` is frozen.

- [x] **T7 — Add undo, give up and the computer phases to the reducer**
  - Refs: spec 4.1 items 1, 2 and 9, spec 6.1.5 items 7 and 9, spec 6.1.6 item 4, spec 6.1.7, spec 6.1.9 items 1–3, spec 6.2.3 examples 19–22 and 24, spec 6.6 item 5, plan 3.3.3, tests 11–15
  - Depends on: T6
  - Done when:
    - `gameReducer` handles `undo`, `giveUp`, `computerMoveReceived`, `computerMoveFailed`, `computerStepShown` and `retry`, and `canUndo` exists, as plan 3.3.3 sets out.
    - `lastComputerMove` is set after the computer's move, and cleared by the person's next move or jump, by Undo and by New game (spec 6.1.5 item 9).
    - Tests 11 to 15 pass.
  - Verify: `npm run check`
  - Notes:
    - For T15: `computerMoving.step` is the number of jumps already shown. Each `computerStepShown` applies the next jump to `board`. The reducer trusts the move, so `useComputerTurn` must check it with `findPath` first (plan 3.3.4).
    - For T15: request ids start again at 1 in every new game, so the id alone cannot reject an old game's answer. `useComputerTurn` must abort its request on New game and must not dispatch after its signal is aborted. T15's tests cover this (spec 6.6 item 5).
    - Decision: a player who gives up during their own chain keeps the board as it is, because the final board stays on view (spec 6.1.6 item 2). Only a give-up during the computer's turn goes back to `turnStart` (spec 6.1.6 item 4).
    - For T14: New game clears the mark because `newGame` starts with `lastComputerMove: null`, so the next game must be built with `newGame`.
    - For T9: during `computerMoving`, `board` holds the jumps shown so far. A state saved as `computerThinking` (plan 3.4) must take its board and counts from `turnStart`.

- [x] **T8 — Add the API service**
  - Refs: spec 3 goal 7, spec 4.1 item 10, spec 5.1, spec 5.2, spec 6.1.5 item 1, spec 6.1.9 items 4 and 5, plan 2, plan 3.3.4, plan 4, plan 7.1, tests 17 and 18
  - Depends on: T4
  - Done when:
    - `src/services/api.ts` has `getNextMove` and `getTips`, as plan 3.3.4 sets out, with the 15-second limit and the caller's abort signal. It throws when it is loaded and `VITE_API_BASE_URL` is empty (plan 2).
    - Before the other cases, one test proves the time-limit approach in plan 7.1 with MSW in the test environment. The result is in `Notes`.
    - Every failure kind in plan 4 gives the right `ApiResult`, and the service never throws.
    - MSW is set up for tests at the HTTP boundary.
    - Tests 17 and 18 pass.
  - Verify: `npm run check`
  - Notes:
    - Time-limit proof (plan 7.1), on jsdom with MSW 3.0.7 and Node 24.19: a 50 ms limit ended an unanswered request with a `TimeoutError` in about 66 ms. The first test in `api.test.ts` keeps it.
    - MSW 3 calls the `listen` option `onUnhandledFrame`. `src/test-setup.ts` starts the server in `src/test-server.ts` for every test file. Tests add responses with `server.use()`.
    - Decision: the caller's abort gives `network` (plan 4 has no abort kind). The request sends `Content-Type: application/json`, as the old app did.
    - Decision: any failure while the body is read is `badBody`. MSW 3 with Node's `fetch` crashes when a body stops part-way, so a separate `timeout` there could not be tested.
    - For T15 and T16: the hook must ignore the result after its own abort (plan 4).

- [ ] **T9 — Add saving in the browser**
  - Refs: spec 4.1 item 14, spec 6.1.8, spec 6.5 item 6, spec 6.6 items 9–11, plan 3.4, plan 4, tests 19 and 20
  - Depends on: T7
  - Done when:
    - `src/services/storage.ts` wraps `localStorage`, and never throws.
    - `src/game/saved-game.ts` checks a saved game as plan 3.4 sets out, and discards anything that fails.
    - `src/hooks/useSavedGame.ts` loads a saved game on start, and saves at each save point in plan 3.4, including after Undo.
    - Tests 19 and 20 pass.
  - Verify: `npm run check`
  - Notes:

- [ ] **T10 — Add the design tokens, the layout and the routes**
  - Refs: spec 3 goal 5, spec 6.1.10, spec 6.4.1, spec 6.5 item 1, spec 6.6 item 13, plan 3.3.5, plan 3.4 (theme), plan 3.5 decisions 5, 7 and 8, plan 3.6, plan 4 (error boundary), design, tests 27 and 28
  - Depends on: T1, T2
  - Done when:
    - `src/styles/tokens.css` holds every colour token in plan 3.6, for light and dark, and the type scale. The board tokens are the same in both modes. No component has a hex colour.
    - The header has the wordmark, the three page links with the current page marked, and the light and dark switch, as the design shows. `useTheme` follows the device until the switch is used, then remembers the choice (spec 6.4.1 item 2).
    - `src/routes.tsx` has the routes in plan 3.3.5. Play, How to play and About show placeholder headings. An unknown address shows "page not found" with a link to Play.
    - Each page has an error boundary, from `react-error-boundary` (plan 4).
    - The Playwright accessibility harness from plan 7.1 runs axe with the tags in plan 7.1 on each page, in light and dark mode, at 320 px and 1280 px. It starts test 34, and later tasks add their states to it.
    - Tests 27 and 28 pass.
  - Verify: `npm run check`, then `npm run e2e`
  - Notes:

- [ ] **T11 — Draw the board, the pieces and the marks**
  - Refs: spec 4.1 items 5 and 6, spec 6.1.2, spec 6.4.2 items 3–7, spec 6.6 item 12, plan 3.3.6, plan 3.6 (signature, colour tokens, board marks, motion), design, tests 36 and 38, risk 11
  - Depends on: T6, T10
  - Done when:
    - The board component draws the family board as plan 3.6 and the design show: the wood grain, the walnut frame with the brass inlay, "For Ernest" with the crown, turned pieces, and stacked kings with the brass band.
    - Every board mark in plan 3.6 has its own look, drawn in its final state with no motion yet: the lifted selection with step back, cream target dots, the cream last-move line, tip rings and the two-tone keyboard focus ring.
    - The captured men stand beside the board: one upright stack on desktop, and towers of up to four on a phone (plan 3.6).
    - No text caret or text selection appears on the board (test 36).
    - Test 38 passes.
    - The owner has decided how player 2's dark men step back (plan risk 11): keep the fade with an approved spec change, or use the fallback. The decision is in the pull request.
    - The board matches the design at 320 px and 1280 px, in light and dark mode. The pull request lists each difference and what was done about it.
  - Verify: `npm run check`, then `npm run e2e`; then the design-reviewer agent on the rendered board, and the owner's look at it
  - Notes:

- [ ] **T12 — Add the board's motion**
  - Refs: spec 6.1.5 item 4, plan 3.5 decision 6, plan 3.6 (motion), design
  - Depends on: T11
  - Done when:
    - `src/components/board/timings.ts` holds every timing in plan 3.6, and nothing else in the code sets a duration.
    - Selecting lifts the piece and steps the others back, and putting it down reverses this. Target dots fade in.
    - A move or jump slides, a captured piece fades and shrinks at its own jump, and a man that becomes a king gets the crowning animation, as plan 3.6 sets out.
    - A move can be shown as a list of steps, one jump at a time with the pause between jumps. T15 uses this for the computer.
    - When the device asks for reduced motion, the board behaves as plan 3.6 says. A component test checks this with a mocked media query.
    - The motion matches the design, checked side by side in the browser at normal and slow speed.
  - Verify: `npm run check`, then `npm run e2e`; then the owner's look at the motion next to the design
  - Notes:

- [ ] **T13 — Add keyboard play and screen reader announcements**
  - Refs: spec 6.4.3, spec 6.5 item 1, plan 3.3.6, tests 25 and 26
  - Depends on: T11
  - Done when:
    - The board follows the ARIA grid pattern in plan 3.3.6: one roving `tabindex`, arrow keys, Enter and Space, and Escape.
    - Each square's name follows spec 6.4.3 item 2.
    - One polite live region announces moves, captures, crowning, the start of each turn, a failure and the result.
    - Tests 25 and 26 pass.
  - Verify: `npm run check`, then `npm run e2e`
  - Notes:

- [ ] **T14 — Build the Play page for a two-player game**
  - Refs: spec 4.1 items 13 and 14, spec 6.1.1, spec 6.1.6, spec 6.1.7, spec 6.1.8 item 7, spec 6.6 item 6, spec 6.1.11 items 1–3 and 7, spec 6.3, spec 6.4.2 items 1 and 2, plan 3.1, design, tests 21, 30 and 32
  - Depends on: T7, T9, T12
  - Done when:
    - Game setup has the choices, the defaults and the welcome line in spec 6.1.1, with the words in spec 6.1.11.
    - The game screen has the status, the mode, the captured men and the controls in spec 6.4.2, laid out as the design shows on desktop and phone.
    - A two-player game can be played from setup to the result, with Undo, Give up, New game and End turn, and with no network.
    - The game is saved, and is kept across a refresh and across visits to the other pages.
    - Every text the player reads has been checked for spelling and clarity. Any choice of wording is listed for the owner in the pull request.
    - Tests 21, 30 and 32 pass, and test 34 covers the setup screen and a two-player game.
  - Verify: `npm run check`, then `npm run e2e`; then the design-reviewer agent on the Play page
  - Notes:

- [ ] **T15 — Add the computer's turn**
  - Refs: spec 3 goal 7, spec 4.1 items 2, 4, 7, 8 and 10, spec 6.1.5, spec 6.1.6 item 4, spec 6.1.8 item 3, spec 6.1.9, spec 6.2.2, spec 6.2.3 examples 20 and 23–26, spec 6.6 items 5, 7 and 8, plan 3.3.3, plan 3.3.4, plan 4, plan 3.6 (motion), tests 23, 24, 31, 33 and 39
  - Depends on: T8, T14
  - Done when:
    - `src/hooks/useComputerTurn.ts` asks the API, checks the move with `findPath`, and cancels the request when the phase changes, as plan 3.3.4 sets out.
    - The computer's move is shown one jump at a time, with the timings in plan 3.6, then the last-move mark. A computer man that reaches the far row is crowned.
    - When the computer moves first, its move starts after the board is shown, not during drawing (spec 4.1 item 8, test 39).
    - A failure shows the message and "Try again", as spec 6.1.9 says, is announced in the live region (spec 6.4.3 item 3), and Undo works then (spec 6.1.7 item 4).
    - Tests 23, 24, 31, 33 and 39 pass, and test 34 covers the thinking, moving and failed states.
    - Against the live API through the dev proxy, a computer game at each level plays to the end with no failure.
  - Verify: `npm run check`, then `npm run e2e`; then `npm run dev`, and one game at each level against the live API, with the result in the pull request
  - Notes:

- [ ] **T16 — Add Show tips**
  - Refs: spec 6.1.4, spec 6.6 items 12 and 15, plan 3.6 (board marks), plan 4, test 22
  - Depends on: T8, T14
  - Done when:
    - `src/hooks/useTips.ts` asks the API for the current player's tips, and aborts when the board or the turn changes.
    - The tips show as rings, look different from targets, and clear when the turn ends or the board changes. "Show tips" is not available during a chain (spec 6.1.4 item 6). A failure shows the note in plan 4, and the game continues.
    - Test 22 passes, and test 34 covers the tips state.
  - Verify: `npm run check`, then `npm run e2e`
  - Notes:

## Phase 4 — Pages

Goal: How to play and About have their new content, approved by the owner.

- [ ] **T17 — Write the How to play page**
  - Refs: spec 2.1, spec 4.1 item 12, spec 6.1.11 items 1, 3, 4 and 7, spec 6.4.4, plan 3.6, design
  - Depends on: T11, T12, T13, T16
  - Done when:
    - The page has the four parts in spec 6.1.11 item 3, in that order, with the contents links at the top and "Start a game" at the end.
    - Each rule picture other than the end of the game has a "Show me" control that plays the move with the board motion from T12 (plan 3.6). A taken man has a dashed ring, and the blocked move has a dashed arrow, as the design shows.
    - Each rule has a small board picture, drawn with the board component, with a text alternative (spec 6.4.4).
    - The text is drafted from spec 2.1. The owner has approved the wording in this task's pull request.
    - Test 34 covers the page.
  - Verify: `npm run check`, then `npm run e2e`; then the design-reviewer agent on the page; then the owner's approval of the text in the pull request
  - Notes:

- [ ] **T18 — Write the About page**
  - Refs: spec 4.1 item 15, spec 6.1.11 items 5–7, spec 6.4.4, plan 3.6 (content), test 29
  - Depends on: T10
  - Done when:
    - The page has the five parts in spec 6.1.11 item 5, in that order, with the heading "Ernest Rumbol". The tribute is in three paragraphs.
    - The tribute starts from `About.js` on `main` at commit `da953ce`, with "past away" corrected. Every other edit is listed in the pull request as a before and after table. Only the edits the owner accepts are used.
    - The photo is the owner's, with `alt` text and a caption the owner approves. The family board photo is used if the owner supplies one. Until each arrives, a visible placeholder is shown, and it is listed in the pull request.
    - "How it's built" links to both repositories.
    - Test 29 passes, and test 34 covers the page.
  - Verify: `npm run check`, then `npm run e2e`; then the design-reviewer agent on the page; then the owner's approval of the text in the pull request
  - Notes: The owner is asked for the photo, and for a photo of the family board if there is one, at the start of this task.

## Phase 5 — Release

Goal: the new web app is live, checked for accessibility, and signed off by the owner, and the old release path is gone.

- [ ] **T19 — Finish the accessibility and layout checks**
  - Refs: spec 3 goal 6, spec 6.4.1 item 3, spec 6.4.2 items 4 and 7, spec 6.5 item 1, spec 6.6 item 14, plan 3.6 (colour tokens), plan 7.1, tests 34, 35 and 36, risks 7 and 8
  - Depends on: T13, T14, T15, T16, T17, T18
  - Done when:
    - Test 34 covers every page and every state in spec 6.3, in light and dark mode, at 320 px and 1280 px, with no axe violation.
    - Tests 35 and 36 pass.
    - Every finding is fixed, or listed in the pull request with the reason it is accepted.
  - Verify: `npm run e2e`
  - Notes:

- [ ] **T20 — Sign off the look and the accessibility (manual)**
  - Refs: spec 3 goals 5 and 6, spec 6.4.1 item 1, spec 6.5 item 1, spec 9, plan 3.6, design
  - Depends on: T19
  - Done when:
    - The design-reviewer agent has reviewed every page once, in light and dark mode, on a phone width and a desktop width. Each finding is fixed, or recorded with the owner's decision.
    - The owner, or a person they choose, has played a full game with the keyboard alone, and a full game with a screen reader. Any problem found is fixed or recorded.
    - The owner has signed off the look in this task's pull request.
  - Verify: the design review report and the owner's sign-off, both recorded in the pull request; `npm run check` and `npm run e2e` pass after any fix
  - Notes:

- [ ] **T21 — Release the new web app (manual)**
  - Refs: spec 2.5, spec 3 goals 2 and 7, spec 9, plan 6 (secrets), plan 8.1, plan 8.3 (release), risk 1
  - Depends on: T3, T20
  - Done when:
    - The owner has changed Settings → Pages → Source to "GitHub Actions", set `DEPLOY_ENABLED` to `true`, and run the workflow on `main` by hand (plan 8.3, release steps 2–3).
    - `https://ollierumbol.github.io/draughtsgame` serves the new app. The gap between the source change and the deploy is recorded.
    - The owner has played a full game at each level and a two-player game on the live site, on a phone and on a desktop.
    - The browser's network view shows `Difficulty` and `Board` only in the GetNextMove requests. The API's logs show status 200 for the games played, and no failed request. The logs do not record `Difficulty` (the API's plan section 5).
    - `README.md` is true for the released project, including deployment and rollback.
  - Verify: the live site loads the new app, and the browser's network view shows `Difficulty` and `Board` only in GetNextMove requests; then the API's request log query (its plan section 5) returns rows with status 200 for the games played
  - Notes: Rollback until T22: point Pages back to the `gh-pages` branch.

- [ ] **T22 — Remove the old release path (manual)**
  - Refs: spec 6.5 item 5, spec 9, plan 6 (CI credentials), plan 8.3 (after the release)
  - Depends on: T21
  - Done when:
    - The owner has deleted the `EMAIL`, `TOKEN` and `USERNAME` secrets.
    - The owner has deleted the `gh-pages` branch.
    - The owner has been told that the API's stage 3 (removing `Version`) can now go ahead in the API repository.
  - Verify: `gh secret list` shows no secret; `git ls-remote --heads origin gh-pages` shows nothing; the live site still serves the new app
  - Notes:

- [ ] **T23 — Check the definition of done**
  - Refs: spec 9
  - Depends on: T22
  - Done when:
    - Each item in spec 9 is checked, and the evidence for each is listed in the pull request.
    - `npm outdated` lists no direct dependency other than the holds in plan 3.5 decision 1, and `npm run audit` passes.
  - Verify: `npm ci`, `npm run audit`, `npm run check` and `npm run e2e`; then each spec 9 item ticked in the pull request, with its evidence
  - Notes: After this task, suggest `/retrospective`.

---

## Blocked

None.
