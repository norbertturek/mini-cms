---
name: code-review
description: Review Mini CMS changes for bugs, regressions, security issues, missing tests, CI risks, and violations of the project's Nuxt 4, Strapi 5, and coding standards. Use before shipping any branch or when the user asks for review.
---

# Mini CMS Code Review

## Workflow

1. Inspect `git status --short --branch`.
2. Identify the base:
   - branch review: `origin/main...HEAD`
   - local review: staged and unstaged diffs
3. Read:
   - `docs/CODING_STANDARDS.md`
   - `docs/RULES.md`
   - `docs/REFERENCES.md`
   - `.github/workflows/ci.yml`
4. Inspect changed files with `git diff --stat`, `git diff`, and focused reads.
5. Prioritize findings over summary.

## Review Focus

- Auth and ownership bugs.
- Public APIs exposing drafts or private author data.
- Nuxt secrets leaking into public runtime config.
- Strapi config not driven by env.
- Deprecated Strapi Entity Service usage.
- Missing loading, error or empty states.
- Missing or weak tests for changed behavior.
- CI, Docker, pnpm workspace or build regressions.
- Generated files, secrets or build output accidentally committed.

## Required Verification

Prefer running:

```bash
pnpm format:check
pnpm lint
pnpm test
pnpm build
```

If a command is not run, state why.

## Output

Use this structure:

```markdown
**Findings**
- High: [file:line] Problem, impact, and suggested fix.
- Medium: [file:line] Problem, impact, and suggested fix.

**Open Questions**
- ...

**Verification**
- Ran: ...
- Not run: ...
```

If there are no findings, say that clearly and mention residual risk.
