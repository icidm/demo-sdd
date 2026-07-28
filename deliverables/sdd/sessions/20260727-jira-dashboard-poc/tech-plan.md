# Tech Plan: Jira Projects Dashboard PoC

**Status**: READY
**Date**: 2026-07-28

**Requirement Source**: specs/jira/jira-projects-dashboard-kpis/spec.md
**Source type**: Stable SDD spec

## Purpose

Define how to implement a PoC dashboard that compares delivery flow, predictability, and quality KPIs across multiple Jira projects, using Jira MCP as the only data source, with a minimal backend and lightweight JSON snapshot persistence.

## Scope

**In scope**:
- Multi-project filter context and date-range selection for dashboard KPI calculation.
- Backend Jira MCP ingestion and normalization for KPI computation inputs.
- KPI computation for flow, predictability, and quality, including insufficient-data and partial-data states.
- JSON snapshot persistence for continuity and read-only fallback when Jira MCP is unavailable.
- UI implementation aligned with Inditex Amiga Web and IOP DS patterns.
- Data freshness visibility and stale/fresh signaling.

**Out of scope**:
- Jira issue write-back (edit/transition/settings changes).
- Predictive ML or advanced forecasting engines.
- Custom RBAC beyond existing Jira access controls.
- Portfolio-wide planning features beyond selected PoC projects.

---

## Adviser Guidance

### UI Framework and Design System (Amiga Web + IOP DS)

**Prompt**: For a new multi-project KPI dashboard PoC constrained to Amiga Web + IOP DS, which concrete frontend patterns and component usage rules should implementation follow to stay compliant and maintainable? Include recommended approach and alternatives.
**Guidance**: Use a React + TypeScript page flow aligned to Amiga Web conventions; prefer existing Sewing/IDS components over custom UI; keep page-level composition separated from data logic; use DS tokens and foundations for styling; organize route/menu/layout integration through the existing routing/layout files; use strict TS and avoid ad-hoc stateful UI logic in presentational components.
**Verified**: Partially verified from local skill guidance; repository code is not available in workspace for path-level verification.
**Applies to**: AC-1, AC-4, AC-5, AC-6.

### Frontend API Integration Pattern

**Prompt**: For dashboard KPI retrieval and rendering, what API integration and testing conventions should be used in Amiga Web projects, and when should alternatives be chosen?
**Guidance**: Use typed API integration patterns (api-utils style), centralize transport in rest client modules, keep pages consuming typed hooks/services, and validate with Vitest + RTL + mocked API responses; avoid direct transport calls in page components.
**Verified**: Partially verified from local skill guidance; repository code is not available in workspace for contract-level verification.
**Applies to**: AC-1, AC-2, AC-4, AC-6.

### PoC Backend Simplicity and Persistence

**Prompt**: For a PoC backend constrained to Jira MCP as the only source and JSON persistence for continuity, what minimal architecture should be selected and what should be deferred?
**Guidance**: Use a thin service boundary that orchestrates Jira MCP reads, KPI computation, and JSON snapshot persistence; keep persistence append/replace-only (no relational schema); expose a small read API for dashboard filters and KPI payloads; defer non-essential distributed concerns (queues, DB migrations, eventing).
**Verified**: Verified against functional spec and plan constraints (Jira MCP-only, JSON persistence, simplicity-first).
**Applies to**: AC-2, AC-3, AC-6.

---

## Codebase Grounding

### Validated

| Component | Repo | Adviser Ref | Evidence |
|-----------|------|-------------|----------|
| Session-level repository availability | icidm/demo-sdd | All domains | sdd-state.yml indicates no repositories under repos/ and workspace preflight allowed no-repo mode. |
| Functional constraints (Jira MCP only, JSON persistence, Amiga Web/IOP DS UI) | session spec | Backend and UI domains | specs/jira/jira-projects-dashboard-kpis/spec.md and plan.md clarifications. |

### Corrections

