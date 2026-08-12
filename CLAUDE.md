# Kids Trainer

Vue 3 + Vite PWA for kids to practise maths on an Android tablet.

- `src/i18n/nl.js` — **all** Dutch UI strings; add here first before using in components
- `src/stores/` — localStorage-backed composables (profiles, levels, stats, preferences)
- `src/views/` — one file per route
- `src/components/` — shared components

## Dev

```
npm install
npm run dev        # http://localhost:5173/kids-trainer/
```

> The Vite base is `/kids-trainer/` (matches GitHub Pages path). Hash routing means
> all routes work without server config.

## Releasing

Push a semver tag to trigger `.github/workflows/release.yml`:

```
git tag v0.1.0 && git push origin v0.1.0
```

- CHANGELOG.md is regenerated from **conventional commits** (`feat:`/`fix:`/`perf:`)
  and committed to main; the notes become the GitHub Release body.
- The built SPA is deployed to **GitHub Pages**:
  `https://rikdepeuter.github.io/kids-trainer/`
- On Android: open that URL in Chrome → menu → **"Add to Home Screen"** to install
  as a standalone PWA (no app store required).

## Domain rules

- **Levels are global** — shared across all profiles; not profile-bound.
- **Stats are per-profile** — stored under `kt_stats` keyed by profileId.
- **Parent profiles** can create/edit/delete levels; child profiles cannot.
- A level becomes **read-only** (no edit) once it has been played (tracked in `kt_played_levels`).
- The builtin "Alles" level (`id: builtin-alles`) can never be deleted.
- Conventional commit prefixes: `feat:` new feature, `fix:` bug, `perf:` performance,
  `chore:` tooling/deps (won't appear in changelog), `docs:` docs only.
