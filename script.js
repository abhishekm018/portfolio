/* script.js — mobile menu, scrollspy (IntersectionObserver), lightbox, project hover, accessibility */

document.addEventListener('DOMContentLoaded', () => {
  // year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Mobile nav toggle
  const navToggle = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-links');
  navToggle?.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));
    navLinks.classList.toggle('active');
  });

  // Close menu on link click
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
      navToggle && navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  // Scrollspy using IntersectionObserver
  const navAnchors = Array.from(document.querySelectorAll('.nav-links a'));
  const sectionMap = new Map();
  navAnchors.forEach(a => {
    const href = a.getAttribute('href') || '';
    if (href.startsWith('#')) sectionMap.set(href.slice(1), a);
  });

  const sections = Array.from(document.querySelectorAll('main section[id]'));
  const observerOptions = { root: null, threshold: 0.55 };
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const anchor = sectionMap.get(entry.target.id);
      if (!anchor) return;
      if (entry.isIntersecting) {
        navAnchors.forEach(a => a.classList.remove('active'));
        anchor.classList.add('active');
      }
    });
  }, observerOptions);
  sections.forEach(sec => observer.observe(sec));

  // Lightbox gallery
  const lb = document.getElementById('lightbox');
  const lbImg = document.getElementById('lb-img');
  const lbCap = document.getElementById('lb-cap');
  const lbClose = document.getElementById('lb-close');
  const lbPrev = document.getElementById('lb-prev');
  const lbNext = document.getElementById('lb-next');
  const thumbs = Array.from(document.querySelectorAll('.gallery-grid .thumb'));
  const imgs = thumbs.map(t => {
    const img = t.querySelector('img');
    const caption = t.getAttribute('data-title') || (t.querySelector('figcaption') ? t.querySelector('figcaption').innerText : '');
    return { el: img, src: img ? img.getAttribute('src') : '', alt: img ? img.getAttribute('alt') : '', caption };
  });

  let currentIndex = -1;
  function openLightbox(index) {
    if (index < 0 || index >= imgs.length) return;
    const item = imgs[index];
    lbImg.src = item.src;
    lbImg.alt = item.alt || item.caption || 'Preview';
    lbCap.textContent = item.caption || item.alt || '';
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
  function showNext() { if (currentIndex >= 0) openLightbox((currentIndex + 1) % imgs.length); }
  function showPrev() { if (currentIndex >= 0) openLightbox((currentIndex - 1 + imgs.length) % imgs.length); }

  thumbs.forEach((t, idx) => {
    const img = t.querySelector('img');
    if (!img) return;
    if (!img.hasAttribute('loading')) img.setAttribute('loading', 'lazy');
    img.addEventListener('click', (e) => {
      e.stopPropagation();
      openLightbox(idx);
    });
  });

  lbClose && lbClose.addEventListener('click', closeLightbox);
  lbNext && lbNext.addEventListener('click', showNext);
  lbPrev && lbPrev.addEventListener('click', showPrev);
  lb && lb.addEventListener('click', (e) => { if (e.target === lb) closeLightbox(); });

  document.addEventListener('keydown', (e) => {
    if (!lb.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') showNext();
    if (e.key === 'ArrowLeft') showPrev();
  });

  // Project card small hover interaction for keyboard focus
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mouseenter', () => card.classList.add('hover'));
    card.addEventListener('mouseleave', () => card.classList.remove('hover'));
    card.addEventListener('focusin', () => card.classList.add('hover'));
    card.addEventListener('focusout', () => card.classList.remove('hover'));
  });

  // image error handler
  document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', () => {
      img.style.opacity = .18;
      img.style.filter = 'grayscale(80%)';
      img.alt = 'Image not found';
    });
  });

  // ensure rd links open in new tab
  document.querySelectorAll('#rd a').forEach(a => { a.setAttribute('target', '_blank'); a.setAttribute('rel', 'noopener'); });
});
