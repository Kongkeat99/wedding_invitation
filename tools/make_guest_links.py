#!/usr/bin/env python3
"""Make a personal invitation link (name + preview photo) for every guest.

1. Put each guest's photo in  tools/guest-photos/
2. List guests in             tools/guests.csv   (columns: code,name,photo)
3. Run                        python3 tools/make_guest_links.py
4. Commit/push (or redeploy), then send each link from tools/guest-links.txt

Why separate pages? Telegram/Facebook/WhatsApp build the preview card from the page's
<meta> tags WITHOUT running JavaScript, so each guest needs a real page (g/<code>/)
with their own name + photo in those tags. Opening it forwards to the invitation with
the guest's name already shown.
"""
import argparse, csv, html, re, sys
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
</head><body><p><a href="{target}">{title}</a></p></body></html>
"""

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--base", default=default_base(), help="public site address, e.g. https://sarserei.com (no trailing slash)")
    ap.add_argument("--csv", default=str(ROOT / "tools" / "guests.csv"))
    a = ap.parse_args()
    base = a.base.rstrip("/")
    if not base:
        sys.exit("Give the public site address: --base https://your-site")
    rows = list(csv.DictReader(open(a.csv, encoding="utf-8-sig")))
    out, seen = [], set()
    for r in rows:
        code = (r.get("code") or "").strip().lower()
        name = " ".join((r.get("name") or "").split())
        photo = (r.get("photo") or "").strip()
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
        page = PAGE.format(title=html.escape(title), desc=html.escape("សូមគោរពអញ្ជើញចូលរួមក្នុងពិធីមង្គលការរបស់យើងខ្ញុំ · Join us to celebrate our wedding"),
                           image=html.escape(f"{base}/{cover}"), url=html.escape(url),
                           target=html.escape("../../?to=" + quote(name)))
        d = ROOT / "g" / code; d.mkdir(parents=True, exist_ok=True)
        (d / "index.html").write_text(page, encoding="utf-8")
        out.append((name, url))
    (ROOT / "tools" / "guest-links.txt").write_text("\n".join(f"{n}\t{u}" for n, u in out) + "\n", encoding="utf-8")
    print(f"\n{len(out)} link(s) written to tools/guest-links.txt\n")
    for n, u in out:
        print(f"{n}\n  {u}")

if __name__ == "__main__":
    main()