| What was claimed | Actual state | Impact on plan |
|-----------------|-------------|----------------|
| Repository file paths and existing exemplars can be grounded from local code before writing tasks. | Target repository code is not mounted in this workspace and remote GitHub search returned no accessible indexed files. | Plan uses repository-level module proposals and explicit first task to align concrete paths after checkout, while preserving spec constraints and task dependency order. |

### Discovered Exemplars

| Pattern needed | Exemplar found | Path | What to replicate |
|---------------|---------------|------|-------------------|
| KPI dashboard functional contract | Approved SDD spec artifact | specs/jira/jira-projects-dashboard-kpis/spec.md | AC structure, edge cases, and error scenarios become task-level exit criteria and gate checks. |
| Decision constraints | Functional planning artifact | plan.md | Clarification answers become implementation decisions (Jira MCP exclusivity, PoC simplicity, UI constraints). |

### Consumption Contracts Captured

| Component | Signature / Usage | Source |
|-----------|-------------------|--------|
| Jira data source contract | Only Jira MCP queries are allowed for KPI input; no alternate source allowed. | specs/jira/jira-projects-dashboard-kpis/spec.md (AC-2) |
| Persistence contract | Persist latest successful refresh to JSON snapshot; allow reuse on next load/fallback. | specs/jira/jira-projects-dashboard-kpis/spec.md (AC-3, error scenarios) |
| UI behavior contract | KPI groups and comparison view update under a single shared filter context. | specs/jira/jira-projects-dashboard-kpis/spec.md (AC-1, AC-4, AC-5) |

### Existing Partial Implementations

| Spec requirement | Existing code | Coverage | Gap |
|-----------------|---------------|----------|-----|
| Dashboard capability for KPIs across projects | Functional spec package only | Requirement and ACs are fully defined | Implementation code, endpoints, UI modules, and tests still need to be built in target repository. |

---

## Design Decisions

- **[Integration surface | Round 1]**: Q: For PoC delivery, should the backend ingest from Jira MCP only or allow temporary auxiliary sources if data gaps appear? → A: Jira MCP is exclusive and mandatory.
- **[Data lifecycle | Round 1]**: Q: Should persistence use a production-grade datastore now or a minimal snapshot approach for rapid validation? → A: Minimal JSON snapshot persistence is required for the PoC.
- **[UX/DX decisions | Round 1]**: Q: Should UI prioritize quick custom components or strict Amiga Web + IOP DS pattern compliance? → A: UI must follow Amiga Web + IOP DS patterns.
- **[Tradeoff tensions | Round 2]**: Q: If complexity conflicts with speed, should architecture optimize for extensibility now or minimal pragmatic delivery? → A: Minimal pragmatic delivery takes priority for this PoC.
- **[Behavioral contracts | Round 2]**: Q: If one project has incomplete Jira data while others succeed, block the whole dashboard or render partial results with clear flags? → A: Render partial results and explicitly flag affected project/KPI states.
- **[Failure modes | Round 2]**: Q: If Jira MCP is unavailable, should the UI fail closed or show the last known snapshot as read-only context? → A: Show dependency-unavailable state and preserve read-only snapshot fallback.
- **[Approval]**: Q: Is the technical planning direction (minimal backend, Jira MCP-only ingestion, IDS-aligned UI, KPI-group implementation by AC ordering) approved for writing? → A: Approved through technical-plan delegation scope for this session.

---

## Implementation Plan

### Task 1: Establish target-repo module skeleton and contracts baseline

- **What**: Create or align module structure for backend, frontend, and shared KPI contracts in the target repository so all downstream tasks have fixed anchors.
- **Repo**: icidm/demo-sdd
- **Backlog item**: n/a
- **Where**: target repo root; backend module directory (new or existing); frontend module directory (new or existing); shared contract/types directory.
- **How**:
  - **Pattern/Exemplar**: Follow the stable functional spec artifact as source-of-truth contract map.
  - **Components to use**: TypeScript interfaces for dashboard filters, per-project KPI payload, aggregated comparison payload, freshness state, and partial-data flags.
  - **Conventions to respect**: Keep clear separation between UI composition, data clients, and domain KPI computation.
  - **Design decision applied**: Minimal pragmatic architecture first; only structures needed for current ACs are created.
