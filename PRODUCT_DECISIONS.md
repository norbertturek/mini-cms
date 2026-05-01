# Mini CMS - decyzje produktowe, security i UI

## Interpretacja produktu

Projekt traktujemy jako dzialajacy mini-CMS dla autorow bloga. Publiczna czesc daje wartosc czytelnikowi przez dostep do opublikowanych artykulow, wyszukiwarke, tagi i sortowanie od najnowszych. Czesci administracyjnej uzywa zalogowany autor, ktory moze tworzyc drafty, publikowac je i edytowac tylko wlasne tresci.

## Aktualny stack

Zostajemy przy Nuxt 4, mimo ze stary brief wskazywal Nuxt 3. Powod: chcemy budowac na aktualnym stabilnym stacku. To wpisujemy w README jako swiadomy trade-off.

Zweryfikowane zalozenia:

- Nuxt 4 uzywa struktury `app/`, np. `apps/frontend/app/pages`.
- Strapi 5 powinno uzywac Document Service API zamiast zdeprecjonowanego Entity Service API.
- `pnpm workspace` wymaga `pnpm-workspace.yaml`.

Zrodla:

- Nuxt 4 release: https://nuxt.com/blog/v4
- Nuxt 4 directory structure: https://nuxt.com/docs/4.x/directory-structure/app/app
- Nuxt 4 pages/routing: https://nuxt.com/docs/4.x/directory-structure/app/pages
- Strapi 5 Document Service API: https://docs.strapi.io/cms/api/document-service
- Strapi 5 Entity Service deprecation: https://docs.strapi.io/cms/migration/v4-to-v5/breaking-changes/entity-service-deprecated
- pnpm workspaces: https://pnpm.io/workspaces

## Flow aplikacji

Flow publiczne:

1. Czytelnik wchodzi na `/`.
2. Widzi opublikowane artykuly posortowane po `publishedAt desc`.
3. Moze szukac po tekscie, filtrowac po tagach i korzystac z paginacji.
4. Otwiera `/articles/[slug]`, gdzie artykul renderuje sie SSR z meta tagami SEO/OG.

Flow autora:

1. Uzytkownik rejestruje sie przez `/register`.
2. System tworzy konto Strapi user oraz powiazany rekord `Author`.
3. Uzytkownik loguje sie przez `/login`.
4. Po zalogowaniu trafia do `/admin/articles`.
5. Moze utworzyc artykul jako draft albo od razu go opublikowac.
6. Moze edytowac i podejrzec swoje artykuly.
7. Po publikacji artykul trafia na publiczna liste jako najnowszy.
8. Uzytkownik moze sie wylogowac.

## Rejestracja i cele biznesowe

Rejestracja jest czescia MVP, bo bez niej aplikacja bylaby mniej samodzielna i wymagalaby recznego zakladania kont. Publiczna rejestracja zwieksza jednak ryzyko naduzyc, wiec w MVP ograniczamy jej skutki przez ownership i minimalne role.

Decyzja:

- Rejestracja tworzy autora, ktory moze zarzadzac tylko wlasnymi artykulami.
- Nowy uzytkownik nie dostaje dostepu do cudzych tresci ani panelu Strapi admin.
- Publikacja w MVP jest dozwolona dla autora, bo zadanie ma pokazac dzialajaca wartosc produktu.
- W produkcji mozna dodac email verification, rate limiting, captcha i role moderation/reviewer.

## JWT i bezpieczenstwo

JWT jest sensowny dla tego zadania, bo Strapi ma gotowy mechanizm Users & Permissions, a frontend potrzebuje prostego auth dla requestow do API.

Decyzja MVP:

- JWT trzymany w Pinia jako stan runtime.
- JWT utrwalony w cookie przez `useCookie`, zeby SSR i middleware Nuxt mogly odczytac sesje.
- Cookie: `sameSite: 'lax'`, `secure` w produkcji, rozsadny czas zycia.
- Requesty mutujace dane wysylaja `Authorization: Bearer <jwt>`.
- Middleware Nuxt chroni UI, ale backend jest zrodlem prawdy dla uprawnien.

Wariant bardziej produkcyjny:

- Nuxt server route jako BFF dla logowania.
- JWT Strapi w httpOnly cookie.
- Frontend nie ma bezposredniego dostepu do tokena.

Trade-off: wariant BFF/httpOnly jest bezpieczniejszy, ale bardziej zlozony. Do zadania MVP wystarczy `useCookie`, o ile backend poprawnie egzekwuje ownership.

## Ownership

Najwazniejsza zasada security: frontend nie decyduje, do kogo nalezy artykul.

- Backend przypisuje `Author` na podstawie zalogowanego usera.
- Backend filtruje liste admina do artykulow zalogowanego autora.
- Backend blokuje edycje cudzych artykulow.
- Publiczne API zwraca tylko opublikowane artykuly.
- Publiczne API nie powinno zwracac prywatnych danych autora, np. emaila, bez swiadomej decyzji.

## Status i publikacja

Brief wymaga `status: draft/published` oraz `publishedAt`. Strapi ma Draft & Publish, ktore tez operuje statusem publikacji i `publishedAt`.

Decyzja do wdrozenia:

- Wlaczyc Draft & Publish jako zrodlo prawdy.
- W UI pokazywac status `draft/published`.
- Jezeli potrzebne jest literalne pole enum z briefu, synchronizowac je z publikacja i opisac trade-off w README.

## Search po content blocks

`content` jako blocks/rich text moze byc JSON-em, co utrudnia stabilne wyszukiwanie. Dlatego plan zaklada `searchText`.

- `searchText` jest generowane z `title` i tekstu wyciagnietego z blocks.
- Custom search szuka po `title` i `searchText`.
- To upraszcza query i daje przewidywalne wyniki w PostgreSQL.

## UI i komponenty

UI ma byc czytelne i uzytkowe. Publiczna czesc powinna wygladac jak prosty blog, panel adminowy jak spokojne narzedzie do pracy autora.

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

- Nie budowac landing page. Pierwszym ekranem jest lista artykulow.
- `ArticleForm` jest wspolny dla tworzenia i edycji.
- Komponenty bazowe nie znaja Strapi.
- Logika API idzie do composables.
- Stany `loading`, `error`, `empty` maja byc czescia UI od poczatku.

## Ryzyka

- Publiczna rejestracja moze generowac spam, jezeli aplikacja trafi do internetu bez rate limitingu i moderacji.
- JWT w cookie dostepnym dla JS jest prostszy, ale slabszy niz httpOnly cookie.
- Blocks/rich text wymaga renderera po stronie Nuxt.
- Search po blocks bez `searchText` moze byc niepelny.
- `status` moze dublowac natywne Draft & Publish Strapi.
- Strapi 5 promuje `documentId`, wiec parametr `[id]` w Nuxt powinien oznaczac `documentId`.
- Uprawnienia Strapi latwo ustawic zbyt szeroko; potrzebny jest service-level ownership check.
- CI z PostgreSQL wymaga healthchecka i dobrej kolejnosci startu.
