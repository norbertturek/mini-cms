# My Review - Mini-CMS Project

## 1. Planowanie i Struktura
Projekt rozpoczął się od gruntownego zaplanowania architektury oraz przygotowania **Implementation Plan**. Zdefiniowano fazy rozwoju, co pozwoliło na ustrukturyzowane podejście do budowy MVP. Kolejnym krokiem było stworzenie szczegółowej listy zadań (`docs/TASKS.md`), która służy jako mapa drogowa dla agenta. Ze względu na dynamiczne zmiany w trakcie pracy, pierwotne plany zostały przeniesione do archiwum (`docs/implementation/archive/`), a proces przyspieszono w końcowej fazie.

## 2. Infrastruktura i Środowisko
- **Monorepo**: Skonfigurowano strukturę workspace pnpm z podziałem na `apps/backend` (Strapi 5) oraz `apps/frontend` (Nuxt 4).
- **Baza danych**: Wykorzystano PostgreSQL jako stabilne rozwiązanie dla backendu.
- **Agent Skills**: Skonfigurowano dedykowane narzędzia dla agenta (tzw. *skills*), takie jak `code-review` oraz `ship`, co automatyzuje proces weryfikacji i wdrażania zmian (PR flow).

## 3. Jakość Kodu i Automatyzacja
Wprowadzono rygorystyczne bramki jakościowe, aby zapewnić spójność i bezpieczeństwo kodu:
- **Linting & Formatting**: Konfiguracja ESLint i Prettier działająca na całym monorepo.
- **Typecheck**: Wymuszenie ścisłego typowania TypeScript (zakaz używania `any`).
- **Sacred Security Tests**: Zaimplementowano krytyczne testy bezpieczeństwa w Vitest, które chronią logikę własności danych (ownership) i autoryzacji.

## 4. Wyzwania i Ewolucja Modeli
- **Praca z Modelami**: Proces wymagał częstych zmian modeli. Model **Gemini 1.5 Flash** generował sporo błędów, nie radził sobie z wieloma aspektami logiki i wymagał prowadzenia "za rękę" krok po kroku. Dopiero przełączenie na model **Claude 4.6 Opus** w końcowej fazie pozwoliło na skuteczne wyeliminowanie krytycznych błędów (problemy z pobieraniem i tworzeniem artykułów, niedziałający modal).
- **Optymalizacja Workflow**: W trakcie pracy wykryto błędy w konfiguracji Strapi (np. błędna wersja Node w configu). Wymuszono na modelu natychmiastowe poprawki i usprawnienie workflow, aby zapamiętywał zasady projektowe i unikał powtarzania błędów (np. walka z typem `any`).

## 5. Podsumowanie i Wnioski
Po ponad 3 godzinach intensywnej pracy projekt został doprowadzony do stanu funkcjonalnego MVP:
- **Sukcesy**: Naprawiono krytyczne błędy CRUD, wdrożono działający modal artykułów, poprawnie skonfigurowano ownership i widoczność draftów. Zautomatyzowano proces uprawnień.
- **Ograniczenia**: Ze względu na presję czasu, nie wszystkie elementy zostały zweryfikowane z najwyższą starannością. Brakuje pełnych testów integracyjnych, a cały workflow mógłby być jeszcze silniej zintegrowany.
- **Weryfikacja**: Mimo pośpiechu, każdorazowo wykonywano `code-review` oraz dbano o poprawność buildów i testów, aby model nie zboczył z obranej ścieżki.

---
**Status**: Projekt oddany po ponad 3 godzinach pracy. MVP funkcjonalne, przygotowane do dalszego rozwoju.
