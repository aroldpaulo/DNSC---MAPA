# MAPA – frontend (plain HTML + CSS + JavaScript)

No PHP, no server, no install. **Double-click `index.html`** to open it (or use the VS Code "Live Server" extension).

## Folder map

```
MAPA/
├── index.html     ALL pages in ONE file (home, about, contact, campus). Has a map at the top.
├── style.css      ALL the design. Has a table of contents at the top.
├── script.js      ALL the behavior. Has a table of contents at the top.
├── images/
│   ├── logo.png, favicon.png
│   └── homepage/  slider + campus pictures
└── backend/       EMPTY PLACEHOLDER for later (see backend/README.md)
```

## How the pages work
Every page is a `<section class="page" id="page-...">` inside `index.html`. Only one shows at a time.
The address bar picks it:

| Address | Page |
|---|---|
| `index.html` or `#home` | Home |
| `#about` | About |
| `#contact` | Contact |
| `#campus-panabo` | Campus page (the word after `campus-` is the campus "slug") |
| `#campuses` | Home, scrolled to the slider |

## "Something is wrong – where do I look?"

| Problem | Look here |
|---|---|
| Anything weird | Press **F12 → Console**. `DEBUG = true` (top of `script.js`) prints `[MAPA] ...` messages |
| Picture does not show | Console shows `MISSING PICTURE: images/homepage/xxx.jpg`. Check the file name / folder |
| Wrong text on a page | Search the text in `index.html` (about / announcements / footer / contact) |
| Wrong campus name / description / picture | `CAMPUSES` list in `script.js` section 2 |
| Slider or search broken | `script.js` sections 8 and 9 |
| Menu / navbar broken | `index.html` [1], `style.css` section 4, `script.js` section 6 |
| Colors | `style.css` section 1 (top) |

## Common edits
- **Add a campus:** copy one line in `CAMPUSES` (`script.js`). Slide, card, search and campus page appear automatically.
- **Change a picture:** put the file in `images/homepage/`, then write its file name in `CAMPUSES` (or `HERO_IMAGE` for the first slide).
- **Edit announcements / about / footer text:** directly in `index.html` (comments tell you where).
- **Turn debug messages off:** `const DEBUG = false;` in `script.js`.

## What was removed from the PHP version
- The **admin dashboard** (login, edit content, upload pictures) – it needs a backend. The old PHP code is saved in `backend/old-php-reference/` for whoever builds the backend later.
- `debug.php` – replaced by the browser console (`DEBUG = true`).
