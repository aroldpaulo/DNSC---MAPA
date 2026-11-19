# backend/  (placeholder – nothing here works yet)

The website in the parent folder is **frontend only**. This folder is reserved for the backend later.

```
backend/
├── admin/                 admin pages (login, dashboard)            -> empty
├── api/                   what the frontend will call (e.g. get campuses, save content) -> empty
├── data/                  saved content (e.g. content.json)         -> empty
└── old-php-reference/     the OLD PHP code (config.php, includes/, admin/) – read-only reference, do not run
```

## When you build the backend, these are the jobs to move over
1. **Content storage** – old `functions.php` read/saved `data/content.json`. Today the same info is the `CAMPUSES` list in `../script.js`.
2. **Admin login + save** – old `admin/auth.php`, `admin/login.php`, `admin/save.php`.
3. **Picture upload** – old `admin/save.php` (saved into `images/homepage/`).

## How the frontend will connect later
- In `../script.js` section 1, set `ADMIN_URL` (the Ctrl+Shift+Q shortcut opens it).
- Replace the `CAMPUSES` list (section 2) with a `fetch('backend/api/...')` call that returns the same list.
