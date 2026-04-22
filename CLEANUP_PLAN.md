# CampusCruz Frontend — 7-Track Cleanup Plan

> **Scope:** `campuscruz-FE` only. Planning only — no code changes.
> **Approach:** Each track inspects the code, produces a critical assessment, ranks findings by
> confidence, and lists the checks to run before and after implementation.

---

## How to Use This Plan

**Confidence levels**

| Level | Meaning |
|---|---|
| 🟢 High | Safe to act on immediately — evidence is conclusive, risk of regression is low |
| 🟡 Medium | Proceed with care — verify manually before touching, test coverage needed |
| 🔴 Low / Hold | Do not act until more context is available or a test harness exists |

**Checks to run before starting any track**

```bash
npm install
npx eslint . --report-unused-disable-directives --max-warnings 0   # 1 existing warning today
npm run build                                                        # Vite build must stay green
```

---

## Track 1 — Deduplication

### Critical Assessment

The codebase is small (~30 files) but already shows copy-paste debt in four distinct areas.
The most damaging is the ride-card duplication: `RideCard.jsx` exists as a general-purpose
component but `FindRide.jsx` completely ignores it and reimplements the same card inline.
That means any future style or data-shape change must be applied in two places.

The geolocation helper is another pure copy-paste: the identical twelve-line block appears in
both `FindRide.jsx` and `OfferRide.jsx` with no differences whatsoever.

The footer copyright string is cosmetically duplicated across three files, which is minor but
worth a shared constant.

### Ranked Findings

| # | Finding | Files | Confidence | Risk |
|---|---|---|---|---|
| 1 | `FindRide.jsx` inlines a full ride card (Avatar, Rating, LocationOn ×2, CalendarMonth, AccessTime, Person, AttachMoney) that is **identical in intent** to `RideCard.jsx` | `FindRide.jsx` ↔ `RideCard.jsx` | 🟢 High | Low — `RideCard` already accepts a `variant` prop; just use it |
| 2 | `handleSetCurrentLocation` is copied verbatim into both `FindRide.jsx` and `OfferRide.jsx` | `FindRide.jsx`, `OfferRide.jsx` | 🟢 High | Low — extract to `utils/geolocation.js` |
| 3 | Footer copyright string `© {new Date().getFullYear()} CampusCruz…` appears in `AuthLayout.jsx`, `MainLayout.jsx`, and `Home.jsx` | Three layout files | 🟢 High | Low — one shared constant or component |
| 4 | `renderRideStatus()` in `Dashboard.jsx` and the `getStatusColor()` helper in `RideCard.jsx` both switch on ride status to produce MUI chip props | `Dashboard.jsx`, `RideCard.jsx` | 🟡 Medium | Low, but the two functions serve slightly different shapes (`Chip` colour vs `Chip` with label) — unify only if intent is truly the same |
| 5 | Notification fetch logic in `Navbar.jsx` (raw axios, polling, cache-bust) vs `notificationService.js` (same endpoint, same cache-bust) | `Navbar.jsx`, `utils/notificationService.js` | 🟡 Medium | Hold until dead-code track confirms `notificationService` is fully unused elsewhere |

### Checks After Implementation

```bash
npm run build
npx eslint . --report-unused-disable-directives --max-warnings 0
# Manual: open /find-ride and /offer-ride in browser, confirm cards render and GPS works
```

---

## Track 2 — Type / Constant Consolidation

### Critical Assessment

The project is plain JavaScript/JSX with no TypeScript, so there are no traditional "types" to
drift. However, the codebase **does** have a well-defined constants module (`config.jsx`) that
exports `RIDE_STATUS` and `PASSENGER_STATUS`. The problem is that half the files import and use
these constants while the other half use raw string literals, introducing a silent risk: if a
status string changes in the API or `config.jsx`, the files still using raw strings will silently
break.

`CAMPUS_DESTINATIONS` and `API_URL` are imported from `config.jsx` consistently — no issue there.

### Ranked Findings

| # | Finding | Files | Confidence | Risk |
|---|---|---|---|---|
| 1 | `Dashboard.jsx` uses raw strings `'completed'`, `'cancelled'`, `'scheduled'`, `'in-progress'` inside `forEach` and `renderRideStatus` instead of importing `RIDE_STATUS` | `Dashboard.jsx` | 🟢 High | Low — mechanical replacement, behaviour unchanged |
| 2 | `FindRide.jsx` passes `ride.status` to API params but never validates against `RIDE_STATUS` enum | `FindRide.jsx` | 🟡 Medium | Low — no immediate bug, but drift risk |
| 3 | `Navbar.jsx` filters notifications using the raw string `'scheduled'` (e.g. checking ride status on notifications) without importing `RIDE_STATUS` | `Navbar.jsx` | 🟡 Medium | Low — same drift risk as above |
| 4 | `notificationService.js` `markNotificationAsRead` returns a plain `boolean`. If a shared notification-state type ever needs additional fields (e.g. `updatedAt`) there is no single definition to update | `utils/notificationService.js` | 🔴 Low | Hold — JS codebase; worth noting if a TS migration ever starts |

