# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**HajarShop / Smart Boutique** — A full-stack e-commerce admin & storefront app for a Moroccan fashion boutique. Built with React 19 + TypeScript + Tailwind CSS v4, backed by an Express server that proxies Gemini AI calls.

## Commands

```bash
# Development (starts Express + Vite middleware on port 3000)
npm run dev

# Type-check (no build output — this is the lint step)
npm run lint

# Production build (Vite frontend + esbuild for server.ts → dist/server.cjs)
npm run build

# Run production build
npm start
```

No test suite is configured. `npm run lint` runs `tsc --noEmit` — keep it passing.

## Environment

Copy `.env.example` to `.env.local` and set:

- `GEMINI_API_KEY` — required for the `/api/ai/generate-post` endpoint. Without it the server falls back to a deterministic template response (no crash).

## Architecture

### Server (`server.ts`)
Express server that:
1. Serves Vite dev middleware in development, static `dist/` in production.
2. Exposes two API routes:
   - `POST /api/ai/generate-post` — calls **Gemini 3.6 Flash** with a French-language marketing prompt and returns `{ title, content, cta, hashtags, variants }`.
   - `POST /api/trigger/run-jobs` — stub endpoint (simulates Trigger.dev job execution, always returns success).

### Client State (`src/services/store.ts`)
All app state lives in **localStorage** — there is no database. The store module exports plain functions (`getProducts`, `saveProduct`, `deleteProduct`, etc.) that read/write to versioned localStorage keys (`smart_boutique_*_v1`). Every write calls `notifyListeners()`, which triggers a re-render in all components using `useStore`.

**Key invariant:** `addInventoryMovement` mutates `stockQuantity` on the product directly in localStorage as a side-effect. `AJUSTEMENT` type sets the stock to the exact quantity value (not a delta).

### React Layer
- **`useStore` hook** (`src/hooks/useStore.ts`) — subscribes to store changes and exposes all collections plus derived values (`lowStockProducts`, `outOfStockProducts`, `totalInventoryValue`). Every admin view imports this hook; do not read from the store module directly in components.
- **`App.tsx`** — top-level router. Two views: `public` (PublicStorefront) and `admin` (sidebar + tab panel). Modal open states for "New Product" and "Stock Movement" are lifted here and passed down as props.
- Admin tabs: `dashboard`, `products`, `categories`, `inventory`, `ai-content`, `social-media`, `calendar`, `settings`.

### Data Model (`src/types.ts`)
Core entities: `Product`, `Category`, `InventoryMovement`, `SocialPost`, `SocialAccount`, `StoreSettings`, `User`.

- Products and categories use auto-generated slugs (NFD-normalized, hyphenated).
- `MovementType`: `'ENTRÉE' | 'SORTIE' | 'AJUSTEMENT'` — French labels used as-is in storage and UI.
- `PostStyle` / `PostPlatform` are passed directly into the Gemini prompt.
- `UserRole`: `'ADMIN' | 'MANAGER'` — controls UI capabilities, toggled via `setUserRole()` in Settings.

### AI Content Generation
`AiContentGeneratorView` calls `POST /api/ai/generate-post` with an `AiGenerationRequest` and renders the `AiGenerationResponse`. The prompt instructs Gemini to reply with `application/json` (`responseMimeType`). If no API key is present, the server returns a French-language fallback object — components should handle both paths identically.

### Styling
Tailwind CSS v4 via `@tailwindcss/vite` plugin. Dark theme only (`bg-slate-950` root). No `tailwind.config.js` — configuration is done via CSS (`src/index.css`) and the Vite plugin.
