# Arrow Escape Tap

An offline, touch-first Canvas puzzle game. The complete game, styles, sounds,
and 150 seeded levels live in **index.html**. No dependencies, assets, or build step.

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

Grid size increases from 5×5 to 12×12; coverage, maximum body length, and arrow
count increase with progression. Seeds make normal levels and each daily
challenge reproducible.

## Validation

Validated 1,500 generated boards (ten seeds at every level), checking complete
solutions, cell uniqueness, and connected bodies. Mobile Chromium checks cover
blocked taps, heart restoration, hint consumption, animated removal, undo,
level completion, next-level unlocking, saved theme/progress, daily mode, and
all 150 level-select buttons. No browser runtime errors were observed. Native
Swift compilation and physical iPhone audio/haptics require the Mac/device
checks above.

### Concurrent move validation

The independent-animation update was checked against all 150 level solutions,
rapid consecutive escapes, a newly freed dependent arrow, ignoring repeat taps
on moving arrows, undo/hints during animation, blocked taps while another arrow
escapes, and completion after all final animations finish. Theme/color selection
and persistence were checked in a mobile browser.