### Checks After Implementation

```bash
npx eslint . --report-unused-disable-directives --max-warnings 0
# Grep that no raw status strings remain outside config.jsx:
grep -rn "'scheduled'\|'in-progress'\|'completed'\|'cancelled'\|'pending'\|'accepted'\|'rejected'" src/ --include="*.jsx" --include="*.js"
```

---

## Track 3 — Dead Code Removal

### Critical Assessment

Static analysis confirms five utility files and one component are completely orphaned — they
have **zero imports anywhere in the codebase**. This is the highest-priority track because dead
files bloat the bundle (or at minimum confuse contributors) and two of them contain broken
placeholder logic that would crash the app if ever called.

> **Verification method used:** `grep -rn "<module>" src/` on each suspected file — zero matches
> confirmed dead status.

### Ranked Findings

| # | File | Reason Dead | Confidence | Notes |
|---|---|---|---|---|
| 1 | `src/utils/api.js` | Never imported. `apiClient.js` is the live client used by Dashboard, OfferRide, Profile | 🟢 High | Delete. `apiClient.js` supersedes it with a 401 redirect interceptor |
| 2 | `src/utils/notificationService.js` | Never imported. Navbar re-implements the same fetch inline with raw axios | 🟢 High | Delete. If Navbar is ever refactored, use `apiClient` directly |
| 3 | `src/utils/googleMapsLoader.jsx` | Never imported anywhere in the app | 🟢 High | Delete. Google Maps is loaded via `@react-google-maps/api` package instead |
| 4 | `src/utils/errorHandler.jsx` | Never imported. Contains `getSafeErrorMessage` and `logError` helpers that nobody calls | 🟢 High | Delete |
| 5 | `src/components/RideCard.jsx` | Never imported. `FindRide.jsx` inlines its own card instead of using this | 🟢 High | **Before deleting:** evaluate Track 1 — the correct fix may be to *use* this component instead. Delete only if Track 1 decides to replace it with something new. |
| 6 | `src/assets/react.svg` | Default Vite template artifact; no import found in any source file | 🟢 High | Delete |
| 7 | `src/components/Debug.jsx` + `/debug` route in `App.jsx` | Development debugging tool registered as a public, unauthenticated production route | 🟡 Medium | Remove the route from `App.jsx` and the import; consider keeping the file locally if useful during development (add to `.gitignore`) |

### Checks Before Removing Each File

```bash
# Confirm zero imports before deleting (example for api.js):
grep -rn "utils/api" src/
grep -rn "notificationService" src/
grep -rn "googleMapsLoader" src/
grep -rn "errorHandler" src/
grep -rn "RideCard" src/
grep -rn "react\.svg" src/
grep -rn "Debug" src/
```

### Checks After Removal

```bash
npm run build     # Must complete with no missing-module errors
npx eslint . --report-unused-disable-directives --max-warnings 0
```

---

## Track 4 — Circular Dependencies

### Critical Assessment

The dependency graph is simple and unidirectional:

```
config.jsx
  └─► utils/api.js (dead), utils/apiClient.js, utils/notificationService.js (dead)
        └─► context/AuthContext.jsx (uses axios directly, not apiClient)
              └─► components/ (Navbar, PrivateRoute, AdminRoute, RideCard)
                    └─► pages/
```

No circular imports were found. The only structural smell is that `AuthContext.jsx` bypasses
`apiClient.js` and imports `axios` directly, making it maintain its own interceptor setup
(`axios.defaults`) in parallel with `apiClient`'s interceptors. This is not a circular dep
but is an inconsistency that creates two separate auth propagation paths.

### Ranked Findings

| # | Finding | Confidence | Risk |
|---|---|---|---|
| 1 | No circular imports found | 🟢 High | — |
| 2 | `AuthContext.jsx` uses `axios` global defaults as a side-effect to propagate auth headers; `apiClient.js` uses its own interceptor for the same purpose — two parallel auth paths | 🟡 Medium | Low for now; could cause bugs if `apiClient` and raw `axios` behave differently on token expiry |
| 3 | `Navbar.jsx` uses raw `axios` instead of `apiClient` for notification fetching, bypassing the 401 redirect interceptor | 🟡 Medium | Low — the Navbar does handle 401 manually, but the handling is weaker (no token/cookie clearing) |