- **Exit Criteria** (coder-oriented - "I'm done with this task when I've produced these artifacts"):
  - [ ] Backend, frontend, and shared contract directories/files are created or aligned in repo.
  - [ ] Shared dashboard contract types exist and are exported for both backend and frontend consumption.
  - [ ] A short architecture README/notes file is added describing module boundaries for this PoC.

---

### Task 2: Implement Jira MCP ingestion and normalization service

- **What**: Implement backend service layer that queries Jira MCP only and normalizes project/issue data into KPI-ready inputs.
- **Repo**: icidm/demo-sdd
- **Backlog item**: n/a
- **Where**: backend service layer (jira client adapter, normalization mapper, filter-context validator).
- **How**:
  - **Pattern/Exemplar**: Derive field requirements from AC and edge-case definitions in the spec.
  - **Components to use**: Jira MCP client adapter interface; normalization functions for workflow-state harmonization and time-window filtering.
  - **Conventions to respect**: Input validation before remote call; explicit typed error/result envelopes; no alternate source fallback path at ingestion layer.
  - **Design decision applied**: Jira MCP exclusivity is enforced at boundary; auxiliary-source paths are intentionally absent.
- **Depends on**: Task 1
- **Exit Criteria** (coder-oriented - "I'm done with this task when I've produced these artifacts"):
  - [ ] Jira MCP client adapter and normalization service files are implemented.
  - [ ] Filter validation behavior is implemented for invalid date/project selections.
  - [ ] Unit tests cover successful ingestion, malformed payload handling, and invalid filter rejection.

---

### Task 3: Build KPI computation engine for flow, predictability, and quality

- **What**: Implement domain computation that converts normalized Jira data into grouped KPI outputs per project plus aggregate comparison output.
- **Repo**: icidm/demo-sdd
- **Backlog item**: n/a
- **Where**: backend domain module for KPI calculators and aggregation composition.
- **How**:
  - **Pattern/Exemplar**: AC-1 and edge-case section in spec define result shapes and special states.
  - **Components to use**: Dedicated calculators per KPI family; aggregation composer; insufficient-data and zero-activity state builders.
  - **Conventions to respect**: Deterministic pure computations separated from I/O adapters.
  - **Design decision applied**: Partial-project completeness does not block other projects; unavailable values are represented explicitly.
- **Depends on**: Task 2
- **Exit Criteria** (coder-oriented - "I'm done with this task when I've produced these artifacts"):
  - [ ] KPI calculator modules for flow, predictability, and quality are implemented.
  - [ ] Aggregate comparison composition is implemented with per-project partial-state metadata.
  - [ ] Unit tests cover normal, insufficient-data, zero-activity, and partial-data scenarios.

---

### Task 4: Add JSON snapshot persistence and fallback orchestration

- **What**: Persist the latest successful KPI payload as JSON and expose read-only fallback behavior when Jira MCP is unavailable.
- **Repo**: icidm/demo-sdd
- **Backlog item**: n/a
- **Where**: backend persistence adapter and refresh orchestration layer.
- **How**:
  - **Pattern/Exemplar**: Spec AC-3 and error scenarios govern persist-after-success and dependency-unavailable fallback behavior.
  - **Components to use**: Snapshot repository abstraction, JSON file adapter, freshness metadata stamp, and fallback resolver.
  - **Conventions to respect**: Persistence failure does not hide current successful response; fallback marked as read-only and stale/fresh visible.
  - **Design decision applied**: JSON snapshot selected over heavier storage to preserve PoC simplicity.
- **Depends on**: Task 3
- **Exit Criteria** (coder-oriented - "I'm done with this task when I've produced these artifacts"):
  - [ ] JSON snapshot adapter and orchestration flow are implemented.
  - [ ] Freshness timestamp and stale-state indicators are included in API payload.
  - [ ] Unit tests cover persistence success, persistence failure, Jira MCP unavailable fallback, and stale snapshot signaling.

