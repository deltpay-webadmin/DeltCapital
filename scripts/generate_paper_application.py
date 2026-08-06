#!/usr/bin/env python3
"""Generate the Delt Capital "Get Funded" paper application PDF.

Mirrors the online application flow (app/variation-1-apply.jsx) step for
step — Business, Bank, Identity, Offer, Sign — so a printed application
collects exactly the same information the modal does, with paper
equivalents for the Plaid-powered steps (bank statements instead of a
Plaid link, a photo-ID copy instead of Plaid IDV).

Output: forms/delt-capital-get-funded-application.pdf
        (served at deltcapital.com/forms/delt-capital-get-funded-application.pdf)

Usage:  python3 scripts/generate_paper_application.py
Fonts:  Inter, JetBrains Mono, and Manrope (the site's font stack; Manrope
        is the brand-guide stand-in for Codec Pro) are fetched from Google
        Fonts on first run and cached next to this script.
"""

import os
import re
import urllib.request

from reportlab.lib.colors import HexColor
from reportlab.lib.pagesizes import letter
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas

# ─── Brand tokens (COLOR_PALETTE.md / BRAND_TYPOGRAPHY.md) ───
INK    = HexColor('#041E42')   # Midnight Steel
INDIGO = HexColor('#4945FF')   # Electric Indigo
WHITE  = HexColor('#FFFFFF')
PAPER  = HexColor('#F6F9FC')   # section paper canvas
LINE   = HexColor('#DCDFE4')   # hairline
MUTED  = HexColor('#697386')   # mono eyebrows / captions
BODY   = HexColor('#425466')   # supporting body text
INDIGO_WASH = HexColor('#EDEDFF')

FORM_CODE = 'FORM DLT-APP · 2026.08'

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FONT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), '.fonts')
OUT = os.path.join(REPO, 'forms', 'delt-capital-get-funded-application.pdf')

FONTS = {
    'Display-XB':  ('Manrope', 800),
    'Display-B':   ('Manrope', 700),
    'Display-SB':  ('Manrope', 600),
    'Body':        ('Inter', 400),
    'Body-SB':     ('Inter', 600),
    'Body-B':      ('Inter', 700),
    'Mono':        ('JetBrains Mono', 500),
    'Mono-B':      ('JetBrains Mono', 700),
}


def fetch_fonts():
    os.makedirs(FONT_DIR, exist_ok=True)
    for name, (family, weight) in FONTS.items():
        path = os.path.join(FONT_DIR, f'{name}.ttf')
        if not os.path.exists(path):
            fam = family.replace(' ', '+')
            css_url = f'https://fonts.googleapis.com/css2?family={fam}:wght@{weight}'
            req = urllib.request.Request(css_url, headers={'User-Agent': 'curl'})
            css = urllib.request.urlopen(req, timeout=30).read().decode()
            ttf_url = re.search(r'https://[^)]+\.ttf', css).group(0)
            with open(path, 'wb') as f:
                f.write(urllib.request.urlopen(ttf_url, timeout=30).read())
        pdfmetrics.registerFont(TTFont(name, path))


W, H = letter          # 612 × 792
M = 48                 # page margin
CW = W - 2 * M         # content width


