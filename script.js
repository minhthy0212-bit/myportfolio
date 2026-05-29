/* ═══════════════════════════════════════════════════════════
   JASMIN THY LE — PORTFOLIO SCRIPT
   Covers: navbar scroll, active nav links, scroll-reveal,
           skill/match bar animation, cycling role text,
           gallery filter with animation
   ═══════════════════════════════════════════════════════════ */

'use strict';

// ─── DOM REFS ───────────────────────────────────────────────
const navbar      = document.getElementById('navbar');
const navLinks    = document.querySelectorAll('.nav-links a');
const sections    = document.querySelectorAll('section[id]');
const revealEls   = document.querySelectorAll('.reveal');
const skillFills  = document.querySelectorAll('.sk-fill');
const matchFills  = document.querySelectorAll('.match-fill');
const filterBtns  = document.querySelectorAll('.filter-btn');
const galleryCards= document.querySelectorAll('.g-card');
const cyclingEl   = document.getElementById('cyclingRole');


// ─── 1. NAVBAR — transparent on banner, solid when scrolled ─
function updateNavbar () {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}
window.addEventListener('scroll', updateNavbar, { passive: true });
updateNavbar(); // run once on load


// ─── 2. ACTIVE NAV LINK (highlight current section) ─────────
function updateActiveNav () {
  const scrollPos = window.scrollY + 110;

  sections.forEach(sec => {
    const top    = sec.offsetTop;
    const bottom = top + sec.offsetHeight;
    const link   = document.querySelector(`.nav-links a[href="#${sec.id}"]`);
    if (!link) return;

    if (scrollPos >= top && scrollPos < bottom) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}
window.addEventListener('scroll', updateActiveNav, { passive: true });


// ─── 3. SCROLL REVEAL (IntersectionObserver) ─────────────────
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target); // fire once only
      }
    });
  },
  { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
);

revealEls.forEach(el => revealObserver.observe(el));


// ─── 4. SKILL BARS — animate widths on scroll-into-view ──────

// Capture the initial style.width values set in CSS/HTML before zeroing them
const matchTargets = new Map();
matchFills.forEach(bar => {
  matchTargets.set(bar, bar.style.width || '0%');
  bar.style.width = '0';      // reset so we can animate in
});

// sk-fill bars use data-w attribute (percentage number)
skillFills.forEach(bar => {
  bar.style.width = '0';
});

const barObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const el = entry.target;

      // skill fills (data-w="85" → "85%")
      if (el.classList.contains('sk-fill')) {
        const w = el.dataset.w;
        if (w) {
          // slight delay so the reveal animation plays first
          requestAnimationFrame(() => {
            setTimeout(() => { el.style.width = w + '%'; }, 80);
          });
        }
      }

      // match fills (style.width was pre-set in HTML, e.g. "92%")
      if (el.classList.contains('match-fill')) {
        const target = matchTargets.get(el) || '0%';
        requestAnimationFrame(() => {
          setTimeout(() => { el.style.width = target; }, 80);
        });
      }

      barObserver.unobserve(el);
    });
  },
  { threshold: 0.4 }
);

skillFills.forEach(bar => barObserver.observe(bar));
matchFills.forEach(bar => barObserver.observe(bar));


// ─── 5. CYCLING ROLE TEXT ────────────────────────────────────
const roles = [
  'Sustainability Consulting',
  'ESG Analysis',
  'Sustainable Finance',
  'Climate Risk Analysis',
  'FP&A Finance',
];
let roleIndex = 0;

function advanceRole () {
  // fade out
  cyclingEl.style.opacity = '0';

  setTimeout(() => {
    roleIndex = (roleIndex + 1) % roles.length;
    cyclingEl.textContent = roles[roleIndex];
    cyclingEl.style.opacity = '1';
  }, 420); // matches the CSS transition 0.4s ease
}

if (cyclingEl) {
  setInterval(advanceRole, 2800);
}


// ─── 6. GALLERY FILTER ───────────────────────────────────────
/**
 * Show / hide gallery cards by data-category,
 * then re-trigger the wide-column grid rule for remaining cards.
 */
function applyFilter (filter) {
  galleryCards.forEach(card => {
    const cat = card.dataset.category;
    const show = (filter === 'all' || cat === filter);

    if (show) {
      // remove hidden, then force a reflow so CSS transition fires
      card.classList.remove('hidden');
      card.style.opacity = '0';
      // double rAF to ensure display:block is painted before opacity change
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          card.style.opacity = '1';
        });
      });
    } else {
      card.style.opacity = '0';
      // wait for fade-out before setting display:none (via .hidden)
      setTimeout(() => {
        card.classList.add('hidden');
      }, 350);
    }
  });
}

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    // update active button
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    applyFilter(btn.dataset.filter);
  });
});


// ─── 7. SMOOTH SCROLL for nav links ──────────────────────────
navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    const href = link.getAttribute('href');
    if (href && href.startsWith('#')) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        const offset = navbar.offsetHeight + 8;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    }
  });
});


// ─── 8. HIRE ME nav-cta smooth scroll ────────────────────────
const navCta = document.querySelector('.nav-cta');
if (navCta) {
  navCta.addEventListener('click', (e) => {
    const href = navCta.getAttribute('href');
    if (href && href.startsWith('#')) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        const offset = navbar.offsetHeight + 8;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    }
  });
}
