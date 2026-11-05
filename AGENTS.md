<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.
Always use shadcn/ui components for UI development.
 Work only on the specific file(s) explicitly mentioned by the user.
<!-- END:nextjs-agent-rules -->

# HireLoop - AI Agent Guidelines & Project Specification

## 🚨 Core Rules (Strict Directives)
1. **Scope Constraint**: Work **ONLY** on the specific file(s) explicitly mentioned or requested by the user. Do not modify, create, or delete unrelated files unless specifically instructed.
2. **UI Library**: Always use **shadcn/ui** components for any UI development. Do not write custom UI primitives when an existing shadcn component can be used or extended.
3. **Type Safety**: Strictly adhere to TypeScript best practices. Avoid `any` types. Ensure `npm run typecheck` passes cleanly.
4. **Preserve Integrity**: Preserve existing comments, docstrings, and project configurations unless explicitly asked to modify them.

---

## 🛠 Tech Stack
- **Framework**: Next.js 16 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS v4, `tw-animate-css`
- **UI Components**: shadcn/ui (`@base-ui/react`, `@shadcn/react`, `cmdk`, `recharts`, `lucide-react`)
- **Theming**: `next-themes` (Dark/Light mode support via `ThemeProvider`)
- **Authentication**: Better Auth (`better-auth`, `@better-auth/mongo-adapter`)
- **Database**: MongoDB (`mongodb` native driver)

---

## 📁 Project Structure
```text
hireloop/
├── app/
│   ├── api/auth/[...all]/route.ts  # Better Auth API route handler
│   ├── favicon.ico
│   ├── globals.css                 # Tailwind v4 theme & CSS variables
│   ├── layout.tsx                  # Root layout with fonts & ThemeProvider
│   └── page.tsx                    # Landing / Home page
├── components/
│   ├── shared/                     # Reusable app-level components (Navbar, Footer, etc.)
│   ├── ui/                         # shadcn/ui component library
│   └── theme-provider.tsx          # Next-themes provider wrapper
├── hooks/                          # Custom React hooks (e.g., use-mobile.ts)
├── lib/
│   ├── auth.ts                     # Better Auth server configuration
│   ├── auth-client.ts              # Better Auth client configuration
│   └── utils.ts                    # Class name merging utility (cn)
├── public/                         # Static assets
├── components.json                 # shadcn configuration
├── package.json                    # Dependencies and scripts
└── tsconfig.json                   # TypeScript configuration
```

---

## 🚀 Available Scripts
- `npm run dev`: Start Next.js local development server (`http://localhost:3000`)
- `npm run build`: Build production output
- `npm run start`: Start production server
- `npm run typecheck`: Run TypeScript compiler type checking (`tsc --noEmit`)
- `npm run lint`: Run ESLint checks
- `npm run format`: Format TypeScript and TSX files with Prettier

---

## 🧩 Development Conventions
- **Component Placement**:
  - Base UI components belong in `components/ui/`.
  - Reusable layout & global sections belong in `components/shared/` (e.g. `Navbar.tsx`).
  - Feature-specific components belong in `components/<feature>/` or colocated within `app/`.
- **Client vs. Server Components**: Default to React Server Components. Use `'use client'` only when state, event handlers, browser APIs, or client hooks are required.
- **Styling**:
  - Use Tailwind CSS utility classes.
  - Merge classes using the `cn(...)` utility from `@/lib/utils`.
- **Icons**: Use icons exclusively from `lucide-react`.
- **Authentication**:
  - Server-side session checks: use `auth.api.getSession({ headers })` from `@/lib/auth`.
  - Client-side auth state and actions: use `authClient` from `@/lib/auth-client`.
