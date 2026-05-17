# application-02

Express + TypeScript + Zod API following Clean Architecture / DDD-lite patterns.

## Stack

- Node.js (ESM)
- Express 5
- Zod (validation + env schema)
- Pino (structured logging)
- helmet + cors + express-rate-limit (security)
- TypeScript (strict)
- tsup (build), tsx (dev), vitest (tests), eslint

## Architecture

```text
src/
├── domain/          # Entities, value objects, repositories (interfaces), exceptions, contracts
├── application/     # Use cases + DTOs (orchestration)
├── infrastructure/  # Concrete repositories, HTTP wrapper, logger, validators, config
├── presentation/    # Controllers, HTTP contracts, validation interfaces, exceptions
└── main/            # Composition root, factories, entrypoint
```

Dependency rule: outer layers depend on inner. Domain depends on nothing.

## Setup

```bash
npm install
cp .env.example .env
```

## Scripts

| Script               | Purpose               |
| -------------------- | --------------------- |
| `npm run start:dev`  | Dev server with watch |
| `npm run build`      | Bundle to `dist/`     |
| `npm start`          | Run built bundle      |
| `npm run typecheck`  | TypeScript check      |
| `npm run lint`       | ESLint                |
| `npm run lint:fix`   | ESLint with autofix   |
| `npm test`           | Run vitest            |
| `npm run test:watch` | Vitest watch mode     |

## Endpoints

- `GET /health` — health check
- `POST /player` — create player
- `GET /player?page=1&limit=10` — list players (paginated)
- `GET /player/:id` — get player by id (404 if missing)
- `PUT /player/:id` — replace player fields (404 if missing)
- `DELETE /player/:id` — delete player (204 on success, 404 if missing)

### Headers

- `x-user-id` — optional. Sets `createdBy` on entities. Defaults to `system`.

### Sample

```bash
curl -X POST http://localhost:5000/player \
  -H 'Content-Type: application/json' \
  -H 'x-user-id: user-123' \
  -d '{"name":"Alice","nickname":"Aly","level":1,"evolution":"rookie"}'
```

## Error responses

| Status | Cause                      |
| ------ | -------------------------- |
| 400    | Validation failure (Zod)   |
| 404    | Resource not found         |
| 409    | Application conflict       |
| 422    | Domain invariant violation |
| 429    | Rate limit exceeded        |
| 503    | Infrastructure failure     |
| 500    | Unhandled error            |

## Environment

See `.env.example`. All variables validated at boot via Zod — invalid env crashes early.

## Notes

- In-memory repository — data lost on restart. Replace with persistent implementation by registering in `src/main/factory/composition-root.ts`.
- Allowed `evolution` values: `rookie`, `amateur`, `pro`, `legend`. Defined in `src/domain/value-object/evolution.ts`.
