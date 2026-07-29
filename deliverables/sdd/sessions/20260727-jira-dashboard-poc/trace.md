# SDD Trace

> Complex-track trace. Complex is spec-driven delivery: functional-spec,
> spec-validation, technical planning, implementation, verification, and
> retro/compound closure run, while discovery and test-design are recorded as
> skipped (test evidence design is folded into spec-verification).

## Session

| Field | Value |
|---|---|
| Session | 20260727-jira-dashboard-poc |
| Track | complex |
| Source spec | workspace:.aicontext/deliverables/sdd/specs/jira/jira-projects-dashboard-kpis/spec.md |
| Current phase | retro |

## Input Contract Trace

| Contract ID | Path | Affected ACs | Evidence |
|---|---|---|---|
| N/A | N/A | N/A | No input contracts. |

## Acceptance Criteria Trace

| AC ID | Acceptance Criterion | Source Spec | Notes |
|---|---|---|---|
| AC-1 | Given a user selects at least two Jira projects and a valid date range, when the dashboard loads data, then it displays KPI groups for delivery flow, predictability, and quality for each selected project and an aggregated comparison view. | workspace:.aicontext/deliverables/sdd/specs/jira/jira-projects-dashboard-kpis/spec.md | Derived from source spec. |
| AC-2 | Given dashboard data is retrieved, when KPIs are rendered, then all KPI values are sourced from Jira MCP responses and no alternate data source is used. | workspace:.aicontext/deliverables/sdd/specs/jira/jira-projects-dashboard-kpis/spec.md | Derived from source spec. |
| AC-4 | Given a user changes project or date filters, when the dashboard recalculates metrics, then all visible KPI panels update consistently under the same filter context. | workspace:.aicontext/deliverables/sdd/specs/jira/jira-projects-dashboard-kpis/spec.md | Derived from source spec. |
| AC-5 | Given the UI is displayed, when users navigate KPI groups and comparisons, then layout, components, and interaction patterns follow Inditex Amiga Web and IOP DS conventions. | workspace:.aicontext/deliverables/sdd/specs/jira/jira-projects-dashboard-kpis/spec.md | Derived from source spec. |

## Backlog Trace

| Backlog ID | Source Spec | GitHub Issue | Project | Sync Status | Notes |
|---|---|---|---|---|---|
| US-001 | specs/jira/jira-projects-dashboard-kpis/spec.md | N/A | N/A | not-published | publish_decision=pending |

## Technical Plan Trace

| Work Item | Linked ACs | Repository | Planned Change | Status |
|---|---|---|---|---|
| Task 1 | N/A | icidm/demo-sdd | Create or align module structure for backend, frontend, and shared KPI contracts in the target repository so all downstream tasks have fixed anchors. | planned |
| Task 2 | AC-2 | icidm/demo-sdd | Implement backend service layer that queries Jira MCP only and normalizes project/issue data into KPI-ready inputs. | planned |
| Task 3 | AC-1 | icidm/demo-sdd | Implement domain computation that converts normalized Jira data into grouped KPI outputs per project plus aggregate comparison output. | planned |
| Task 4 | AC-3, AC-6 | icidm/demo-sdd | Persist the latest successful KPI payload as JSON and expose read-only fallback behavior when Jira MCP is unavailable. | planned |
| Task 5 | AC-1, AC-2, AC-3, AC-4, AC-6 | icidm/demo-sdd | Implement minimal backend read endpoints for dashboard filter context and KPI result retrieval. | planned |
| Task 6 | AC-4, AC-5, AC-6 | icidm/demo-sdd | Implement frontend dashboard shell with project/date filters, loading/error states, and freshness signaling using Amiga Web + IOP DS patterns. | planned |
| Task 7 | AC-1, AC-4, AC-5 | icidm/demo-sdd | Build KPI group visualization panels for flow, predictability, and quality per project, plus aggregate comparison views. | planned |
| Task 8 | N/A | icidm/demo-sdd | Add integration coverage and finalize technical hardening so the PoC demonstrates AC compliance reliably. | planned |

## Implementation Trace

