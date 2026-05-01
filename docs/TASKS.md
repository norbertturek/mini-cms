# MVP Tasks

## Phase 1: Auth & Public Feed

- [ ] **Auth Navigation**: Update `Header` component to show user status and navigation links.
- [ ] **Public Feed**: Refactor `index.vue` to show beautiful article cards and handle empty states.
- [ ] **Auth Verification**: Manual test of Login/Register redirect logic.

## Phase 2: Authoring Flow

- [ ] **Create Toggle**: Add status (draft/published) radio buttons to `admin/articles/create.vue`.
- [ ] **Edit Page**: Create `admin/articles/[id]/edit.vue` with form pre-filled.
- [ ] **Delete Action**: Add "Delete" button with confirmation to `admin/articles.vue`.
- [ ] **Dashboard Status**: Update `admin/articles.vue` to display article status badges.

## Phase 3: Launch

- [ ] **Run Linter**: `pnpm lint`
- [ ] **Run Typecheck**: `pnpm typecheck`
- [ ] **Run Tests**: `pnpm test`
- [ ] **Run Build**: `pnpm build`
- [ ] **Final Review**: Use `code-review` skill on the whole MVP.
- [ ] **Ship**: Merge to main and tag version 1.0.0-mvp.
