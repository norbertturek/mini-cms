---
name: ship
description: Ship Mini CMS work through a protected-main GitHub workflow: branch from main, commit with Conventional Commits, push, open a PR, provide the PR URL, wait for explicit approval, merge after approval, then return to main and pull latest.
---

# Mini CMS Ship

## Workflow

1. Inspect `git status --short --branch`, `git remote -v`, and `git branch --show-current`.
2. Preserve unrelated user changes.
3. Sync main:
   - `git switch main`
   - `git pull --rebase origin main`
4. Create a short branch from main.
5. Implement or verify requested changes.
6. Run:

```bash
pnpm format:check
pnpm lint
pnpm test
pnpm build
```

7. Stage only intended files.
8. Commit using Conventional Commits.
9. Push the branch.
10. Open a PR to `main`.
11. Return the PR URL to the user.
12. Wait for explicit approval in the conversation, for example `approve`.
13. After approval, merge the PR.
14. Switch back to `main`.
15. Pull latest from `origin/main`.
16. Confirm a clean worktree.

## Guardrails

- Never push directly to `main`.
- Never merge without explicit user approval in the current conversation.
- Never include `.env`, generated caches, build output, database dumps or `node_modules`.
- Prefer GitHub CLI for repository, PR and merge operations.
- If GitHub authentication fails, stop and report the exact command that needs re-authentication.

## PR Body

```markdown
## Summary

- ...

## Verification

- [x] pnpm format:check
- [x] pnpm lint
- [x] pnpm test
- [x] pnpm build
```
