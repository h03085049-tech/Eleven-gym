/* ============================================================
   IRON EMPIRE — Main JavaScript
   Author: Iron Empire Dev Team
   All interactions, animations, form logic & payment simulation
============================================================ */

/* ============================================================
   1. PRELOADER
============================================================ */
(function () {
  const bar = document.getElementById('plBar');
  const pre = document.getElementById('preloader');
  if (!pre) return;

  let p = 0;
  const t = setInterval(() => {
    p += Math.random() * 16;
    if (p > 92) p = 92;
    bar.style.width = p + '%';
  }, 130);

  function finish() {
    clearInterval(t);
    bar.style.width = '100%';
    setTimeout(() => {
      pre.classList.add('done');
      document.body.classList.remove('lock');
    }, 420);
  }

  document.body.classList.add('lock');
  window.addEventListener('load', () => setTimeout(finish, 500));
  setTimeout(finish, 3200); // safety fallback
})();


/* ============================================================
   2. CUSTOM CURSOR
============================================================ */
(function () {
  const dot = document.getElementById('curDot');
  const ring = document.getElementById('curRing');
  if (!dot || window.matchMedia('(hover:none)').matches) return;

  let mx = 0, my = 0, rx = 0, ry = 0;

  window.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    dot.style.transform = `translate(${mx}px,${my}px) translate(-50%,-50%)`;
  });

  (function loop() {
    rx += (mx - rx) * 0.16;
    ry += (my - ry) * 0.16;
    ring.style.transform = `translate(${rx}px,${ry}px) translate(-50%,-50%)`;
    requestAnimationFrame(loop);
  })();

  const hoverables = document.querySelectorAll(
    'a,button,[data-cursor],.pcard,.tcard,.gitem,.feat,.plan,.ccard,.pp'
  );
  hoverables.forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('grow'));
    el.addEventListener('mouseleave', () => ring.classList.remove('grow'));
  });
})();


/* ============================================================
   3. NAVBAR + MOBILE MENU
============================================================ */
(function () {
  const nav = document.getElementById('nav');
  const burger = document.getElementById('burger');
  const menu = document.getElementById('mobileMenu');
  if (!nav || !burger || !menu) return;

  const links = menu.querySelectorAll('a');

  const onScroll = () => nav.classList.toggle('solid', window.scrollY > 40);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  burger.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    burger.classList.toggle('open', open);
    document.body.classList.toggle('lock', open);
    links.forEach((a, i) => {
      a.style.transitionDelay = open ? (0.06 * i + 0.15) + 's' : '0s';
    });
  });

  links.forEach(a => a.addEventListener('click', () => {
    menu.classList.remove('open');
    burger.classList.remove('open');
    document.body.classList.remove('lock');
  }));

  // Active link highlighting
  const secs = [...document.querySelectorAll('section[id]')];
  const navLinks = [...document.querySelectorAll('.nav-links a')];
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        navLinks.forEach(l =>
          l.classList.toggle('active', l.getAttribute('href') === '#' + en.target.id)
        );
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  secs.forEach(s => io.observe(s));
})();


/* ============================================================
   4. REVEAL ON SCROLL
============================================================ */
(function () {
  const items = document.querySelectorAll('.rv,.rv-l,.rv-r,.rv-s');
  if (!items.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach((en, i) => {
      if (en.isIntersecting) {
        setTimeout(() => en.target.classList.add('in'), i * 70);
        io.unobserve(en.target);
      }
    });
  }, { threshold: 0.14, rootMargin: '0px 0px -60px 0px' });

  items.forEach(el => io.observe(el));
})();


/* ============================================================
   5. HERO PARALLAX
============================================================ */
(function () {
  const bg = document.getElementById('heroBg');
  if (!bg) return;

  let ticking = false;

  function update() {
    const y = window.scrollY;
    if (y < window.innerHeight * 1.3) {
      bg.style.transform = `translate3d(0,${y * 0.32}px,0) scale(1.06)`;
    }
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  }, { passive: true });

  update();
})();


/* ============================================================
   6. MARQUEE DUPLICATE
============================================================ */
(function () {
  const track = document.getElementById('marquee');
  if (!track) return;
  track.innerHTML += track.innerHTML; // duplicate for seamless loop
})();


