# Draughts

A draughts game for the web, made in memory of Ernest Rumbol and played with our family's house rules. Two people can play on one device, or one person can play against the computer. The computer's moves come from a separate API, [DraughtsGameFunction](https://github.com/OllieRumbol/DraughtsGameFunction).

The live site is at <https://ollierumbol.github.io/draughtsgame>.

The site is being rebuilt. Until the release, the live site still runs the old game, and a merge to `main` does not deploy (`docs/plan.md`, section 8.3).

## Documents

| Document | What it holds |
| --- | --- |
| [`docs/spec.md`](docs/spec.md) | What the site must do |
| [`docs/plan.md`](docs/plan.md) | How it is built |
| [`docs/tasks.md`](docs/tasks.md) | The order of work, and its progress |
| [`docs/design/site.html`](docs/design/site.html) | The approved design. Open it in a browser. |

## Requirements

Node.js 26, the version in `.nvmrc`. Node.js 24 also works.

## Install

```bash
npm ci
```

## Run

```bash
npm run dev
```

Then open <http://localhost:5173/draughtsgame/>. The dev server forwards requests for `/api` to the live API, so games against the computer also work locally (`docs/plan.md`, section 3.5, decision 9).

## Test and check

| Command | What it does |
| --- | --- |
| `npm run test` | Runs the unit and component tests once |
| `npm run check` | Type check, lint, format check, tests and build. Run it before a pull request. |
| `npm run audit` | Fails on any known vulnerability that is not approved in [`docs/audit-exceptions.md`](docs/audit-exceptions.md) |
| `npm run format` | Formats the code with Prettier |

## Build

```bash
npm run build
```

The site is written to `dist/`. Run `npm run preview` to serve the build on your computer.

## Deployment

GitHub Actions builds the site and deploys it to GitHub Pages. `docs/plan.md`, section 8, describes the workflow, the switch from the old site, and how to roll back.

## Licence

The code is under the MIT licence, in [`LICENSE`](LICENSE). The licence does not cover the About page's tribute or the photos. They remain the owner's.
