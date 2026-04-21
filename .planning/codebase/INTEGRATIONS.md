# External Integrations

**Analysis Date:** 2026-04-21

## APIs & External Services

**Firebase:**
- Auth: Google Sign-In for user authentication.
- Firestore: Real-time NoSQL database for wallets and transactions.
  - SDK: `firebase/app`, `firebase/auth`, `firebase/firestore`.
  - Config: `src/lib/firebase.config.ts`.

## Data Storage

**Databases:**
- Google Firestore (NoSQL)
  - Connection: `db` initialized in `src/lib/firebase.config.ts`.
  - Client: Official Firebase Web SDK.

**File Storage:**
- Not detected (Local filesystem or cloud storage not currently used for user uploads).

**Caching:**
- Firestore's built-in offline persistence and internal SDK caching.

## Authentication & Identity

**Auth Provider:**
- Firebase Auth (Google Provider)
  - Implementation: `src/context/AuthContext.tsx`.
  - Flow: Uses `signInWithPopup` for desktop/mobile login.

## Monitoring & Observability

**Error Tracking:**
- Basic console logging in service layers (`src/services/walletService.ts`, `src/services/transactionService.ts`).

**Logs:**
- Browser console logs during development.

## CI/CD & Deployment

**Hosting:**
- Netlify (detected via `netlify.toml`).

**CI Pipeline:**
- Netlify's built-in CI/CD for GitHub/GitLab.

## Environment Configuration

**Required env vars:**
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

**Secrets location:**
- `.env.local` (Local)
- Netlify Environment Variables (Production)

## Webhooks & Callbacks

**Incoming:**
- None detected.

**Outgoing:**
- None detected.

---

*Integration audit: 2026-04-21*
