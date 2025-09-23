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

  // Lightbox for gallery thumbs
  const lb = document.getElementById('lightbox');
  const lbImg = document.getElementById('lb-img');
  const lbCap = document.getElementById('lb-cap');
  const lbClose = document.getElementById('lb-close');

  function openLightbox(src, cap) {
    lbImg.src = src;
    lbCap.textContent = cap || '';
    lb.classList.add('active');
    lb.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
  function closeLightbox() {
    lb.classList.remove('active');
    lbImg.src = '';
    lbCap.textContent = '';
    lb.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.thumb img, .gallery img').forEach(img => {
    img.addEventListener('click', (e) => {
      const capEl = img.closest('figure') ? img.closest('figure').querySelector('figcaption') : null;
      const cap = capEl ? capEl.innerText : '';
      openLightbox(img.src, cap);
      e.stopPropagation();
    });
  });

  lbClose && lbClose.addEventListener('click', closeLightbox);
  lb.addEventListener('click', (e) => { if (e.target === lb) closeLightbox(); });

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
  }, { threshold: 0.15 });

  document.querySelectorAll('.card, .exp, .skill-pill').forEach(el => observer.observe(el));

  // image error handling (shows faded placeholder if missing)
  document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', () => {
      img.style.opacity = .18;
      img.style.filter = 'grayscale(70%)';
      img.alt = 'Image not found';
    });
  });
});
