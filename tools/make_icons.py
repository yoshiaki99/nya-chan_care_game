#!/usr/bin/env python3
"""ホーム画面のアイコンと、SNS で共有されたときの絵（OGP）を、ニャーちゃんの基準画から作る

  python3 tools/make_icons.py
必要なもの：pip install pillow
"""
import os

from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BASE = os.path.join(ROOT, 'assets/characters/nya_base.png')
BG = (251, 238, 240)  # manifest の background_color と同じ


def main():
    nya = Image.open(BASE).convert('RGBA')
    head = nya.crop((190, 40, 1064, 640))  # 耳の先から あごの下まで
    for name, size in [('icon-512.png', 512), ('icon-192.png', 192), ('apple-touch-icon.png', 180)]:
        im = Image.new('RGBA', (size, size), BG + (255,))
        w = round(size * 0.84)
        h = round(head.height * w / head.width)
        im.alpha_composite(head.resize((w, h), Image.LANCZOS), ((size - w) // 2, (size - h) // 2 + round(size * 0.03)))
        im.convert('RGB').save(os.path.join(ROOT, 'icons', name), optimize=True)
    og = Image.new('RGBA', (1200, 630), BG + (255,))
    body = nya.crop((190, 40, 1064, 1210))
    h = 580
    w = round(body.width * h / body.height)
    og.alpha_composite(body.resize((w, h), Image.LANCZOS), ((1200 - w) // 2, 25))
    og.convert('RGB').save(os.path.join(ROOT, 'icons', 'og-image.png'), optimize=True)
    print('icons/ に 作りました')


if __name__ == '__main__':
    main()
