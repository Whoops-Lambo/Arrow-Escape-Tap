# Arrow Escape Tap

A self-contained, offline Canvas puzzle game in **index.html**, with 1,000
seeded levels, daily challenges, synthesized audio, and saved progress. No
runtime libraries, external assets, or web build step are needed.

Open the HTML in a browser or run `python3 -m http.server 8080` in this folder.

## Current design and controls

The screenshot-inspired redesign uses a white background, thin navy paths,
small proportional arrowheads, a compact centered difficulty/level/hearts
header, and a thin progress bar. Back and restart sit at the upper left.
The first launch of this design switches the appearance to light, monochrome,
and Compact arrowheads. Existing unlocks, stars, sound, and haptics are retained.

- Tap an arrow anywhere along its body or head, including in the fitted view.
  The nearest stationary arrow within a forgiving hit area is selected.
- Arrows with a clear forward ray escape independently; keep tapping while
  others move. A blocked tap costs one of three hearts.
- Use the lower-left **⋯** button to open Puzzle Tools: Hint, Undo, Daily
  challenge, Settings, zoom controls, Fit puzzle, and the remaining arrow count.
- The lower-right grid button shows dotted path guides. Any arrow tap hides
  them, including a blocked tap. Press the button to show them again. Undo does
  not turn them back on. Empty taps and panning do not hide them.
- Pinch to zoom up to 14× and drag to pan. Zoom is optional. Fit restores the
  full-puzzle view without moving arrows as other pieces escape.
- Settings include sound, haptics, theme, colors, and **Arrow size**. Arrow
  size cycles through Compact, Balanced, and Large independently of zoom.

Hint and Undo each have three uses per attempt. Undo restores hearts lost on
blocked moves. Restart resets the attempt. Clear a level to unlock the next;
stars depend on remaining hearts. Data is stored in localStorage when allowed.
Daily challenges use the device's local calendar date.

## Difficulty and generation

Tiers are shuffled reproducibly between levels. An easier tier can follow a
harder one, so counts can drop between levels. Layouts, dimensions, lengths,
and counts vary within these ranges:

| Difficulty | Arrows |
| --- | --- |
| Easy | 25–40 |
| Medium | 50–75 |
| Hard | 100–150 |
| Very Hard | 150–200 |
| Nightmare | 200–250 |
| Extreme Nightmare | 300–400 |

The generator tiles compact rectangles with straight arrows, single bends,
U-shapes, zigzags, and winding paths. Every grid cell inside the puzzle belongs
to an arrow. Reverse placement keeps an outward escape available as each piece
is placed; reversing that order supplies a solution. A separate solver removes
free arrows and rejects any puzzle that cannot be cleared. Counts are exact.

This version uses its own procedural generator and contains no code, assets,
or level data from the supplied Android template repository.

## iPhone IPA and Sideloadly

Use [Build iPhone IPA](https://github.com/Whoops-Lambo/Arrow-Escape-Tap/actions/workflows/build-ios.yml).
Open the latest run, or choose **Run workflow → main**. After it finishes green,
download **ArrowEscape-Sideloadly** under Artifacts and extract the ZIP to get
**ArrowEscape.ipa**. GitHub login is required to download artifacts; downloads
expire after 30 days. Re-run the workflow for a fresh artifact.

GitHub's Mac runner builds an unsigned arm64 IPA with Xcode. No signing secrets
are needed for the build. Install Sideloadly from https://sideloadly.io/, connect
and trust your iPhone, select the IPA and your device, and follow Sideloadly's
Apple ID signing flow. Trust the developer profile and enable Developer Mode
on the phone if iOS requests it. Free Apple ID signing typically needs renewal
after seven days. Keep the same bundle identifier when updating. Deleting the
app deletes its saved data.

To build on your own Mac with full Xcode and iOS tools installed:

```sh
bash ios/build-ipa.sh
```

The result is `ios/build/ArrowEscape.ipa`. The iOS 15+ WKWebView wrapper bundles
the same HTML and supplies native haptics where Safari lacks navigator.vibrate.
The Linux workspace cannot compile or verify the native IPA; GitHub build
success and physical iPhone behavior require separate verification.

## Validation

`node tests/generator.cjs` checks all 1,000 levels for exact tier counts, full
solutions, adjacency, head direction, bounds, non-overlap, density, straight
and bent shape variety, deterministic output, cycle rejection, and a reachable
400-arrow board. The redesign passed mobile Chromium checks for fitted taps,
path-guide auto-hide, tools drawer, Hint/Undo, zoom/Fit, appearance and arrow-size
settings, daily mode, 1,000 level buttons, restart, and responsive portrait and
landscape layouts. Physical iPhone rendering remains an on-device check.
