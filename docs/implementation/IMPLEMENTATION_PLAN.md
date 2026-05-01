# Mini CMS - plan implementacji

## Cel implementacji

Zbudowac dzialajacy mini-CMS dla artykulow blogowych jako `pnpm workspace` z aplikacjami `apps/backend` i `apps/frontend`, baza PostgreSQL w Docker Compose, backendem Strapi 5, frontendem Nuxt 4, auth JWT, rejestracja/logowaniem uzytkownika, panelem autora, publiczna lista artykulow oraz CI sprawdzajacym lint, testy i build.

## Zakres MVP

- Publiczna strona `/` z opublikowanymi artykulami, wyszukiwarka, filtrem tagow, paginacja i sortowaniem od najnowszych.
- Publiczna strona `/articles/[slug]` renderowana SSR z meta tagami SEO/OG.
- Rejestracja autora przez `/register`.
- Logowanie przez `/login` i wylogowanie.
- Panel autora `/admin/articles` z lista wlasnych artykulow.
- Tworzenie artykulu jako `draft` albo `published`.
- Edycja wlasnego artykulu.
- Podglad wlasnego artykulu, takze draftu, z poziomu panelu autora.
- Po publikacji artykul jest widoczny publicznie jako najnowszy wedlug `publishedAt`.
- Minimum 2 sensowne testy.
- Dokumentacja `README.md` i `docs/prompts.md`.

## Stack

- Monorepo: `pnpm workspace`
- Backend: Strapi 5, TypeScript, PostgreSQL
- Frontend: Nuxt 4, TypeScript, Pinia, Tailwind CSS
- Baza lokalna: PostgreSQL przez Docker Compose
- Testy: Vitest/component tests plus test backendowej logiki search/auth
- Jakosc: ESLint, Prettier, `pnpm lint`, `pnpm test`, `pnpm build`
- CI: GitHub Actions

## Struktura repozytorium

```text
mini-cms/
  apps/
    backend/              # Strapi 5
    frontend/             # Nuxt 4
  packages/
    config/               # opcjonalne wspolne configi
  docker-compose.yml
  pnpm-workspace.yaml
  package.json
  .env.example
  .gitignore
  .prettierrc
  eslint.config.mjs
  docs/
    implementation/
      IMPLEMENTATION_PLAN.md
      archive/
    PRODUCT_DECISIONS.md
    TASKS.md
    prompts.md
  README.md
  .github/
    workflows/
      ci.yml
```

## Etap 1 - workspace i infrastruktura

- Utworzyc root `package.json` z komendami:
  - `dev`
  - `dev:backend`
  - `dev:frontend`
  - `lint`
  - `format`
  - `test`
  - `build`
- Utworzyc `pnpm-workspace.yaml` dla `apps/*` i `packages/*`.
- Dodac `.nvmrc` albo `engines.node`.
- Dodac `.gitignore`, `.env.example`, Prettier i ESLint.
- Dodac `docker-compose.yml` z PostgreSQL `postgres:16-alpine`.
- Uruchomic lokalnie backend przez `pnpm dev:backend`.
- Uruchomic lokalnie frontend przez `pnpm dev:frontend`.
- Potwierdzic adresy lokalne do weryfikacji, np. Strapi `http://localhost:1337` i Nuxt `http://localhost:3000`.
- Zaktualizowac `docs/prompts.md` po zakonczeniu inicjalizacji projektu i konfiguracji.
- Kryterium akceptacji: `docker compose up -d postgres`, `pnpm install`, `pnpm lint`, `pnpm dev:backend` i `pnpm dev:frontend` dzialaja, a frontend oraz backend da sie otworzyc lokalnie.

## Etap 1.5 - repozytorium GitHub i CI dla inicjalizacji

