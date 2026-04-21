# Technology Stack

**Analysis Date:** 2026-04-21

## Languages

**Primary:**
- TypeScript 5+ - Used throughout the entire codebase for type safety and better developer experience.

**Secondary:**
- JavaScript (ES6+) - Used in configuration files and some legacy build scripts.
- CSS (Vanilla CSS Modules) - Used for styling components with scoped classes.

## Runtime

**Environment:**
- Node.js 18+ (Next.js requirement)

**Package Manager:**
- npm
- Lockfile: `package-lock.json` present.

## Frameworks

**Core:**
- Next.js 14+ (App Router) - Full-stack framework for React applications.

**UI:**
- React 18+ - Core UI library.
- Lucide React - Icon set.

**Build/Dev:**
- TypeScript - Static typing.
- ESLint - Linting tool with `eslint-config-next`.

## Key Dependencies

**Critical:**
- `firebase` - Official SDK for Firebase Auth and Firestore.
- `lucide-react` - Standardized icons.

## Configuration

**Environment:**
- Configured via `.env.local` for local development.
- Required vars: `NEXT_PUBLIC_FIREBASE_API_KEY`, `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`, etc. (See `src/lib/firebase.config.ts`)

**Build:**
- `next.config.js` (standard Next.js)
- `tsconfig.json` (TypeScript configuration)
- `netlify.toml` (Deployment configuration for Netlify)

## Platform Requirements

**Development:**
- Node.js 18.17.0 or later.

**Production:**
- Optimized for deployment on Vercel or Netlify.

---

*Stack analysis: 2026-04-21*
