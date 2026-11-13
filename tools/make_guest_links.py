#!/usr/bin/env python3
"""Make a personal invitation link (name + preview photo) for every guest.

1. Put each guest's photo in  tools/guest-photos/
2. List guests in             tools/guests.csv   (columns: code,name,photo[,time][,venue] - time like 11:30 and venue are optional per-guest overrides)
3. Run                        python3 tools/make_guest_links.py
4. Commit/push (or redeploy), then send each link from tools/guest-links.txt

Why separate pages? Telegram/Facebook/WhatsApp build the preview card from the page's
<meta> tags WITHOUT running JavaScript, so each guest needs a real page (g/<code>/)
with their own name + photo in those tags. Opening it forwards to the invitation with
the guest's name already shown.
"""
import argparse, csv, html, re, sys
from datetime import datetime
from pathlib import Path
from urllib.parse import quote
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parent.parent
W, H = 1200, 630

def default_base():
    m = re.search(r'property="og:image"\s+content="(https?://[^"]+?)/assets/og\.jpg"', (ROOT / "index.html").read_text(encoding="utf-8"))
    return m.group(1) if m else ""

def make_cover(src: Path, dest: Path):
    im = ImageOps.exif_transpose(Image.open(src)).convert("RGB")
    im = ImageOps.fit(im, (W, H), Image.LANCZOS, centering=(0.5, 0.35))  # keep faces: crop a bit higher than centre
    dest.parent.mkdir(parents=True, exist_ok=True)
    im.save(dest, "JPEG", quality=85, optimize=True)

KM_DIGITS = str.maketrans("0123456789", "០១២៣៤៥៦៧៨៩")
KM_MONTHS = ["មករា","កុម្ភៈ","មីនា","មេសា","ឧសភា","មិថុនា","កក្កដា","សីហា","កញ្ញា","តុលា","វិច្ឆិកា","ធ្នូ"]
KM_DAYS = ["ច័ន្ទ","អង្គារ","ពុធ","ព្រហស្បតិ៍","សុក្រ","សៅរ៍","អាទិត្យ"]  # Monday..Sunday

def read_config():
    """Pull date / venue / map link straight from js/config.js so the preview card never drifts from the site."""
    t = (ROOT / "js" / "config.js").read_text(encoding="utf-8")
    def grab(pattern):
        m = re.search(pattern, t, re.M)
        return m.group(1) if m else ""
    return {
        "date": grab(r'^\s*date:\s*"([^"]+)"'),
        "venue": grab(r'^\s*venue:\s*"([^"]+)"'),
        "venue_en": grab(r'en:\s*\{\s*venue:\s*"([^"]+)"'),
        "map": grab(r'mapUrl:\s*"([^"]+)"'),
    }

def when(cfg, time_override=""):
    """Return (khmer, english) strings like 'ថ្ងៃអាទិត្យ ទី២២ ខែវិច្ឆិកា ឆ្នាំ២០២៦ · ម៉ោង ៣:០០ រសៀល'."""
    dt = datetime.fromisoformat(cfg["date"])
    if time_override:
        hh, mm = (int(x) for x in time_override.split(":"))
        dt = dt.replace(hour=hh, minute=mm)
    h = dt.hour
    part = "ព្រឹក" if h < 12 else "រសៀល" if h < 17 else "ល្ងាច" if h < 19 else "យប់"
    h12 = h % 12 or 12
    km = f"ថ្ងៃ{KM_DAYS[dt.weekday()]} ទី{str(dt.day).translate(KM_DIGITS)} ខែ{KM_MONTHS[dt.month-1]} ឆ្នាំ{str(dt.year).translate(KM_DIGITS)} · ម៉ោង {f'{h12}:{dt.minute:02d}'.translate(KM_DIGITS)} {part}"
    en = f"{dt.strftime('%A')}, {dt.day} {dt.strftime('%B %Y')} · {dt.strftime('%I:%M %p').lstrip('0')}"
    return km, en

