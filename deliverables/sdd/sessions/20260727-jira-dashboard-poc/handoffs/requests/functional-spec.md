# SDD Specialist Delegation

You are invoked as the AIDevPlanner specialist inside the `functional-spec` phase of an orchestrated Spec-Driven Development session.

## Required outcome

Amend the approved spec to retire/adjust AC-3 (JSON snapshot fallback) and AC-6 (freshness UI) since the snapshot persistence adapter and Freshness UI text were removed at explicit user request after spec-verification had already passed. Update backlog-plan.yml and any dependent trace entries accordingly, then hand off for spec-validation.

## Operating contract

- `interaction_mode: delegated`.
- Load `<agent-dir>/skills/aidev-sdd/references/specialist-contract.md` and `<agent-dir>/skills/aidev-agent-questions/references/specialist.md` before any work.
- Execute your agent and owning skill completely. This request supplies routing context, not a replacement workflow.
- Do not edit `sdd-state.yml` or `trace.md`, and do not run SDD lifecycle validation commands.
- When blocked on user input, follow the delegated question-envelope contract and stop.
- Before a successful handoff, sign every owned Markdown artifact that requires a signature with `signature-append.py`.
- Use shell execution only for commands required by your owning workflow and these generated SDD helpers; do not run lifecycle mutation or validation commands.

## Context

- Session path: `.aicontext/deliverables/sdd/sessions/20260727-jira-dashboard-poc`
- Read-only inputs:
- `specs/jira/jira-projects-dashboard-kpis/spec.md`: current approved spec draft containing AC-3 and AC-6 to amend
- `verification.md`: prior spec-verification evidence showing AC-3/AC-6 previously passed before the code removal
- Session policy:
- (none)

## Successful handoff

When the mission is complete, run the command below exactly once after adding only the repeated flags allowed for this phase. The phase instructions below identify the artifacts already included and the permitted flags; do not redeclare an included artifact. The command writes and validates the manifest. Return exactly the one-line response printed by it. The command defaults to `--status ready`; for a durable non-question blocker, replace that value with `blocked` and add the required `--blocker` flags.

```bash
python3 <agent-dir>/skills/aidev-sdd/scripts/sdd-state.py submit-handoff .aicontext/deliverables/sdd/sessions/20260727-jira-dashboard-poc --expect-phase functional-spec --status ready
```

Fixed artifacts already included; do not redeclare their names or paths:
- `plan`: kind `plan`, scope `session`, path `plan.md`
- `backlog`: kind `backlog`, scope `session`, path `backlog-plan.yml`

Additional flags allowed for this phase:
- `--artifact NAME KIND SCOPE PATH` adds an optional artifact.
- `--spec NAME SCOPE PATH RELATION` adds and classifies a spec artifact.
- `--replace-spec NAME OLD_SCOPE OLD_PATH` makes a declared spec replace an existing registry entry.
- `--contract-map CONTRACT SPEC AC-CSV` maps contract/spec/AC IDs without changing AC prose.
- `--remove-spec SCOPE PATH` drops an existing draft registry entry.
- For blocked status, repeat `--blocker ARTIFACT BLOCK-ID`; the ID must exist in that artifact.
- Add at least one spec with --spec; the primary artifact name must be primary-spec and its relation must be primary.
- When contracts.yml exists, add one or more --contract-map flags so every contract ID maps to AC IDs from a declared spec.
- Add optional prototypes, spec drafts, or spec-relations files with --artifact.

Do not write the handoff YAML manually and do not add a narrative report to the final response.
