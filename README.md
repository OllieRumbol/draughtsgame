# Draughts

A draughts game for the web, made in memory of my grandad, Ernest Rumbol, and played with the house rules we played by.

Two people can play on one device, or one person can play against the computer at three levels: Easy, Normal and Hard. The computer's moves come from a separate API, [DraughtsGameFunction](https://github.com/OllieRumbol/DraughtsGameFunction).

Play it at <https://ollierumbol.github.io/draughtsgame>.

> **The site is being rebuilt.** Until the release, the live site runs the old game, and a merge to `main` does not deploy. `docs/tasks.md` shows the progress.

## Documents

| Document | What it holds |
| --- | --- |
| [`docs/spec.md`](docs/spec.md) | What the site must do, including the house rules |
| [`docs/plan.md`](docs/plan.md) | How it is built, and why |
| [`docs/tasks.md`](docs/tasks.md) | The order of work, and its progress |
| [`docs/design/site.html`](docs/design/site.html) | The approved design. Open it in a browser. |

## Get started

You need Node.js 26, the version in `.nvmrc` and in CI. Node.js 24 also works.

1. Install the packages:

   ```bash
   npm ci
   ```

2. Start the dev server:

   ```bash
   npm run dev
   ```

3. Open <http://localhost:5173/draughtsgame/>.

The dev server forwards requests for `/api` to the live API, so games against the computer also work on your computer (`docs/plan.md`, section 3.5, decision 9).

## Commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Starts the dev server |
| `npm run test` | Runs the unit and component tests once |
| `npm run check` | Runs the type check, lint, format check, tests and build. Run it before you open a pull request. |
| `npm run audit` | Fails on any known vulnerability that is not approved in [`docs/audit-exceptions.md`](docs/audit-exceptions.md) |
| `npm run format` | Formats the code with Prettier |
| `npm run build` | Builds the site into `dist/` |
| `npm run preview` | Serves the build from `dist/` on your computer |

## Deployment

GitHub Actions builds the site and deploys it to GitHub Pages. `docs/plan.md`, section 8, describes the workflow, the switch from the old site, and how to roll back.

## Licence

The code is under the MIT licence, in [`LICENSE`](LICENSE).

The licence does not cover the tribute on the About page or the photos. They are not free to reuse, and remain the copyright of the repository's owner.
