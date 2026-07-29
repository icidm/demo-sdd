# SDD Retro

## Topic

| Field | Value |
|---|---|
| Topic | Jira Projects Dashboard KPIs PoC |
| Closure evidence | verification.md, code.md, trace.md, specs/jira/jira-projects-dashboard-kpis/spec.md |
| Closure status | complete-with-follow-ups |

## Outcome Summary

The PoC dashboard was delivered and satisfies four of its six original acceptance criteria as `pass` (AC-1, AC-2, AC-4, AC-5: multi-project KPI comparison, Jira-MCP-exclusive sourcing, consistent filter-driven recalculation, and Amiga Web/IOP DS-compliant UI). Two capabilities — JSON snapshot persistence (AC-3) and a data-freshness UI indicator (AC-6) — were implemented and originally verified, then deliberately removed afterward so the dashboard always reflects live Jira state and surfaces a clear error during an outage instead of potentially stale cached data. That reduction was accepted as final rather than reopened as a new commitment, and is recorded here as `accepted-risk` against the original criteria. The session's spec draft already reflects this accepted, reduced scope directly (AC-3/AC-6 retired, not carried as deviations), so the canonical spec created by this closure is a direct, unmodified consolidation of that draft. The session closes as `complete-with-follow-ups`: the product outcome is accepted, and the follow-ups below are documentation/branch-hygiene items for the delivery team, not gating defects.

## Observations

| ID | Area | Observation | Evidence |
|---|---|---|---|
| OBS-1 | Backend / Jira ingestion | This Jira MCP instance returns flat issue fields (`status.category`, `issue_type.name`, `resolution_date`, `assignee`) rather than nested `fields.*` shapes; KPI ingestion must map against the flat shape to get non-zero, meaningful values. | `backend/src/jira/mcp-jira-client.ts`, `backend/src/jira/normalize.ts`, verified live against project `IOPPROSU` |
| OBS-2 | Domain / KPI design | The delivery-flow/predictability/quality KPI grouping is realized only with fields Jira populates on virtually every issue (status category, issue type, assignee, created/resolution dates): `totalIssues`, `completedIssues`, `cycleTimeDays` (flow); `completionRate`, `avgOpenAgeDays` (backlog health / predictability); `defectRate`, `unassignedRate` (quality). Optional agile fields such as sprint commitment or reopen history are intentionally not used because this Jira instance does not expose them reliably. | `backend/src/domain/kpi-engine.ts`, `shared/src/contracts.ts` |
| OBS-3 | Domain / normalization | Defect classification matches issue-type-name substrings against a locale-aware list including the Spanish "Incidencia", because this Jira instance's defect issue type is not named "Bug"/"Defect" in English. | `backend/src/jira/normalize.ts` (`DEFECT_TYPE_NAMES`) |
| OBS-4 | Backend / data continuity | The dashboard has no data-continuity path: when Jira MCP is unavailable for a project, the dashboard surfaces a real dependency-unavailable error for that project rather than any cached data. The `DashboardResponse.fallbackPayload` field remains in the type contract for the invalid-filter/dependency-unavailable branches but is always `null` in practice; `DataFreshness.state`/`source` are narrowed to the single literal values `"fresh"`/`"jira-mcp"` at the type level. | `backend/src/service/dashboard-service.ts`, `shared/src/contracts.ts` |

### Dead Ends & Rejected Approaches

| ID | Approach Tried | Why It Failed | Correct Approach |
|---|---|---|---|
| DEADEND-1 | Map Jira KPI ingestion against nested `fields.*` field names, following generic Jira REST field conventions. | This Jira MCP instance's real responses use flat field names; ingestion built on the nested assumption produced zero or meaningless KPI values against live data. | Verify the live MCP payload shape against a real project before finalizing field mapping, and design the KPI set only around fields reliably present in this Jira instance's flat schema. |
| DEADEND-2 | Build and fully verify a JSON snapshot persistence adapter with stale/fresh fallback, plus a user-facing freshness timestamp. | Not a technical failure: once working, stakeholders judged the fallback and freshness UI unnecessary complexity for this PoC — they wanted the dashboard to always reflect live Jira state and show a clear error on outage rather than potentially stale cached data — so both were removed after they had already passed verification. | For this product, do not reintroduce snapshot/fallback persistence or a freshness indicator without an explicit stakeholder request; treat "always live, fail loud on outage" as the accepted behavior. |

