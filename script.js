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


// ─── 9. DOWNLOAD BUTTONS ─────────────────────────────────────
/**
 * WHY THIS EXISTS:
 * Browsers ignore the `download` attribute on <a> tags when the file is
 * cross-origin (e.g. your site is on Netlify but the PDF is on
 * raw.githubusercontent.com). The browser opens the file instead of saving it.
 *
 * FIX: Intercept every download click, fetch the PDF as a binary blob on the
 * client, turn it into a temporary local URL, then programmatically click a
 * hidden <a download> — which always triggers the Save dialog because the
 * blob URL is same-origin by definition.
 *
 * If the fetch fails (e.g. file not uploaded yet), we fall back to opening
 * the URL in a new tab so the user isn't left with nothing.
 */

// ── SVG icons used inside the button ──
const ICON_DOWNLOAD = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none"
  stroke="currentColor" stroke-width="2.5" stroke-linecap="round"
  stroke-linejoin="round" aria-hidden="true">
  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
  <polyline points="7 10 12 15 17 10"/>
  <line x1="12" y1="15" x2="12" y2="3"/>
</svg>`;

const ICON_SPINNER = `<svg class="btn-spinner" width="14" height="14" viewBox="0 0 24 24"
  fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"
  aria-hidden="true">
  <path d="M12 2a10 10 0 1 0 10 10" />
</svg>`;

const ICON_CHECK = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none"
  stroke="currentColor" stroke-width="2.5" stroke-linecap="round"
  stroke-linejoin="round" aria-hidden="true">
  <polyline points="20 6 9 17 4 12"/>
</svg>`;

/**
 * triggerBlobDownload(url, filename, btn)
 *
 * 1. Puts the button into a loading state.
 * 2. Fetches the remote PDF as a Blob (works cross-origin because
 *    raw.githubusercontent.com sends CORS headers allowing all origins).
 * 3. Creates a temporary blob:// URL — which IS same-origin — and clicks a
 *    hidden anchor with the `download` attribute, forcing a Save dialog.
 * 4. Cleans up and restores the button.
 * 5. On any error, opens the URL in a new tab as a fallback.
 */
async function triggerBlobDownload (url, filename, btn) {

  // ── save original button content so we can restore it ──
  const originalHTML = btn.innerHTML;

  // ── loading state ──────────────────────────────────────
  btn.classList.add('g-download-btn--loading');
  btn.setAttribute('aria-disabled', 'true');
  btn.innerHTML = `${ICON_SPINNER} Downloading…`;

  try {
    const response = await fetch(url, { mode: 'cors' });

    if (!response.ok) {
      throw new Error(`Server returned ${response.status} — check the file URL.`);
    }

    const blob    = await response.blob();
    const blobUrl = URL.createObjectURL(blob);

    // Create a hidden anchor, click it, then immediately remove it
    const tempLink    = document.createElement('a');
    tempLink.href     = blobUrl;
    tempLink.download = filename;
    tempLink.style.display = 'none';
    document.body.appendChild(tempLink);
    tempLink.click();
    document.body.removeChild(tempLink);

    // Release the blob URL after the browser has had time to start the download
    setTimeout(() => URL.revokeObjectURL(blobUrl), 3000);

    // ── brief success state ────────────────────────────────
    btn.innerHTML = `${ICON_CHECK} Saved!`;
    setTimeout(() => {
      btn.innerHTML = originalHTML;
      btn.classList.remove('g-download-btn--loading');
      btn.removeAttribute('aria-disabled');
    }, 2000);

    // ── optional analytics hook ────────────────────────────
    // Uncomment and swap for your real analytics:
    // gtag('event', 'file_download', { file_name: filename });
    // plausible('Download', { props: { file: filename } });
    console.log(`[Portfolio] Downloaded: ${filename}`);

  } catch (err) {
    console.error('[Portfolio] Blob download failed — falling back to new tab:', err);
    window.open(url, '_blank', 'noopener,noreferrer');

    // Restore button immediately on error
    btn.innerHTML = originalHTML;
    btn.classList.remove('g-download-btn--loading');
    btn.removeAttribute('aria-disabled');
  }
}

// ── Wire up every active download button ───────────────────────────────────
document.querySelectorAll('.g-download-btn:not(.g-download-btn--disabled)').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();   // stop the default anchor navigation

    const url      = btn.getAttribute('href');
    const filename = btn.getAttribute('download') || 'project.pdf';

    if (!url || url.includes('YOUR-USERNAME')) {
      // Placeholder URL not yet replaced — warn the developer
      console.warn('[Portfolio] Download button has a placeholder URL. Update the href in index.html.');
      return;
    }

    triggerBlobDownload(url, filename, btn);
  });
});

// ── Block disabled (Coming Soon) buttons ───────────────────────────────────
document.querySelectorAll('.g-download-btn--disabled').forEach(btn => {
  btn.addEventListener('click',   e => e.preventDefault());
  btn.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') e.preventDefault();
  });
});
