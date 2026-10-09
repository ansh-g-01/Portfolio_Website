# Ansh Gandhi · Portfolio

My personal portfolio: React, TypeScript and Three.js (via React Three Fiber), built with Vite.

The hero is an animated illustration of the AI gateway I work on: one core routing requests out to many model-provider nodes and responses back.

## Run it

```bash
npm install
npm run dev
```

## Structure

- `src/data.ts`: all the site's text and links
- `src/components/Sections.tsx`: the page sections
- `src/components/GatewayScene.tsx`: the 3D gateway scene
- `src/styles.css`: all styles

## Deploy

It's a static site. `npm run build` outputs to `dist/`, which any static host (Vercel, Netlify, Cloudflare Pages) can serve.
