# Spec Change Note

## Change Summary

| Field | Value |
|---|---|
| Spec | specs/jira/jira-projects-dashboard-kpis/spec.md |
| Session | 20260727-jira-dashboard-poc |
| Change type | created |
| Spec version | 1.0.0 (was N/A) |
| Timestamp | 2026-07-29T05:05:00Z |

## What Changed

Established the canonical Jira Projects Dashboard KPIs spec: a PoC dashboard that lets delivery stakeholders compare delivery flow, predictability, and quality across multiple Jira projects in one place. Acceptance criteria AC-1, AC-2, AC-4, and AC-5 cover multi-project KPI display with an aggregated comparison view, exclusive Jira MCP sourcing, consistent filter-driven recalculation, and Amiga Web/IOP DS UI conventions. Scope explicitly excludes backend state persistence (JSON snapshot or any other store) and a user-facing data freshness/staleness indicator.

## Why

The PoC delivery proved out the four criteria in practice: multi-project KPI panels and comparison rendering, Jira MCP-exclusive ingestion, a shared filter context that keeps all panels consistent, and IOP DS-compliant layout and components. A JSON snapshot fallback and a freshness timestamp indicator were also built and verified, but stakeholders decided afterward that the dashboard should always reflect live Jira state and surface a clear error during an outage rather than show potentially stale cached data. That decision was accepted as the product's final boundary, so this spec captures the dashboard's actual, accepted contract rather than carrying the retired capabilities as open commitments.

## How

The canonical spec is created for the first time, carrying forward the acceptance criteria, scope, edge cases, error scenarios, and risks exactly as they stand after the accepted scope reduction. Acceptance criterion identifiers are kept stable at AC-1, AC-2, AC-4, and AC-5 rather than renumbered, and the retired snapshot-persistence and freshness-indicator capabilities are recorded as explicit Out Of Scope items and a risk/assumption instead of acceptance criteria.
