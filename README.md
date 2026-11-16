# Arrow Escape Tap

An offline, touch-first Canvas puzzle game. The complete game, styles, sounds,
and 1,000 seeded levels live in **index.html**. No dependencies, assets, or build step.

Open `index.html` in a modern browser, or serve this folder:

```sh
python3 -m http.server 8080
```

Tap the body or head of an arrow. A clear ray ahead of its head lets it follow
its own bends out of the board. Another stationary arrow on that ray costs one of three
hearts. Escaping arrows release their cells immediately and animate independently,
so keep tapping without waiting. Tapping an arrow already leaving does nothing.
Undo and hints also work while other arrows are moving. Clear the board to unlock the next level. Hint and undo each have three
uses per attempt. Undo also restores the heart lost on a blocked move. Pinch to
zoom and drag to pan; mouse wheel zoom works on desktop. Restart resets the
attempt. Daily challenges use the device's local calendar date and don't change
normal level progression. Settings, stars, and unlocks persist in localStorage
when the browser permits it. The default look uses thin monochrome arrows on a
light background; Settings → Colors restores the pastel palette. Existing theme
preferences are preserved, and light/dark themes work with either arrow style. Safari doesn't support web vibration; the iOS
wrapper below supplies native haptics.

## Install on iPhone with Sideloadly

Sideloadly installs **IPA apps**, not HTML documents. This repository includes
an offline WKWebView iOS wrapper and an unsigned IPA build script. The wrapper
bundles the exact same `index.html` and adds native iPhone haptic feedback.

### Build on GitHub (no Mac needed)

1. Open https://github.com/Whoops-Lambo/Arrow-Escape-Tap/actions/workflows/build-ios.yml .
2. Select **Run workflow**, choose **main**, and run it. A build also starts when
   the game or iOS wrapper changes on main. Enable Actions if GitHub prompts you.
3. Open the completed green run. In **Artifacts**, download
   **ArrowEscape-Sideloadly** (GitHub login required).
4. Extract the downloaded ZIP. Inside is **ArrowEscape.ipa**, ready for
   Sideloadly on Windows or Mac. Follow the installation steps below.

The build runs on GitHub's macOS runner with Xcode. It needs no Apple ID,
certificate, or signing secrets: Sideloadly signs the resulting IPA afterward.
Artifacts expire after 30 days; run the workflow again for a fresh download.
GitHub Actions must be enabled and your account must have available runner
minutes. A failed run's build log shows the exact error.

### Build the IPA (Mac with full Xcode required)

1. Install Xcode, open it once, and install its iOS platform tools. Make sure
   `xcode-select -p` points to Xcode's Developer directory, not only Command Line Tools.
2. In Terminal, from this repository run:

   ```sh
   bash ios/build-ipa.sh
   ```

3. The result is **ios/build/ArrowEscape.ipa**. The build disables code signing
   because Sideloadly will sign the app for your Apple ID/device.

### Sideload (Windows or Mac)

1. Install Sideloadly from its official site, https://sideloadly.io/ . On Windows,
   install the Apple device support components required by Sideloadly.
2. Connect your iPhone by USB, unlock it, and trust the computer.
3. Select your iPhone in Sideloadly, choose `ArrowEscape.ipa`, and follow its
   Apple ID signing flow. Enter account details only in the official tool.
4. On your iPhone, trust the developer profile in **Settings → General → VPN &
   Device Management** if prompted. Enable **Settings → Privacy & Security →
   Developer Mode** if your iOS version requests it, then launch Arrow Escape.

Free Apple ID signing typically expires after seven days; re-sign with
Sideloadly as needed. Keep the same bundle identifier (`com.arrowescape.tap`)
when updating to retain app identity. Deleting the app deletes its saved data.
The app targets iOS 15+ and arm64 iPhones/iPads, in portrait orientation.

**Build limitation:** This Linux environment cannot run Xcode or generate/test
the iOS IPA. The wrapper and packaging script are supplied; the Mac build,
Sideloadly signing, and on-device behavior still need verification. If you only
have Windows, use the GitHub Actions build above; Windows Sideloadly can
then sign and install it. No prebuilt IPA is included.

## Why levels are solvable

The generator builds a removal order backwards. It places an arrow only when
its head's entire outward ray is clear of all previously placed arrows. Its
connected body uses only unoccupied cells and avoids its own outward ray. New
arrows can block older ones, creating dependencies, but every new arrow is
removable once all later additions have been removed. Reversing placement
order therefore gives a solution by construction. Before displaying a puzzle,
a separate greedy solver repeatedly removes free arrows and rejects the board
unless every arrow can be removed. Removing pieces cannot create a new blocker,
so any currently free arrow is safe to choose.

