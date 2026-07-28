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
- Minimal backend state persistence using a JSON-based snapshot/cache to keep the PoC simple while preserving continuity between refreshes.
- User interface behavior and visual structure aligned with Inditex Amiga Web and IOP DS patterns.
- Data freshness indicator showing when dashboard data was last refreshed.

## Out Of Scope
- Editing Jira issues, transitions, or project settings from the dashboard.
- Predictive ML models, Monte Carlo simulations, or long-horizon forecasting.
- Custom role/permission management beyond existing Jira access controls.
- Enterprise-wide portfolio planning features outside the selected PoC project set.

## Acceptance Criteria
- AC-1: Given a user selects at least two Jira projects and a valid date range, when the dashboard loads data, then it displays KPI groups for delivery flow, predictability, and quality for each selected project and an aggregated comparison view.
- AC-2: Given dashboard data is retrieved, when KPIs are rendered, then all KPI values are sourced from Jira MCP responses and no alternate data source is used.
- AC-3: Given a successful data refresh, when backend state is persisted, then a JSON snapshot is stored and can be reused to render the latest known dashboard state on the next load.
- AC-4: Given a user changes project or date filters, when the dashboard recalculates metrics, then all visible KPI panels update consistently under the same filter context.
- AC-5: Given the UI is displayed, when users navigate KPI groups and comparisons, then layout, components, and interaction patterns follow Inditex Amiga Web and IOP DS conventions.
- AC-6: Given data was last refreshed at a known timestamp, when the dashboard is visible, then the user can see the freshness timestamp and distinguish fresh versus stale data.

## Edge Cases
- Projects with insufficient historical data for a predictability metric must show a clear "insufficient data" state instead of misleading values.
- Projects with different workflow naming conventions must still contribute to comparable KPI groupings.
- If one selected project returns incomplete data while others succeed, the dashboard must render available projects and flag the partial state for the affected project.
- If a selected project has no changes in the chosen period, the dashboard must show valid zero-activity states rather than blank panels.

## Error Scenarios
- If Jira MCP is temporarily unavailable, the dashboard shows an explicit dependency-unavailable state and preserves the latest stored JSON snapshot as read-only fallback context.
- If Jira MCP returns malformed or unexpected fields for a KPI, the affected KPI is marked unavailable and the rest of the dashboard remains visible.
- If JSON snapshot persistence fails after successful retrieval, the dashboard still shows current results and indicates that persistence did not complete.
- If filter input is invalid (for example end date before start date), the dashboard prevents execution and guides the user to correct the filter.

## Risks And Assumptions
- Assumption: Jira MCP can consistently provide the minimum fields required to compute the selected KPI set across all PoC projects.
- Risk: KPI comparability may be reduced by project-specific workflow practices; mitigation is to document normalization rules and visibly flag low-confidence comparisons.