- Zainicjalizowac lokalne repozytorium git.
- Upewnic sie, ze `.gitignore` nie przepuszcza sekretow, `node_modules`, build outputow i danych bazy.
- Dodac pierwszy commit z inicjalizacja workspace, konfiguracja, Docker Compose, dokumentacja i minimalnymi aplikacjami.
- Utworzyc repozytorium na GitHub.
- Wypchnac kod na GitHub.
- Dodac `.github/workflows/ci.yml` juz na tym etapie.
- Pipeline CI ma sprawdzac:
  - `pnpm install --frozen-lockfile`
  - `pnpm lint`
  - `pnpm test`
  - `pnpm build`
- Jezeli backendowe testy wymagaja bazy, dodac PostgreSQL jako service container z healthcheckiem.
- Uruchomic pipeline na GitHub i potwierdzic wynik.
- Zaktualizowac `docs/prompts.md` po utworzeniu repozytorium, pushu i pierwszym uruchomieniu CI.
- Kryterium akceptacji: kod inicjalizacyjny jest na GitHub, CI istnieje i sprawdza lint, testy oraz build.

## Etap 2 - backend Strapi 5

- Wygenerowac Strapi 5 w `apps/backend`.
- Skonfigurowac PostgreSQL przez env:
  - `DATABASE_CLIENT=postgres`
  - `DATABASE_HOST=localhost`
  - `DATABASE_PORT=5432`
  - `DATABASE_NAME=mini_cms`
  - `DATABASE_USERNAME=mini_cms`
  - `DATABASE_PASSWORD=mini_cms`
  - `DATABASE_SSL=false`
- Dodac kolekcje:
  - `Article`
  - `Author`
  - `Tag`
- Wlaczyc Draft & Publish dla `Article`.
- Dodac pole techniczne `searchText` do przewidywalnego wyszukiwania po tresci blocks.
- Kryterium akceptacji: Strapi startuje, laczy sie z PostgreSQL i ma wymagane modele.

## Etap 3 - modele danych

`Article`:

- `title`: string, wymagane
- `slug`: uid z `title`, unikalny
- `content`: blocks/rich text, wymagane
- `status`: enum `draft | published`, jezeli decydujemy sie trzymac literalne pole z briefu
- `publishedAt`: datetime
- `searchText`: text, generowany z `title` i `content`
- relacja many-to-one do `Author`
- relacja many-to-many do `Tag`

`Author`:

- `name`: string, wymagane
- `email`: email, wymagane, unikalne
- `bio`: text/rich text, opcjonalne
- relacja one-to-many do `Article`
- relacja do usera Strapi, zeby egzekwowac ownership

`Tag`:

- `name`: string, wymagane
- `slug`: uid z `name`, unikalny
- relacja many-to-many do `Article`

Kryterium akceptacji: relacje dzialaja w API, a artykul ma autora i tagi.

## Etap 4 - rejestracja, logowanie i JWT

- Dodac `/register` po stronie frontendu.
- Uzyc Strapi Users & Permissions do rejestracji i logowania.
- Po rejestracji automatycznie utworzyc rekord `Author` powiazany z userem Strapi.
- Po rejestracji zalogowac uzytkownika albo przekierowac na `/login` z komunikatem sukcesu.
- Dodac `/login`.
- Dodac `logout`.
- Przechowywac JWT:
  - w Pinia jako runtime state
  - w cookie przez `useCookie`, zeby auth dzialal z SSR i middleware
- Ustawic cookie z `sameSite: 'lax'`, `secure` w produkcji i rozsadnym czasem zycia.
- Wszystkie mutacje artykulow wykonywac z `Authorization: Bearer <jwt>`.
- Kryterium akceptacji: uzytkownik moze sie zarejestrowac, zalogowac, wylogowac i wejsc do panelu autora.

## Etap 5 - autoryzacja i ownership na backendzie

