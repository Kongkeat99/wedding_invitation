# Wedding Invitation – Soem Kungkiet & Chham Chanthu

Static website (HTML + CSS + JavaScript). No build step, no server needed.

## Structure
```
index.html                         page markup
css/style.css                      all styles
js/config.js                       ✏️ EDIT HERE: names, date, venue, program, story, music, photos
js/app.js                          page logic (countdown, music, gallery, guest names, ...)
assets/music/beautiful-in-white.mp3
```

## Edit
Open `js/config.js` – change names, date, venue, map link, program, love story, dress colors, photos, music playlist. Set `ALBUM_COMING_SOON` to show or hide the Coming Soon notice on the guest photo album page.

## Personal guest links
Open `https://YOUR-USERNAME.github.io/REPO-NAME/?setup` → "👥 Guest links" → enter names → "Make links".
Each link like `.../?to=Sok Dara` shows the guest's name on the cover and the main page.

## Publish on GitHub Pages
1. Create a repository and upload everything in this folder (keep the folders).
2. Settings → Pages → Deploy from a branch → `main` / `(root)` → Save.
3. Live at `https://YOUR-USERNAME.github.io/REPO-NAME/`

## Notes
- Music starts when a guest taps the ♥ seal (browsers block autoplay before a tap).
- Link preview photo (Telegram/Facebook): add `assets/og.jpg` and uncomment the `og:image` line in `index.html`.
