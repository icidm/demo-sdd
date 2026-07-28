# Jira Dashboard PoC Architecture

## Modules

- `shared`: Cross-module TypeScript contracts for filters, KPI payloads, and freshness states.
- `backend`: Jira MCP ingestion adapter contract, normalization, KPI engine, snapshot persistence, and read API controller.
- `frontend`: Dashboard shell, filter context, KPI rendering panels, and API client.

## Boundaries

- `frontend` imports only typed contracts and typed API client outputs.
- `backend` owns all KPI computation and snapshot fallback behavior.
- `shared` has no runtime side effects and only exports domain types.
