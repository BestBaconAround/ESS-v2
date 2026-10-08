"""Renders each page of the Technical Service Manual to web/public/tsm/pNNN.webp so the chatbot can show the real pages
(tables, photos, diagrams). PDF page number = printed page number.
  uv run --with pymupdf --with pillow python tools/render-tsm-pages.py "<path to the PDF>" [first] [last]
"""
import io
import sys
from pathlib import Path

import fitz
from PIL import Image

pdf = sys.argv[1]
doc = fitz.open(pdf)
first = int(sys.argv[2]) if len(sys.argv) > 2 else 6
last = int(sys.argv[3]) if len(sys.argv) > 3 else len(doc)
out = Path(__file__).resolve().parent.parent / "web" / "public" / "tsm"
out.mkdir(parents=True, exist_ok=True)

total = 0
for n in range(first, last + 1):
    pix = doc[n - 1].get_pixmap(matrix=fitz.Matrix(1.6, 1.6), alpha=False)
    img = Image.open(io.BytesIO(pix.tobytes("png"))).convert("RGB")
    path = out / f"p{n:03d}.webp"
    img.save(path, "WEBP", quality=74, method=6)
    total += path.stat().st_size
print(f"{last - first + 1} pages, {total / 1e6:.1f} MB, last size {img.size}")
