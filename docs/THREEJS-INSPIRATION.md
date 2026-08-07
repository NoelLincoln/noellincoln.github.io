# Three.js Inspiration Board

A curated board for bringing WebGL / 3D into the portfolio — the ideas, the
references, the stack, and the rules that keep it fast and accessible. Paired
with the working prototype on the `feat/hero-3d` branch.

For where this sits in the plan, see [`PROGRESS.md`](./PROGRESS.md).

---

## Where this fits the roadmap

The current focus (per `PROGRESS.md` → _Next 3 Actions_) is **deploy the Django
backend**, **Vercel env + redeploy**, and **SEO**. Those move the needle more
for a portfolio than eye-candy, so 3D is a **parallel visual-polish track** — it
should _not_ block those. Ship it timeboxed, behind the same performance
discipline as the rest of the site.

Think of it as **Phase 7 — visual polish**.

---

## The stack we're adding

| Package                                    | Why                                                                                                   |
| ------------------------------------------ | ----------------------------------------------------------------------------------------------------- |
| `three`                                    | The WebGL engine.                                                                                     |
| `@react-three/fiber`                       | React renderer for three — declarative `<mesh>`/`<Points>` instead of imperative scene code.          |
| `@react-three/drei`                        | Helpers: `Points`, `PointMaterial`, `Float`, `MeshDistortMaterial`, loaders, controls.                |
| _(optional)_ `@react-three/postprocessing` | Bloom / glow / depth-of-field if we want a richer look.                                               |
| _(optional)_ `maath`                       | Tiny math helpers (easing, random-in-sphere) — we hand-rolled this in the prototype to avoid the dep. |

> ⚠️ **Compatibility:** this app is **React 19.2 + Next 16**. You need the
> **`@react-three/fiber` v9 line** (v8 targets React 18) and a matching
> `@react-three/drei` v10. Installing `@latest` gets you there — just don't pin
> to an older major.
>
> **`three` is pinned to `0.182.0`** on purpose: three deprecated `THREE.Clock`
> in r183 and logs a console warning, but r3f 9.7 still constructs a `Clock`
> internally. `0.182.0` is the last release before that warning and satisfies
> both r3f (`>=0.156`) and drei (`>=0.159`). Note the pin lives in a **root
> `overrides`** block, not just `frontend/package.json`: r3f/drei peer-deps
> otherwise hoist the latest `three` at the repo root — the copy r3f actually
> loads — so a frontend-level dep alone doesn't win. Remove the override once r3f
> migrates to `THREE.Timer`.

