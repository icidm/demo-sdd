# Plan: Jira Dashboard PoC Functional Spec

## Metadata
- **Session id**: 20260727-jira-dashboard-poc
- **Status**: ✅ Complete
- **Created**: 2026-07-28
- **Input source**: Direct requirement
- **Research file**: N/A
- **Target repository**: icidm/demo-sdd

## Overview

Define the functional specification and backlog projection for a PoC dashboard that helps delivery stakeholders monitor project execution across multiple Jira projects from one place. The plan focuses on the most decision-relevant KPI groups for delivery flow, predictability, and quality, while keeping the solution intentionally lightweight for rapid validation.

The PoC outcome is a clear product contract for what stakeholders can observe and compare, constrained by mandatory Jira MCP data sourcing, minimal backend persistence through JSON snapshots, and UI patterns aligned with Inditex Amiga Web and IOP DS.

## Research Context

N/A

## Product Context

The planned product capability is a cross-project delivery observability view for delivery managers and project leads who need fast status understanding without manually traversing each Jira project. It concentrates on three decision areas:
- Delivery flow: how work moves and where throughput or flow stability issues appear.
- Predictability: whether delivery cadence and commitments are becoming more or less reliable.
- Quality: whether defect pressure or rework signals are affecting delivery confidence.

The PoC combines selected Jira projects into a single filtered dashboard perspective, making project-to-project differences visible under the same analysis window. The intended value is faster prioritization discussions and clearer escalation signals when one project diverges from expected behavior.

### Sources consulted

- Delegation request at .aicontext/deliverables/sdd/sessions/20260727-jira-dashboard-poc/handoffs/requests/functional-spec.md - binding requirement, constraints, and target outcome for this phase.
- Session state at .aicontext/deliverables/sdd/sessions/20260727-jira-dashboard-poc/sdd-state.yml - confirms current phase and policy target repository.
- Existing session artifacts scan under .aicontext/deliverables/sdd/sessions/20260727-jira-dashboard-poc - no prior plan/spec/backlog artifacts found for this topic.

## Clarifications

### Session 2026-07-28

- **[Scope Boundaries]**: Q: What is the required data source for dashboard metrics in this PoC? → A: Jira MCP is mandatory and exclusive.
- **[Integration Surface]**: Q: How should backend persistence be handled for PoC continuity? → A: Keep backend minimal and persist state as JSON or equivalent lightweight storage.
- **[Behavioral Contracts]**: Q: What UX standard must govern the dashboard experience? → A: UI must follow Inditex Amiga Web and IOP DS patterns.
- **[Done Criteria]**: Q: Which KPI families are required to validate product value? → A: KPIs must emphasize delivery flow, predictability, and quality across multiple projects.
- **[Tradeoff Tensions]**: Q: If complexity conflicts with delivery speed in the PoC, which priority applies? → A: Simplicity and minimal implementation footprint take priority while preserving KPI usefulness.

## Work Breakdown

- **Unit**: Multi-project dashboard context selection - candidate issue: user-story
- **Unit**: KPI visualization for delivery flow, predictability, and quality - candidate issue: user-story
- **Unit**: Partial-data transparency across selected projects - candidate issue: user-story
- **Retired unit**: Lightweight persisted snapshot continuity for dashboard state - removed 2026-07-28; snapshot persistence adapter dropped at explicit user request after spec-verification.
- **Retired unit**: Data freshness UI indicator - removed 2026-07-28; freshness UI text dropped at explicit user request after spec-verification (backend freshness metadata may still exist but is no longer a required user-facing capability).
- **Open question (functional/purpose)**: Which specific KPI list is the mandatory baseline for PoC sign-off - resolved as grouped KPI families with comparability across selected projects.

## Spec Registry

| # | Title | File |
|---|-------|------|
| 1 | Jira Projects Dashboard KPIs | specs/jira/jira-projects-dashboard-kpis/spec.md |

## Backlog Projection

| Backlog ID | Type | Title | Source Spec | Change | GitHub Action | GitHub Issue | Sync Status |
|------------|------|-------|-------------|--------|---------------|--------------|-------------|
| US-001 | user-story | PoC Jira projects dashboard with multi-project delivery KPIs | specs/jira/jira-projects-dashboard-kpis/spec.md | new | create | not published | not-published |

Backlog projection source of truth: `backlog-plan.yml`.

## Planning Notes

- [Phase 1] No prior session-level planning artifacts existed for this topic, so this plan establishes the first functional baseline.
- [Phase 1] Existing stable-spec overlap was treated as clear due to absence of discovered prior spec artifacts in the current workspace context.
- [Phase 2] The requirement package already contained explicit constraints for source, persistence, UX alignment, and KPI focus, allowing direct clarification capture without adding speculative scope.
- [Phase 3] A single-spec decomposition is sufficient for this PoC because all required outcomes are tightly coupled around one dashboard capability contract.
- [Phase 3 amendment 2026-07-28] Retired AC-3 (JSON snapshot fallback) and AC-6 (freshness UI) from specs/jira/jira-projects-dashboard-kpis/spec.md. Both capabilities were removed from the implementation at explicit user request after spec-verification had already passed (EVID-CODE-7). Scope, Out Of Scope, Error Scenarios, and Risks And Assumptions were updated to match; remaining AC IDs (AC-1, AC-2, AC-4, AC-5) were kept stable rather than renumbered.

## Risks & Considerations

| Risk | Impact | Mitigation |
|------|--------|------------|
| KPI comparability may vary across projects with heterogeneous workflows | High | Define normalization rules in implementation planning and make low-confidence comparisons visible in UI messaging |
| Jira MCP response gaps may prevent computation of one or more KPI values | High | Define fallback states per KPI and keep partial rendering behavior explicit in acceptance criteria |
| PoC simplicity constraint may under-represent long-term scalability needs | Medium | Keep scope explicitly PoC-bound and capture scalability follow-ups as future planning items |
| Stakeholders may interpret PoC KPI trends as production-grade forecasting | Medium | Mark trend interpretation boundaries clearly and keep advanced forecasting explicitly out of scope |

## Session Info

- **File path**: /Users/iagocid/Library/CloudStorage/OneDrive-Indra/Proyectos/Inditex/IA/demo-ssd/runtimes/root/.aicontext/deliverables/sdd/sessions/20260727-jira-dashboard-poc/plan.md
- **Session id**: 20260727-jira-dashboard-poc
- **Research file**: N/A
- **Target repository**: icidm/demo-sdd

---

| Field | Value |
|-------|-------|
| Agent | AIDevPlanner |
| Assistant | vscode |
| Model | GPT-5.3-Codex |
| Commit | 409e9b6 |
| Version Ref | null |
