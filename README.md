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
Open `js/config.js` – change names, date, venue, map link, program, love story, dress colors, photos, music playlist. Set `ALBUM_COMING_SOON` in `js/config.js`: `true` keeps the guest photo album blurred with a Coming Soon badge, `false` opens it. (The photo files are still public URLs either way.)

## RSVP and gifts
In `js/config.js` set `contact: { telegram: "username", whatsapp: "855XXXXXXXX" }` to show the RSVP section (guests pick attending / not attending and a prefilled message opens in Telegram or WhatsApp, including their name from a personal link). Fill `gifts` with real bank accounts to show the gift section. Each section stays hidden until it has real content; an account made only of zeros (the placeholder) is not shown.

## Personal guest links
Open `https://YOUR-USERNAME.github.io/REPO-NAME/?setup` → "👥 Guest links" → enter names → "Make links".
Each link like `.../?to=Sok Dara` shows the guest's name on the cover and the main page.

## Personal links with guest name + preview photo
Telegram/Facebook/WhatsApp make the preview card from the page's meta tags, so every guest gets their own small page.
1. Put each guest's photo in `tools/guest-photos/` (any size; it is cropped to 1200x630 automatically).
2. Add one line per guest to `tools/guests.csv`: `code,name,photo` (example: `mai,ម៉ៃ ម៉ុំ,mai.jpg`; code = short, a-z 0-9 and -).
3. Run `python3 tools/make_guest_links.py --base https://YOUR-SITE` (needs `pip install pillow`).
4. Commit and push (or redeploy). Send each link from `tools/guest-links.txt`, e.g. `https://YOUR-SITE/g/mai/`.
The guest sees the card with their name and photo, and the invitation opens with their name on it. A missing photo falls back to `assets/og.jpg`.
Tip: guest photos are public files; only add photos guests would be fine with others seeing if the link is forwarded.

## Publish on GitHub Pages
1. Create a repository and upload everything in this folder (keep the folders).
2. Settings → Pages → Deploy from a branch → `main` / `(root)` → Save.
3. Live at `https://YOUR-USERNAME.github.io/REPO-NAME/`

## Notes
- Music starts when a guest taps the ♥ seal (browsers block autoplay before a tap).
- Link preview photo (Telegram/Facebook): add `assets/og.jpg` and uncomment the `og:image` line in `index.html`.
