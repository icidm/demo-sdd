# PoC Hardening Notes

## Deferred Non-PoC Concerns

- Replace JSON filesystem snapshots with durable storage and retention policy.
- Add service-level authn/authz integration for backend endpoints.
- Add observability backend export (metrics/traces) beyond console-level diagnostics.
- Add rate-limiting and circuit-breaker strategy for Jira MCP calls.
