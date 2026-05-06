# ESI Glass — Entrance Systems, Inc.

Marketing website for [Entrance Systems, Inc.](https://www.esiglass.com/), a Southeastern Pennsylvania commercial glazing contractor specializing in custom glass facades, curtain walls, storefronts, and architectural glass for institutional, educational, healthcare, and commercial buildings since 1983.

## Stack

- **Vite** + **React 18** + **TypeScript**
- **Tailwind CSS** for styling
- **shadcn/ui** for component primitives
- **React Router** for routing
- **React Hook Form** + **Zod** for the lead-qualifying form

## Local development

```bash
npm install
npm run dev          # http://localhost:8080
npm run build        # production build to dist/
npm run preview      # preview the production build
npm run lint
npm run test
```

## Project structure

```
src/
  components/        Site primitives (Navbar, Footer, SiteLayout) + shadcn/ui
  lib/site-config.ts Single source of truth for copy, contact info, services
  pages/             Home, Services, Work, About, Contact, NotFound
```

Update content in `src/lib/site-config.ts` rather than editing pages directly.

## Lead-qualifying contact form

The contact form (`src/pages/Contact.tsx`) is structured to filter the inbound pipeline toward ESI's actual market — institutional / commercial / large multi-family — and politely redirect single-family residential inquiries elsewhere.

Steps: Project type → Scope & scale → Timeline → Contact details.