| Evidence ID | Linked ACs | Files / Commands | Result | Notes |
|---|---|---|---|---|
| EVID-CODE-1 | AC-1, AC-4, AC-5, AC-6 | `ARCHITECTURE.md`; `shared/src/contracts.ts`; `backend/`; `frontend/` | Created backend/frontend/shared module baseline and shared contracts. | Tasks: T1; Repo: icidm/demo-sdd |
| EVID-CODE-2 | AC-1, AC-2, AC-3, AC-4, AC-6 | `backend/src/jira/*`; `backend/src/domain/kpi-engine.ts`; `backend/src/service/dashboard-service.ts`; `backend/src/api/dashboard-controller.ts`; `backend/ENDPOINTS.md` | Implemented Jira ingestion contract, normalization, KPI engine, snapshot fallback, and typed read API. | Tasks: T2, T3, T4, T5; Repo: icidm/demo-sdd |
| EVID-CODE-3 | AC-1, AC-4, AC-5, AC-6 | `frontend/src/pages/dashboard-page.tsx`; `frontend/src/context/filter-context.tsx`; `frontend/src/components/*`; `frontend/src/routes.tsx`; `frontend/src/styles/dashboard.css` | Implemented dashboard shell, shared filter context, freshness/fallback UI, and KPI comparison rendering. | Tasks: T6, T7; Repo: icidm/demo-sdd |
| EVID-CODE-4 | AC-1, AC-2, AC-3, AC-4, AC-5, AC-6 | `npm run lint`; `npm run test`; `npm run build`; `backend/test/*`; `frontend/test/*`; `shared/test/contracts.test.ts`; `HARDENING-NOTES.md` | Added integration/contract coverage and passed full backend/frontend/shared technical gates. | Tasks: T8; Repo: icidm/demo-sdd |
| EVID-CODE-5 | AC-2 | `backend/src/jira/mcp-jira-client.ts`; `backend/src/server.ts`; `backend/src/domain/kpi-engine.ts`; `backend/src/jira/normalize.ts`; `shared/src/contracts.ts` | Replaced mocked Jira client with a real MCP client, remapped real flat Jira fields, and redesigned the KPI set. Verified live against project `IOPPROSU`. | Commit `1cf7c4f` on `feature/jira-dashboard-poc`; Repo: icidm/demo-sdd |
| EVID-CODE-6 | AC-4, AC-5 | `frontend/src/App.tsx`; `frontend/src/components/*`; `frontend/src/pages/dashboard-page.tsx`; `frontend/src/styles/dashboard.css` | Scaffolded Vite/React app, updated KPI rendering for redesigned metrics, restyled date filter. Confirmed live dynamic reload on filter change. | Commit `1797aec` on `feature/jira-dashboard-poc`; Repo: icidm/demo-sdd |
| EVID-CODE-7 | AC-3, AC-6 | `backend/src/persistence/snapshot-repository.ts` (deleted); `frontend/src/pages/dashboard-page.tsx` | Removed JSON snapshot fallback and Freshness UI text at explicit user request. **Deviates from AC-3 and AC-6 as previously verified.** | Commits `1cf7c4f`, `1797aec` on `feature/jira-dashboard-poc`; Repo: icidm/demo-sdd |

## Verification Trace

| AC ID | Verification Evidence | Status | Notes |
|---|---|---|---|
| AC-1 | EVID-CODE-2, EVID-CODE-3, EVID-TEST-1 | pass | Backend implements multi-project KPI computation with aggregation (Task 3, 5); frontend implements KPI group panels and comparison rendering (Task 7, EVID-CODE-3). Integration tests verify end-to-end KPI loading and display under multi-project context (backend/test/dashboard-service.test.ts). All tests pass. |
| AC-2 | EVID-CODE-2, EVID-TEST-1 | pass | Backend Jira ingestion service (backend/src/jira/*) enforces Jira MCP as exclusive source with no alternate-source fallback paths at ingestion layer (Task 2). Filter validation rejects invalid inputs before MCP queries. Unit tests verify ingestion behavior and malformed payload handling (backend/test/kpi-engine.test.ts). All tests pass. |
| AC-3 | EVID-CODE-2, EVID-CODE-7, EVID-TEST-1 | accepted-risk | Backend originally implemented JSON snapshot persistence adapter (Task 4, backend/src/persistence/snapshot-repository.ts) with refresh orchestration and fallback resolver, tested in backend/test/dashboard-service.test.ts. **Deviation (2026-07-28)**: adapter removed at explicit user request (EVID-CODE-7); no fallback path remains. Accepted as final rather than remediated via formal spec amendment (GitHub issue #1). Status downgraded from `pass` to `accepted-risk`. |
| AC-4 | EVID-CODE-3, EVID-TEST-1 | pass | Frontend implements shared filter context (frontend/src/context/filter-context.tsx) to propagate filter state atomically to all KPI panels. No independent per-panel filters. Component tests verify filter updates propagate consistently to all panels (frontend/test/filter-context.test.tsx, frontend/test/dashboard-page.test.tsx). All tests pass. |
| AC-5 | EVID-CODE-3, EVID-RUN-1 | pass | Frontend implemented using Amiga Web + IOP DS patterns (Task 6, EVID-CODE-3): dashboard shell uses typed page composition, components follow DS conventions with strict TypeScript, styling uses DS tokens/foundations. Code compiles without type errors (EVID-RUN-1, npm build). Architecture notes in ARCHITECTURE.md document Amiga Web compliance. |
| AC-6 | EVID-CODE-2, EVID-CODE-3, EVID-CODE-7, EVID-TEST-1 | accepted-risk | Backend originally embedded freshness metadata and stale-state indicators in KPI payload (Task 4); frontend originally rendered freshness timestamp and fallback UI states (Task 6), tested in backend/test/dashboard-service.test.ts and component tests. **Deviation (2026-07-28)**: freshness UI text removed at explicit user request (EVID-CODE-7); freshness data is still computed/returned by the backend but no longer rendered. Accepted as final rather than remediated via formal spec amendment (GitHub issue #1). Status downgraded from `pass` to `accepted-risk`. |

## PR / Review Trace

| PR | Linked ACs | Review Status | Blocking Findings | Notes |
|---|---|---|---|---|
| https://github.com/icidm/demo-sdd/pull/2 | AC-1, AC-2, AC-3, AC-4, AC-5, AC-6 | pass | 0 | Derived from verification.md. |