### Checks to Run

```bash
npx madge --circular --extensions js,jsx src/
# Expected: "No circular dependency found"
```

---

## Track 5 — Type Strengthening

### Critical Assessment

This is a plain JavaScript project with no TypeScript configuration. There are no `any` or
`unknown` types to replace. However, the codebase has no PropTypes declarations anywhere, which
means components accept arbitrary props silently — prop renames or shape changes cause no
compile-time or runtime warning. This is the closest equivalent to "weak types" in a JS/JSX
project.

The most impactful gap is `RideCard.jsx` which has a documented `variant` prop used for
conditional rendering but no PropTypes validation. If a caller passes an invalid variant string
it silently renders the wrong layout.

### Ranked Findings

| # | Finding | Files | Confidence | Risk |
|---|---|---|---|---|
| 1 | `RideCard.jsx` accepts `ride` (complex object) and `variant` ('default' \| other) with no PropTypes — invalid props are silently accepted | `RideCard.jsx` | 🟡 Medium | Low — add `PropTypes.shape({...})` for `ride` and `PropTypes.oneOf` for `variant` |
| 2 | `PrivateRoute`, `AdminRoute`, `AuthLayout`, `MainLayout` accept `children` implicitly via `Outlet` — not a prop-shape risk, but no docs | Multiple | 🔴 Low | Cosmetic; these components have no explicit props |
| 3 | `AuthContext.jsx` methods (`login`, `register`, `updateProfile`) return plain objects `{ success, error }` with no consistent shape enforced | `AuthContext.jsx` | 🟡 Medium | Low — consumers must null-check defensively; a shared JSDoc typedef would help |
| 4 | **Future consideration:** If TypeScript is ever added, `config.jsx` exports are good candidates for `const` enums or `as const` objects | `config.jsx` | 🔴 Low | No action needed now |

### Checks to Run

```bash
# After adding PropTypes:
npx eslint . --report-unused-disable-directives --max-warnings 0
# PropTypes violations will surface as react/prop-types ESLint warnings
```

---

## Track 6 — Error Handling Cleanup

### Critical Assessment

The error handling is generally reasonable — the pattern of catching errors, logging them, and
returning a structured `{ success, error }` object is consistent. There are two real problems:

1. **Silent swallowing with misleading return values:** `notificationService.js`
   `markNotificationAsRead` catches the error, logs it, and returns `false` — the caller
   cannot distinguish "server said false" from "a network error happened."

2. **AI-generated crash path in production:** `main.jsx`'s `ErrorBoundary` renders a
   "Try Test Component" button that navigates to `/test` — a route that does not exist in
   `App.jsx`. Clicking it renders nothing. Worse, `main.jsx` references `TestComponent` which
   is never defined — if the error boundary ever fires and the isTestRoute branch is hit, it
   would throw a second `ReferenceError`.

3. **Debug `console.log` in production error paths:** Several files leave `console.log` statements
   that were clearly development-phase diagnostics (marked `// Debug log` in comments).

### Ranked Findings

| # | Finding | File | Confidence | Risk |
|---|---|---|---|---|
| 1 | `ErrorBoundary` in `main.jsx` has a "Try Test Component" button pointing to `/test` (undefined route) and references `TestComponent` (undefined variable) | `main.jsx` | 🟢 High | Medium — ErrorBoundary only fires when app crashes; but on crash the fallback UI itself would be broken |
| 2 | `console.log('Updating profile with data:', cleanedData)` leaks user PII to the browser console in production | `AuthContext.jsx:179` | 🟢 High | Medium — privacy concern |
| 3 | `console.log('Submitting profile update:', updatedValues)` — same issue | `Profile.jsx:72` | 🟢 High | Medium — privacy concern |
| 4 | `console.log('Root element found:', !!root)` and `console.log('React render initiated')` — diagnostic noise in production | `main.jsx:44,57` | 🟢 High | Low — cosmetic but unprofessional |
| 5 | `notificationService.js` `markNotificationAsRead` swallows error and returns `false` — caller cannot distinguish failure from explicit false | `utils/notificationService.js` | 🟡 Medium | Low right now since the service is dead (Track 3); becomes real if the service is resurrected |
| 6 | `AuthLayout.jsx` logout uses `setTimeout(() => window.location.reload(), 100)` — fragile timing; reload may fire before async logout resolves | `AuthLayout.jsx` | 🟡 Medium | Low — likely works in practice, but proper fix is `await logout(); navigate('/login')` |
| 7 | `Login.jsx` has its own `catch` block that duplicates the error extraction logic already inside `AuthContext.login()` — double handling | `Login.jsx` | 🟡 Medium | Low — no harm today but error messages could diverge |

### Checks After Implementation

