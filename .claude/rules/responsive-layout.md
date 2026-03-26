# Responsive layout rules

Apply these rules whenever working on layout, CSS, or the app shell.

---

## The core principle

The app must work correctly at three breakpoints. The current codebase is mobile-only (hard 430px cap). That is wrong for desktop browsers. Fix it.

## Breakpoints

```css
/* Mobile — default, no media query needed */
/* 0–639px: single column, bottom nav, Mira bar above nav */

/* Tablet */
@media (min-width: 640px) {
  /* centred single column, 560px max, no bottom nav */
}

/* Desktop */
@media (min-width: 1024px) {
  /* two-column layout: content left + Mira panel right */
}
```

## App shell structure

### Mobile (< 640px)
```
┌────────────────────────────┐  (full viewport width)
│  Screen content            │
│  (scrollable)              │
├────────────────────────────┤  ← MiraBar (sticky, bottom: 56px)
│  ● Tell Mira what's…      │
├────────────────────────────┤  ← BottomNav (fixed, 56px)
│  Home  Find  Sessions  …  │
└────────────────────────────┘
```

### Tablet (640px–1023px)
```
┌──────────────────────────────────────┐
│         [centred 560px column]        │
│  Screen content                       │
├───────────────────────────────────────┤
│  ● Tell Mira what's going on…        │  ← MiraBar at bottom of column
└───────────────────────────────────────┘
No bottom nav — use top nav or sidebar
```

### Desktop (≥ 1024px)
```
┌──────────────────┬─────────────────────┐  (max-width: 1080px, centred)
│  Left: content   │  Right: Mira panel  │
│  (400px)         │  (flex: 1)          │
│                  │                     │
│  Home tiles      │  Active Mira chat   │
│  Practitioners   │  or welcome state   │
│  Sessions        │                     │
└──────────────────┴─────────────────────┘
Side nav (vertical, left edge) replaces bottom nav
```

## CSS implementation

```css
/* App root — replaces the broken max-width: 430px */
.app-root {
  width: 100%;
  min-height: 100vh;
  background: var(--niro-cream);
  position: relative;
}

/* Mobile: center the content column */
.content-column {
  width: 100%;
  max-width: 430px;
  margin: 0 auto;
  position: relative;
}

/* Tablet: widen the column */
@media (min-width: 640px) {
  .content-column {
    max-width: 560px;
  }
  .bottom-nav {
    display: none;
  }
  .top-nav {
    display: flex;
  }
}

/* Desktop: two-column layout */
@media (min-width: 1024px) {
  .app-root {
    display: grid;
    grid-template-columns: 400px 1fr;
    grid-template-rows: 1fr;
    max-width: 1080px;
    margin: 0 auto;
    min-height: 100vh;
  }
  .content-column {
    max-width: 400px;
    border-right: 1px solid var(--niro-border);
    overflow-y: auto;
    height: 100vh;
    position: sticky;
    top: 0;
  }
  .mira-panel {
    display: flex;
    flex-direction: column;
    height: 100vh;
    position: sticky;
    top: 0;
    overflow: hidden;
  }
  .bottom-nav {
    display: none;
  }
  .mira-bar-mobile {
    display: none;
  }
}
```

## Mira panel (desktop right column)

On desktop, the Mira chat is always visible in the right panel — it does NOT take over the full screen. When no conversation is active, show a welcome state:

```
┌─────────────────────────────┐
│                             │
│    ● Mira                   │
│                             │
│    "What's going on         │
│     at work right now?"     │
│                             │
│  [Tell Mira…          →]    │
└─────────────────────────────┘
```

When a conversation is active, the right panel shows the full chat thread.

## MiraScreen on mobile vs desktop

- Mobile: MiraScreen is a full-screen takeover (renders over the home screen)
- Desktop: MiraScreen renders inside the right panel — never full-screen
- Use a prop `isPanel={true}` on MiraScreen to suppress the full-screen styles on desktop

## Font scaling

```css
/* Prevent very large text on wide screens */
@media (min-width: 640px) {
  .hero-title { font-size: 28px; }    /* was 24px mobile */
}
@media (min-width: 1024px) {
  .hero-title { font-size: 30px; }
}
```

## What NOT to do

- Do NOT apply `max-width: 430px` to `body`, `html`, or `#root`
- Do NOT use `position: fixed` for bottom nav on desktop — it escapes the grid
- Do NOT show the mobile MiraBar on desktop — the panel input replaces it
- Do NOT make the desktop layout a phone-in-the-centre aesthetic — use the full width
