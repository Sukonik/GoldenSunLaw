# SUN brand assets

## Brand
- `brand/sun-wordmark-black.png`, `brand/sun-wordmark-white.png`: the SUN* wordmark, trimmed, black and white. The site renders the wordmark through a CSS mask, so it always takes the surrounding text color.
- `brand/sun-compass-star-black.png`, `brand/sun-compass-star-white.png`: the standalone Compass Star for compact placements.

## Icons
The Pearl Compass Star set is the site icon system.
- `icons/sun-pearl-icon-1024.png`: transparent master from the primary tile.
- `icons/apple-touch-icon.png` (180, opaque) and `icons/icon-maskable-512.png`: the tile scaled to the full square. Its corners are the iOS shape, so the OS mask trims it cleanly.
- `icons/icon-192.png`, `icons/icon-512.png`, `icons/favicon-32.png`, `icons/favicon-48.png`, and `favicon.ico`: transparent rounded tile.
- `icons/variants/`: alternates 2 to 4, each as a 1024 transparent master and an opaque Apple touch icon, ready to rotate in.
- `icons/studio/`: the alternate studio pearl set rendered from the Compass Star (ink star with bevel on a domed ivory tile).

Rebuild from the supplied PNGs with `python3 tools/build-pearl-icons.py PATH_TO_UNZIPPED_SET`. Rebuild the studio set with `python3 tools/generate-icons.py`. Both need numpy and Pillow.
