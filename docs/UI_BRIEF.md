# Payal-to-Pay (പായൽ ടു പേ) — UI Brief

DIRECTION
A fieldwork notebook from the backwaters: hand-inked, warm, alive. Feels drawn by a person; works like a precise tool. Mobile-first (360–430px) for boat crews; wider layout for the panchayat dashboard.
Priorities: 1 usable outdoors and one-handed, 2 Malayalam-first, 3 distinctive hand-drawn character, 4 performance and offline, 5 delight.
Culture: draw from everyday backwater life (vallam, kettuvallam, coconut palms, nilavilakku lamp, banana leaf, kasavu border, hyacinth flower). No religious or ritual imagery, no caricature. Have a Malayalam speaker proofread all copy.

TOKENS (CSS variables)
--paper #F6EEDC (kasavu cream)   --paper-2 #EDE0C3
--ink #1E2B24   --ink-soft #4A5A50
--kasavu #C9972F (decorative only, low contrast on cream)
--backwater #1F6B57   --water #A9D3CC
--hyacinth #8A6FD1   --hyacinth-deep #5B43A8
--laterite #B4532F (primary actions; paper-colored text on it)
--leaf #6B9A3C   --sun #F2B632 (flower centre, warnings; never as text on cream)
Dark "night lamp" mode: --paper #17221D, --ink #F3E9D2, same accents. Follow prefers-color-scheme plus a manual toggle.
Never convey status by colour alone: verified = round stamp + check; pending = dashed outline; simulated = diagonal stamp "SIMULATED / സിമുലേറ്റഡ്".

TYPE
Display and numerals: Chilanka. UI and body: Manjari (Noto Sans Malayalam for long text). Caveat only for tiny Latin accents.
Base 17px on mobile, line-height 1.6 (Malayalam conjuncts need room). Key numbers (kg, ₹) 40–56px. Use Arabic numerals for money and weight.
Self-host and preload; font-display: swap; must render offline.

HAND-DRAWN SYSTEM
- Shapes and borders: rough.js with a fixed seed per component id (no jitter on re-render), roughness 1–1.4, stroke 2.5px mobile / 2px desktop. Generate once, cache the path, render as an absolutely positioned SVG behind the content (pointer-events: none).
- Paper texture: tiny inline SVG feTurbulence noise at 4–6% opacity. No large images.
- Ink-wobble filter (feTurbulence + feDisplacementMap, scale <= 2) on at most 3 static elements (logo, hero line). Never on animated or scrolling elements.
- Icons: custom 24px hand-drawn strokes, round caps, 2.25px: mic-lamp, boat, patch, satellite, rain, drying-yard, ledger, coin, camera, check-stamp.
- Kasavu border: double ink line, gold stripe, tiny woven zigzag. Use on the top bar, card headers and section dividers. It draws itself on first load.
- Dividers: hand-drawn ripple lines.

LAYOUT (mobile)
- Top bar: logo lockup, ML/EN toggle, online/offline pill.
- Bottom tab bar in the thumb zone, 4 tabs: ഇന്ന് Today · ഭൂപടം Map · പറയൂ Speak (centre, raised lamp-mic) · കൂലി Wages.
- Paper cards with rough borders, 16px gutters, one column, 8px grid, tap targets >= 48px. Details in bottom sheets with a rope-style drag handle.
- Respect safe areas. No hover-only interactions.
Desktop/tablet (>= 1024px): map in 8 columns, notebook panel in 4.

SCREENS
1. Landing story (for judges): sticky illustrated scroll story in 4 chapters (satellite sees -> routes planned -> voice desk -> wages). The illustration morphs between chapters. Pinned "Try demo" button.
2. Today (ഇന്ന്): weather strip (hand-drawn sun/cloud with dry windows), route card (sketched mini-map, dashed route, stops as stepping stones), a boat sailing along a ripple line as progress, big primary "പറയൂ" button.
3. Map (ഭൂപടം): full-bleed map, muted sepia basemap, patches as lavender hatch-fill polygons with ink outline, routes as dashed ink lines with round joins, boat marker, bottom sheet with patch stats. A round rubber "satellite-verified" stamp animates in (rotate -8deg, slight overshoot).
4. Speak (പറയൂ): full-screen; a lamp-flame mic grows with input level; live transcript in Chilanka; extracted fields as editable chips; confirm, then spoken readback with a ripple waveform. A text fallback is always visible.
5. Wages (കൂലി): ledger page with ruled lines, handwritten rows, big ₹ total, stamps per entry, before/after photo slider with a hand-drawn handle.
6. Dashboard: optimizer-vs-baseline ink bar chart, assumptions list, accuracy panel styled as a lab-notebook page.

MOTION (transform and opacity only, 150–400ms, subtle spring)
- Load: kasavu border draws in (600ms), cards rise 8px and fade, staggered 40ms.
- Buttons: press = translateY(2px) plus ink-fill wipe; navigator.vibrate(10).
- Routes draw via stroke-dashoffset.
- Success: hyacinth flower draws petal by petal (700ms), coin drops, one soft stamp thud.
- Loading: a small vallam paddles across a ripple line (CSS only).
- Ambient ripple/cloud drift in the hero only; pause off-screen.
- prefers-reduced-motion: fades only, no loops.

PERFORMANCE AND OFFLINE
Initial JS target under ~250KB gzipped; lazy-load the map and rough.js. PWA offline shell. Every screen needs loading, empty, error and offline states in this same style. Test at 360x640 and 390x844 with 4x CPU throttle.

ACCESSIBILITY
AA contrast for text (verify; gold and sun are decorative only). Visible 3px hand-drawn focus ring. Labels alongside icons. lang="ml" on Malayalam text. Text scales to 200%.

DEFINITION OF DONE (UI)
Run the web-design-guidelines audit. Screenshots at 360, 390, 768, 1280. Malayalam conjunct render test. Airplane-mode test. Full-brightness contrast check.
