# Design tokens

Apply these rules whenever working on any `.jsx`, `.css`, or `.module.css` file.

---

## CSS variables — use these, never hardcode hex

```css
--niro-green:        #1C3A2A;   /* primary, hero backgrounds, CTAs, active states */
--niro-green-mid:    #2D5A3D;   /* hover states */
--niro-green-light:  #4A7A5A;   /* secondary text, icons */
--niro-gold:         #C4973A;   /* Mira dot, gold accents, artefact text */
--niro-gold-light:   #E8C97A;   /* hero title accent */
--niro-cream:        #F5F1E8;   /* app background */
--niro-cream-dark:   #EDE8DC;   /* input backgrounds, secondary surfaces */
--niro-ink:          #1A1A18;   /* primary text */
--niro-muted:        #6B6960;   /* secondary text, placeholders, labels */
--niro-border:       rgba(28,58,42,0.11); /* all borders */
--niro-white:        #FFFFFF;
```

## Typography

```css
/* Headings and display text */
font-family: 'Instrument Serif', 'Playfair Display', Georgia, serif;

/* All UI text, body, labels, buttons */
font-family: 'DM Sans', -apple-system, sans-serif;

/* Weights used */
font-weight: 300;  /* body text, descriptions */
font-weight: 400;  /* regular body */
font-weight: 500;  /* labels, button text, emphasis */
/* Never use 600, 700, or 800 */
```

## Spacing scale

```
4px   — gap between icon and label
8px   — internal padding small elements
10px  — chip padding horizontal
12px  — card internal padding compact
14px  — standard padding horizontal
16px  — standard padding vertical
20px  — section padding
24px  — card padding generous
32px  — section gap
```

## Border radius

```
6px   — chips, small badges
8px   — input fields, small cards
12px  — message bubbles
14px  — primary tiles, practitioner cards
20px  — modal bottom sheet
50%   — avatars, dots
```

## Key component dimensions

```
Bottom nav height:    56px (fixed)
Mira bar height:      52px (sticky, bottom: 56px)
Primary tile height:  ~110px (2-line content)
Chip height:          32px
Avatar size:          52px (practitioner cards)
CTA button height:    48px (full-width primary)
```

## Mira dot animation

```css
@keyframes mira-pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.4); opacity: 0.7; }
}
.mira-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--niro-gold);
  animation: mira-pulse 2s ease-in-out infinite;
}
```

## Message bubble styles

```css
/* Mira messages — left aligned */
.mira-bubble {
  background: var(--niro-white);
  border-radius: 4px 14px 14px 14px;
  padding: 10px 14px;
  max-width: 85%;
  font-size: 14px;
  line-height: 1.6;
  color: var(--niro-ink);
  box-shadow: 0 1px 3px rgba(28,58,42,0.08);
}

/* User messages — right aligned */
.user-bubble {
  background: var(--niro-green);
  border-radius: 14px 4px 14px 14px;
  padding: 10px 14px;
  max-width: 85%;
  font-size: 14px;
  line-height: 1.6;
  color: white;
}
```

## Artefact card style

```css
.artefact-card {
  background: var(--niro-white);
  border-radius: 14px;
  border: 1px solid var(--niro-border);
  padding: 20px 18px;
  margin: 8px 0;
}
.artefact-text {
  font-family: 'Instrument Serif', serif;
  font-style: italic;
  font-size: 17px;
  line-height: 1.5;
  color: var(--niro-gold);
  margin-bottom: 10px;
}
.artefact-credit {
  font-size: 11px;
  color: var(--niro-muted);
  text-align: right;
}
```