/* ============================================================
   7. COUNT-UP STATS
============================================================ */
(function () {
  const nums = document.querySelectorAll('[data-count]');
  if (!nums.length) return;

  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;

      const el = en.target;
      const target = parseInt(el.dataset.count, 10);
      const suffix = el.dataset.suffix || '';
      const dur = 1900;
      const start = performance.now();

      function tick(now) {
        const p = Math.min((now - start) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        const val = Math.floor(eased * target);
        el.textContent = val.toLocaleString('en-US') + (p === 1 ? suffix : '');
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
      io.unobserve(el);
    });
  }, { threshold: 0.5 });

  nums.forEach(n => io.observe(n));
})();


/* ============================================================
   8. HORIZONTAL SCROLL PROGRAMS
============================================================ */
(function () {
  const section = document.getElementById('programs');
  const track = document.getElementById('hsTrack');
  const progress = document.getElementById('hsProgress');
  if (!section || !track) return;

  // Apply card background images from --img custom property
  track.querySelectorAll('.pcard').forEach(card => {
    const url = card.style.getPropertyValue('--img');
    if (url) {
      const inner = document.createElement('div');
      inner.style.cssText = `position:absolute;inset:0;background-image:${url};background-size:cover;background-position:center;transition:transform 1.1s cubic-bezier(.19,1,.22,1);z-index:0`;
      card.insertBefore(inner, card.firstChild);
      card.addEventListener('mouseenter', () => inner.style.transform = 'scale(1.09)');
      card.addEventListener('mouseleave', () => inner.style.transform = 'scale(1)');
    }
  });

  function isMobile() { return window.innerWidth <= 900; }

  function update() {
    if (isMobile()) return;
    const rect = section.getBoundingClientRect();
    const total = section.offsetHeight - window.innerHeight;
    if (total <= 0) return;

    let p = (-rect.top) / total;
    p = Math.max(0, Math.min(1, p));

    const maxX = Math.max(0, track.scrollWidth - window.innerWidth + 40);
    track.style.transform = `translate3d(${-p * maxX}px,0,0)`;
    if (progress) progress.style.width = (p * 100) + '%';
  }

  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', () => {
    if (isMobile()) track.style.transform = 'translate3d(0,0,0)';
    update();
  });
  update();
})();


