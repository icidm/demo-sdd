# Project Rules

This is an AI Context runtime workspace.

- `.aicontext/` — resolved configuration (rules, skills, packages, MCPs, agents, templates, tools, memory)
- `.aicontext/deliverables/` — shared workspace where assistants can write data to exchange between sessions
- `repos/` — code repositories, each with their own rules and context. Check for AGENTS.md or equivalent in each repo before working on it.
<!-- gpto:start -->
# gpto — Code Intelligence

## First decision
If you are about to manually walk files or directories, broad-grep common names, reconstruct relationships,
trace wiring, or assess change impact, load the routing skill first:
- Swift/iOS repo → load `geppetto-graph-swift`
- Other repos → load `geppetto-graph-explore`

If routing skill is not installed or unavailable, use this fallback:

- Directory/package/module/large-file map → `gpto_outline`
- Known symbol, unknown file/type/module → `gpto_find_symbol`
- Common/overloaded symbol name → `gpto_find_symbol` with `label` and/or `file_path`
- Implementers, conformers, hierarchy, ownership, DI, beans, routes, annotations, type usage, render/reference
structure → `gpto_context` after symbol lookup
- Behavior/concept known, symbol unknown → `gpto_query`
- Refactor/delete/rename/signature-change impact → `gpto_impact`
- Direct callers/callees of concrete Python/call-dense callable → `gpto_explore`
- Repo-level orientation before walking broad directories or locating a feature area → `gpto_overview`, 
then drill with `gpto_outline`

## Use built-in search/read first for

- Exact literals, route strings, config keys, env vars, URLs, import paths, SQL fragments, error messages
- Known small files or exact source ranges
- Exhaustive text counts, proof something is unused, or proof deletion is safe

## Verification

After gpto narrows location or structure, read real source before behavior claims or edits. Treat empty/sparse
results as no graph evidence yet, not absence.
<!-- gpto:end -->
