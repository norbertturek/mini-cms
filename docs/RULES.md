# Project Rules

## Implementation Rules

- Use Nuxt 4 for frontend work and Strapi 5 for backend work.
- Verify framework-sensitive decisions against official docs when uncertain.
- Prefer official generators and installed packages over handwritten framework scaffolds.
- Work task by task and update `docs/TASKS.md` from `[ ]` to `[*]` after completion.
- Update `docs/prompts.md` after meaningful planning, implementation, CI, review or release steps.
- Keep `main` protected; work through branches and pull requests.
- **NEVER use `any` in TypeScript. This is a strict quality gate.**
- **NEVER merge a Pull Request without explicit user approval in the chat, even for small chores or documentation updates.**
- Current GitHub limitation: branch protection/rulesets for this private repo returned HTTP 403 and require GitHub Pro or making the repository public. Until that is enabled, enforce protected-main behavior operationally through the ship skill and PR workflow.

## Architecture Rules

- `apps/backend` owns Strapi content types, services, routes, policies and auth enforcement.
- `apps/frontend` owns Nuxt pages, components, composables, stores and SSR rendering.
- Public article queries return published articles sorted by `publishedAt desc`.
- Admin article queries return only the current author's articles.
- Draft preview is allowed only for the owning authenticated author.

## UI Rules

- Build the usable app first, not a landing page.
- Use reusable base components for repeated controls.
- Keep admin UI quiet, scannable and work-focused.
- Keep public article UI readable and SEO-friendly.
- Design loading, error and empty states with the feature, not after it.

## Review Rules

- Every PR should include verification notes.
- Run `pnpm format:check`, `pnpm lint`, `pnpm test` and `pnpm build` before requesting review.
- Code review should prioritize bugs, security, ownership, CI risks, missing tests and framework-standard violations.

## Security & Test Integrity Rules

- **SACRED TESTS**: Unit tests covering authorization, data ownership, and privacy (e.g., `apps/backend/tests/article.test.ts`) are sacred.
- **DO NOT MODIFY** these tests to "fix" a failing build caused by logic changes. If a security test fails, the logic change is likely a regression or a security vulnerability.
- Any modification to security-critical tests requires explicit user approval and a detailed security impact analysis.
- **OWNERSHIP**: Every mutation (create/update/delete) in the backend MUST verify the requester's ownership.
- **PRIVACY**: Publicly exposed relationships (like `author`) must be explicitly filtered to prevent leaking PII (e.g., email).
