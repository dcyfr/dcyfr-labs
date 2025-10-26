# Next.js Developer Blog & Portfolio

A modern developer blog and portfolio built with Next.js (App Router), TypeScript, Tailwind CSS v4, and shadcn/ui. Features an MDX-powered blog, GitHub integration, Redis-backed view counts, and comprehensive security features.

Developing with an AI assistant? See `agents.md` for the AI contributor guide (kept in sync with `.github/copilot-instructions.md`).

## Tech
- Next.js 15 (App Router) + React 19
- TypeScript, ESLint
- Tailwind CSS v4
- shadcn/ui (Radix + CVA)
- next-themes, sonner
- Inngest (background jobs)
- Redis (caching & analytics)
- Resend (email)
- Vercel Analytics & Speed Insights

## Development

```sh
npm install
npm run dev
```

Then open http://localhost:3000.

### HTTPS Development (Safari on macOS)

Safari on macOS Tahoe and newer versions have strict TLS requirements. If you encounter TLS errors in Safari, use the HTTPS development server:

```sh
npm run dev:https
```

This will serve the site over HTTPS at https://localhost:3000 using locally-trusted certificates (via mkcert).

**First-time setup**: The certificates are already generated. If you need to regenerate them, see `certs/README.md`.

## Build & Start

```sh
npm run build
npm start
```

## Project Structure
- `src/app` — App Router pages and API routes
- `src/components` — UI components (shadcn/ui + custom)
- `src/data` — Static content/data
- `src/lib` — Utilities

## Customization
- Update site copy in `src/app/page.tsx`, `about`, `projects`, `contact`.
- Add/edit projects in `src/data/projects.ts`.
- Tweak theme tokens in `src/app/globals.css`.

## SEO
- Edit `metadata` in `src/app/layout.tsx`.
- `src/app/sitemap.ts` and `src/app/robots.ts` are generated routes.

## Domain & Deployment
- Point your domain to your hosting provider (e.g., Vercel).
- On Vercel: import this repo, set production branch, add domain in Project Settings.
- DNS: add A/AAAA or CNAME as directed by your host.

### Vercel Analytics & Speed Insights
- Already wired in `src/app/layout.tsx` via `<Analytics />` and `<SpeedInsights />`.
- Works automatically on Vercel deployments; no extra config required.
- Disable or relocate only if requested.

### Vercel project config
- `vercel.json` provides sensible defaults for caching static assets and adds basic security headers.
- You can extend headers or rewrites as needed; Next.js routing remains managed by the App Router.

## Contact Form & Background Jobs
- Powered by **Inngest** for reliable background job processing
- Contact form submissions processed asynchronously with automatic retries
- Sends notification email to site owner + confirmation email to submitter
- API response time: < 100ms (vs 1-2s synchronous)
- **Dev UI**: http://localhost:3000/api/inngest (view all functions, test, monitor)
- **Setup**: Add `RESEND_API_KEY` for email delivery
- **Documentation**: See `/docs/features/inngest-integration.md`

### Other Background Jobs
- **GitHub data refresh**: Scheduled every 5 minutes (keeps heatmap cache fresh)
- **Blog analytics**: View tracking, trending calculations, milestone detection
- **Daily summaries**: Automated analytics reports (midnight UTC)
- All jobs visible and testable in Inngest Dev UI

## Blog View Counts & Analytics
- Real-time view tracking powered by Redis and Inngest
- Each post view tracked with daily statistics
- Milestone detection (100, 1K, 10K, 50K, 100K views)
- Trending post calculations (hourly)
- Set `REDIS_URL` in environment variables to enable
- For local work, pull with `vercel env pull .env.development.local`

## GitHub Contributions
- The GitHub heatmap component fetches real contribution data via `/api/github-contributions`.
- **Optional**: Set `GITHUB_TOKEN` in `.env.local` to increase rate limits (60 → 5,000 req/hour).
  - Create token at: https://github.com/settings/tokens (no scopes needed)
  - See `.env.example` for setup instructions
- Without a token, the API uses GitHub's public GraphQL API with basic rate limits.
- Falls back to sample data if the API is unavailable.

## License
MIT
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
