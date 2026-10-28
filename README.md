# Thousand Sunny — Elbaph Adventure

A three-scene cinematic One Piece landing page built with Next.js, TypeScript, GSAP, and ScrollTrigger. Every hero uses a scroll-controlled WebP image sequence; the experience does not use video.

> **Image sets:** `op1/`, `op2/`, and `op3/` contain 180, 240, and 214 source PNG frames. Optimized WebP copies are served from matching folders under `public/assets/`; the original PNGs are kept unchanged.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). To verify a production build:

```bash
npm run build
npm start
```

## Experience

- Three separate, naturally scrolling page sections use every frame in the Elbaph (180), Thousand Sunny (240), and Luffy (214) image sequences. Each image sequence finishes in its own sticky hero before normal scrolling continues to the next section. The third source set is in `op3/`.
- An animated preloader, scroll-scrubbed image sequences, text reveals, layered background overlays, and parallax bring each scene to life.
- Google Fonts are used throughout: Rye for primary titles, Bangers for secondary titles, and Cinzel for body copy.
- The top navigation, scene navigator, progress bar, scroll cues, and CTA links are interactive.
- The mobile menu and scene layout adapt to smaller viewports.
- Lenis provides smooth scrolling; motion effects respect `prefers-reduced-motion`.

## Add or replace image sequences

Name source frames consecutively as `ezgif-frame-001.png`, `ezgif-frame-002.png`, and so on, and place the source set in a folder such as `op4/`. Convert the sequence to WebP in `public/assets/op4/` using the same frame names with a `.webp` extension. Then add the frame folder and frame count to the scene entry near the top of `components/OnePieceExperience.tsx`:

```ts
image: "/assets/op3/ezgif-frame-001.webp",
frameCount: 180,
```

The source PNGs can be converted with Pillow (`Image.save(..., "WEBP", quality=82, method=6)`). The page loads frames on demand and retains a small in-memory frame cache. No remote image or video URLs are used.

## Main files

- `app/page.tsx` — page entry point.
- `components/OnePieceExperience.tsx` — scene content, navigation indicators, GSAP timelines, and image paths.
- `components/Navbar.tsx` — responsive top navigation.
- `app/globals.css` — cinematic theme and responsive layout.
- `public/assets/` — current local image assets.
