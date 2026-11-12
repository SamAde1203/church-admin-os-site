// Checks a Stripe Checkout Session and, only if it is paid, returns the
// template link. The link itself lives in a Vercel environment variable,
// never in the website's code.
//
// Environment variables (Vercel → Project → Settings → Environment Variables):
//   STRIPE_SECRET_KEY        Restricted key (rk_live_… / rk_test_…) with
//                            "Checkout Sessions: Read" permission only.
//   NOTION_TEMPLATE_URL      The public "Duplicate as template" Notion link.
//   STRIPE_PAYMENT_LINK_ID   Optional. plink_… of the Church Admin OS payment
//                            link; when set, payments made through any other
//                            link in the account are not accepted here.

const SESSION_ID = /^cs_(live|test)_[A-Za-z0-9]{10,200}$/;

function send(res, status, body) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.statusCode = status;
  res.end(JSON.stringify(body));
}

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') return send(res, 405, { ok: false, reason: 'method' });

  const url = new URL(req.url, 'http://localhost');
  const id = url.searchParams.get('session_id') || '';
  if (!SESSION_ID.test(id)) return send(res, 400, { ok: false, reason: 'missing' });

  const key = process.env.STRIPE_SECRET_KEY;
  const templateUrl = process.env.NOTION_TEMPLATE_URL;
  if (!key || !templateUrl) return send(res, 500, { ok: false, reason: 'not_configured' });

  let session;
  try {
    const r = await fetch('https://api.stripe.com/v1/checkout/sessions/' + encodeURIComponent(id), {
      headers: { Authorization: 'Bearer ' + key }
    });
    if (r.status === 404) return send(res, 404, { ok: false, reason: 'not_found' });
    if (!r.ok) return send(res, 502, { ok: false, reason: 'stripe_error' });
    session = await r.json();
  } catch (e) {
    return send(res, 502, { ok: false, reason: 'stripe_unreachable' });
  }

  const linkId = process.env.STRIPE_PAYMENT_LINK_ID;
  const rightLink = !linkId || session.payment_link === linkId;
  const paid = session.status === 'complete' && session.payment_status === 'paid';

  if (paid && rightLink) return send(res, 200, { ok: true, templateUrl });
  return send(res, 402, { ok: false, reason: 'not_paid' });
};
