# Codebase Structure

**Analysis Date:** 2026-04-21

## Directory Layout

```
tang-dee/
├── dictionaries/    # i18n JSON files (en.json, th.json)
├── docs/            # Documentation (Brain, Maestro plans)
├── src/
│   ├── app/         # Next.js App Router (Pages & Page-specific styles)
│   ├── components/  # Reusable React components (Organized by feature)
│   ├── constants/   # Static data (Categories, Icons)
│   ├── context/     # React Context Providers
│   ├── lib/         # Third-party configurations (Firebase, i18n helpers)
│   └── services/    # Business logic and Database API calls
└── netlify.toml     # Deployment config
```

## Directory Purposes

**src/app:**
- Purpose: Routing and main page layouts.
- Key files: `layout.tsx` (App shell), `page.tsx` (Home/Dashboard).

**src/components:**
- Purpose: Feature-specific UI components.
- Sub-directories: `dashboard/`, `navigation/`, `settings/`, `transactions/`, `wallet/`.

**src/context:**
- Purpose: Global state providers for Auth, Wallets, and Language.

**src/services:**
- Purpose: Encapsulated Firestore logic. `transactionService.ts` handles the heavy lifting of atomic updates.

## Key File Locations

**Entry Points:**
- `src/app/layout.tsx`: Root shell.
- `src/app/page.tsx`: Landing/Dashboard logic.

**Configuration:**
- `src/lib/firebase.config.ts`: Firebase initialization.
- `src/lib/dictionary.ts`: i18n logic.

**Core Logic:**
- `src/services/transactionService.ts`: Atomic transaction and transfer logic.

## Naming Conventions

**Files:**
- Components: `PascalCase.tsx`
- Styles: `Feature.module.css` (CSS Modules)
- Services/Hooks: `camelCase.ts`

**Directories:**
- Feature folders: `kebab-case` or lowercase.

## Where to Add New Code

**New Feature Page:**
- Create folder in `src/app/[feature-name]`.
- Add `page.tsx` and optionally `[Feature].module.css`.

**New Shared Component:**
- Add to `src/components/[category]/`.

**New Database Operation:**
- Add to existing or new service in `src/services/`.

---

*Structure analysis: 2026-04-21*
