# Mini CMS - lista zadan

Legenda:

- `[ ]` - do wykonania
- `[*]` - wykonane

## Etap 1 - workspace i infrastruktura

- [*] Utworzyc root `package.json`.
- [*] Dodac skrypty root: `dev`, `dev:backend`, `dev:frontend`, `lint`, `format`, `test`, `build`.
- [*] Utworzyc `pnpm-workspace.yaml` dla `apps/*` i `packages/*`.
- [*] Dodac `.nvmrc` albo `engines.node`.
- [*] Dodac `.gitignore`.
- [*] Dodac `.env.example`.
- [*] Dodac konfiguracje Prettier.
- [*] Dodac konfiguracje ESLint.
- [*] Dodac `docker-compose.yml` z PostgreSQL.
- [*] Utworzyc aplikacje backend w `apps/backend`.
- [*] Utworzyc aplikacje frontend w `apps/frontend`.
- [*] Uruchomic `pnpm install`.
- [*] Uruchomic PostgreSQL przez `docker compose up -d postgres`.
- [*] Uruchomic backend przez `pnpm dev:backend`.
- [*] Uruchomic frontend przez `pnpm dev:frontend`.
- [*] Potwierdzic lokalny adres backendu.
- [*] Potwierdzic lokalny adres frontendu.
- [*] Uruchomic `pnpm lint`.
- [*] Zaktualizowac `docs/prompts.md` po zakonczeniu Etapu 1.

## Etap 1.5 - repozytorium GitHub i CI

- [*] Zainicjalizowac lokalne repozytorium git.
- [*] Sprawdzic, czy `.gitignore` wyklucza sekrety, `node_modules`, build outputy i dane bazy.
- [*] Dodac pierwszy commit z inicjalizacja projektu.
- [*] Utworzyc repozytorium na GitHub.
- [*] Dodac remote GitHub.
- [*] Wypchnac kod na GitHub.
- [*] Utworzyc `.github/workflows/ci.yml`.
- [*] Skonfigurowac CI: checkout, Node, pnpm, cache/install.
- [*] Skonfigurowac CI: `pnpm lint`.
- [*] Skonfigurowac CI: `pnpm test`.
- [*] Skonfigurowac CI: `pnpm build`.
- [*] Dodac PostgreSQL service container w CI, jezeli testy backendu beda go wymagac.
- [*] Uruchomic pipeline na GitHub.
- [*] Potwierdzic, ze pipeline przechodzi.
- [*] Zaktualizowac `docs/prompts.md` po repozytorium, pushu i pierwszym CI.

## Etap 1.6 - dokumentacja, rules i skills

- [*] Utworzyc katalog `docs/implementation`.
- [*] Utworzyc katalog `docs/implementation/archive`.
- [*] Przeniesc plan implementacji do `docs/implementation/IMPLEMENTATION_PLAN.md`.
- [*] Utworzyc root `README.md`.
- [*] Utworzyc `docs/CODING_STANDARDS.md`.
- [*] Utworzyc `docs/RULES.md`.
- [*] Utworzyc `docs/REFERENCES.md`.
- [*] Utworzyc `AGENTS.md`.
- [*] Utworzyc Cursor rules dla projektu.
- [*] Utworzyc Cursor rules dla Nuxt 4.
- [*] Utworzyc Cursor rules dla Strapi 5.
- [*] Utworzyc projektowy skill code review.
- [*] Utworzyc projektowy skill ship.
- [*] Zweryfikowac mozliwosc zabezpieczenia `main`.
- [*] Odnotowac blocker branch protection dla prywatnego repo bez GitHub Pro.
- [*] Otworzyc PR z dokumentacja, rules i skills.
- [*] Zaktualizowac `docs/prompts.md` po Etapie 1.6.

## Etap 2 - backend Strapi 5

- [*] Skonfigurowac Strapi 5 w `apps/backend`.
- [*] Skonfigurowac polaczenie Strapi z PostgreSQL.
- [*] Dodac kolekcje `Article`.
- [*] Dodac kolekcje `Author`.
- [*] Dodac kolekcje `Tag`.
- [*] Wlaczyc Draft & Publish dla `Article`.
- [*] Dodac pole techniczne `searchText`.
- [*] Potwierdzic, ze Strapi startuje z PostgreSQL.
- [*] Zaktualizowac `docs/prompts.md` po Etapie 2.

## Etap 3 - modele danych i relacje

- [*] Dodac pola `title`, `slug`, `content`, `status`, `publishedAt`, `searchText` w `Article`.
- [*] Dodac relacje many-to-one `Article -> Author`.
- [*] Dodac relacje many-to-many `Article <-> Tag`.
- [*] Dodac pola `name`, `email`, `bio` w `Author`.
- [*] Dodac relacje `Author -> User`.
- [*] Dodac pola `name`, `slug` w `Tag`.
- [*] Potwierdzic, ze relacje dzialaja w API.
- [*] Zaktualizowac `docs/prompts.md` po Etapie 3.

## Etap 4 - rejestracja, logowanie i JWT

- [ ] Dodac strone `/register`.
- [ ] Dodac strone `/login`.
- [ ] Dodac logike rejestracji przez Strapi Users & Permissions.
- [ ] Automatycznie tworzyc `Author` po rejestracji usera.
- [ ] Dodac logike logowania.
- [ ] Dodac logike wylogowania.
- [ ] Dodac Pinia auth store.
- [ ] Przechowywac JWT w Pinia jako runtime state.
- [ ] Przechowywac JWT w cookie przez `useCookie`.
- [ ] Dodac helper autoryzowanych requestow z naglowkiem `Authorization`.
- [ ] Potwierdzic flow: rejestracja, logowanie, wylogowanie.
- [ ] Zaktualizowac `docs/prompts.md` po Etapie 4.

