# Phone preview — a recording rig (drop-in, then delete before handoff)

Puts the live site inside a phone frame on a desktop screen, at the device's
real CSS viewport size, so the mobile experience can be screen-recorded without
filming an actual phone. Built for making client demo / ad videos.

**This is not a product feature. Delete it before the client sees the site** —
a "Phone preview" button in the header of a live store is exactly the sort of
thing that makes a finished site look unfinished.

## Why an iframe and not a scaled `<div>`

Scaling a `<div>` down to 393px gets you the *desktop* layout drawn small:
`@media (max-width: 767px)` resolves against the window, `100vh` resolves
against the window, `position: fixed` escapes to the window, and
`useMediaFlags()` asks the window whether it is a phone. An iframe **is** a
window, so every one of those answers the way it would on the device. What you
record is the mobile site, not a small picture of the desktop one.

## Install (3 steps, ~2 minutes)

Dependencies: `zustand` + `lucide-react` — both already in this scaffold. No
new package, no config change.

1. Copy these three files to `src/devtools/phone-preview/` in the project
   (`state.ts`, `PhonePreview.tsx`, `PhonePreviewButton.tsx`; copy this README
   too so whoever removes it has the instructions).

2. `src/App.tsx` — wrap the router:
   ```tsx
   // PHONE PREVIEW — temporary recording rig, delete with the folder it points at
   import { PhonePreview } from "@/devtools/phone-preview/PhonePreview";

   export function App() {
     return (
       // PHONE PREVIEW — temporary recording rig. Delete this wrapper, its
       // import, and src/devtools/phone-preview/ to remove.
       <PhonePreview>
         <BrowserRouter>{/* …everything that was already here… */}</BrowserRouter>
       </PhonePreview>
     );
   }
   ```
   It must be **outside** `BrowserRouter`: the rig replaces the whole app while
   it is up, and a router inside the unmounted tree is fine — a rig inside the
   router would remount on every navigation.

3. `src/components/layout/Header.tsx` — add the toggle next to the other chips
   (cart / theme / language / menu):
   ```tsx
   // PHONE PREVIEW — temporary recording rig, delete with the folder it points at
   import { PhonePreviewButton } from "@/devtools/phone-preview/PhonePreviewButton";
   …
   {/* PHONE PREVIEW — temporary recording rig. Delete this line, its import,
       and src/devtools/phone-preview/ to remove. */}
   <PhonePreviewButton />
   ```

Tag every insertion point with the string `PHONE PREVIEW` exactly as above —
that comment is what makes the removal a `grep` instead of an archaeology dig.

### Per-project adaptation

- `state.ts` → `FRAME_TITLE`: set to the store's name (`"Auto Style — aperçu
  mobile"`). Cosmetic, it is the iframe's accessible title.
- `PhonePreview.tsx` → the `chrome` initial state: this scaffold's light-theme
  `--c-bg` / `--c-ink`. It is only the fallback for the frames before the
  iframe loads; after that the strips are read live out of the frame's `body`,
  which is what keeps the status bar in sync with the theme toggle *inside*
  the preview.
- `PhonePreviewButton.tsx` → the className. It is written against this
  scaffold's Phase 3 tokens (`border-line`, `bg-panel`, `text-muted`,
  `text-ink`), so it should match as-is; if a project's header chips use
  different classes, copy theirs. The button must not change the header's
  layout — the whole point is to film the header as it really is.
- The backdrop gradient in `PhoneStage` is warm brown. Any dark neutral works;
  it gets cropped out of the recording anyway.
- React 18 typings: `useRef<MutationObserver>(undefined)` is React 19's
  signature. On 18, write `useRef<MutationObserver | undefined>(undefined)`
  (same for the `setTimeout` ref).

## Using it

Click the phone icon in the header. Then:

- **Device buttons** — iPhone 15 Pro (393×852), iPhone SE (375×667),
  Pixel 8 Pro (412×915). Add devices in `DEVICES` in `state.ts`: CSS viewport
  size, corner radius, and notch style (`island` / `punch` / `none`).
- **Rotate** — landscape.
- **Fullscreen** — the phone is sized to fill whatever box it is given, so this
  is simply the biggest and sharpest it gets: worth ~15 % on a 1080p screen,
  and it keeps the tab strip and address bar out of a window capture. Esc
  leaves fullscreen without also leaving the preview.
- **✕ / Esc** — back to the desktop site.

The controls fade out after ~2.5 idle seconds and return on the first mouse
move, so a recording longer than that catches only the phone. The mode is kept
in `sessionStorage`, so reloading the page — which is how you re-trigger a
splash/intro animation — keeps you in the preview.

The frame opens on whatever route the desktop was showing, so toggling from
`/shop` previews `/shop`.

## The traps that shaped it (don't "simplify" these away)

- **`window.name`, not a `?phone=1` query flag.** React-router drops the query
  the moment you click a link inside the frame, so the inner app drew a second
  phone inside the first one as soon as anyone navigated. `window.name` is set
  on the element before its document exists and survives navigation and reload.
- **Two nested boxes for the scale transform.** A transform scales what is
  *painted* and leaves the layout box its original size, so centring a scaled
  phone centres the box it *used to* occupy — the phone hung off the bottom of
  the screen. The outer div takes the scaled dimensions; the inner one scales
  from `top left`.
- **Fit measured off the stage with a `ResizeObserver`,** not computed from
  `window.innerHeight` — the window is not the stage in fullscreen, and not
  when browser chrome changes height. A guessed margin cost the home indicator
  and the lower bezel in the shot.
- **The status bar is a reserved strip, not an overlay.** Floated over the
  glass, the Dynamic Island pill sat squarely on the header's language chip —
  the first thing in the video was a control with a black lozenge through it.
  Reserving it also gives the page the shorter viewport a phone really has.
- **Controls in a rail down the side, not a bar along the bottom.** The phone
  is as tall as the window allows, so there is no empty height under it — but
  hundreds of pixels of unused width either side.
- **`scrollbar-gutter: stable` is reclaimed while the rig is up.** A
  `fixed inset-0` element does not cover the reserved gutter, which left a
  strip of page background down the edge of the black backdrop, in shot.
- **`allow="autoplay; fullscreen"` on the iframe** — without it a muted
  autoplaying hero video records as a still poster.

## Removing it (before handoff)

Three steps, no side effects:

1. Delete `src/devtools/phone-preview/`. If that leaves `src/devtools/` empty,
   delete it too.
2. `src/App.tsx` — remove the import and unwrap `<PhonePreview>` (re-indent).
3. `src/components/layout/Header.tsx` — remove the import and the
   `<PhonePreviewButton />` line.

```
grep -rn "PHONE PREVIEW" src/
```

finds all of them. Then `bun run typecheck && bun run lint` to confirm nothing
else referenced it — nothing else should: nothing outside this folder imports
from it, and it adds no dependency that was not already installed.