## Shuffled difficulty and large boards

Each level has a reproducible, shuffled difficulty tier, shown above the level
number. As requested, an easier tier can follow a harder one, so the total arrow
count can decrease between levels. Within each tier, later levels trend toward
its upper count, with seeded variation. Board dimensions, length, density, and
layout also vary. Daily challenges seed both their tier and layout from the
local calendar date.

| Difficulty | Arrows |
| --- | --- |
| Easy | 25–40 |
| Medium | 50–75 |
| Hard | 100–150 |
| Very Hard | 150–200 |
| Nightmare | 200–250 |
| Extreme Nightmare | 300–400 |

Generation tiles a compact portrait rectangle with connected snakes, assigning
every grid cell to an arrow. Bands are visited from their far edge toward an
escape edge, ensuring a clear removal direction; other directions are chosen
when available. The independent solver validates every board. The 1,000 level
slots and existing unlocks/stars remain, but layouts are regenerated by the
new dense generator, including level 10.

The initial view and **Fit** use the original occupied bounds and preserve
square cells, centering the entire puzzle within the available canvas. Zoom
controls have a reserved strip so they cannot cover the fitted puzzle. The
view does not jump or shrink while arrows leave. Pinch or use **+** to zoom up
to 14×; drag to pan. Taps below a readable cell size prompt for zoom rather
than costing a heart. Hints center and zoom onto a free arrow.

The supplied reference ZIP could not be inspected because it exceeds the
workspace transfer limit of 32 MB, and the Play Store page was inaccessible.
The current visual design remains an original minimal thin-arrow presentation;
a closer visual comparison needs screenshots or a smaller reference archive.

## Validation

Validated 1,500 generated boards (ten seeds at every level), checking complete
solutions, cell uniqueness, and connected bodies. Mobile Chromium checks cover
blocked taps, heart restoration, hint consumption, animated removal, undo,
level completion, next-level unlocking, saved theme/progress, daily mode, and
level-select buttons. No browser runtime errors were observed. Native
Swift compilation and physical iPhone audio/haptics require the Mac/device
checks above.

### Concurrent move validation

The independent-animation update was checked against all 150 level solutions,
rapid consecutive escapes, a newly freed dependent arrow, ignoring repeat taps
on moving arrows, undo/hints during animation, blocked taps while another arrow
escapes, and completion after all final animations finish. Theme/color selection
and persistence were checked in a mobile browser.

### Current generator checks

Run `node tests/generator.cjs` (no dependencies). It checks all 1,000 levels with
one seed each for tier counts, full solutions, connected paths, bounds and
non-overlap, deterministic output, multiple board sizes, rejection of a cyclic
board, and a reachable 400-arrow level. Mobile Chromium flow checks also cover
overview tap protection, zoom controls, hint targeting, undo, restart, 400
concurrent escapes and completion, daily determinism, and theme/color settings.
Physical iPhone performance and the current IPA build remain separate checks.

The game now has 1,000 selectable level slots. Existing unlocks and stars are preserved. Levels 1–150 retain their count progression; later shuffled tiers use the upper portion of their arrow ranges.

### Touch and fit update

Game text selection, native dragging, and long-press context menus are disabled
inside the game. The arrow hit tolerance increased from 12 to 14 screen pixels
(or 42% of a cell for larger cells), with the nearest stationary arrow winning.
Dense tile snakes now vary their bends while preserving a clear head and full
cell coverage. Arrowheads use solid triangles like the supplied screenshots.
All 1,000 levels passed density, connectivity, count, and solver checks; level
10 fit checks passed at small portrait, large portrait, and landscape sizes.
Mobile browser tests checked off-stroke taps, undo, panning without text
selection, and Fit. Native iPhone behavior still needs device verification.

### Pre-template base restored and arrow visibility fixed

The current version restores the pre-reference release `c97b4a7` and applies
only rendering/layout fixes to that base. Its procedural generator matches that
release; no code, assets, or level data from the supplied template repository
are included. Arrowhead length stays at least 6.25 CSS pixels in fitted view,
and heads scale proportionally at higher zoom. Background dots no longer draw
on an unused square grid. Zoom controls are below the canvas, so Fit can use
the canvas height without reserving an overlay strip. Square cell proportions
are preserved; natural margins may remain when the puzzle and screen aspect
ratios differ. Clears still leave dots at the cells that actually held arrows.
Rendering checks covered light/dark and color/monochrome modes, pixel samples
inside the heads, two phone sizes, Fit and zoom. All 1,000 generated puzzles
passed the generator validation suite.
