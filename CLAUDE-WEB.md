# CT Battery Solutions — Web

Next.js 16 (static export) + React 19 + Tailwind 4. The customer + admin frontend for the CT
Battery Solutions platform. Deployed to **Netlify**; talks to the backend API over HTTP.

> Read `AGENTS.md` before touching Next.js code — this repo pins a specific Next version whose
> APIs/conventions may differ from what you expect.

## Structure
```
src/app/          # routes
  ct/             # consumer site: landing, apply, about, contact, partners, privacy, terms
  portal/         # admin portal (client-side login stub + applications dashboard)
  page.tsx        # root → redirects to /ct; C&I engine components live under components/
src/components/    # AddressSearch, MapView, analysis cards (C&I engine)
src/lib/api.ts     # API client — reads NEXT_PUBLIC_API_BASE_URL, unwraps { success, data }
```
Just updated
## Dev
```bash
npm install
npm run dev        # next dev -p 3001
npm run build      # static export → out/
```
Set `NEXT_PUBLIC_API_BASE_URL=http://localhost:3000` in `.env.local` (see `.env.local.example`)
to point at a local backend. `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` powers address autocomplete.

## Backend integration
- All API calls go through `src/lib/api.ts`. In production leave `NEXT_PUBLIC_API_BASE_URL`
  blank so the app calls relative `/api/*`, which Netlify proxies to the backend droplet (see the
  redirect in `netlify.toml`). Same-origin → no browser CORS.
- The backend lives in its own repo; this repo only depends on the HTTP contract.

## Deploy (Netlify)
`netlify.toml` builds `npm run build` and publishes `out/`. On the Netlify site set
`NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`, and uncomment the `/api/*` redirect once the API host is live.

## Notes
- Static export: no SSR/API routes here — dynamic behavior is client-side + the external API.
- Mobile-friendly: pages use fluid `clamp()` type + breakpoints; keep new UI responsive.
