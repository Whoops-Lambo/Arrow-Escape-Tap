#!/bin/bash
set -euo pipefail
cd "$(dirname "$0")"
if ! command -v xcodebuild >/dev/null; then
  echo 'This build requires a Mac with full Xcode installed and selected using xcode-select.' >&2
  exit 1
fi
xcodebuild -project ArrowEscape.xcodeproj -target ArrowEscape -configuration Release \
  -sdk iphoneos -arch arm64 ONLY_ACTIVE_ARCH=NO CODE_SIGNING_ALLOWED=NO \
  CONFIGURATION_BUILD_DIR="$PWD/build/Release-iphoneos" build
mkdir -p build/package/Payload
# Recreate only this script's packaging directory; never alter the source game.
rm -rf build/package/Payload/ArrowEscape.app
cp -R build/Release-iphoneos/ArrowEscape.app build/package/Payload/
rm -f build/ArrowEscape.ipa
(cd build/package && /usr/bin/zip -qry ../ArrowEscape.ipa Payload)
echo "IPA ready for Sideloadly: $PWD/build/ArrowEscape.ipa"
