# Church Admin OS — landing page

The sales website for **Church Admin OS**, a Notion workspace for pastors, staff and volunteers.

It's a plain static site (HTML, CSS and a little JavaScript). There's no build step, so Vercel serves it as it is.

## Files

| File | What it is |
|---|---|
| `index.html` | The whole page |
| `styles.css` | All the styling |
| `main.js` | The £/₦ price switch and **your checkout links** |
| `favicon.svg`, `apple-touch-icon.png` | Browser and phone icons |
| `og-image.png` | The preview image shown when the link is shared on WhatsApp, Facebook, LinkedIn or X |
| `thank-you.html` | Page buyers land on after paying. It asks `/api/verify` whether the payment went through before showing the template link (hidden from search engines) |
| `api/verify.js` | Vercel function: checks the Stripe Checkout Session and returns the template link only for paid sessions |
| `vercel.json` | Vercel settings (clean URLs, caching, noindex for the thank-you page and PDF) |

## Deploy to Vercel

1. Go to [vercel.com/new](https://vercel.com/new) and import this GitHub repository.
2. Leave **Framework Preset** as **Other**. There's no build command and no output directory to set.
3. Click **Deploy**. You'll get an address like `church-admin-os-site.vercel.app`.

Every push to `main` redeploys automatically.

## Before you go live

- [x] **Checkout links:** Complete OS uses a Stripe Payment Link (redirects to `/thank-you?session_id={CHECKOUT_SESSION_ID}` after payment); Lemon Squeezy is kept in `main.js` as a commented fallback until approved. Done-for-you opens an email to support. To sell in naira, add Paystack links under `ngn` in `main.js` and the £/₦ switch reappears automatically.
- [x] **Refund policy:** 14-day money-back guarantee, no questions asked (hero line, pricing note and FAQ in `index.html`).
- [ ] **Prices:** in `index.html`, check the `data-gbp` and `data-ngn` values on each `.price`.
- [ ] **Testimonial:** once you have a real quote, fill it in under `<!-- TESTIMONIAL -->` and delete the `hidden` attribute on that section.
- [x] **Share image:** `og:image` points at `https://www.churchadminos.com/og-image.png`. If the domain ever changes, update `og:url` and `og:image` in `index.html`.

## Domain

Live at **https://www.churchadminos.com** (DNS at Hostinger, hosted on Vercel). Keep the MX records in Hostinger untouched so `support@churchadminos.com` keeps working.

## Changing the domain later

In Vercel, open the project, go to **Settings → Domains**, add your domain, then follow the DNS instructions it shows you.

## Notes

- Visitors in Nigeria (by time zone) see naira prices first, and everyone else sees pounds. The choice is remembered on their device.
- The page collects no personal data and sets no cookies. If you add analytics or a sign-up form later, add a privacy policy too.

© Apex Digital Africa

## Protected thank-you page (Stripe)

The template link is **not** in this repository. `/thank-you` reads the `session_id` Stripe adds after payment and asks `api/verify.js`, which checks the session with Stripe and only returns the link if it was paid. Anyone opening `/thank-you` directly sees "We couldn't find your payment".

Vercel → Project → Settings → **Environment Variables**:

| Name | Value | Environments |
|---|---|---|
| `STRIPE_SECRET_KEY` | Restricted key with **Checkout Sessions: Read** only. `rk_live_…` for Production, `rk_test_…` for Preview | Production / Preview |
| `NOTION_TEMPLATE_URL` | The "Duplicate as template" Notion link | Production and Preview |
| `STRIPE_PAYMENT_LINK_ID` | Optional: the `plink_…` ID of the Church Admin OS payment link | Production (live ID) / Preview (test ID) |

Stripe payment link → **After payment** → redirect to:
`https://www.churchadminos.com/thank-you?session_id={CHECKOUT_SESSION_ID}` (type `{CHECKOUT_SESSION_ID}` exactly; Stripe fills it in).

Changing an environment variable needs a redeploy to take effect (Deployments → ⋯ → Redeploy).