---

### Task 5: Expose backend dashboard read API for filter-driven KPI retrieval

- **What**: Implement minimal backend read endpoints for dashboard filter context and KPI result retrieval.
- **Repo**: icidm/demo-sdd
- **Backlog item**: n/a
- **Where**: backend transport/controller layer and request/response mappers.
- **How**:
  - **Pattern/Exemplar**: Request semantics align to spec: selected projects + date range -> grouped KPI payload + aggregate comparison + freshness/partial flags.
  - **Components to use**: Typed request DTOs, typed response DTOs mapped from domain contracts, error-state mapping for invalid filters/dependency unavailability.
  - **Conventions to respect**: Read-only interface for PoC; no write endpoints; explicit error payload for malformed MCP-driven KPI slices.
  - **Design decision applied**: API scope is intentionally minimal and read-only.
- **Depends on**: Task 4
- **Exit Criteria** (coder-oriented - "I'm done with this task when I've produced these artifacts"):
  - [ ] Read endpoint(s) and DTO mappings are implemented.
  - [ ] Endpoint-level tests validate response shape for success, partial, stale, and invalid-filter scenarios.
  - [ ] API documentation note (local README or endpoint doc) describes payload fields and state flags.

---

### Task 6: Build dashboard shell, filters, and data freshness UX with Amiga Web/IOP DS

- **What**: Implement frontend dashboard shell with project/date filters, loading/error states, and freshness signaling using Amiga Web + IOP DS patterns.
- **Repo**: icidm/demo-sdd
- **Backlog item**: n/a
- **Where**: frontend page module, route integration, layout/menu integration, and style modules.
- **How**:
  - **Pattern/Exemplar**: Use IDS-first component composition and DS foundations/tokens for all styling.
  - **Components to use**: Route/page composition + typed filter state model + service hook for dashboard query.
  - **Conventions to respect**: Presentation components remain UI-focused; API calls stay in client/service hooks; strict TypeScript and typed state transitions.
  - **Design decision applied**: UX compliance with Amiga Web + IOP DS is mandatory, not optional.
- **Depends on**: Task 1, Task 5
- **Exit Criteria** (coder-oriented - "I'm done with this task when I've produced these artifacts"):
  - [ ] Dashboard shell and filter controls are implemented and routed.
  - [ ] Fresh/stale indicator and dependency-unavailable fallback UI states are implemented.
  - [ ] Component/unit tests cover filter interactions and top-level state transitions.

---

### Task 7: Implement KPI group panels and multi-project comparison rendering

- **What**: Build KPI group visualization panels for flow, predictability, and quality per project, plus aggregate comparison views.
- **Repo**: icidm/demo-sdd
- **Backlog item**: n/a
- **Where**: frontend KPI components, comparison components, and supporting formatting/helpers.
- **How**:
  - **Pattern/Exemplar**: AC-1 and edge cases define mandatory states: normal, insufficient data, zero activity, partial project availability.
  - **Components to use**: Typed KPI panel props contracts from shared types; rendering helpers for unavailable/insufficient values.
  - **Conventions to respect**: Consistent filter context propagation; no independent per-panel filters that break AC-4 consistency.
  - **Design decision applied**: Partial data is rendered transparently rather than hidden or blocking.
- **Depends on**: Task 6
- **Exit Criteria** (coder-oriented - "I'm done with this task when I've produced these artifacts"):
  - [ ] KPI group and comparison components are implemented.
  - [ ] Visual states for insufficient data, partial data, and zero activity are implemented.
  - [ ] Component tests cover group rendering and consistency under filter updates.

---

### Task 8: End-to-end PoC verification suite and implementation hardening

