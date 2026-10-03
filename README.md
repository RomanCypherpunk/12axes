<div align="center">

# 12 Axes

A political quiz that places you on twelve independent axes and compares your answers with +230 ideologies, +170 countries and regimes, and +390 political figures.

**[12axes.vercel.app](https://12axes.vercel.app)** · Portuguese and English · no sign-up

![Java](https://img.shields.io/badge/Java-21-orange) ![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.3-6DB33F) ![React](https://img.shields.io/badge/React-18-61DAFB) ![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6) ![CI](https://github.com/RomanCypherpunk/12axes/actions/workflows/ci.yml/badge.svg)

</div>

## Overview

Most political tests reduce you to a single point on a left-right line, or to a two-axis grid. 12 Axes measures twelve dimensions separately, so someone who wants a free market and a strong state, or open borders and a religious society, sees that combination instead of an average that hides it.

The project is also a full-stack portfolio piece: a Spring Boot REST API with its own matching algorithm, a React and TypeScript frontend, a versioned JSON data layer, automated tests, CI, and cloud deploys.

## About the project

### What it is

An anonymous quiz. You rate statements on a five-point agreement scale and get a percentage on each axis, your closest ideologies, the country or historical regime nearest to you, and the political figures who think most like you.

### Who it is for

People curious about politics who want more than a left-right label, students comparing doctrines and regimes, and anyone who wants to see where they disagree with their own side.

### What sets it apart

- Twelve axes scored independently, so the result keeps tensions and unusual combinations.
- Three catalogs (ideologies, countries, personalities), each matched on its own. Countries include +68 historical regimes, from the Paris Commune to Atatürk's Turkey.
- Every profile in the catalogs answered the same 240 questions a user can answer, instead of being placed by hand.
- An optional religion filter, so a user can hide profiles tied to a faith that is not theirs.
- A shareable result card, a PDF report, and a link that rebuilds the result from the URL.

### The 12 axes

The model is inspired by the original [12 Axes test](https://politicaltests.github.io/12axes/). Each axis runs between two poles:

| Axis | Pole A | Pole B |
|------|--------|--------|
| Structure | Federal | Unitary |
| Representation | Democracy | Autocracy |
| Power | Security | Liberty |
| Immigration | Assimilation | Multiculturalism |
| Diplomacy | Militarist | Pacifist |
| Intervention | Non-interventionist | Nationalist |
| Economy | Public | Private |
| Control | Planning | Free market |
| Trade | Protectionism | Globalism |
| Religion | Irreligious | Religious |
| Morality | Progressive | Traditionalist |
| Technology | Technology | Biology |

### Political spectra

The axes describe the user. Ideologies are grouped into eight broader families, in the spirit of the [Political Compass](https://www.politicalcompass.org/), which place a result on the familiar map: Left, Radical Left, Center, Right, Far-Right, Libertarian, Anarchist, and Third Position. The family is a label for reading the result. It does not count in the score.

### How your result is calculated

1. Each answer moves an axis toward one of its poles. Strong agreement counts fully, "neutral" leaves the axis at the center, and disagreement pushes the other way.
2. The average of your answers on each axis becomes a percentage between the two poles, labeled balanced, leaning, strong, or very strong depending on how far it is from the center.
3. Your twelve percentages form a profile, which is compared with every ideology, country, and personality in the catalogs. The closest ones are shown with a compatibility score.

### Questions and scoring

| Format | Questions | Per axis |
|--------|----------:|---------:|
| Short | 36 | 3 |
| Complete | 60 | 5 |
| Extreme | 240 | 20 |

The pool has 240 statements, 20 per axis, half phrased toward each pole so agreeing with everything does not skew the result. The short and complete formats draw a balanced subset. Five multiple-choice "archetype" questions at the end add broader signals across several axes. A last, optional question about your religion sets the filter and does not affect the score.

| Answer | Value |
|--------|------:|
| Strongly agree | 1.00 |
| Agree | 0.75 |
| Neutral | 0.50 |
| Disagree | 0.25 |
| Strongly disagree | 0.00 |

### Methodological note

12 Axes is a tool for exploring ideas. It is not a scientific instrument. A high compatibility means your answers are close to a profile, not that you belong to a movement, should vote for someone, or share anyone's values in full. Profiles are simplified models, and the questions inevitably carry the framing of whoever wrote them.

## Features

- Three quiz lengths with auto-advance and a back button.
- Results by axis, with intensity and the rarest and most common positions in your profile.
- Top ideologies, the closest current and historical countries, and matching personalities by category, plus the least compatible ideology.
- An "axis tension" readout for pairs of positions that rarely appear together.
- Book recommendations tied to your profile.
- Religion filter for Christianity, Judaism, Islam, and Buddhism.
- Share card (PNG), PDF report, and shareable result link.
- Static, indexable pages for every ideology, country, and personality.

## Demo

<div align="center">
<img src=".github/assets/result-card.png" alt="12 Axes result card" width="360">
</div>

The share card sums up a result: the main ideology and its family, the most compatible personality, the dominant pole on each of the twelve axes, and the closest personalities and countries.

## Architecture

### Stack

| Layer | Technology |
|-------|------------|
| Backend | Java 21, Spring Boot 3.3, Maven |
| Frontend | React 18, TypeScript, Vite 5 |
| Data | Versioned JSON, loaded into memory at startup |
| Tests | JUnit 5, MockMvc, AssertJ, Vitest |
| CI | GitHub Actions (backend tests, i18n check, frontend tests and build) |
| Deploy | Backend on Render (Docker), frontend on Vercel |

There is no database. The catalogs change only through reviewed commits, so the backend reads the JSON once at startup, validates it, and scores every request in memory.

### Project data

All data lives in `backend/src/main/resources/data/`, with English translations in `i18n/en/`.

| File | Contents |
|------|----------|
| `axes.json` | The 12 axes, their poles and labels |
| `questions-pool.json` | 240 questions, with axis, polarity, and weight |
| `archetype-questions.json` | The five multiple-choice questions |
| `ideologies.json` / `ideology-profiles.json` | Ideologies and their 12-axis vectors |
| `countries.json` / `countries-profiles.json` | Countries, regions, and historical regimes |
| `personalities.json` / `personality-profiles.json` | Political figures and intellectuals |
| `books.json` | Book recommendations |

On startup the backend refuses to run if any catalog entry lacks a vector or a vector does not have exactly the 12 known axes.

### Repository structure

```txt
12Axes/
├── backend/                 Spring Boot API
│   └── src/main/java/com/twelveaxes/
│       ├── config/          CORS, cache headers, origin enforcement
│       ├── controller/      REST endpoints
│       ├── model/           records and DTOs
│       └── service/         data loading, scoring, matchers, religion filter
├── frontend/                React + Vite app
│   ├── src/components/      home, quiz, results, report
│   ├── src/i18n/            PT/EN strings
│   └── scripts/             static page generator, image optimizer
├── profile-audit/           pipeline that builds the catalog vectors
├── scripts/                 repository checks (i18n)
└── .claude/skills/          Claude Code skills for adding profiles
```

### How matching works

A result is a vector of twelve values from 0 to 100. The `ProfileMatchScorer` compares it with each profile using four weighted parts:

| Component | Weight | What it measures |
|-----------|-------:|------------------|
| Per axis | 0.42 | Distance on each axis, with an extra penalty when you and the profile are on opposite sides of the center |
| Direction | 0.33 | Cosine similarity of both vectors around the center, damped near it, where direction is mostly noise |
| Magnitude | 0.18 | Whether your overall intensity matches the profile's, so a moderate user does not match an extreme profile just because the direction agrees |
| Outlier | 0.07 | A penalty for a single axis that is far off |

Each catalog is ranked separately. A match also reports a percentile inside its own catalog, because ideologies tend to be more extreme than real countries and the raw scores are not comparable across catalogs. `ScorerBenchmarkTest` guards the calibration: it checks that noisy answers generated from a profile still find that profile.

### API

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/health` | Health check |
| `GET` | `/api/quiz?variant=short\|extended\|extreme` | Quiz metadata and the question pool |
| `POST` | `/api/results` | Scores answers and returns axes and matches |
| `GET` | `/api/results/by-axes?v=...` | Rebuilds a result from 12 values, for shared links |
| `GET` | `/api/ideologies[/{id}]` | Ideology catalog |
| `GET` | `/api/countries[/{id}]` | Country catalog |
| `GET` | `/api/personalities[/{id}]` | Personality catalog |

Endpoints accept `lang=pt|en`, and the result endpoints accept `religion` for the filter. `/api/**` answers only requests whose `Origin` or `Referer` is in `FRONTEND_ORIGINS`, and returns `403` otherwise. `/api/health` stays open for the Render health check.

<details>
<summary>Example request</summary>

```json
POST /api/results?lang=en
{
  "variant": "short",
  "answers": [
    { "questionId": "estrutura_01", "answer": "STRONGLY_AGREE" },
    { "questionId": "poder_03", "answer": "DISAGREE" }
  ]
}
```

`answer` is one of `STRONGLY_AGREE`, `AGREE`, `NEUTRAL`, `DISAGREE`, `STRONGLY_DISAGREE`.

</details>

### Running locally

You need Java 21, Maven 3.9+, Node.js 20+, and npm.

```bash
# Backend: http://localhost:8080
cd backend
mvn spring-boot:run

# Frontend: http://localhost:5173 (proxies /api to the backend)
cd frontend
npm install
npm run dev
```

To point the local frontend at the production API instead, create `frontend/.env.local` with `VITE_API_URL=https://one2axes-backend.onrender.com`.

| Variable | Side | Default | Purpose |
|----------|------|---------|---------|
| `PORT` | Backend | `8080` | HTTP port |
| `FRONTEND_ORIGINS` | Backend | localhost + Vercel | Allowed origins for CORS and the API |
| `API_ORIGIN_ENFORCEMENT` | Backend | `true` | Set to `false` to turn off the origin check |
| `VITE_API_URL` | Frontend | empty | API base URL in production |

### Tests

```bash
cd backend && mvn test          # 129 tests
cd frontend && npm test         # Vitest
cd frontend && npm run build    # type check, build, static pages
```

The backend suite covers the question pool, the three formats, every catalog vector, links between catalogs, the religion filter, the REST endpoints, and matching regressions. The frontend suite covers question selection and translation. `RandomQuizSimulationTest` simulates users of a given leaning, for example `mvn -Dtest=RandomQuizSimulationTest "-Dquiz.mode=traditional" test`.

### Deploy

| Part | Platform | Configuration |
|------|----------|---------------|
| Backend | Render | `render.yaml` and `backend/Dockerfile` |
| Frontend | Vercel | `frontend/vercel.json`, output `dist` |

Every push and pull request runs the CI workflow in `.github/workflows/ci.yml`.

## Contributing

Bug reports, corrections to profiles, and translation fixes are welcome as issues or pull requests. Keep each pull request to one change, run the backend and frontend tests, and describe how you tested it. [CONTRIBUTING.md](CONTRIBUTING.md) has the full checklist.

### Adding ideologies, countries, or personalities

Catalog entries are not written by hand. Each new profile answers all 240 questions, one by one, in character, and its vector is computed from those answers with the same formula a user gets. The process is in [`profile-audit/NEW_PROFILE.md`](profile-audit/NEW_PROFILE.md), and the repository ships [Claude Code](https://claude.com/claude-code) skills that run it end to end:

| Skill | Purpose |
|-------|---------|
| `/new_ideology <name>` | Create an ideology |
| `/new_country <name>` | Create a country or historical regime |
| `/new_personality <name>` | Create a personality |
| `/audit_ideology`, `/audit_country`, `/audit_personality` | Re-audit an existing profile |

A new profile has to meet these requirements before it is merged:

- Metadata in Portuguese and English, with the English version free of Brazil-specific references.
- A full 240-answer audit, archived in `profile-audit/answers/`.
- `python profile-audit/validate.py <catalog> <id>` passes. It blocks vectors that are near duplicates of an existing profile, too many neutral answers, and a religious vector with no religion tag.
- Portraits and historical flags come from Wikimedia Commons, with their source recorded, and are compressed with `npm run optimize:images`.
- `mvn test` passes.

### License

12 Axes is source-available but not open source. The code, questions, profiles, and vectors are © 2026 Enzo Xavier Santos, all rights reserved. You may read the code and send contributions, but copying, redistributing, translating, or using any part commercially needs written permission. See [LICENSE](LICENSE) for the full terms.

## Author

**Enzo Xavier Santos** built 12 Axes as a portfolio project and a practical study of full-stack architecture with Java, React, and TypeScript.
