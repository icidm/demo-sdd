# Dashboard API (PoC)

## Read endpoint contract

- `POST /api/dashboard`
- Request body: `DashboardFilters`
- Response:
  - `status: ok` with `payload`
  - `status: invalid-filter` with validation message
  - `status: dependency-unavailable` with `fallbackPayload` when snapshot exists

## State flags

- `payload.freshness.state`: `fresh | stale`
- `payload.freshness.source`: `jira-mcp | snapshot`
- `payload.dependencyUnavailable`: marks Jira dependency outage while preserving fallback context.