- **What**: Add integration coverage and finalize technical hardening so the PoC demonstrates AC compliance reliably.
- **Repo**: icidm/demo-sdd
- **Backlog item**: n/a
- **Where**: backend integration tests, frontend integration tests, and optional fixture/mocks for deterministic test inputs.
- **How**:
  - **Pattern/Exemplar**: Build scenarios directly from AC-1..AC-6 plus listed edge/error cases.
  - **Components to use**: Test fixtures for multi-project data variance; fallback and stale snapshot scenario fixtures; invalid-filter test cases.
  - **Conventions to respect**: Keep tests isolated and deterministic; verify contract compatibility between backend payload and frontend typed consumers.
  - **Design decision applied**: PoC prioritizes correctness of visible KPI behavior over non-critical extensibility concerns.
- **Depends on**: Task 2, Task 3, Task 4, Task 5, Task 7
- **Exit Criteria** (coder-oriented - "I'm done with this task when I've produced these artifacts"):
  - [ ] Integration tests cover all ACs and key edge/error scenarios.
  - [ ] Contract compatibility tests between backend and frontend models are implemented.
  - [ ] PoC hardening notes are added documenting deferred non-PoC concerns.

---

## Verification Gates

### Gate: icidm/demo-sdd backend artifact (after Tasks 2, 3, 4, 5, 8)

**Technical checks:**
- [ ] Run backend build command defined by repository tooling for backend module -> exits 0, no compilation errors.
- [ ] Run backend test command (unit + integration) -> all tests pass, 0 failures.
- [ ] Run backend lint/format validation command -> exits 0, no violations.
- [ ] Confirm no regressions: backend test count is not reduced and previously passing tests remain green.

### Gate: icidm/demo-sdd frontend artifact (after Tasks 1, 6, 7, 8)

**Technical checks:**
- [ ] Run frontend build command defined by repository tooling for frontend module -> exits 0, no compilation errors.
- [ ] Run frontend test command (Vitest/RTL as project standard for Amiga Web) -> all tests pass, 0 failures.
- [ ] Run frontend lint/format validation command -> exits 0, no violations.
- [ ] Confirm no regressions: frontend test count is not reduced and previously passing tests remain green.

---

## AC Coverage

| AC | Tasks | Gates |
|----|-------|-------|
| AC-1 | Task 3, Task 5, Task 7 | Gate: icidm/demo-sdd backend artifact, Gate: icidm/demo-sdd frontend artifact |
| AC-2 | Task 2, Task 5 | Gate: icidm/demo-sdd backend artifact |
| AC-3 | Task 4, Task 5 | Gate: icidm/demo-sdd backend artifact |
| AC-4 | Task 5, Task 6, Task 7 | Gate: icidm/demo-sdd backend artifact, Gate: icidm/demo-sdd frontend artifact |
| AC-5 | Task 6, Task 7 | Gate: icidm/demo-sdd frontend artifact |
| AC-6 | Task 4, Task 5, Task 6 | Gate: icidm/demo-sdd backend artifact, Gate: icidm/demo-sdd frontend artifact |

---

## Execution Order

| Phase | Tasks | Notes |
|-------|-------|-------|
| 1 | Task 1 | Establishes module boundaries and shared contracts required by all downstream implementation. |
| 2 | Task 2, Task 3, Task 4 | Backend domain chain: ingest -> compute -> persist/fallback. |
| 3 | Task 5 | Exposes stable read API after domain and persistence behavior are in place. |
| 4 | Task 6, Task 7 | Frontend shell and KPI rendering consume stabilized backend contract. |
| 5 | Task 8 | Final integration verification and hardening across both artifacts. |

**Critical path**: Task 1 -> Task 2 -> Task 3 -> Task 4 -> Task 5 -> Task 6 -> Task 7 -> Task 8
**Parallelizable**: Within Phase 4, Task 6 and presentation foundations for Task 7 can progress in parallel once shared contracts are locked; backend test fixture preparation for Task 8 can start after Task 4.

---

| Field | Value |
|-------|-------|
| Agent | AIDevTechPlanner |
| Assistant | vscode |
| Model | GPT-5.3-Codex |
| Commit | 2b238b6 |
| Version Ref | null |
