# SohCahToa Payout BDC — Frontend Assessment

A secure fintech transaction monitoring dashboard built with Next.js App Router, TypeScript, and Tailwind CSS.


## Getting Started
npm install
npm run dev

Visit `http://localhost:3000/login`

login credentials
Admin: `admin@sohcahtoa.com` / `admin123`
Analyst: `analyst@sohcahtoa.com` / `analyst123`

## Tech Stack
Next.js 15
TypeScript
Tailwind CSS v4 
Iconsax React (Icon library)

## Folder Structure
app/
├── api/
│   ├── auth/
│   │   ├── login/route.ts       # Authentication
│   │   └── refresh/route.ts     # Token refresh
│   └── transactions/
│       ├── route.ts           # Get transactions (paginated)
│       └── flag/route.ts       # Flag/unflag transaction
├── dashboard/
│   ├── layout.tsx            # Sidebar + main layout wrapper
│   └── page.tsx            # Dashboard home
└── login/
└── page.tsx                   # Login page
components/
├── sidebar.tsx           # Navigation sidebar
├── header.tsx              # Top header
├── balance-card.tsx       # FX balance + actions
├── card-panel.tsx            # Cards + transaction flows
└── transaction-table.tsx      # Transactions list + detail panel
lib/
├── types.ts                # All TypeScript types
└── mock-data.ts            # Simulated database
middleware.ts          # Route protection and token refresh


## Architecture Decisions

### Server vs Client Components
- All pages use "Server Components" by default, no JavaScript sent to browser, faster load
- Components with interactivity use "Client Components" via `"use client"`
- Examples:
   `dashboard/layout.tsx`  Server Component (just wraps children)
   `dashboard/page.tsx` Server Component (just composes layout)
   `components/transaction-table.tsx`  Client Component (useState, useEffect, click handlers)
   `components/balance-card.tsx`  Client Component (toggle balance visibility)
   `components/sidebar.tsx`  Client Component (usePathname for active state)

### Route Handlers
All API routes live inside `app/api/`  no external backend needed:
#### | Method |      Route       |           Purpose             |
    | POST | `/api/auth/login` | Authenticate user, set cookies |
    | POST | `/api/auth/refresh` | Issue new access token silently |
    | GET | `/api/transactions` | Paginated, filtered, sorted transactions |
    | PATCH | `/api/transactions/flag` | Flag or unflag a transaction |

All Route Handlers:
1) Use typed `NextRequest` and `NextResponse`
2) Validate input before processing
3) Return normalized error responses with correct HTTP status codes

### Caching Strategy
Transaction API uses `cache: "no-store"` in the client fetch call. This means:
1) Every request always fetches fresh data
2) No stale transaction data is ever shown
3) This is the correct strategy for a **real-time financial dashboard** where showing outdated balances or transaction states could mislead users or cause financial errors


## Security Implementation

### 5.1 XSS Protection
- All transaction data rendered via React's `{}` syntax which automatically escapes HTML
- `dangerouslySetInnerHTML` is never used anywhere in the codebase
- Proof: `txn_006` in mock data contains `<script>alert('xss')</script>` as recipient name — it renders as plain text, the script never executes
- Mitigation: React converts `<` to `&lt;` and `>` to `&gt;` before rendering

### 5.2 Session Handling
- Access token stored in `httpOnly` cookie with `maxAge: 120` (2 minutes) for demonstration
- Refresh token stored separately with longer `maxAge: 360`
- `expires_at` cookie tracks exact expiry timestamp
- On expiry: middleware detects it, calls `/api/auth/refresh` silently
- On refresh failure: both cookies deleted, user redirected to `/login`
- All in-flight navigation is blocked at middleware level before reaching any page

### 5.3 CSRF Mitigation Strategy
Cookies are protected against Cross-Site Request Forgery via:
- `sameSite: "strict"` cookie is only sent when the request originates from the same site. A malicious third-party site cannot trigger requests that include our cookies
- `httpOnly: true` JavaScript cannot read the cookie, preventing token theft via XSS
- `secure: true` in production — cookie only transmitted over HTTPS
No separate CSRF token is needed because `sameSite: "strict"` provides equivalent protection for this architecture.

### 5.4 Sensitive Data Handling
- Card numbers masked in UI: `•••• 7093`
- Access tokens and refresh tokens never logged to `console`
- Cookies are `httpOnly` never accessible via `document.cookie` in the browser
- No sensitive values exposed in client-side JavaScript bundles

### Token Refresh Race Conditions
- Token refresh is handled at the middleware level — Edge Runtime
- Only one refresh attempt is made per request
- If refresh fails, cookies are immediately deleted and the user is redirected
- Because middleware runs before any page or component loads, there is no possibility of multiple simultaneous refresh calls from the same navigation event



## Role Based Access Control
| Feature | Admin | Analyst |
|---|---|---|
| View transactions | ✅ | ✅ |
| View transaction detail | ✅ | ✅ |
| Flag transaction | ✅ | ❌ |
| Unflag transaction | ✅ | ❌ |

Implementation: `USER_ROLE` check in `transaction-table.tsx` hides the flag button entirely for non-admin users. The `/api/transactions/flag` route also validates the auth cookie server-side before processing.


## Middleware Limitations

Next.js middleware runs on the "Edge Runtime" which means:
- No access to Node.js APIs (`fs`, `crypto`, `path`, etc.)
- No direct database connections
- Limited to Web Standard APIs only
- Cannot use most npm packages that depend on Node.js internals

This is why token validation uses cookie presence and prefix checking rather than full cryptographic JWT verification. In production, JWT verification using the Web Crypto API would be the correct approach within Edge Runtime constraints.


## What I Would Add With More Time
- Full transaction search by recipient name
- Date range filtering
- Export transactions to CSV