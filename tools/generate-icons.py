"""Render the studio pearl icon set (an alternate to the supplied Pearl Compass Star set) from
assets/brand/sun-compass-star-black.png.

Usage: python3 tools/generate-icons.py   (needs numpy and Pillow)
Outputs go to assets/icons/studio/.
"""
import os
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
N = 2048  # master render size, downscaled for every output


def norm(v):
    return v / np.maximum(np.linalg.norm(v, axis=-1, keepdims=True), 1e-9)


def pearl_surface(n=N):
    """Domed pearl-ceramic square. Returns float RGB array (n, n, 3) in 0..1."""
    y, x = np.mgrid[0:n, 0:n].astype(np.float32)
    u = (x + .5) / n * 2 - 1
    v = (y + .5) / n * 2 - 1
    # soft superellipse dome: flat enough in the middle to hold the logo, rolling off at the edges
    # r reaches ~.86 at the tile edge, so the shading rolls off but never shows a second outline
    r = (np.abs(u) ** 3.2 + np.abs(v) ** 3.2) ** (1 / 3.2) * .86
    h = np.sqrt(np.clip(1 - np.minimum(r, .999) ** 2.2, 0, 1)) * .55
    hy, hx = np.gradient(h)
    nrm = norm(np.dstack([-hx * n / 2, -hy * n / 2, np.ones_like(h)]))

    L = norm(np.array([-.42, -.58, .70], dtype=np.float32))
    ndl = np.clip((nrm * L).sum(-1), 0, 1)
    V = np.array([0, 0, 1], dtype=np.float32)
    Hh = norm(L + V)
    ndh = np.clip((nrm * Hh).sum(-1), 0, 1)

    # luminous ivory-white base with soft shading
    base = np.array([251, 249, 245], dtype=np.float32) / 255
    shade = .84 + .16 * ndl
    col = base[None, None, :] * shade[..., None]

    # faint pearlescent sheen: pastel hue drift that follows the surface angle
    ang = (nrm[..., 0] * 2.3 + nrm[..., 1] * 1.7) * 2.2
    sheen = np.dstack([np.sin(ang), np.sin(ang + 2.1), np.sin(ang + 4.2)]) * .022
    edge = np.clip((r - .45) / .45, 0, 1) ** 1.6
    col = col + sheen * (.35 + .9 * edge[..., None])

    # cool shadow side + warm key light
    col[..., 2] -= .020 * (1 - ndl)
    col[..., 0] -= .010 * (1 - ndl)
    col += np.array([.020, .014, .004]) * (ndl[..., None] ** 3)

    # broad soft highlight (upper left) and a small crisp specular
    gx, gy = (u + .46), (v + .54)
    col += (.075 * np.exp(-(gx ** 2 + gy ** 2) / .20))[..., None]
    col += (.16 * ndh ** 90)[..., None]
    # rim light along the lower-right edge for depth
    rim = np.clip((r - .70) / .16, 0, 1) * np.clip(u * .6 + v * .8, 0, 1)
    col += (.035 * rim)[..., None]
    return np.clip(col, 0, 1)


def star_layers(size, scale):
    """Return (mask, bevel) float arrays for the Compass Star centered on a size x size canvas."""
    star = Image.open(os.path.join(ROOT, 'assets/brand/sun-compass-star-black.png')).getchannel('A')
    side = int(size * scale)
    star = star.resize((side, round(star.height * side / star.width)), Image.LANCZOS)
    canvas = Image.new('L', (size, size), 0)
    canvas.paste(star, ((size - star.width) // 2, (size - star.height) // 2))
    return canvas


def compose(scale=.60, size=N):
    surf = pearl_surface(size)
    m = star_layers(size, scale)
    mask = np.asarray(m, dtype=np.float32) / 255

    # soft contact shadow and a wider ambient shadow, offset down-right
    def blurred(img, rad, dx, dy):
        sh = Image.new('L', (size, size), 0)
        sh.paste(img, (dx, dy))
        return np.asarray(sh.filter(ImageFilter.GaussianBlur(rad)), dtype=np.float32) / 255

    k = size / 1024
    contact = blurred(m, 6 * k, int(5 * k), int(9 * k))
    ambient = blurred(m, 26 * k, int(10 * k), int(22 * k))
    out = surf * (1 - .30 * ambient[..., None]) * (1 - .38 * contact[..., None])

    # star body: deep ink with a gentle top-left to bottom-right lift
    yy, xx = np.mgrid[0:size, 0:size].astype(np.float32) / size
    lift = np.clip(1 - (xx * .6 + yy * .8), 0, 1)
    ink = np.array([10, 12, 18], dtype=np.float32) / 255
    body = ink[None, None, :] + (np.array([34, 38, 50], dtype=np.float32) / 255 - ink)[None, None, :] * (lift[..., None] ** 1.6)

    # bevel: light catches the upper-left edges, falls off on the lower-right
    soft = np.asarray(m.filter(ImageFilter.GaussianBlur(5 * k)), dtype=np.float32) / 255
    gy, gx = np.gradient(soft)
    bevel = np.clip(-(gx * -.55 + gy * -.80) * 40 * k, -1, 1)
    body = body + (np.clip(bevel, 0, 1) * .34)[..., None] - (np.clip(-bevel, 0, 1) * .05)[..., None]
    out = out * (1 - mask[..., None]) + np.clip(body, 0, 1) * mask[..., None]
    return np.clip(out, 0, 1)


def save(arr, path, px, rounded=False):
    im = Image.fromarray((arr * 255 + .5).astype(np.uint8), 'RGB')
    if px != im.width:
        im = im.resize((px, px), Image.LANCZOS)
    if rounded:
        # squircle-ish corners (22.4% radius, like the iOS shape) for icons shown without an OS mask
        big = 4
        m = Image.new('L', (px * big, px * big), 0)
        ImageDraw.Draw(m).rounded_rectangle((0, 0, px * big - 1, px * big - 1), radius=int(px * big * .2237), fill=255)
        im = im.convert('RGBA')
        im.putalpha(m.resize((px, px), Image.LANCZOS))
    im.save(path, optimize=True)
    return im


def main():
    icons = os.path.join(ROOT, 'assets/icons/studio')
    os.makedirs(icons, exist_ok=True)
    full = compose(scale=.60)          # iOS / favicon: star fills the tile
    safe = compose(scale=.46)          # Android maskable: star stays inside the 80% safe zone
    master = save(full, os.path.join(icons, 'sun-pearl-icon-1024.png'), 1024, rounded=True)
    save(full, os.path.join(icons, 'apple-touch-icon.png'), 180)
    save(full, os.path.join(icons, 'icon-192.png'), 192, rounded=True)
    save(full, os.path.join(icons, 'icon-512.png'), 512, rounded=True)
    save(safe, os.path.join(icons, 'icon-maskable-512.png'), 512)
    # small sizes: a bolder star reads better at 16 to 48px
    small = compose(scale=.70)
    ico = [save(small, os.path.join(icons, 'favicon-%d.png' % s), s, rounded=True) for s in (32, 48)]
    print('ok')


if __name__ == '__main__':
    main()
