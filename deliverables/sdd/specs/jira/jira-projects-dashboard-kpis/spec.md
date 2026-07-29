---
schema_version: 1
---

# Jira Projects Dashboard KPIs

## Purpose
Define a PoC dashboard that gives delivery stakeholders a shared, comparable view of flow, predictability, and quality across multiple Jira projects. This provides faster, evidence-based delivery decisions without requiring stakeholders to navigate each project separately.

## Scope
- Dashboard capability to select multiple Jira projects and a time window for analysis.
- KPI panels and visual summaries grouped by delivery flow, predictability, and quality.
- Data sourcing exclusively through Jira MCP queries.
- User interface behavior and visual structure aligned with Inditex Amiga Web and IOP DS patterns.

## Out Of Scope
- Editing Jira issues, transitions, or project settings from the dashboard.
- Predictive ML models, Monte Carlo simulations, or long-horizon forecasting.
- Custom role/permission management beyond existing Jira access controls.
- Enterprise-wide portfolio planning features outside the selected PoC project set.
- Backend state persistence (JSON snapshot/cache or any other store) for continuity between refreshes. Every load queries Jira MCP directly.
- A user-facing data freshness or staleness indicator in the dashboard UI.

## Acceptance Criteria
- AC-1: Given a user selects at least two Jira projects and a valid date range, when the dashboard loads data, then it displays KPI groups for delivery flow, predictability, and quality for each selected project and an aggregated comparison view.
- AC-2: Given dashboard data is retrieved, when KPIs are rendered, then all KPI values are sourced from Jira MCP responses and no alternate data source is used.
- AC-4: Given a user changes project or date filters, when the dashboard recalculates metrics, then all visible KPI panels update consistently under the same filter context.
- AC-5: Given the UI is displayed, when users navigate KPI groups and comparisons, then layout, components, and interaction patterns follow Inditex Amiga Web and IOP DS conventions.

## Edge Cases
- Projects with insufficient historical data for a predictability metric must show a clear "insufficient data" state instead of misleading values.
- Projects with different workflow naming conventions must still contribute to comparable KPI groupings.
- If one selected project returns incomplete data while others succeed, the dashboard must render available projects and flag the partial state for the affected project.
- If a selected project has no changes in the chosen period, the dashboard must show valid zero-activity states rather than blank panels.

## Error Scenarios
- If Jira MCP is temporarily unavailable, the dashboard shows an explicit dependency-unavailable state until Jira MCP becomes reachable again; no stored fallback data is available.
- If Jira MCP returns malformed or unexpected fields for a KPI, the affected KPI is marked unavailable and the rest of the dashboard remains visible.
- If filter input is invalid (for example end date before start date), the dashboard prevents execution and guides the user to correct the filter.

## Risks And Assumptions
- Assumption: Jira MCP can consistently provide the minimum fields required to compute the selected KPI set across all PoC projects.
- Risk: KPI comparability may be reduced by project-specific workflow practices; mitigation is to document normalization rules and visibly flag low-confidence comparisons.
- Risk: Without persisted snapshot fallback, the dashboard has no data to show during a Jira MCP outage; mitigation is the explicit dependency-unavailable state defined in Error Scenarios.
- Assumption: Users do not require a visible freshness/staleness indicator for this PoC; data is always fetched live from Jira MCP on each load.