**Install (you run this — at the repo root, it's an npm workspace):**

```bash
npm install three @react-three/fiber @react-three/drei --workspace=frontend
# add @types/three if TS complains about three's types
```

---

## What we already have that makes this easy

The 3D work reuses tools already in the project — no extra libraries for motion,
theming, or lazy-loading:

- **`framer-motion`** → `useReducedMotion()` for the accessibility fallback, and
  scroll-reveal orchestration around a canvas.
- **`next-themes`** → `useTheme()` to recolour scenes for light/dark (the
  prototype pulls the brand `--primary` per theme).
- **`next/dynamic`** → the `ssr: false` lazy-load pattern (the canvas is
  client-only; there's no `window` on the server). Mirrors the existing
  `next/script` Lottie load in `layout.tsx`.
- **Tailwind v4 tokens** (`globals.css`) → feed `--primary` / `--accent` into the
  scene so 3D colours track the brand automatically.
- **CI build gate** → catches any bundle/build regression the new deps introduce.

---

## Concept board

Ranked roughly by impact-for-effort. ★ = shipped in the prototype.

| Idea                         | What it is                                                                                                          | Effort   | Impact  |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------- | -------- | ------- |
| **★ Ambient particle hero**  | A slow-drifting point field behind the hero, pointer parallax, theme-aware. Decorative background layer.            | Low      | High    |
| **Floating 3D object**       | A distorted sphere / icosahedron (`Float` + `MeshDistortMaterial`) where the Lottie sits — a signature "hero prop". | Low–Med  | High    |
| **Tilt project cards**       | Cards in `Projects` tilt in 3D toward the cursor (can be pure CSS 3D transforms — no three needed).                 | Low      | Med     |
| **3D skills cloud**          | Skills/tech as labels on a rotating sphere (`drei` `Billboard`/`Text`).                                             | Med      | Med     |
| **Scroll-driven object**     | A model that rotates/assembles as you scroll the About section (`drei` `ScrollControls`).                           | Med–High | High    |
| **Shader gradient backdrop** | An animated GLSL gradient/noise plane behind a section — cheaper than particles, very "Awwwards".                   | Med      | Med     |
| **3D 404 page**              | A playful floating scene on `not-found` — low stakes, high delight.                                                 | Low      | Low–Med |

**Recommended sequence:** ship the ambient hero (done) → add the floating object
as an alternative hero prop → tilt cards (cheap, CSS-only) → consider a
scroll-driven About piece once the backend/SEO work is out of the way.

---

## The prototype (this branch)

`feat/hero-3d` adds an **ambient particle field behind the hero**:

- `frontend/src/components/three/HeroBackground.tsx` — the r3f `<Canvas>` +
  procedural sphere of ~1,200 points, slow auto-rotation, pointer parallax,
  confined to the right side with an alpha-mask fade on its left edge.
- `frontend/src/hooks/useMediaQuery.ts` — SSR-safe media-query hook.
- `frontend/src/components/sections/Hero.tsx` — lazy-loads the canvas with
  `dynamic(..., { ssr: false })`, gates it behind `(min-width: 768px)`, and
  layers it behind the content (`z-10`).

It's built to the rules below out of the box:

- **Decorative:** `pointer-events-none` + `aria-hidden` — never steals hero
  clicks, invisible to screen readers.
- **Legible:** the canvas is confined to the right side and its left edge is
  alpha-masked, so particles read against the illustration and never touch — or
  dim — the text column.
- **Desktop-only:** gated at `≥md` (768px) — mobile never mounts the canvas or
  downloads the WebGL chunk (mirrors the desktop-only Lottie).
- **Motion-safe:** honours `prefers-reduced-motion` — renders the field **once**
  (`frameloop="demand"`, zero rAF churn) instead of animating.
- **Fail-safe:** feature-detects WebGL and wraps the canvas in an error boundary —
  browsers that can't create a GL context (GPU disabled, some VMs) render nothing
  instead of crashing the page.
- **Theme-aware:** point colour/size/opacity tuned per theme (punchier in light,
  softer in dark).
- **LCP-safe:** transparent background layer; the hero heading stays the LCP.

**Try it:**

```bash
npm run dev --workspace=frontend   # then open the homepage
```

---

## Performance & accessibility rules

These are non-negotiable — they're why the old static site scored well and we
keep that here:

1. **Lazy-load, client-only.** Always `dynamic(..., { ssr: false })`. `three` +
   r3f + drei is a heavy chunk; keep it out of the initial bundle.
2. **Protect the LCP.** 3D is decorative background/side content — never the
   largest paintable element. Text stays the LCP.
3. **Respect `prefers-reduced-motion`.** Pause the render loop
   (`frameloop="demand"`) or drop the canvas entirely.
4. **Cap the pixel ratio.** `dpr={[1, 2]}` — never render at raw retina density.
5. **Start procedural.** Points/shaders need zero downloaded assets. Only reach
   for glTF models when a concept truly needs one (and compress with Draco).
6. **Don't fight the CI build.** New three components sit outside the 100%
   Vitest coverage list, so no test burden — but the build must still pass.

---

## Learning resources

- **Three.js Journey** — <https://threejs-journey.com> (Bruno Simon). The
  definitive course; the r3f chapters map directly to this stack.
- **React Three Fiber docs + examples** — <https://r3f.docs.pmnd.rs>
- **drei docs** — <https://drei.docs.pmnd.rs> (copy-pasteable helpers).
- **Codrops** — <https://tympanus.net/codrops> (filter "WebGL") — hero-background
  tutorials with source.
- **three.js examples** — <https://threejs.org/examples> — the official gallery.
- **Inspiration:** Bruno Simon's portfolio (bruno-simon.com), and Awwwards'
  WebGL collection for the bar.

---

## Next steps

1. Eyeball the prototype (`npm run dev`), tune density/speed/colour to taste.
2. Decide: keep the ambient field, or swap in the floating-object hero prop.
3. Once deploy + SEO are moving, pick one "signature" interaction (scroll-driven
   About, or the tilt cards) rather than sprinkling 3D everywhere.