- Skonfigurowac minimalne role Strapi.
- Zabezpieczyc endpointy tworzenia i edycji artykulow JWT.
- Przy tworzeniu artykulu backend przypisuje autora na podstawie zalogowanego usera, nie z request body.
- Przy listowaniu w panelu backend zwraca tylko artykuly zalogowanego autora.
- Przy edycji backend blokuje edycje cudzych artykulow.
- Publiczne endpointy zwracaja tylko opublikowane artykuly.
- Nie zwracac publicznie wrazliwych danych autora, np. emaila, jezeli nie jest swiadomie publiczny.
- Kryterium akceptacji: user A nie moze zobaczyc ani edytowac prywatnych/draftowych artykulow usera B.

## Etap 6 - custom search API

Endpoint:

```text
GET /api/articles/search?q=...&tags=...&page=...&pageSize=...
```

Implementacja:

- Dodac custom route, controller i service w Strapi.
- Uzyc Document Service API Strapi 5.
- Szukac po `title` i `searchText`.
- Filtrowac po slugach tagow.
- Zwracac tylko opublikowane artykuly.
- Sortowac domyslnie po `publishedAt desc`.
- Zwracac paginacje.
- Zwracac dane listy: `title`, `slug`, `excerpt`, `publishedAt`, `author`, `tags`.
- Kryterium akceptacji: `/api/articles/search` wspiera search, tagi, paginacje i sortowanie od najnowszych.

## Etap 7 - frontend Nuxt 4

Struktura:

```text
apps/frontend/
  app/
    pages/
      index.vue
      login.vue
      register.vue
      articles/
        [slug].vue
      admin/
        articles/
          index.vue
          new.vue
          [id]/
            edit.vue
            preview.vue
    middleware/
      auth.ts
    layouts/
    components/
    composables/
    stores/
  server/
  shared/
  nuxt.config.ts
```

Widoki:

- `/` - publiczna lista opublikowanych artykulow, search, tagi, paginacja, sortowanie `publishedAt desc`.
- `/articles/[slug]` - publiczny artykul SSR z SEO/OG.
- `/register` - rejestracja autora.
- `/login` - logowanie.
- `/admin/articles` - lista artykulow zalogowanego autora.
- `/admin/articles/new` - tworzenie draftu albo publikacja.
- `/admin/articles/[id]/edit` - edycja wlasnego artykulu.
- `/admin/articles/[id]/preview` - podglad wlasnego artykulu, takze draftu.

Kryterium akceptacji: pelny flow uzytkownika dziala z UI bez recznego grzebania w Strapi.

## Etap 8 - frontend auth i dane

- Dodac Pinia store `auth`:
  - `user`
  - `jwt`
  - `isAuthenticated`
  - `register`
  - `login`
  - `logout`
  - `fetchMe`
- Dodac middleware `auth` dla `/admin/**`.
- Dodac klienta API Strapi z `NUXT_PUBLIC_API_BASE_URL`.
- Dodac helper do requestow autoryzowanych.
- Dodac typy TypeScript dla `Article`, `Author`, `Tag`, odpowiedzi Strapi i paginacji.
- Kryterium akceptacji: odswiezenie strony w panelu nie gubi sesji, jezeli cookie nadal istnieje.

## Etap 9 - UI i komponenty reuzywalne

Komponenty bazowe:

- `BaseButton`
- `BaseInput`
- `BaseTextarea`
- `BaseSelect`
- `BaseBadge`
- `BaseAlert`
- `BasePagination`
- `EmptyState`
- `LoadingState`

Komponenty domenowe:

- `ArticleCard`
- `ArticleFilters`
- `ArticleMeta`
- `ArticleContentRenderer`
- `ArticleStatusBadge`
- `ArticleForm`
- `TagPicker`
- `AdminArticleTable`
- `AuthForm`

Zasady:

- `ArticleForm` jest wspolny dla `new` i `edit`.
- Komponenty bazowe nie znaja Strapi.
- Logika requestow jest w composables, nie w komponentach prezentacyjnych.
- Stany `loading`, `error`, `empty` sa obslugiwane od poczatku.

