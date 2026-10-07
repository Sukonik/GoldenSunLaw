# SUN brand assets

- `brand/sun-wordmark-black.png`, `brand/sun-wordmark-white.png`: the SUN* wordmark, trimmed, black and white. The site renders the wordmark through a CSS mask, so it always takes the surrounding text color.
- `brand/sun-compass-star-black.png`, `brand/sun-compass-star-white.png`: the standalone Compass Star for compact placements.
- `icons/`: pearl home-screen icon set (Apple touch icon, 192/512 app icons, maskable icon, favicons) and the 1024px master.

Regenerate every icon from the Compass Star with `python3 tools/generate-icons.py` (needs numpy and Pillow).