/* ============================================================
   9. TILT CARDS
============================================================ */
(function () {
  if (window.matchMedia('(hover:none)').matches) return;

  document.querySelectorAll('[data-tilt]').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `perspective(900px) rotateY(${x * 7}deg) rotateX(${-y * 7}deg) translateY(-10px)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });
})();


/* ============================================================
   10. MAGNETIC BUTTONS
============================================================ */
(function () {
  if (window.matchMedia('(hover:none)').matches) return;

  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width / 2) * 0.22;
      const y = (e.clientY - r.top - r.height / 2) * 0.32;
      btn.style.transform = `translate(${x}px,${y}px) translateY(-3px)`;
    });
    btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
  });
})();


/* ============================================================
   11. GLOBAL STATE
============================================================ */
let currentStep = 1;
let selectedPlan = 'basic';
let billingMode = 'm';

const planData = {
  basic: { name: 'Basic', m: 3000, y: 28800 },
  pro:   { name: 'Pro',   m: 5500, y: 52800 },
  elite: { name: 'Elite', m: 9500, y: 91200 }
};


/* ============================================================
   12. BILLING TOGGLE (PRICING SECTION)
============================================================ */
(function () {
  const btns = document.querySelectorAll('.billing-toggle button');
  const amts = document.querySelectorAll('.price .amt');
  const pers = document.querySelectorAll('.price .per');
  const notes = document.querySelectorAll('.price-note');
  if (!btns.length) return;

  btns.forEach(b => {
    b.addEventListener('click', () => {
      btns.forEach(x => x.classList.remove('on'));
      b.classList.add('on');

      const mode = b.dataset.bill;
      billingMode = mode;

      amts.forEach(a => {
        a.style.transition = 'opacity .3s';
        a.style.opacity = 0;
        setTimeout(() => {
          a.textContent = a.dataset[mode];
          a.style.opacity = 1;
        }, 150);
      });

      pers.forEach(p => p.textContent = p.dataset[mode]);
      notes.forEach(n => n.textContent = n.dataset[mode]);

      // update plan picker prices in form
      document.querySelectorAll('.pp').forEach(pp => {
        const price = mode === 'm' ? pp.dataset.priceM : pp.dataset.priceY;
        pp.querySelector('.pp-price').textContent =
          'Rs ' + Number(price).toLocaleString('en-US') + (mode === 'm' ? '/mo' : '/yr');
      });

      updateSummary();
    });
  });
})();


/* ============================================================
   13. MULTI-STEP ADMISSION FORM
============================================================ */
function goStep(n) {
  if (n > currentStep) {
    if (!validateStep(currentStep)) return;
  }
  currentStep = n;

  document.querySelectorAll('.form-step').forEach(s => {
    s.classList.toggle('on', Number(s.dataset.step) === n);
  });

  document.querySelectorAll('.step-dot').forEach(d => {
    const ds = Number(d.dataset.step);
    d.classList.toggle('active', ds === n);
    d.classList.toggle('done', ds < n);
  });

  const labels = ['Personal Details', 'Plan Selection', 'Secure Payment'];
  const stepLabelEl = document.getElementById('stepLabel');
  if (stepLabelEl) stepLabelEl.textContent = `Step ${n} of 3 — ${labels[n - 1]}`;

  if (n === 3) updateSummary();

  const joinSection = document.querySelector('#join');
  if (joinSection) {
    joinSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function validateStep(step) {
  let ok = true;
  const stepEl = document.querySelector(`.form-step[data-step="${step}"]`);
  if (!stepEl) return true;

  stepEl.querySelectorAll('[required]').forEach(input => {
    const field = input.closest('.field');
    let valid = input.value.trim() !== '';

    if (valid && input.type === 'email') {
      valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value);
    }
    if (valid && input.type === 'tel') {
      valid = input.value.replace(/\D/g, '').length >= 7;
    }

    field.classList.toggle('err', !valid);
    if (!valid) ok = false;
  });

  return ok;
}

document.querySelectorAll('[data-next]').forEach(b => {
  b.addEventListener('click', () => goStep(Number(b.dataset.next)));
});

document.querySelectorAll('[data-prev]').forEach(b => {
  b.addEventListener('click', () => goStep(Number(b.dataset.prev)));
});

// Clear error on input
document.querySelectorAll('.field input, .field select, .field textarea').forEach(i => {
  i.addEventListener('input', () => i.closest('.field').classList.remove('err'));
});


/* ============================================================
   14. PLAN PICKER
============================================================ */
document.querySelectorAll('.pp').forEach(pp => {
  pp.addEventListener('click', () => {
    document.querySelectorAll('.pp').forEach(x => x.classList.remove('sel'));
    pp.classList.add('sel');
    selectedPlan = pp.dataset.plan;
    updateSummary();
  });
});

// Pricing "Choose" buttons — preselect plan & jump to step 2
document.querySelectorAll('[data-plan]').forEach(b => {
  b.addEventListener('click', () => {
    const plan = b.dataset.plan;
    const target = document.querySelector(`.pp[data-plan="${plan}"]`);
    if (target) {
      document.querySelectorAll('.pp').forEach(x => x.classList.remove('sel'));
      target.classList.add('sel');
      selectedPlan = plan;
    }
    setTimeout(() => goStep(2), 420);
  });
});


/* ============================================================
   15. PAYMENT TABS
============================================================ */
document.querySelectorAll('.pt').forEach(t => {
  t.addEventListener('click', () => {
    document.querySelectorAll('.pt').forEach(x => x.classList.remove('sel'));
    t.classList.add('sel');

    document.querySelectorAll('.pay-panel').forEach(p => {
      p.classList.toggle('on', p.dataset.panel === t.dataset.pay);
    });
  });
});


/* ============================================================
   16. ORDER SUMMARY
============================================================ */
function updateSummary() {
  const d = planData[selectedPlan];
  if (!d) return;

  const price = billingMode === 'm' ? d.m : d.y;
  const total = price + 2000;
  const fmt = n => 'Rs ' + n.toLocaleString('en-US');

  const el = id => document.getElementById(id);
  if (!el('sumPlan')) return;

  el('sumPlan').textContent = d.name;
  el('sumBill').textContent = billingMode === 'm' ? 'Monthly' : 'Yearly';
  el('sumPrice').textContent = fmt(price);
  el('sumTotal').textContent = fmt(total);
}


/* ============================================================
   17. CARD INPUT FORMATTING
============================================================ */
(function () {
  const cnum = document.getElementById('cnum');
  const cexp = document.getElementById('cexp');
  const ccvv = document.getElementById('ccvv');

  if (cnum) cnum.addEventListener('input', e => {
    let v = e.target.value.replace(/\D/g, '').slice(0, 16);
    e.target.value = v.replace(/(.{4})/g, '$1 ').trim();
  });

  if (cexp) cexp.addEventListener('input', e => {
    let v = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (v.length > 2) v = v.slice(0, 2) + '/' + v.slice(2);
    e.target.value = v;
  });

  if (ccvv) ccvv.addEventListener('input', e => {
    e.target.value = e.target.value.replace(/\D/g, '').slice(0, 4);
  });
})();


/* ============================================================
   18. FORM SUBMIT / PAYMENT SIMULATION
============================================================ */
(function () {
  const form = document.getElementById('joinForm');
  if (!form) return;

  const btn = document.getElementById('payBtn');
  const btnText = document.getElementById('payBtnText');
  const agree = document.getElementById('agree');
  const agreeErr = document.getElementById('agreeErr');

  form.addEventListener('submit', e => {
    e.preventDefault();

    // Terms checkbox check
    if (!agree.checked) {
      agreeErr.style.display = 'block';
      agree.parentElement.style.color = '#e05252';
      return;
    }
    agreeErr.style.display = 'none';
    agree.parentElement.style.color = '';

    // Payment method validation
    const method = document.querySelector('.pt.sel').dataset.pay;

    if (method === 'card') {
      const num = document.getElementById('cnum').value.replace(/\s/g, '');
      const exp = document.getElementById('cexp').value;
      const cvv = document.getElementById('ccvv').value;
      if (num.length < 15 || exp.length < 5 || cvv.length < 3) {
        alert('Please enter complete card details.');
        return;
      }
    }

    if (method === 'jazz') {
      const jnum = document.getElementById('jnum');
      if (!jnum.value.trim()) {
        alert('Please enter your JazzCash mobile number.');
        return;
      }
    }

    if (method === 'easy') {
      const enumEl = document.getElementById('enum');
      if (!enumEl.value.trim()) {
        alert('Please enter your EasyPaisa mobile number.');
        return;
      }
    }

    if (method === 'bank') {
      const bref = document.getElementById('bref');
      if (!bref.value.trim()) {
        alert('Please enter your transaction reference.');
        return;
      }
    }

    // Processing state
    btn.disabled = true;
    btn.style.opacity = '.75';
    btnText.innerHTML = '<span class="spin"></span> Processing…';

    setTimeout(() => {
      btn.disabled = false;
      btn.style.opacity = '1';
      btnText.textContent = 'Pay Securely';

      const ref = 'IE-' + Math.floor(100000 + Math.random() * 899999);
      document.getElementById('refCode').textContent = 'REF: ' + ref;
      document.getElementById('modal').classList.add('open');
      document.body.classList.add('lock');

      // Auto-send details to WhatsApp
      const name = document.getElementById('fname').value;
      const phone = document.getElementById('fphone').value;
      const city = document.getElementById('fcity').value;
      const plan = planData[selectedPlan].name;

      const msg = encodeURIComponent(
        `🏋️ *NEW MEMBERSHIP — IRON EMPIRE*\n\n` +
        `👤 Name: ${name}\n` +
        `📞 Phone: ${phone}\n` +
        `📍 City: ${city}\n` +
        `💎 Plan: ${plan} (${billingMode === 'm' ? 'Monthly' : 'Yearly'})\n` +
        `💳 Method: ${method.toUpperCase()}\n` +
        `🧾 Ref: ${ref}`
      );

      setTimeout(() => {
        window.open('https://wa.me/923001234567?text=' + msg, '_blank');
      }, 900);

    }, 2200);
  });
})();


/* ============================================================
   19. SUCCESS MODAL CLOSE
============================================================ */
(function () {
  const modal = document.getElementById('modal');
  const close = document.getElementById('modalClose');
  if (!modal) return;

  if (close) {
    close.addEventListener('click', () => {
      modal.classList.remove('open');
      document.body.classList.remove('lock');
    });
  }

  modal.addEventListener('click', e => {
    if (e.target === modal) {
      modal.classList.remove('open');
      document.body.classList.remove('lock');
    }
  });
})();


/* ============================================================
   20. TESTIMONIAL SLIDER
============================================================ */
(function () {
  const slides = document.querySelectorAll('.tst-slide');
  const dots = document.querySelectorAll('#tstNav button');
  if (!slides.length) return;

  let idx = 0;
  let timer;

  function show(i) {
    slides.forEach((s, n) => s.classList.toggle('on', n === i));
    dots.forEach((d, n) => d.classList.toggle('on', n === i));
    idx = i;
  }

  function auto() {
    clearInterval(timer);
    timer = setInterval(() => show((idx + 1) % slides.length), 6000);
  }

  dots.forEach((d, n) => d.addEventListener('click', () => { show(n); auto(); }));
  auto();
})();


/* ============================================================
   21. GALLERY LIGHTBOX
============================================================ */
(function () {
  const lb = document.getElementById('lb');
  const img = document.getElementById('lbImg');
  const close = document.getElementById('lbClose');
  if (!lb) return;

  document.querySelectorAll('.gitem').forEach(g => {
    g.addEventListener('click', () => {
      img.src = g.dataset.src;
      lb.classList.add('open');
      document.body.classList.add('lock');
    });
  });

  function hide() {
    lb.classList.remove('open');
    document.body.classList.remove('lock');
  }

  if (close) close.addEventListener('click', hide);
  lb.addEventListener('click', e => { if (e.target === lb) hide(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') hide(); });
})();


/* ============================================================
   22. BACK TO TOP
============================================================ */
(function () {
  const btn = document.getElementById('toTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('show', window.scrollY > 700);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();


/* ============================================================
   23. FOOTER YEAR
============================================================ */
(function () {
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();


/* ============================================================
   24. SMOOTH ANCHOR SCROLL (fallback for older browsers)
============================================================ */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    if (id === '#' || id.length < 2) return;

    const target = document.querySelector(id);
    if (!target) return;

    e.preventDefault();
    const offset = window.innerWidth < 700 ? 76 : 96;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});


/* ============================================================
   25. CONSOLE SIGNATURE
============================================================ */
console.log(
  '%cIRON EMPIRE',
  'font-family:Bebas Neue,sans-serif;font-size:38px;letter-spacing:.2em;background:linear-gradient(135deg,#8a6620,#f8ecc0,#d9b45b,#7d5a1a);-webkit-background-clip:text;color:transparent;font-weight:bold;'
);
console.log(
  '%cBuilt with ❤ in Lahore · © Iron Empire Fitness',
  'font-family:Inter,sans-serif;font-size:12px;color:#d9b45b;letter-spacing:.15em;'
);
setTimeout(() => {
  btn.disabled = false;
  btn.style.opacity = '1';
  btnText.textContent = 'Pay Securely';

  // Generate reference
  const ref = 'IE-' + Math.floor(100000 + Math.random() * 899999);

  // Grab user data
  const name  = document.getElementById('fname').value || 'Valued Member';
  const phone = document.getElementById('fphone').value;
  const city  = document.getElementById('fcity').value;
  const plan  = planData[selectedPlan].name;
  const billLabel = billingMode === 'm' ? 'Monthly' : 'Yearly';

  // Fill modal content
  document.getElementById('refCode').textContent       = ref;
  document.getElementById('modalRefSmall').textContent = ref;
  document.getElementById('modalPlan').textContent     = `${plan} — ${billLabel}`;
  document.getElementById('modalName').textContent     = name.split(' ')[0] + ' ' +
                                                         (name.split(' ')[1] ? name.split(' ')[1][0] + '.' : '');

  // Open modal
  document.getElementById('modal').classList.add('open');
  document.body.classList.add('lock');

  // Auto send to WhatsApp
  const msg = encodeURIComponent(
    `🏋️ *NEW MEMBERSHIP — IRON EMPIRE*\n\n` +
    `👤 Name: ${name}\n` +
    `📞 Phone: ${phone}\n` +
    `📍 City: ${city}\n` +
    `💎 Plan: ${plan} (${billLabel})\n` +
    `💳 Method: ${method.toUpperCase()}\n` +
    `🧾 Ref: ${ref}`
  );
  setTimeout(() => {
    window.open('https://wa.me/923001234567?text=' + msg, '_blank');
  }, 1200);

}, 2200);
function update() {
  // Mobile pe kuch na karo
  if (window.innerWidth <= 900) {
    track.style.transform = 'none';
    return;
  }
  // ...baaki code same
}