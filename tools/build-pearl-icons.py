"""Build the site icon set from the supplied Pearl Compass Star PNGs.

Usage: python3 tools/build-pearl-icons.py PATH/TO/UNZIPPED_SET   (needs numpy and Pillow)

The supplied PNGs are transparent rounded tiles. This script
  * crops each tile and saves a 1024px transparent master (assets/icons/*.png, assets/icons/variants/),
  * makes the opaque full-bleed Apple touch icon and the Android maskable icon by scaling the tile to the
    whole square and filling the four transparent corners from the tile's own edge colors (the tile already
    has the iOS corner shape, so the OS mask trims it cleanly),
  * writes the 192/512 app icons, the favicons, and favicon.ico from the primary.
"""
import os
import sys

import numpy as np
from PIL import Image, ImageFilter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ICONS = os.path.join(ROOT, 'assets/icons')
NAMES = {
    'Primary': None,
    'Variant-2': 'variants/variant-2',
    'Variant-3': 'variants/variant-3',
    'Variant-4': 'variants/variant-4',
}


def tile_crop(path):
    im = Image.open(path).convert('RGBA')
    a = np.asarray(im)[..., 3]
    ys, xs = np.where(a > 8)
    return im.crop((xs.min(), ys.min(), xs.max() + 1, ys.max() + 1))


def transparent_master(tile, size=1024, margin=.02):
    """Fit the tile into a square transparent canvas, uniform scale, centered."""
    inner = int(size * (1 - 2 * margin))
    s = inner / max(tile.size)
    t = tile.resize((round(tile.width * s), round(tile.height * s)), Image.LANCZOS)
    canvas = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    canvas.paste(t, ((size - t.width) // 2, (size - t.height) // 2), t)
    return canvas


def fill_corners(rgba):
    """Opaque RGB from an RGBA image: transparent areas take the nearest edge colors (push-pull blur)."""
    a = np.asarray(rgba).astype(np.float32) / 255
    alpha = a[..., 3:4]
    rgb = a[..., :3] * alpha
    out = a[..., :3].copy()
    known = alpha[..., 0] > .98
    filled = np.where(known[..., None], a[..., :3], 0)
    wsum = known.astype(np.float32)
    for radius in (3, 8, 20, 48, 110):
        prem = Image.fromarray((np.dstack([filled * wsum[..., None], wsum]) * 255).clip(0, 255).astype(np.uint8), 'RGBA') if False else None
        # blur premultiplied color and weight separately in float via 8-bit-safe scaling
        chans = []
        for c in range(3):
            ch = Image.fromarray(((filled[..., c] * wsum) * 255).astype(np.uint8))
            chans.append(np.asarray(ch.filter(ImageFilter.GaussianBlur(radius)), dtype=np.float32) / 255)
        w = np.asarray(Image.fromarray((wsum * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(radius)), dtype=np.float32) / 255
        est = np.dstack(chans) / np.maximum(w[..., None], 1e-4)
        new = (w > .02) & (wsum < .5)
        filled = np.where(new[..., None], est, filled)
        wsum = np.maximum(wsum, new.astype(np.float32))
    soft = alpha
    final = a[..., :3] * soft + np.clip(filled, 0, 1) * (1 - soft)
    return Image.fromarray((np.clip(final, 0, 1) * 255 + .5).astype(np.uint8), 'RGB')


def full_bleed(tile, size=1024):
    """Scale the tile to the whole square (3 percent non-uniform at most), fill corners, return RGB."""
    t = tile.resize((size, size), Image.LANCZOS)
    return fill_corners(t)


def main(src):
    os.makedirs(os.path.join(ICONS, 'variants'), exist_ok=True)
    for key, rel in NAMES.items():
        path = os.path.join(src, 'SUN-Pearl-Compass-Star-%s.png' % key)
        tile = tile_crop(path)
        master = transparent_master(tile)
        solid = full_bleed(tile)
        if rel is None:
            master.save(os.path.join(ICONS, 'sun-pearl-icon-1024.png'), optimize=True)
            solid.resize((180, 180), Image.LANCZOS).save(os.path.join(ICONS, 'apple-touch-icon.png'), optimize=True)
            solid.resize((512, 512), Image.LANCZOS).save(os.path.join(ICONS, 'icon-maskable-512.png'), optimize=True)
            tight = transparent_master(tile, 1024, 0)
            for px in (192, 512):
                master.resize((px, px), Image.LANCZOS).save(os.path.join(ICONS, 'icon-%d.png' % px), optimize=True)
            sizes = []
            for px in (48, 32, 16):
                im = tight.resize((px, px), Image.LANCZOS)
                if px != 16:
                    im.save(os.path.join(ICONS, 'favicon-%d.png' % px), optimize=True)
                sizes.append(im)
            tight.resize((48, 48), Image.LANCZOS).save(os.path.join(ROOT, 'favicon.ico'), sizes=[(16, 16), (32, 32), (48, 48)])
        else:
            master.save(os.path.join(ICONS, rel + '-1024.png'), optimize=True)
            solid.resize((180, 180), Image.LANCZOS).save(os.path.join(ICONS, rel + '-apple-touch-icon.png'), optimize=True)
        print('built', key, tile.size)


if __name__ == '__main__':
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    main(sys.argv[1])
