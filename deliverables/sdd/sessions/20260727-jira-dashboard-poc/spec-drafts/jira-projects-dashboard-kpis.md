# Draft: Jira Projects Dashboard KPIs

## Scope
- Define a PoC dashboard for delivery stakeholders to monitor delivery flow, predictability, and quality across multiple Jira projects.
- Use Jira MCP as the single data source for project and issue-level information.
- Define a minimal backend state persistence approach using a lightweight JSON store for cache and snapshot continuity.
- Define UX expectations aligned with Inditex Amiga Web and IOP DS patterns.

## Out of scope
- Advanced forecasting models beyond trend-based indicators.
- Workflow automation, issue updates, or write-back actions into Jira.
- Organization-wide portfolio planning beyond selected projects in the PoC scope.

## Functional outcomes
- Stakeholders can compare delivery health across selected Jira projects in one dashboard view.
- Stakeholders can review core KPIs grouped into delivery flow, predictability, and quality.
- Stakeholders can apply common filters (project set, time window) and see consistent KPI recalculation.
- Stakeholders can understand data freshness and partial-data conditions.

## Affected artifacts
- icidm/demo-sdd (session-level spec and backlog artifacts for this PoC plan).

## Edge cases
- Projects with sparse historical data should still render with explicit "insufficient data" labels.
- Different workflow naming conventions across projects should be normalized for KPI comparability.
- Mixed completeness across projects should not block rendering of available metrics.

## Open questions
- What minimum historical window should the PoC require for predictability metrics.
- Which quality KPI has highest decision value when only one can be highlighted.
