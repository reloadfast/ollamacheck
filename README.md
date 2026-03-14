# OllamaCheck

OllamaCheck is a web utility that tracks and ranks Ollama models suited for 40GB GPU environments and AI coding agents (Claude Code, OpenCode, Codex CLI, etc.).

## Project Structure

```
ollamacheck/
├── apps/
│   ├── api/                    # Fastify backend
│   │   ├── src/
│   │   │   ├── modules/
│   │   │   │   ├── models/     # Model entity: routes, service, repo, schema
│   │   │   │   ├── categories/ # Category entity (code, vision, nlp, etc.)
│   │   │   │   ├── scraper/    # Ollama.com scraper + normalizer
│   │   │   │   └── scheduler/  # node-cron daily job
│   │   │   ├── db/             # Drizzle schema + migrations
│   │   │   ├── plugins/        # Fastify plugins (cors, helmet, etc.)
│   │   │   └── index.ts
│   │   ├── tests/
│   │   └── vitest.config.ts
│   └── web/                    # React frontend
│       ├── src/
│       │   ├── features/
│       │   │   ├── models/     # Model list, filters, model card
│       │   │   └── categories/ # Category tabs/switcher
│       │   ├── components/ui/  # shadcn components
│       │   └── main.tsx
│       ├── tests/
│       └── vite.config.ts
├── packages/
│   └── shared/                 # Shared Zod schemas + TypeScript types
├── docker-compose.yml
├── .env.example                # ✅ committed — contains keys with empty values
├── .gitignore                  # ✅ blocks .env, *.sqlite, test.db
└── README.md
```

## Getting Started

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Start the development servers:
   ```bash
   pnpm dev
   ```

3. The API will be available at `http://localhost:3001`
4. The frontend will be available at `http://localhost:5173`

## Features

- Daily-updated ranked list of Ollama models that fit within 40GB VRAM
- Models are ranked by a composite score: weekly download trend + benchmark score + VRAM fit margin
- Strong candidates for code agent use (code generation, tool use, instruction following)
- Shows the correct pull command for each model

## Tech Stack

### Backend
- Node.js 22+ with TypeScript (strict mode)
- Fastify framework
- node-cron for daily scrape jobs
- SQLite via Drizzle ORM (file-based, dev) + PostgreSQL-compatible schema for prod
- Zod for all input/output schemas
- Undici or native fetch for HTTP client
- Vitest + Supertest for API integration tests

### Frontend
- React 19 + Vite
- Tailwind CSS v4 + shadcn/ui components
- TanStack Query v5 for state management
- Vitest + React Testing Library + Playwright for E2E
- Recharts for trend visualization

## Development

### API
```bash
cd apps/api
pnpm dev    # Start development server
pnpm test   # Run tests
```

### Web
```bash
cd apps/web
pnpm dev    # Start development server
pnpm test   # Run tests
```

## Docker

```bash
docker compose up
```

## Environment Variables

See `.env.example` for all required environment variables.