## Etap 5 - autoryzacja i ownership

- [ ] Skonfigurowac minimalne role Strapi.
- [ ] Zabezpieczyc tworzenie artykulu JWT.
- [ ] Zabezpieczyc edycje artykulu JWT.
- [ ] Przy tworzeniu przypisywac autora z zalogowanego usera.
- [ ] Przy listowaniu adminowym zwracac tylko artykuly zalogowanego autora.
- [ ] Przy edycji blokowac cudze artykuly.
- [ ] Publiczne endpointy ograniczyc do opublikowanych artykulow.
- [ ] Ukryc wrazliwe pola autora w publicznym API.
- [ ] Zaktualizowac `docs/prompts.md` po Etapie 5.

## Etap 6 - custom search API

- [ ] Dodac route `GET /api/articles/search`.
- [ ] Dodac controller search.
- [ ] Dodac service search.
- [ ] Uzyc Document Service API Strapi 5.
- [ ] Szukac po `title`.
- [ ] Szukac po `searchText`.
- [ ] Filtrowac po slugach tagow.
- [ ] Zwracac tylko opublikowane artykuly.
- [ ] Sortowac po `publishedAt desc`.
- [ ] Dodac paginacje `page` i `pageSize`.
- [ ] Zaktualizowac `docs/prompts.md` po Etapie 6.

## Etap 7 - frontend Nuxt 4

- [ ] Skonfigurowac Nuxt 4 w `apps/frontend`.
- [ ] Dodac Tailwind CSS.
- [ ] Dodac Pinia.
- [ ] Dodac strone `/`.
- [ ] Dodac strone `/articles/[slug]`.
- [ ] Dodac strone `/admin/articles`.
- [ ] Dodac strone `/admin/articles/new`.
- [ ] Dodac strone `/admin/articles/[id]/edit`.
- [ ] Dodac strone `/admin/articles/[id]/preview`.
- [ ] Dodac middleware `auth`.
- [ ] Potwierdzic pelny flow UI bez recznej pracy w Strapi.
- [ ] Zaktualizowac `docs/prompts.md` po Etapie 7.

## Etap 8 - frontend auth i dane

- [ ] Dodac `useApiClient`.
- [ ] Dodac `useAuth`.
- [ ] Dodac `useArticles`.
- [ ] Dodac `useArticle`.
- [ ] Dodac `useAdminArticles`.
- [ ] Dodac `useTags`.
- [ ] Dodac typy `Article`, `Author`, `Tag`.
- [ ] Dodac typy odpowiedzi Strapi.
- [ ] Dodac typy paginacji.
- [ ] Potwierdzic, ze odswiezenie strony w panelu nie gubi sesji.
- [ ] Zaktualizowac `docs/prompts.md` po Etapie 8.

## Etap 9 - UI i komponenty

- [ ] Dodac `BaseButton`.
- [ ] Dodac `BaseInput`.
- [ ] Dodac `BaseTextarea`.
- [ ] Dodac `BaseSelect`.
- [ ] Dodac `BaseBadge`.
- [ ] Dodac `BaseAlert`.
- [ ] Dodac `BasePagination`.
- [ ] Dodac `EmptyState`.
- [ ] Dodac `LoadingState`.
- [ ] Dodac `ArticleCard`.
- [ ] Dodac `ArticleFilters`.
- [ ] Dodac `ArticleMeta`.
- [ ] Dodac `ArticleContentRenderer`.
- [ ] Dodac `ArticleStatusBadge`.
- [ ] Dodac `ArticleForm`.
- [ ] Dodac `TagPicker`.
- [ ] Dodac `AdminArticleTable`.
- [ ] Dodac `AuthForm`.
- [ ] Uzyc `ArticleForm` wspolnie dla tworzenia i edycji.
- [ ] Zaktualizowac `docs/prompts.md` po Etapie 9.

## Etap 10 - testy

- [ ] Dodac test custom search.
- [ ] Dodac test auth/ownership.
- [ ] Dodac test formularza logowania albo rejestracji.
- [ ] Uruchomic `pnpm --filter backend test`.
- [ ] Uruchomic `pnpm --filter frontend test`.
- [ ] Uruchomic `pnpm test`.
- [ ] Zaktualizowac `docs/prompts.md` po Etapie 10.

## Etap 11 - build, lint i CI

- [ ] Uruchomic `pnpm lint`.
- [ ] Uruchomic `pnpm test`.
- [ ] Uruchomic `pnpm build`.
- [ ] Rozszerzyc CI o wymagania z kolejnych etapow.
- [ ] Potwierdzic, ze CI przechodzi na GitHub.
- [ ] Zaktualizowac `docs/prompts.md` po Etapie 11.

## Etap 12 - dokumentacja

- [ ] Utworzyc `README.md`.
- [ ] Opisac uruchomienie lokalne.
- [ ] Opisac, co zdelegowano do AI.
- [ ] Opisac, co napisano samodzielnie i dlaczego.
- [ ] Opisac wykryte i poprawione bledy AI.
- [ ] Opisac, co zrobilbym inaczej majac wiecej czasu.
- [ ] Opisac swiadome trade-offy.
- [ ] Upewnic sie, ze `README.md` miesci sie w limicie ok. 1 strony.
- [ ] Upewnic sie, ze `docs/prompts.md` jest aktualny.
- [ ] Upewnic sie, ze `docs/PRODUCT_DECISIONS.md` jest aktualny.
- [ ] Zaktualizowac `docs/prompts.md` po Etapie 12.
