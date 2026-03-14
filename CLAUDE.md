# OllamaCheck Project Documentation

## Overview
OllamaCheck is a web utility that tracks and ranks Ollama models suited for 40GB GPU environments and AI coding agents (Claude Code, OpenCode, Codex CLI, etc.).

## Features
- Daily-updated ranked list of Ollama models that fit within 40GB VRAM
- Models are ranked by a composite score: weekly download trend + benchmark score + VRAM fit margin
- Strong candidates for code agent use (code generation, tool use, instruction following)
- Shows the correct pull command for each model
- Supports multiple data sources with priority order:
  1. Primary: ollamadb.dev/api/v1
  2. Fallback: registry.ollama.ai (OCI manifests)
  3. Last Resort: HTML scrape of ollama.com/search

## Tech Stack
### Backend
- Node.js 22+ with TypeScript (strict mode)
- Fastify framework
- node-cron for daily scrape jobs
- SQLite via Drizzle ORM (file-based, dev) + PostgreSQL-compatible schema for prod
- Zod for all input/output schemas
- node-fetch for HTTP client

### Frontend
- React 19 + Vite
- Tailwind CSS v4 + shadcn/ui components
- TanStack Query v5 for state management
- Recharts for trend visualization

### Infrastructure / DevOps
- Docker + Docker Compose (dev + prod profiles)
- GitHub Actions CI: lint → test → build → deploy
- `.env.example` committed, `.env` always gitignored
- `db/` and `*.sqlite` always gitignored

## Project Structure
```
ollamacheck/
├── apps/
│   ├── api/                    # Fastify backend
│   │   ├── src/
│   │   │   ├── modules/
│   │   │   │   ├── models/     # Model entity: routes, service, repo, schema
│   │   │   │   ├── categories/ # Category entity (code, vision, nlp, etc.)
│   │   │   │   ├── scraper/    # Multi-source scraper with provider architecture
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
├── unraid-template.xml         # Unraid Community Application template
├── .env.example                # ✅ committed — contains keys with empty values
├── .gitignore                  # ✅ blocks .env, *.sqlite, test.db
└── README.md
```

## Environment Variables
See `.env.example` for all required environment variables.

## Security Requirements
1. No secrets, tokens, API keys, or PII ever committed — enforced with CI checks
2. `.env.example` must list all required env vars with empty values and comments; actual `.env` is gitignored
3. No SQLite or test database files ever committed; add `*.sqlite`, `*.db`, `test.db` to `.gitignore`
4. Fastify must use `@fastify/helmet` for security headers and `@fastify/cors` with explicit origin allowlist
5. All external data (scraped HTML/JSON) must be sanitized and validated through Zod before persistence
6. Rate limiting on all public API routes via `@fastify/rate-limit`

## Data Scraping Logic
### Source Priority Order:
1. **Primary**: `https://ollamadb.dev/api/v1` - Provides pulls, tags, capability, labels, last_updated
2. **Fallback**: `https://registry.ollama.ai` - OCI manifests with layer sizes for precise VRAM calculation
3. **Last Resort**: `https://ollama.com/search` - HTML scraping when other sources fail

### VRAM Estimation Formula:
vram_gb = (params_billions * bits_per_weight) / 8 / 1e9 * 1.15  // 15% overhead

### Scraper Module:
- Fetches model list + weekly download counts from primary source
- For each model, resolves the best-fit variant (highest quality that fits 40GB)
- Implements provider architecture for multiple data sources
- Emits normalized `ModelCandidate` objects with all required fields

## API Routes
GET  /api/models?category=code&sort=fitScore&limit=20&page=1
GET  /api/models/:slug
GET  /api/categories
GET  /api/scrape/status          // last run info
POST /api/scrape/trigger         // manual trigger (internal/admin use only, rate-limited)
GET  /health

## Testing Requirements
Every feature ships with tests. Minimum coverage:
### Backend
- Unit: scraper normalizer, VRAM estimator, fitScore calculator, Zod schema validation
- Integration: all API routes (happy path + error cases) via Supertest
- Scheduler: mock cron, assert job runs and updates DB

### Frontend
- Unit: ModelCard renders correct VRAM bar color, pull command copies correctly
- Integration: model list fetches and renders with TanStack Query
- E2E (Playwright): load page → filter by category → see ranked list → copy pull command

## Docker
```yaml
# docker-compose.yml
services:
  api:
    build: ./apps/api
    env_file: .env         # never committed
    ports: ["3001:3001"]
    volumes:
      - ./data:/app/data   # SQLite persistence, gitignored
  web:
    build: ./apps/web
    ports: ["5173:80"]
    depends_on: [api]
```

## CI/CD Pipeline
- GitHub Actions workflow with lint → test → build → deploy steps
- All secrets properly handled (no committed files)
- Automated testing and validation

## Deployment
### Local Development:
```bash
docker compose up
```

### Production Deployment:
1. Build the images: `docker-compose build`
2. Deploy: `docker-compose up -d`
3. Configure environment variables in `.env`

## Unraid Installation
This project includes a complete Unraid Community Application template (`unraid-template.xml`) that can be used to deploy OllamaCheck on Unraid systems.

## Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License
This project is licensed under the MIT License.