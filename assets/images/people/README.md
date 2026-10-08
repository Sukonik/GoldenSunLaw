# Partner portraits

## Image map

| Initials | Attorney | Original | Web versions (`web/`) |
| -------- | -------- | -------- | --------------------- |
| WS | Will Sun | `WS.png` | `ws-480.jpg`, `ws-800.jpg`, `ws-1254.jpg` |
| EK | Erin Kim | `EK.png` | `ek-480.jpg`, `ek-800.jpg`, `ek-1254.jpg` |
| BD | Ben Diamond | `BD.png` | `bd-480.jpg`, `bd-800.jpg`, `bd-1254.jpg` |
| EG | Eli Goldman | `EG.png` | `eg-480.jpg`, `eg-800.jpg`, `eg-1254.jpg` |

Originals are the square 1254px files as supplied. The `web/` JPEGs are what the pages load.

## The initials version

Before the portraits, each person card showed large initials (WS, EK, BD, EG) in the accent color. That version is kept here as a record and as a fallback for any partner without a photo.

- **Where it lives in history:** commit `14eb992` ("Hotfix small preview to Will Sun only"), the last commit before the portraits. Open `index.html` and `people.html` at that commit to see it.
- **Styles are still in the site:** `.person-card__initials` in `css/site.css` is unchanged and still works.

Initials card markup (homepage, `h3`; the People page uses `h2` and adds a bio paragraph):

```html
<article class="card person-card">
  <div class="person-card__initials">WS</div>
  <div>
    <h3 class="person-card__name">Will Sun</h3>
    <p class="person-card__role">Managing Partner · Global Technology &amp; Asia-Pacific</p>
  </div>
</article>
```

Photo card markup (current):

```html
<article class="card person-card person-card--photo">
  <figure class="person-card__photo"><img src="assets/images/people/web/ws-800.jpg" ... alt="Portrait of Will Sun, Managing Partner"></figure>
  <div class="person-card__body">
    <h3 class="person-card__name">Will Sun</h3>
    <p class="person-card__role">Managing Partner · Global Technology &amp; Asia-Pacific</p>
  </div>
</article>
```

To use initials for someone without a portrait, use the first block for that card; the grid handles both side by side.