class Form:
    def __init__(self, path):
        self.c = canvas.Canvas(path, pagesize=letter)
        self.c.setTitle('Delt Capital — Get Funded Application (Paper)')
        self.c.setAuthor('Delt Capital')
        self.c.setSubject('Business funding application — identical to deltcapital.com/apply')

    # ── primitives ──
    def eyebrow(self, x, y, text, color=MUTED, size=6.4, font='Mono-B'):
        self.c.setFont(font, size)
        self.c.setFillColor(color)
        self.c.drawString(x, y, text.upper(), charSpace=1.15)

    def field(self, x, y, w, label, hint=None, h=22):
        """Label + write-in box. y is the TOP of the label line."""
        self.eyebrow(x, y - 6.4, label)
        if hint:
            self.c.setFont('Body', 6.8)
            self.c.setFillColor(MUTED)
            self.c.drawRightString(x + w, y - 6.4, hint)
        self.c.setStrokeColor(LINE)
        self.c.setLineWidth(0.9)
        self.c.setFillColor(WHITE)
        self.c.roundRect(x, y - 11 - h, w, h, 3.5, stroke=1, fill=1)
        return y - 11 - h

    def charboxes(self, x, y, label, groups, box=15.5, gap=2.2, dash_gap=8, hint=None):
        """Label + character boxes, e.g. groups=[2, 7] for an EIN."""
        self.eyebrow(x, y - 6.4, label)
        total = sum(groups) * (box + gap) - gap + (len(groups) - 1) * dash_gap
        if hint:
            self.c.setFont('Body', 6.8)
            self.c.setFillColor(MUTED)
            self.c.drawRightString(x + total, y - 6.4, hint)
        bx = x
        top = y - 11
        self.c.setLineWidth(0.9)
        for gi, n in enumerate(groups):
            for _ in range(n):
                self.c.setStrokeColor(LINE)
                self.c.setFillColor(WHITE)
                self.c.roundRect(bx, top - 19, box, 19, 2.5, stroke=1, fill=1)
                bx += box + gap
            if gi < len(groups) - 1:
                self.c.setFillColor(MUTED)
                self.c.setFont('Body-B', 9)
                self.c.drawCentredString(bx - gap + dash_gap / 2, top - 13.5, '–')
                bx += dash_gap
        return top - 19

    def checkbox(self, x, y, label, size=9, label_font='Body', label_size=8.2, gap=5):
        self.c.setStrokeColor(MUTED)
        self.c.setLineWidth(0.9)
        self.c.setFillColor(WHITE)
        self.c.roundRect(x, y - size + 1.5, size, size, 2, stroke=1, fill=1)
        self.c.setFont(label_font, label_size)
        self.c.setFillColor(INK)
        self.c.drawString(x + size + gap, y - size + 3.5, label)
        return x + size + gap + self.c.stringWidth(label, label_font, label_size)

    def rule(self, x, y, w, color=LINE, lw=0.9):
        self.c.setStrokeColor(color)
        self.c.setLineWidth(lw)
        self.c.line(x, y, x + w, y)

    def body_text(self, x, y, lines, size=8.2, leading=12, color=BODY, font='Body'):
        self.c.setFont(font, size)
        self.c.setFillColor(color)
        for i, ln in enumerate(lines):
            self.c.drawString(x, y - i * leading, ln)
        return y - (len(lines) - 1) * leading

    def step_header(self, y, num, tag, title, accent_word=None):
        """Numbered step chip + eyebrow + display title. Returns new cursor."""
        # step chip
        self.c.setFillColor(INK)
        self.c.roundRect(M, y - 20, 20, 20, 10, stroke=0, fill=1)
        self.c.setFillColor(WHITE)
        self.c.setFont('Mono-B', 8)
        self.c.drawCentredString(M + 10, y - 14, num)
        # eyebrow + title
        self.eyebrow(M + 30, y - 7, f'Step {num} · {tag}', color=INDIGO)
        self.c.setFont('Display-XB', 14.5)
        self.c.setFillColor(INK)
        tx = M + 30
        self.c.drawString(tx, y - 21.5, title)
        if accent_word:
            tx += self.c.stringWidth(title + ' ', 'Display-XB', 14.5)
            self.c.setFillColor(INDIGO)
            self.c.drawString(tx, y - 21.5, accent_word)
        self.rule(M, y - 30, CW)
        return y - 42

    # ── page furniture ──
    def header_page1(self):
        self.c.setFillColor(INK)
        self.c.rect(0, H - 88, W, 88, stroke=0, fill=1)
        # logo block
        self.c.setFillColor(INDIGO)
        self.c.roundRect(M, H - 62, 30, 30, 8, stroke=0, fill=1)
        self.c.setFillColor(WHITE)
        self.c.setFont('Display-XB', 17)
        self.c.drawCentredString(M + 15, H - 54.5, 'D')
        self.c.setFont('Display-XB', 16)
        self.c.drawString(M + 42, H - 46, 'Delt · Get funded')
        self.c.setFont('Body', 8.2)
        self.c.setFillColor(HexColor('#A9B4C6'))
        self.c.drawString(M + 42, H - 60, 'Business funding application — paper edition')
        # right column
        self.c.setFont('Mono-B', 6.4)
        self.c.setFillColor(HexColor('#8B97AC'))
        self.c.drawRightString(W - M, H - 40, FORM_CODE, charSpace=1.1)
        self.c.drawRightString(W - M, H - 52, 'IDENTICAL TO DELTCAPITAL.COM/APPLY', charSpace=1.1)
        self.c.setFillColor(INDIGO)
        self.c.drawRightString(W - M, H - 64, 'DECISIONS IN HOURS · NOT WEEKS', charSpace=1.1)
        # office-use strip
        y = H - 88
        self.c.setFillColor(PAPER)
        self.c.rect(0, y - 26, W, 26, stroke=0, fill=1)
        self.rule(0, y - 26, W)
        self.eyebrow(M, y - 16.5, 'For Delt use only')
        self.c.setFillColor(MUTED)
        self.c.setFont('Body', 7.6)
        lx = M + 108
        for lbl, w in [('App ID', 90), ('Date received', 90), ('Funding specialist', 120)]:
            self.c.setFillColor(MUTED)
            self.c.setFont('Body', 7.6)
            self.c.drawString(lx, y - 16.5, lbl)
            lw_ = self.c.stringWidth(lbl, 'Body', 7.6)
            self.rule(lx + lw_ + 6, y - 18.5, w, color=HexColor('#B9C2CE'), lw=0.8)
            lx += lw_ + 6 + w + 18
        return y - 26

    def header_page2(self):
        self.c.setFillColor(INK)
        self.c.rect(0, H - 40, W, 40, stroke=0, fill=1)
        self.c.setFillColor(INDIGO)
        self.c.roundRect(M, H - 30, 20, 20, 6, stroke=0, fill=1)
        self.c.setFillColor(WHITE)
        self.c.setFont('Display-XB', 12)
        self.c.drawCentredString(M + 10, H - 24.5, 'D')
        self.c.setFont('Display-B', 11)
        self.c.drawString(M + 30, H - 24, 'Delt · Get funded — application, page 2 of 2')
        self.c.setFont('Mono-B', 6.4)
        self.c.setFillColor(HexColor('#8B97AC'))
        self.c.drawRightString(W - M, H - 23, FORM_CODE, charSpace=1.1)
        return H - 40

    def footer(self, page):
        self.rule(M, 40, CW)
        self.eyebrow(M, 29, 'Delt Capital')
        self.c.setFont('Mono', 6.4)
        self.c.setFillColor(MUTED)
        self.c.drawCentredString(W / 2, 29, 'DELTCAPITAL.COM/APPLY · SOFT-PULL ONLY · PURGED 30D IF DECLINED', charSpace=1.0)
        self.c.drawRightString(W - M, 29, f'PAGE {page} OF 2', charSpace=1.0)

    # ── steps ──
    def step_business(self, y):
        y = self.step_header(y, '01', 'Business', 'Tell us about your business.')
        y = self.body_text(M, y - 2, [
            'Used to verify entity formation and file a KYB check. We don’t hard-pull business credit and we',
            'don’t surface this to bureaus.',
        ]) - 16
        col = (CW - 20) / 2
        x2 = M + col + 20
        # row 1 — legal name | EIN
        self.field(M, y, col, 'Legal business name')
        self.charboxes(x2, y, 'EIN', [2, 7], hint='9 digits')
        y -= 48
        # row 2 — entity type checkboxes | state of operation
        self.eyebrow(M, y - 6.4, 'Entity type')
        cx = M
        for opt in ['LLC', 'S-Corp', 'C-Corp', 'Sole Prop', 'Partnership']:
            cx = self.checkbox(cx, y - 15, opt, label_size=7.8, gap=4) + 9
        self.charboxes(x2, y, 'State of operation — 2-letter code', [2])
        y -= 48
        # rows 3-4 — owner contact
        self.field(M, y, col, 'First name')
        self.field(x2, y, col, 'Last name')
        y -= 48
        self.field(M, y, col, 'Email')
        self.field(x2, y, col, 'Phone', hint='(555) 555-0199')
        return y - 48

    def step_bank(self, y):
        y = self.step_header(y, '02', 'Bank', 'Link your deposits.', 'Read-only.')
        y = self.body_text(M, y - 2, [
            'Online, deposits link via Plaid. On paper, statements stand in: we review 90 days of deposits and',
            'balances — never credentials. No ACH authorization at this stage.',
        ]) - 16
        col = (CW - 20) / 2
        x2 = M + col + 20
        self.field(M, y, col, 'Bank / institution name')
        self.charboxes(x2, y, 'Business checking — last 4 digits', [4])
        y -= 48
        self.field(M, y, col, 'Number of operating accounts')
        self.field(x2, y, col, 'Approx. monthly deposits', hint='$')
        y -= 46
        # attachment callout — mirrors the Plaid trust strip
        bh = 44
        self.c.setFillColor(INDIGO_WASH)
        self.c.setStrokeColor(INDIGO)
        self.c.setLineWidth(1.4)
        self.c.line(M, y - bh, M, y)
        self.c.setFillColor(INDIGO_WASH)
        self.c.rect(M, y - bh, CW, bh, stroke=0, fill=1)
        self.c.setLineWidth(1.6)
        self.c.setStrokeColor(INDIGO)
        self.c.line(M + 0.8, y - bh, M + 0.8, y)
        self.eyebrow(M + 14, y - 14, 'Attach — required', color=INDIGO)
        self.checkbox(M + 14, y - 24, 'Most recent 3 months (90 days) of business bank statements — all pages, every operating account', label_size=8.4)
        self.c.setFont('Body', 7.4)
        self.c.setFillColor(MUTED)
        self.c.drawString(M + 28, y - 38.5, 'Statements are reviewed read-only, exactly like a Plaid connection. Revoke by asking us to shred — anytime.')
        return y - bh - 18

    def path_strip(self, y):
        """Horizontal version of the online modal's 5-step rail."""
        bh = 96
        self.c.setFillColor(PAPER)
        self.c.roundRect(M, y - bh, CW, bh, 8, stroke=0, fill=1)
        self.eyebrow(M + 16, y - 16, 'The path — same five steps as online', color=INDIGO)
        steps = [
            ('01', 'Business',  'THIS FORM · PAGE 1'),
            ('02', 'Bank',      'THIS FORM · PAGE 1'),
            ('03', 'Identity',  'THIS FORM · PAGE 2'),
            ('04', 'Offer',     'DELT COMPLETES · 72H LOCK'),
            ('05', 'Done',      'FUNDED BY 2:00 PM ET'),
        ]
        inset = 52
        span = CW - 2 * inset
        cy = y - 44
        r = 10
        # connecting track
        self.c.setStrokeColor(LINE)
        self.c.setLineWidth(1.2)
        self.c.line(M + inset + r, cy, M + inset + span - r, cy)
        for i, (num, name, sub) in enumerate(steps):
            cx = M + inset + span * i / 4
            filled = i < 3  # the steps this paper form completes
            self.c.setLineWidth(1.1)
            if filled:
                self.c.setFillColor(INDIGO)
                self.c.circle(cx, cy, r, stroke=0, fill=1)
                self.c.setFillColor(WHITE)
            else:
                self.c.setFillColor(WHITE)
                self.c.setStrokeColor(INDIGO if i == 3 else MUTED)
                self.c.circle(cx, cy, r, stroke=1, fill=1)
                self.c.setFillColor(INK)
            self.c.setFont('Mono-B', 7.5)
            self.c.drawCentredString(cx, cy - 2.6, num)
            self.c.setFont('Display-B', 9)
            self.c.setFillColor(INK)
            self.c.drawCentredString(cx, cy - 24, name)
            self.c.setFont('Mono', 5.6)
            self.c.setFillColor(MUTED)
            self.c.drawCentredString(cx, cy - 35, sub, charSpace=0.7)
        return y - bh - 16

    def step_identity(self, y):
        y = self.step_header(y, '03', 'Identity', 'Verify identity.')
        y = self.body_text(M, y - 2, [
            'Online, ID + selfie run through Plaid IDV. On paper, a photo-ID copy does the same job. Soft-pull on',
            'the guarantor — no impact to your personal credit.',
        ]) - 16
        col = (CW - 20) / 2
        x2 = M + col + 20
        self.field(M, y, col, 'Guarantor full legal name', hint='as it appears on ID')
        # ID type checkboxes
        self.eyebrow(x2, y - 6.4, 'Government ID type')
        cx = x2
        for opt in ["Driver's license", 'State ID', 'Passport']:
            cx = self.checkbox(cx, y - 15, opt) + 13
        y -= 48
        self.field(M, y, col, 'ID number')
        self.charboxes(x2, y, 'Issuing state', [2])
        y -= 46
        bh = 30
        self.c.setFillColor(INDIGO_WASH)
        self.c.rect(M, y - bh, CW, bh, stroke=0, fill=1)
        self.c.setStrokeColor(INDIGO)
        self.c.setLineWidth(1.6)
        self.c.line(M + 0.8, y - bh, M + 0.8, y)
        self.eyebrow(M + 14, y - 12.5, 'Attach — required', color=INDIGO)
        self.checkbox(M + 14, y - 22.5, 'Legible copy of the guarantor’s government-issued photo ID (front and back)', label_size=8.4)
        y -= bh + 14
        # soft-inquiry note (mirrors the on-screen card)
        self.c.setFont('Body-SB', 8.4)
        self.c.setFillColor(INK)
        self.c.drawString(M, y - 4, 'Soft inquiry only.')
        self.c.setFont('Body', 8.2)
        self.c.setFillColor(BODY)
        self.c.drawString(M + self.c.stringWidth('Soft inquiry only.', 'Body-SB', 8.4) + 5, y - 4,
                          'A hard pull happens only if you counter-sign an offer — and only on the personal guarantor, never the business.')
        return y - 22

    def step_offer(self, y):
        y = self.step_header(y, '04', 'Offer', 'Your offer.', 'One page.')
        y = self.body_text(M, y - 2, [
            'No addenda, no “processing fee”, no origination fee. Tell us what you need — your one-page offer comes',
            'back for counter-signature, locked for 72 hours.',
        ]) - 16
        col = (CW - 20) / 2
        x2 = M + col + 20
        self.field(M, y, col, 'Requested advance amount', hint='$5,000 – $500,000')
        self.field(x2, y, col, 'Use of funds', hint='optional')
        y -= 50
        # office-use offer card — mirrors the online offer card
        card_h = 74
        self.c.setStrokeColor(LINE)
        self.c.setLineWidth(0.9)
        self.c.setFillColor(WHITE)
        self.c.roundRect(M, y - card_h, CW, card_h, 8, stroke=1, fill=1)
        # dark header band of the card
        self.c.setFillColor(INK)
        self.c.roundRect(M, y - 26, CW, 26, 8, stroke=0, fill=1)
        self.c.rect(M, y - 26, CW, 13, stroke=0, fill=1)
        self.eyebrow(M + 14, y - 11, 'Offer — completed by Delt Capital', color=HexColor('#8B97AC'))
        self.c.setFont('Mono-B', 7)
        self.c.setFillColor(WHITE)
        self.c.drawString(M + 14, y - 21.5, 'OFFER ID  DLT-2026-________', charSpace=0.8)
        self.c.setFillColor(INDIGO)
        self.c.roundRect(W - M - 76, y - 20.5, 62, 13, 6.5, stroke=0, fill=1)
        self.c.setFont('Mono-B', 6.2)
        self.c.setFillColor(WHITE)
        self.c.drawCentredString(W - M - 45, y - 16.2, 'LOCKED 72H', charSpace=0.8)
        # terms grid
        cw4 = CW / 4
        labels = ['Advance amount', 'Factor rate', 'Total repayment', 'Term / weekly debit']
        fills  = ['$', '×', '$', 'mo  ·  $']
        for i, (lbl, pre) in enumerate(zip(labels, fills)):
            gx = M + i * cw4
            if i:
                self.c.setStrokeColor(LINE)
                self.c.setLineWidth(0.9)
                self.c.line(gx, y - card_h + 14, gx, y - 32)
            self.eyebrow(gx + 14, y - 40, lbl, size=5.8)
            self.c.setFont('Display-B', 11)
            self.c.setFillColor(INK)
            self.c.drawString(gx + 14, y - 56, pre)
        self.rule(M, y - card_h + 14, CW)
        self.c.setFont('Mono', 6.2)
        self.c.setFillColor(MUTED)
        self.c.drawString(M + 14, y - card_h + 5, 'NO ORIGINATION · NO ACH FEE · EARLY-PAY REBATE', charSpace=0.9)
        self.c.drawRightString(W - M - 14, y - card_h + 5, 'WIRES SAME-DAY WHEN SIGNED BEFORE 2:00 PM ET', charSpace=0.9)
        return y - card_h - 18

    def step_sign(self, y):
        y = self.step_header(y, '05', 'Sign', 'Certification & authorization.')
        terms = [
            'By signing below, I certify that I own or am authorized to act for the business named in Step 01, and that everything in this',
            'application is true and complete. I authorize Delt Capital to verify entity formation (KYB), to review the attached bank',
            'statements read-only, and to obtain a soft credit inquiry on the personal guarantor — a hard pull occurs only if I counter-sign',
            'an offer. If this application is declined, all submitted data is purged within 30 days. Accepting an offer means agreeing to',
            'Delt’s standard advance agreement; a countersigned copy and payment schedule are returned by email the same day.',
        ]
        y = self.body_text(M, y - 2, terms, size=7.8, leading=11.6) - 22
        col = (CW - 20) / 2
        x2 = M + col + 20
        sub = (col - 20) / 2
        # signature row
        self.rule(M, y - 24, col)
        self.eyebrow(M, y - 33, 'Owner / guarantor signature')
        self.rule(x2, y - 24, sub)
        self.eyebrow(x2, y - 33, 'Date')
        self.rule(x2 + sub + 20, y - 24, sub)
        self.eyebrow(x2 + sub + 20, y - 33, 'Printed name & title')
        return y - 52

    def submit_box(self, y):
        bh = 58
        self.c.setFillColor(INK)
        self.c.roundRect(M, y - bh, CW, bh, 8, stroke=0, fill=1)
        self.eyebrow(M + 16, y - 16, 'Submit this application', color=INDIGO)
        self.c.setFont('Body', 8.4)
        self.c.setFillColor(WHITE)
        self.c.drawString(M + 16, y - 30, 'Email a scan with attachments to hello@deltcapital.com, or hand it to your funding specialist.')
        self.c.setFillColor(HexColor('#A9B4C6'))
        self.c.drawString(M + 16, y - 43, 'Questions: (888) 555-0144 · Mon–Fri, 8:00a–7:00p ET · Reply in under 1 hour during business hours.')
        self.c.setFont('Display-B', 10)
        self.c.setFillColor(WHITE)
        self.c.drawRightString(W - M - 16, y - 37, 'Funded in hours.')
        return y - bh

    # ── assemble ──
    def build(self):
        # page 1
        y = self.header_page1() - 34
        y = self.step_business(y - 2)
        y = self.step_bank(y - 4)
        self.path_strip(y - 10)
        self.footer(1)
        self.c.showPage()
        # page 2
        y = self.header_page2() - 28
        y = self.step_identity(y)
        y = self.step_offer(y)
        y = self.step_sign(y)
        self.submit_box(y - 2)
        self.footer(2)
        self.c.showPage()
        self.c.save()


def main():
    fetch_fonts()
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    Form(OUT).build()
    print(f'Wrote {OUT}')


if __name__ == '__main__':
    main()