PAGE = """<!DOCTYPE html>
<html lang="km"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title}</title>
<meta name="robots" content="noindex">
<meta property="og:type" content="website">
<meta property="og:title" content="{title}">
<meta property="og:description" content="{desc}">
<meta property="og:image" content="{image}">
<meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">
<meta property="og:url" content="{url}">
<meta name="twitter:card" content="summary_large_image">
<noscript><meta http-equiv="refresh" content="0;url={target}"></noscript>
<script>location.replace("{target}")</script>
</head><body style="font-family:sans-serif;text-align:center;padding:2rem;line-height:1.7">
<h2>{title}</h2><p>📅 {when_km}<br>{when_en}</p><p>📍 {venue}</p>
<p><a href="{target}">បើកធៀបអញ្ជើញ · Open invitation</a></p></body></html>
"""

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--base", default=default_base(), help="public site address, e.g. https://sarserei.com (no trailing slash)")
    ap.add_argument("--csv", default=str(ROOT / "tools" / "guests.csv"))
    a = ap.parse_args()
    base = a.base.rstrip("/")
    if not base:
        sys.exit("Give the public site address: --base https://your-site")
    cfg = read_config()
    if not cfg["date"]:
        sys.exit("Could not read `date` from js/config.js")
    rows = list(csv.DictReader(open(a.csv, encoding="utf-8-sig")))
    out, seen, msgs = [], set(), []
    for r in rows:
        code = (r.get("code") or "").strip().lower()
        name = " ".join((r.get("name") or "").split())
        photo = (r.get("photo") or "").strip()
        time_o = (r.get("time") or "").strip()          # optional, e.g. 11:30 for a lunch-only guest
        venue_o = (r.get("venue") or "").strip()        # optional, overrides the venue from config.js
        if not code and not name:
            continue
        if not re.fullmatch(r"[a-z0-9][a-z0-9-]*", code) or not name:
            print(f"SKIP  bad row (code must be a-z 0-9 -, name required): {r}"); continue
        if code in seen:
            print(f"SKIP  duplicate code: {code}"); continue
        seen.add(code)
        cover = f"assets/guests/{code}.jpg"
        src = ROOT / "tools" / "guest-photos" / photo if photo else None
        if src and src.is_file():
            make_cover(src, ROOT / cover)
        else:
            print(f"WARN  {code}: photo '{photo}' not found in tools/guest-photos/ -> using the default preview photo")
            cover = "assets/og.jpg"
        url = f"{base}/g/{code}/"
        title = f"សូមគោរពអញ្ជើញ {name} · Dear {name}, you are invited · Soem Kungkiet & Chham Chanthu"
        km_when, en_when = when(cfg, time_o)
        venue = venue_o or cfg["venue"]
        desc = f"📅 {km_when} · 📍 {venue} · {en_when}"
        page = PAGE.format(title=html.escape(title), desc=html.escape(desc),
                           when_km=html.escape(km_when), when_en=html.escape(en_when), venue=html.escape(venue),
                           image=html.escape(f"{base}/{cover}"), url=html.escape(url),
                           target=html.escape("../../?to=" + quote(name)))
        d = ROOT / "g" / code; d.mkdir(parents=True, exist_ok=True)
        (d / "index.html").write_text(page, encoding="utf-8")
        out.append((name, url))
        msgs.append(f"សូមគោរពអញ្ជើញ {name}\nសូមអញ្ជើញចូលរួមពិធីមង្គលការរបស់យើងខ្ញុំ\n📅 {km_when}\n📍 {venue}" + (f"\n🗺 {cfg['map']}" if cfg["map"] else "") + f"\n\nDear {name}, you are warmly invited to our wedding.\n📅 {en_when}\n📍 {cfg['venue_en'] or venue}\n\n💌 {url}")
    (ROOT / "tools" / "guest-links.txt").write_text("\n".join(f"{n}\t{u}" for n, u in out) + "\n", encoding="utf-8")
    (ROOT / "tools" / "guest-messages.txt").write_text(("\n\n" + "-" * 30 + "\n\n").join(msgs) + "\n", encoding="utf-8")
    print(f"\n{len(out)} link(s) written to tools/guest-links.txt (+ ready-to-send texts in tools/guest-messages.txt)\n")
    for n, u in out:
        print(f"{n}\n  {u}")

if __name__ == "__main__":
    main()
