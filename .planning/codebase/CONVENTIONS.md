# Coding Conventions

**Analysis Date:** 2026-04-21

## Naming Patterns

**Files:**
- Components: `PascalCase` (e.g., `NetWorthCard.tsx`).
- Styles: `[ComponentName].module.css`.
- Services: `[feature]Service.ts`.

**Functions:**
- Logic/Helper: `camelCase` (e.g., `addTransactionWithUpdate`).
- Components: `PascalCase` (Functional components).

**Variables:**
- General: `camelCase`.
- Constants: `UPPER_SNAKE_CASE` (observed in `constants/`).

**Types/Interfaces:**
- `PascalCase`, often prefixed with the entity name (e.g., `WalletData`, `Transaction`).

## Code Style

**Formatting:**
- Assumed standard Prettier (default Next.js setup).

**Linting:**
- `eslint-config-next` (standard Next.js).

## Import Organization

**Order:**
1. React / Next.js core imports.
2. Third-party libraries (Firebase, Lucide).
3. Absolute path aliases (`@/components`, `@/lib`, `@/context`).
4. Local styles (`.module.css`).

**Path Aliases:**
- `@/` maps to `src/`.

## Error Handling

**Patterns:**
- Try/Catch in async service functions.
- `console.error` with descriptive messages.
- Error throwing for caller handling.

## Logging

**Framework:** Native `console`.

**Patterns:**
- Errors logged with descriptive prefix: `Error creating wallet:`.

## Comments

**When to Comment:**
- JSDoc-style comments for exported service functions.
- Brief explanations for complex logic (e.g., Firestore transactions).

## Module Design

**Exports:**
- Named exports for services and components.
- Default export for Next.js pages.

**Barrel Files:**
- Used in some component directories (e.g., `src/components/transactions/index.ts`).

---

*Convention analysis: 2026-04-21*
