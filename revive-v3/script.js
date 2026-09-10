(() => {
  'use strict';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let manuallyPaused = false;
  try { manuallyPaused = localStorage.getItem('revive-motion-paused') === 'true'; } catch {}
  const motionToggle = document.querySelector('#motionToggle');
  function syncMotion() {
    const paused = reduced.matches || manuallyPaused;
    document.documentElement.classList.toggle('motion-paused', paused);
    if (motionToggle) {
      motionToggle.hidden = false;
      motionToggle.disabled = reduced.matches;
      motionToggle.setAttribute('aria-pressed', String(paused));
      motionToggle.textContent = reduced.matches ? 'Reduced motion on' : paused ? 'Play motion ▷' : 'Pause motion Ⅱ';
      motionToggle.title = reduced.matches ? 'Following your device’s reduced-motion preference' : '';
    }
    window.dispatchEvent(new CustomEvent('revive:motion', {detail: {paused}}));
  }
  motionToggle?.addEventListener('click', () => { manuallyPaused = !manuallyPaused; try { localStorage.setItem('revive-motion-paused', String(manuallyPaused)); } catch {} syncMotion(); });
  reduced.addEventListener('change', syncMotion); syncMotion();
  const enter = document.querySelector('#enterSite');
  enter?.addEventListener('click', event => { event.preventDefault(); document.querySelector('#welcome').hidden = true; const intro = document.querySelector('#heroIntro'); intro.hidden = false; intro.querySelector('h1').focus({preventScroll: true}); });
  const toggle = document.querySelector('#menuToggle'), menu = document.querySelector('#siteMenu');
  const pageRegions = [...document.querySelectorAll('main, footer, #motionToggle')];
  function setMenu(open, restoreFocus = true) {
    if (!menu) return;
    menu.hidden = !open; toggle.setAttribute('aria-expanded', String(open));
    toggle.innerHTML = open ? 'Close <span aria-hidden="true">×</span>' : 'Menu <span aria-hidden="true">☰</span>';
    document.body.classList.toggle('menu-open', open); pageRegions.forEach(region => { region.inert = open; });
    if (open) menu.querySelector('a').focus(); else if (restoreFocus) toggle.focus();
  }
  toggle?.addEventListener('click', () => setMenu(menu.hidden));
  menu?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => { setMenu(false, false); if (link.hash) { const section = document.querySelector(link.hash); section?.setAttribute('tabindex', '-1'); section?.focus({preventScroll: true}); } }));
  document.addEventListener('keydown', event => {
    if (!menu || menu.hidden) return;
    if (event.key === 'Escape') setMenu(false);
    if (event.key === 'Tab') {
      const items = [...document.querySelectorAll('.site-header a, .site-header button, #siteMenu a')];
      const first = items[0], last = items.at(-1);
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
  });
  const content = window.REVIVE_CONTENT, gallery = document.querySelector('#portfolioGallery');
  if (gallery && Array.isArray(content?.portfolio) && content.portfolio.length) {
    const fragment = document.createDocumentFragment();
    for (const item of content.portfolio) {
      if (typeof item.image !== 'string' || !item.image.startsWith('assets/') || item.image.includes('..')) continue;
      const figure = document.createElement('figure'); if (['wide', 'tall'].includes(item.layout)) figure.className = item.layout;
      const image = document.createElement('img'); image.src = item.image; image.alt = item.alt || ''; image.loading = 'lazy'; image.decoding = 'async'; image.width = 1000; image.height = item.layout === 'wide' ? 625 : 1250;
      const caption = document.createElement('figcaption'); caption.textContent = item.caption || ''; figure.append(image, caption); fragment.append(figure);
    }
    if (fragment.childElementCount) gallery.replaceChildren(fragment);
  }
  // No third-party form scripts until a visitor chooses to open the form.
  if (content?.typeformUrl) {
    try {
      const url = new URL(content.typeformUrl);
      if (url.protocol === 'https:') {
        const link = document.querySelector('#inquiryLink');
        if (link) { link.href = url.href; document.querySelector('#inquiryHelp').textContent = 'A few questions, at your own pace. Opens our inquiry form.'; }
      }
    } catch { /* Keep working email link if the pasted URL is invalid. */ }
  }
})();
