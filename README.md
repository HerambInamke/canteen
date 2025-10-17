# CanteenHub

A simple static website for a college canteen with pages for Home, Dashboard, Menu, Feedback, About, plus an Admin login and Admin dashboard.

## Project Structure

```
canteen/
├─ index.html                         # Home page
├─ pages/
│  ├─ about.html
│  ├─ cart.html
│  ├─ contact.html
│  ├─ dashboard.html                  # Public analytics demo page
│  ├─ feedback.html
│  ├─ login.html                      # Admin login page (client-side demo)
│  ├─ admin-dashboard.html            # Admin area (protected client-side)
│  └─ menu.html
├─ assets/
│  ├─ css/
│  │  └─ styles.css                   # Global + login/admin styles
│  └─ js/
│     ├─ script.js                    # Site-wide JS (filters, forms, UI)
│     ├─ dashboard.js                 # Public dashboard charts and actions
│     ├─ auth.js                      # Client-side auth/session + navbar state
│     └─ admin-dashboard.js           # Admin dashboard interactivity (mock data)
└─ README.md
```

## Getting Started

- Open `index.html` in your browser (double-click or use a local server).
- Navigate between pages via the navbar.

Optional: run a lightweight local server (recommended for consistent relative paths).

```bash
# Python 3
python -m http.server 5500
# then open http://localhost:5500
```

## Admin Login (Demo)

- Credentials: `admin@gmail.com` / `admin@123`
- Click Login in the navbar, sign in, and you’ll be redirected to the Admin Dashboard.
- After login, the navbar shows `ADMIN` and `LOGOUT` instead of `LOGIN`.
- Logout clears the session and returns you to the login page.

Notes:
- This is client-side only (no real backend). The session flag is stored in `sessionStorage` or `localStorage` if "Remember me" is checked.
- A Google Login button is present for UI only and is disabled (non-functional by design).

## Admin Dashboard

- Order history with status filter and search
- Menu list with Available/Unavailable filter and search
- Quick actions:
  - Complete All (marks mock orders completed)
  - Toggle Stock (toggles mock availability)
- Implemented with mock data in `assets/js/admin-dashboard.js`.

## Dependencies (CDN)

- Bootstrap 5 (CSS/JS)
- Font Awesome 6
- Google Fonts (Dancing Script, Open Sans)
- Chart.js (Dashboard only)

These are loaded from CDNs in each page header/footer; no local install required.

## Conventions

- HTML pages live in `pages/` (except `index.html`).
- Styles: `assets/css/styles.css`.
- Scripts: `assets/js/script.js` (global), `assets/js/dashboard.js` (public dashboard), `assets/js/auth.js` (auth + navbar), and `assets/js/admin-dashboard.js` (admin UI).
- Use relative links:
  - From `index.html` to pages: `pages/<page>.html`.
  - From pages to assets: `../assets/...`.
  - From pages back to home: `../index.html`.

## Security Warning (Important)

This login is a front-end demonstration only. Do not use real credentials or deploy as-is for production. For a real app, implement server-side authentication, authorization, and secure session handling.

## Editing Tips

- Keep class names consistent with `styles.css`.
- If adding new pages, place them under `pages/` and update navbar links.
- For new JS utilities, prefer adding to `assets/js/script.js`; keep page-specific code in a dedicated file.

## License

MIT