```bash
npx eslint . --report-unused-disable-directives --max-warnings 0
npm run build
# Manual: trigger the ErrorBoundary by temporarily throwing inside App, confirm fallback renders cleanly
```

---

## Track 7 — Deprecated Code and AI Slop Cleanup

### Critical Assessment

Several files contain clear AI generation artifacts: file-creation instructions left as comments,
undefined placeholder references, and stub functions with "add your logic here" bodies. Two of
these are actively harmful (the `TestComponent` reference causes a `ReferenceError`; the Windows
absolute path comments expose the developer's machine structure). The rest are low-harm but
unprofessional and confusing to new contributors.

### Ranked Findings

| # | Finding | File:Line | Confidence | Risk |
|---|---|---|---|---|
| 1 | `// Create this file: c:\Users\ASUS\Desktop\...` — absolute Windows path, author's machine, AI generation artifact | `utils/errorHandler.jsx:1` | 🟢 High | Low — delete the comment; file already exists |
| 2 | Same Windows path comment | `utils/googleMapsLoader.jsx:1` | 🟢 High | Low — delete the comment |
| 3 | `TestComponent` is referenced in `main.jsx` but never defined anywhere; `isTestRoute` check at line 47–53 is a leftover development stub | `main.jsx:47–53` | 🟢 High | Medium — currently harmless because the `/test` route is never served by the router, but a `ReferenceError` is waiting |
| 4 | `formatNotificationMessage` in `notificationService.js`: body is `// Add your custom formatting logic here` followed by `return notification.message` — a stub that was never implemented | `utils/notificationService.js` | 🟢 High | Low — file is dead (Track 3), but the stub confirms it was never properly built |
| 5 | `console.log('Google Maps API loaded successfully')` — dev log baked into a utility | `utils/googleMapsLoader.jsx:28` | 🟢 High | Low |
| 6 | `console.log('Root element found:', !!root)` and `console.log('React render initiated')` — narrates execution instead of explaining intent | `main.jsx:44,57` | 🟢 High | Low |
| 7 | `console.log('Updating profile with data:', cleanedData); // Debug log` — comment explicitly labels it a debug log that was never removed | `AuthContext.jsx:179` | 🟢 High | Medium (PII) |
| 8 | `console.log('Submitting profile update:', updatedValues); // Debug log` — same | `Profile.jsx:72` | 🟢 High | Medium (PII) |
| 9 | `button onClick={() => window.location.href = '/test'}` in ErrorBoundary — broken recovery action pointing to non-existent route | `main.jsx:31` | 🟢 High | Low cosmetic (ErrorBoundary path) |
| 10 | `ErrorBoundary` class component in `main.jsx` could be replaced with React's built-in error handling once a proper error reporting destination (Sentry, etc.) is chosen | `main.jsx` | 🔴 Low | Hold — keep class ErrorBoundary for now; remove only after a real error reporting solution is in place |

### Checks After Implementation

```bash
npm run build    # Must succeed with no ReferenceErrors
npx eslint . --report-unused-disable-directives --max-warnings 0
grep -rn "console\.log" src/ --include="*.jsx" --include="*.js"
# Expected: only console.error calls remain, all inside catch blocks or dev-mode guards
```

---

## Implementation Order Recommendation

Run the tracks in this sequence to avoid chasing moving targets:

1. **Track 7 first** — remove AI slop and dead comments (cleanest, no logic changes)
2. **Track 3 second** — remove dead files (`api.js`, `notificationService.js`,
   `googleMapsLoader.jsx`, `errorHandler.jsx`, `react.svg`). Decide on `RideCard.jsx` only
   after Track 1 decision.
3. **Track 6 third** — fix the `main.jsx` ErrorBoundary and remove `console.log` PII leaks
4. **Track 2 fourth** — replace raw status strings with `RIDE_STATUS` / `PASSENGER_STATUS` constants
5. **Track 1 fifth** — deduplicate ride-card rendering and geolocation handler
6. **Track 4 sixth** — run `madge`, confirm no cycles; address the dual-auth-path smell
7. **Track 5 last** — add PropTypes (least urgent, most verbose)

---

## Full Pre/Post Check Suite

```bash
# Pre-implementation baseline
npm install
npx eslint . --report-unused-disable-directives --max-warnings 0
npm run build

# After all tracks complete
npx eslint . --report-unused-disable-directives --max-warnings 0
npm run build
npx madge --circular --extensions js,jsx src/
grep -rn "console\.log" src/ --include="*.jsx" --include="*.js"
grep -rn "'scheduled'\|'in-progress'\|'completed'\|'cancelled'" src/ --include="*.jsx" --include="*.js"
# ^ should only match config.jsx after Track 2
```
