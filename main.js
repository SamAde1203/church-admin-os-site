/*
 * Church Admin OS landing page
 *
 * CHECKOUT LINKS: paste your Gumroad / Lemon Squeezy / Paystack links below.
 * Until a link is filled in, its button simply scrolls to the pricing section.
 * You can use different links for each currency.
 */
const CHECKOUT = {
  gbp: {
    starter: '',       // e.g. 'https://yourname.gumroad.com/l/church-admin-starter'
    complete: '',
    done_for_you: ''   // a booking link (e.g. Calendly) or a contact form
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
      if (url) {
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

  let initial = 'gbp';
  try {
    const saved = localStorage.getItem('cao-currency');
    if (saved === 'gbp' || saved === 'ngn') initial = saved;
    else if ((Intl.DateTimeFormat().resolvedOptions().timeZone || '') === 'Africa/Lagos') initial = 'ngn';
  } catch (e) { /* ignore */ }
  setCurrency(initial);

  const year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