## Compounding Ledger

| ID | Source | Durable Knowledge | Target Surface | Section | Status |
|---|---|---|---|---|---|
| KNOW-1 | OBS-1 / DEADEND-1 | This Jira MCP instance returns flat issue fields (`status.category`, `issue_type.name`, `resolution_date`, `assignee`), not nested `fields.*`; map ingestion against the flat shape or KPI values come out zero/meaningless. | repos/demo-sdd/ARCHITECTURE.md | Contracts & Integrations | kept-local |
| KNOW-2 | OBS-3 | Defect detection matches issue-type-name substrings including the Spanish "Incidencia", since this Jira instance's defect type isn't named "Bug"/"Defect" in English. | repos/demo-sdd/ARCHITECTURE.md | Constraints & Gotchas | kept-local |
| KNOW-3 | OBS-4 / DEADEND-2 | The dashboard has no persisted continuity: on a Jira MCP outage it must show a live dependency-unavailable error, not a cached snapshot; snapshot/freshness fallback was built, verified, then intentionally removed and must not be reintroduced without an explicit stakeholder request. | repos/demo-sdd/ARCHITECTURE.md | Constraints & Gotchas | kept-local |

All three items are `kept-local` rather than `applied`: `repos/demo-sdd` has no `ARCHITECTURE.md` on its currently checked-out branch (`dev`). Product documentation only exists on `origin/sdd-jira-dashboard`, which is neither the checked-out branch nor either delivery branch the coding journal names (`private/sdd-jira-dashboard-poc`, `feature/jira-dashboard-poc` — neither exists locally or on the configured remote). The correct long-lived branch could not be verified without switching branches, so no enrichment was written to the working tree; the knowledge above stays recorded here and is picked up by the follow-up below.

## Spec Consolidation

| Spec | Path | Change Type | Spec Version | Prev Version | Changelog Entry | Change Note | Status |
|---|---|---|---|---|---|---|---|
| Jira Projects Dashboard KPIs | specs/jira/jira-projects-dashboard-kpis/spec.md | created | 1.0.0 | N/A | changes/changes.json | changes/20260727-jira-dashboard-poc.md | consolidated |

## Follow-Ups

| ID | Type | Owner | Status | Description |
|---|---|---|---|---|
| FOLLOWUP-1 | product | Team | open | Reconcile `demo-sdd` repository documentation state: `ARCHITECTURE.md`/`AGENTS.md` product notes currently exist only on `origin/sdd-jira-dashboard`, not on the checked-out `dev` branch nor either delivery branch on record. Confirm the intended long-lived branch, then add the Jira MCP flat-field mapping, defect-locale matching, and no-fallback-persistence knowledge (KNOW-1..3) to it. |
| FOLLOWUP-2 | product | Team | open | `backend/ENDPOINTS.md` still documents `fallbackPayload` and `freshness.source: snapshot` behavior that no longer exists in the delivered code (snapshot fallback and freshness rendering were removed). Update the endpoint documentation to match the current `DashboardResponse`/`DataFreshness` contracts. |
| FOLLOWUP-3 | product | Team | open | The pull request delivery decision for `icidm/demo-sdd#2` is still `pending_user_input` per `verification.md` (choice between `in_review_wait`, `in_review_handoff`, `ignore_draft`). Finalize that decision to close out delivery. |

## Closure Decision

| Field | Value |
|---|---|
| Gate | retro |
| Decision | complete-with-follow-ups |
| Final topic status | complete-with-follow-ups |

---

| Field | Value |
|-------|-------|
| Agent | AIDevRetro |
| Assistant | vscode |
| Model | Claude Sonnet 5 |
| Commit | 2b238b6 |
| Version Ref | null |
