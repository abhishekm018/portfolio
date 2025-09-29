// script.js — handles mobile menu, scrollspy (IntersectionObserver), timeline arrows, lightbox, accessibility
document.addEventListener('DOMContentLoaded', () => {
  // AOS initialization handled inline in HTML; ensure year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Mobile nav toggle (fixed)
  const navToggle = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-links');
  navToggle && navToggle.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));
    navLinks.classList.toggle('active');
  });

  // Close mobile nav on link click
  document.querySelectorAll('.nav-links a').forEach(a => a.addEventListener('click', () => {
    navLinks.classList.remove('active');
    navToggle && navToggle.setAttribute('aria-expanded', 'false');
  }));

  // Scrollspy (IntersectionObserver for smoothness)
  const navAnchors = Array.from(document.querySelectorAll('.nav-links a'));
  const map = new Map();
  navAnchors.forEach(a => {
    const href = a.getAttribute('href') || '';
    if (href.startsWith('#')) map.set(href.slice(1), a);
  });
  const sections = Array.from(document.querySelectorAll('main section[id]'));
  const obsOptions = { root: null, threshold: 0.55 };
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const anchor = map.get(entry.target.id);
      if (!anchor) return;
      if (entry.isIntersecting) {
        navAnchors.forEach(a => a.classList.remove('active'));
        anchor.classList.add('active');
      }
    });
  }, obsOptions);
  sections.forEach(s => observer.observe(s));

  // Timeline arrow controls (scroll the timeline wrapper)
  const tlWrapper = document.getElementById('timeline-wrapper');
  const tlPrev = document.getElementById('tl-prev');
  const tlNext = document.getElementById('tl-next');
  const TL_STEP = 260; // px per arrow click

  tlPrev && tlPrev.addEventListener('click', () => {
    tlWrapper.scrollBy({ left: -TL_STEP, behavior: 'smooth' });
  });
  tlNext && tlNext.addEventListener('click', () => {
    tlWrapper.scrollBy({ left: TL_STEP, behavior: 'smooth' });
  });

  // lightbox (dark, opaque)
  const lb = document.getElementById('lightbox');
  const lbInner = document.querySelector('.lb-inner');
  const lbImg = document.getElementById('lb-img');
  const lbCap = document.getElementById('lb-cap');
  const lbClose = document.getElementById('lb-close');

  const thumbs = Array.from(document.querySelectorAll('.gallery-grid .thumb'));
  const imgs = thumbs.map(t => {
    const img = t.querySelector('img');
    const caption = t.querySelector('figcaption') ? t.querySelector('figcaption').innerText : (t.getAttribute('data-title') || '');
    return { el: img, src: img ? img.getAttribute('src') : '', alt: img ? img.getAttribute('alt') : '', caption };
  });

  let currentIndex = -1;
  function openLightbox(index) {
    if (index < 0 || index >= imgs.length) return;
    const item = imgs[index];
    lbImg.src = item.src;
    lbImg.alt = item.alt || item.caption || 'Preview';
    lbCap.textContent = item.caption || '';
    lb.classList.add('active');
    lb.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    currentIndex = index;
    lbClose && lbClose.focus();
  }
  function closeLightbox() {
    lb.classList.remove('active');
    lb.setAttribute('aria-hidden', 'true');
    lbImg.src = '';
    lbCap.textContent = '';
    document.body.style.overflow = '';
    currentIndex = -1;
  }

  thumbs.forEach((t, idx) => {
    const img = t.querySelector('img');
    if (!img) return;
    if (!img.hasAttribute('loading')) img.setAttribute('loading', 'lazy');
    img.addEventListener('click', (e) => { e.stopPropagation(); openLightbox(idx); });
  });

  lbClose && lbClose.addEventListener('click', closeLightbox);
  lb && lb.addEventListener('click', (e) => { if (e.target === lb) closeLightbox(); });

  document.addEventListener('keydown', (e) => {
    if (!lb.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') openLightbox((currentIndex + 1) % imgs.length);
    if (e.key === 'ArrowLeft') openLightbox((currentIndex - 1 + imgs.length) % imgs.length);
  });

  // small accessibility: make timeline focusable scrollable via keyboard arrows
  if (tlWrapper) {
    tlWrapper.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') tlWrapper.scrollBy({ left: TL_STEP, behavior: 'smooth' });
      if (e.key === 'ArrowLeft') tlWrapper.scrollBy({ left: -TL_STEP, behavior: 'smooth' });
    });
  }

  // image error handler (graceful)
  document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', () => {
      img.style.opacity = .15;
      img.style.filter = 'grayscale(80%)';
      img.alt = 'Image not found';
    });
  });

  // ensure R&D links open in new tab
  document.querySelectorAll('#rd a').forEach(a => { a.setAttribute('target', '_blank'); a.setAttribute('rel', 'noopener'); });
});
