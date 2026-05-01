# Fast-Track MVP Implementation Plan

This plan supersedes all previous implementation plans to prioritize a working MVP.

## Core Objective
Deliver a fully functional Mini-CMS flow: Public Feed -> Auth -> Author Dashboard -> Create/Edit Articles (Draft/Publish) -> Public Visibility.

## Current Status (Audit)
- **Backend**:
  - [x] Strapi 5 installed with PostgreSQL.
  - [x] Content types: Article, Author, Tag.
  - [x] Security: Ownership enforced via controller overrides.
  - [x] Privacy: Author email hidden in public API.
  - [x] Testing: Sacred Security Tests implemented and passing.
- **Frontend**:
  - [x] Nuxt 4 installed.
  - [x] Basic Auth store & composables.
  - [x] Basic Login/Register pages (already in place).
  - [x] Public index page (already in place).
  - [x] "My Articles" dashboard (already in place).
  - [x] Create Article page (needs Draft/Publish toggle).

## MVP Phase 1: Auth & Public Feed
- [ ] **Verification**: Ensure Login/Register flows correctly redirect to Dashboard.
- [ ] **UI Polish**: Improve Public Feed (index.vue) with better cards and "publishedAt" formatting.
- [ ] **Navigation**: Add proper header with Auth status (Login/Register or Dashboard/Logout).

## MVP Phase 2: Authoring Flow
- [ ] **Create Article**: Add `status` toggle (Draft/Published) to `create.vue`.
- [ ] **Edit Article**: Implement `pages/admin/articles/[id]/edit.vue`.
- [ ] **Delete Article**: Add delete confirmation to Dashboard.
- [ ] **My Articles**: Ensure the dashboard clearly shows "Draft" vs "Published" status.

## MVP Phase 3: Final Polish & Ship
- [ ] **Quality Gates**: Lint, Typecheck, Test, Build.
- [ ] **Code Review**: Full audit of the MVP flow.
- [ ] **Ship**: Merge to main and verify deployment-ready state.

## Tech Stack Reminder
- **Frontend**: Nuxt 4, Vanilla CSS, Pinia.
- **Backend**: Strapi 5, Document Service API.
- **Rules**: Zero `any`, Protected `main`, Sacred Tests Green.
