# Mini CMS

Mini CMS is a pnpm workspace with a Strapi 5 backend, Nuxt 4 frontend and PostgreSQL running in Docker. The app will let users register, log in, create draft or published blog articles, manage their own articles, and expose published content through a public SSR blog.

## Quick Start

```bash
pnpm install
docker compose up -d postgres
pnpm dev:backend
pnpm dev:frontend
```

- Backend: `http://localhost:1337/admin`
- Frontend: `http://localhost:3000`

## Quality Checks

```bash
pnpm format:check
pnpm lint
pnpm test
pnpm build
```

CI runs install, lint, test and build on GitHub Actions.

## AI Collaboration

I use AI for planning, framework verification, implementation support, code review and release workflow checks. I keep the interaction log in [docs/prompts.md](docs/prompts.md).

I write and verify project-specific decisions myself when they affect security, ownership, product flow or maintainability. AI helps draft options, but implementation choices are checked against official Nuxt, Strapi and pnpm documentation.

## Known AI Corrections

- Updated the old task brief from Nuxt 3 to Nuxt 4.
- Replaced Strapi Entity Service assumptions with Strapi 5 Document Service guidance.
- Moved broad product/security notes out of the implementation plan into dedicated docs.

## Trade-offs

- Nuxt 4 is used because the task brief is old and the project should use current stable tooling.
- JWT is stored in a Nuxt-readable cookie for MVP SSR support; a production-hardening path would use a Nuxt BFF with httpOnly cookies.
- Search uses a technical `searchText` field because Strapi blocks content is JSON and direct full-text filtering would be fragile.

## More Docs

- [Implementation plan](docs/implementation/IMPLEMENTATION_PLAN.md)
- [Product decisions](docs/PRODUCT_DECISIONS.md)
- [Coding standards](docs/CODING_STANDARDS.md)
- [Project rules](docs/RULES.md)
- [Task checklist](docs/TASKS.md)