Kryterium akceptacji: formularze i listy korzystaja z reuzywalnych komponentow zamiast duplikowania markup/logiki.

## Etap 10 - testy

Minimum:

- Backend: test custom search, ktory potwierdza filtrowanie po `published`, `q`, `tags` i sortowanie po `publishedAt desc`.
- Backend albo frontend: test ownership/auth, ktory potwierdza, ze user nie edytuje cudzego artykulu.
- Frontend: test formularza logowania albo rejestracji.

Komendy:

- `pnpm test`
- `pnpm --filter backend test`
- `pnpm --filter frontend test`

Kryterium akceptacji: sa minimum 2 sensowne testy, a `pnpm test` przechodzi.

## Etap 11 - build, lint i CI

- Rozwijac pipeline utworzony w Etapie 1.5 o wymagania wynikajace z kolejnych funkcji.
- Utrzymywac `pnpm lint`.
- Utrzymywac `pnpm format`.
- Utrzymywac `pnpm build`.
- CI:
  - checkout
  - setup Node
  - setup pnpm
  - `pnpm install --frozen-lockfile`
  - PostgreSQL service container
  - `pnpm lint`
  - `pnpm test`
  - `pnpm build`
- Zaktualizowac `docs/prompts.md` po kazdej wiekszej zmianie CI lub konfiguracji jakosci.
- Kryterium akceptacji: lokalnie i w CI przechodza lint, testy i build.

## Etap 12 - dokumentacja

- Utworzyc `README.md`, max 1 strona:
  - jak uruchomic projekt
  - co zdelegowalem do AI, co napisalem sam i dlaczego
  - jakie bledy AI wykrylem i poprawilem
  - co zrobilbym inaczej majac wiecej czasu
  - trade-offy, ktore swiadomie wybralem
- Prowadzic `docs/prompts.md` jako log pracy z AI:
  - data
  - godzina
  - input uzytkownika
  - jednozdaniowe podsumowanie wykonanej pracy
- Aktualizowac `docs/prompts.md` po inicjalizacji projektu, zmianach konfiguracji, zakonczeniu Etapu 1, utworzeniu repozytorium GitHub, pierwszym pipeline CI oraz po kazdym istotnym etapie implementacji.
- Utrzymywac `docs/PRODUCT_DECISIONS.md` jako miejsce na decyzje produktowe, security, UI i ryzyka.
- Kryterium akceptacji: dokumentacja spelnia wymagania zadania i pokazuje realny proces pracy z AI.

## Definition of Done

- Projekt jest `pnpm workspace`.
- Aplikacje sa w `apps/backend` i `apps/frontend`.
- Repozytorium jest utworzone lokalnie i na GitHub.
- CI na GitHub sprawdza install, lint, testy i build juz po inicjalizacji projektu.
- PostgreSQL dziala z Docker Compose.
- Strapi 5 ma modele `Article`, `Author`, `Tag`.
- Uzytkownik moze sie zarejestrowac, zalogowac i wylogowac.
- Po rejestracji powstaje powiazany `Author`.
- JWT chroni tworzenie i edycje artykulow.
- Backend egzekwuje ownership artykulow.
- Autor moze utworzyc draft albo opublikowany artykul.
- Opublikowany artykul pojawia sie publicznie jako najnowszy.
- Publiczna lista ma search, tagi, paginacje i sortowanie po dacie.
- Autor moze podejrzec wlasny artykul, takze draft.
- Nuxt 4 ma widoki publiczne i adminowe.
- SSR i meta tagi dzialaja dla strony artykulu.
- UI korzysta z reuzywalnych komponentow.
- Sa minimum 2 sensowne testy.
- `pnpm lint`, `pnpm test`, `pnpm build` przechodza.
- Jest `README.md`.
- Jest aktualizowany `docs/prompts.md`.
- Jest CI gotowe do uruchomienia.
