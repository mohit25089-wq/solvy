# Solvy — production-oriented starter

This is the next step from the visual prototype: a real Next.js application with:
- Supabase email/password authentication
- Postgres persistence + Row Level Security
- Server-side OpenAI Responses API integration for AI planning
- AI proof review endpoint
- Focus timer / Commit Mode
- Browser Web Serial integration for an ESP32 Focus Buddy
- ESP32 starter firmware and a simple serial protocol

## 1. Install

```bash
npm install
cp .env.example .env.local
```

Fill in:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `OPENAI_API_KEY`
- optionally `OPENAI_MODEL`

The OpenAI key is server-only. Do not put it in a `NEXT_PUBLIC_*` variable.

## 2. Create the database

Create a Supabase project, then paste `supabase/schema.sql` into the Supabase SQL Editor and run it.

Then start:

```bash
npm run dev
```

Open http://localhost:3000 and create an account.

## 3. AI

`POST /api/plan` calls the OpenAI Responses API and asks for a JSON action plan. It stores the resulting plan in `goals`.

`POST /api/review` sends proof notes to the model and stores the review in `proofs`.

The proof flow is intentionally conservative: a filename + text note is not treated as visual proof. To make photo verification production-grade, upload the actual image to Supabase Storage and pass a signed image URL to the AI review endpoint.

## 4. Hardware

The browser hardware panel uses Web Serial on supported Chromium browsers.

1. Flash `hardware/solvy_focus_buddy.ino` to an ESP32.
2. Wire the three buttons to the pins defined in the sketch.
3. Connect the ESP32 over USB.
4. Open Solvy → Hardware → Connect USB device.
5. The browser and ESP32 exchange newline-delimited commands at 115200 baud.

For a polished physical product, move from USB Serial to BLE for phone-first connectivity, and add device pairing, firmware versioning, encrypted device identity, and offline event buffering.

## 5. Production hardening still needed

- Add proper proof-file upload UI and signed URLs.
- Add rate limiting / abuse controls around AI routes.
- Add AI cost budgets and request logging.
- Add background job processing for larger evidence reviews.
- Add task creation from generated plans instead of only storing the goal.
- Add device event persistence and reconnect handling.
- Add real OS distraction blocking; a normal browser tab cannot reliably block phone notifications/apps.
- Add tests, observability, error boundaries, and deployment configuration.

## Architecture

Next.js App Router
→ Supabase Auth / Postgres / Storage
→ `/api/plan` → OpenAI Responses API
→ `/api/review` → OpenAI Responses API
→ Web Serial → ESP32 Focus Buddy

The app uses Supabase's current SSR pattern with `@supabase/ssr` and a Next.js `proxy.ts` for session refresh.
