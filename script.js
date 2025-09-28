document.addEventListener('DOMContentLoaded', () => {
  // Init AOS safely
  try {
    if (window.AOS) AOS.init({ once: true, duration: 700, easing: 'cubic-bezier(.2,.8,.2,1)' });
  } catch (e) { console.warn('AOS init failed', e); }

  // Set copyright year
  document.getElementById('year') && (document.getElementById('year').textContent = new Date().getFullYear());

  // Fill progress bars (with slight delay to allow AOS)
  setTimeout(() => {
    document.querySelectorAll('.bar-fill').forEach(b => {
      const pct = b.getAttribute('data-fill') || 0;
      b.style.width = pct + '%';
    });
  }, 120);

  // Lightbox for gallery thumbs with keyboard nav
  const lb = document.getElementById('lightbox');
  const lbImg = document.getElementById('lb-img');
  const lbCap = document.getElementById('lb-cap');
  const lbClose = document.getElementById('lb-close');
  const lbPrev = document.getElementById('lb-prev');
  const lbNext = document.getElementById('lb-next');

  // collect gallery items
  const thumbs = Array.from(document.querySelectorAll('.gallery-grid .thumb'));
  const galleryDatas = thumbs.map(t => {
    const img = t.querySelector('img');
    const cap = t.getAttribute('data-title') || (t.querySelector('figcaption') ? t.querySelector('figcaption').innerText : '');
    return { src: img ? img.getAttribute('src') : '', cap: cap, el: t };
  });

  let currentIndex = -1;
  function openLightboxByIndex(i) {
    if (i < 0 || i >= galleryDatas.length) return;
    const item = galleryDatas[i];
    lbImg.src = item.src;
    lbImg.alt = item.cap || 'Preview';
    lbCap.textContent = item.cap || '';
    lb.classList.add('active');
    lb.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    currentIndex = i;
  }
  function closeLightbox() {
    lb.classList.remove('active');
    lbImg.src = '';
    lbCap.textContent = '';
    lb.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    currentIndex = -1;
  }
  function showNext() {
    if (currentIndex < 0) return;
    const next = (currentIndex + 1) % galleryDatas.length;
    openLightboxByIndex(next);
  }
  function showPrev() {
    if (currentIndex < 0) return;
    const prev = (currentIndex - 1 + galleryDatas.length) % galleryDatas.length;
    openLightboxByIndex(prev);
  }

  // click thumbs
  thumbs.forEach((t, idx) => {
    const img = t.querySelector('img');
    if (!img) return;
    img.addEventListener('click', (e) => {
      e.stopPropagation();
      openLightboxByIndex(idx);
    });
  });

  // click controls
  lbClose && lbClose.addEventListener('click', closeLightbox);
  lbNext && lbNext.addEventListener('click', (e) => { e.stopPropagation(); showNext(); });
  lbPrev && lbPrev.addEventListener('click', (e) => { e.stopPropagation(); showPrev(); });

  // click outside to close
  lb.addEventListener('click', (e) => { if (e.target === lb) closeLightbox(); });

  // keyboard nav
  document.addEventListener('keydown', (e) => {
    if (lb.classList.contains('active')) {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') showNext();
      if (e.key === 'ArrowLeft') showPrev();
    }
  });

  // Fallback IntersectionObserver animate (for elements without AOS or if blocked)
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Fill any bars inside
        entry.target.querySelectorAll && entry.target.querySelectorAll('.bar-fill').forEach(b => {
          b.style.width = (b.getAttribute('data-fill') || 0) + '%';
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.card, .exp, .skill-pill').forEach(el => observer.observe(el));

  // image error handling (shows faded placeholder if missing)
  document.querySelectorAll('img').forEach((img, i) => {
    img.addEventListener('error', () => {
      img.style.opacity = .18;
      img.style.filter = 'grayscale(70%)';
      img.alt = 'Image not found';
    });
    // Add lazy loading attribute if missing (progressive enhancement)
    if (!img.hasAttribute('loading')) img.setAttribute('loading', 'lazy');
  });
});
