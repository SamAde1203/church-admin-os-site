/*
 * Church Admin OS landing page
 *
 * CHECKOUT LINKS: paste your Gumroad / Lemon Squeezy / Paystack links below.
 * Until a link is filled in, its button simply scrolls to the pricing section.
 * You can use different links for each currency.
 */
const CHECKOUT = {
  gbp: {
    starter: '',       // Starter is hidden on the page until its template is ready
    complete: 'https://church-admin-os.lemonsqueezy.com/checkout/buy/fdef26ea-7846-496e-b700-598f79afb1bb',
    done_for_you: 'mailto:support@churchadminos.com?subject=Done-for-you%20setup%20enquiry'
  },
  ngn: {
    starter: '',       // e.g. a Paystack payment page
    complete: '',
    done_for_you: ''
  }
};

(function () {
  const buttons = document.querySelectorAll('.toggle button');
  const prices = document.querySelectorAll('.price[data-gbp]');
  const checkoutLinks = document.querySelectorAll('[data-checkout]');

  function setCurrency(cur) {
    buttons.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.cur === cur)));
    prices.forEach(p => { p.textContent = p.dataset[cur]; });
    checkoutLinks.forEach(a => {
      const url = CHECKOUT[cur][a.dataset.checkout];
      if (url && url.startsWith('mailto:')) {
        a.href = url;
        a.removeAttribute('target');
        a.removeAttribute('rel');
      } else if (url) {
        a.href = url;
        a.target = '_blank';
        a.rel = 'noopener';
      } else {
        a.href = '#pricing';
        a.removeAttribute('target');
        a.removeAttribute('rel');
      }
    });
    try { localStorage.setItem('cao-currency', cur); } catch (e) { /* storage unavailable */ }
  }

  buttons.forEach(b => b.addEventListener('click', () => setCurrency(b.dataset.cur)));

  const year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());

  // Until a naira checkout link exists, show pounds to everyone and hide the switch.
  const ngnReady = Object.values(CHECKOUT.ngn).some(Boolean);
  if (!ngnReady) {
    const toggle = document.querySelector('.toggle');
    if (toggle) toggle.hidden = true;
    setCurrency('gbp');
    return;
  }

  let initial = 'gbp';
  try {
    const saved = localStorage.getItem('cao-currency');
    if (saved === 'gbp' || saved === 'ngn') initial = saved;
    else if ((Intl.DateTimeFormat().resolvedOptions().timeZone || '') === 'Africa/Lagos') initial = 'ngn';
  } catch (e) { /* ignore */ }
  setCurrency(initial);
})();
