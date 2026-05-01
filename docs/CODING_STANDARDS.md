# Coding Standards

## General

- Use TypeScript everywhere possible.
- **NEVER use `any`. Always define proper interfaces or types. Use `unknown` if a type is truly uncertain.**
- **NEVER use underscored variables (e.g. `_error`) just to bypass linting. For catch blocks where the error is not used, use the optional catch binding: `catch { ... }`.**
- **ALWAYS use aliases (e.g. `~` or `@`) for imports to avoid relative path nesting.**
- Prefer generated framework conventions over custom scaffolding.
- Install libraries and frameworks with official package managers/generators.
- Keep business logic out of page files when it can live in composables, services or Strapi services.
- Do not commit `.env`, generated caches, build outputs, database dumps or `node_modules`.
- Keep commits small and use Conventional Commits.

## Monorepo

- Backend code lives in `apps/backend`.
- Frontend code lives in `apps/frontend`.
- Shared docs live in `docs`.
- Project skills live in `.agents/skills`.
- Root scripts must keep working:
  - `pnpm format:check`
  - `pnpm lint`
  - `pnpm test`
  - `pnpm build`

## Nuxt 4

- Follow Nuxt 4 `app/` directory conventions.
- Pages belong in `apps/frontend/app/pages`.
- Middleware belongs in `apps/frontend/app/middleware`.
- Reusable UI belongs in `apps/frontend/app/components`.
- Composables belong in `apps/frontend/app/composables`.
- Pinia auth state belongs in `apps/frontend/app/stores`.
- Public runtime values use `runtimeConfig.public`.
- Secrets must never be exposed through public runtime config.
- SSR pages must handle loading, error and empty states.
- Use `useCookie` for auth persistence needed by SSR.

## Strapi 5

- Follow Strapi 5 project structure and content-type conventions.
- Use Document Service API for custom data access.
- Do not use deprecated Entity Service API for new custom logic.
- Database settings, salts, keys and secrets must be environment-driven.
- PostgreSQL is the default local and CI database.
- Public APIs must return only published articles unless explicitly designed otherwise.
- Ownership checks must happen on the backend, not only in Nuxt.
- Generated Strapi types may be committed when useful, but should not be hand-edited.

## Security

- Never trust author IDs from client request bodies.
- Assign `Author` from the authenticated Strapi user.
- Block access to another author's drafts and private admin data.
- Do not expose author email publicly unless it becomes a deliberate product decision.
- Keep JWT handling documented and covered by tests around auth/ownership behavior.

## Testing

- Add tests for meaningful behavior, not just rendering snapshots.
- Required early checks:
  - workspace smoke test
  - search filtering/sorting
  - auth or ownership rule
  - login or registration form behavior
- CI must stay green before opening a PR for review.
- **SACRED SECURITY TESTS**:
  - Tests covering authorization, data ownership, and privacy are considered "Sacred".
  - These tests represent the "Security Contract" of the application.
  - **NEVER modify or delete** these tests to pass a build after a logic change.
  - A failure in a Sacred Test indicates a security regression that must be fixed in the application code, not by weakening the test.
  - Modifying these tests requires a formal security review and explicit owner approval.
