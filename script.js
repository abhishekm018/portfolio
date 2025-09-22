// script.js: initialize AOS, fill bars, lightbox, and fallback IntersectionObserver
document.addEventListener('DOMContentLoaded', () => {
  // Initialize AOS if available
  try {
    if (window.AOS) {
      AOS.init({ once: true, duration: 700, easing: 'cubic-bezier(.2,.8,.2,1)' });
    }
  } catch (e) {
    // ignore AOS init error
    console.warn('AOS init failed:', e);
  }

  // Fill language bars immediately and also when visible
  function fillBars() {
    document.querySelectorAll('.bar-fill').forEach(b => {
      const pct = b.getAttribute('data-fill') || 0;
      b.style.width = pct + '%';
    });
  }
  fillBars();

  // Lightbox: open on thumbnail click
  const lb = document.getElementById('lightbox');
  if (lb) {
    const lbImg = document.getElementById('lb-img');
    const lbCap = document.getElementById('lb-cap');
    const lbClose = document.getElementById('lb-close');

    function openLightbox(src, caption) {
      lbImg.src = src;
      lbCap.textContent = caption || '';
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
        const captionEl = img.closest('figure') ? img.closest('figure').querySelector('figcaption') : null;
        const caption = captionEl ? captionEl.innerText : '';
        openLightbox(img.src, caption);
        e.stopPropagation();
      });
    });

    lbClose && lbClose.addEventListener('click', closeLightbox);
    lb.addEventListener('click', (e) => { if (e.target === lb) closeLightbox(); });

    // fallback: if image fails to load -> low opacity instead of 'disabled'
    document.querySelectorAll('img').forEach(img => {
      img.addEventListener('error', () => {
        img.style.opacity = 0.14;
        img.style.filter = 'grayscale(40%)';
        img.alt = 'Image not found';
      });
    });
  }

  // IntersectionObserver fallback: ensure non-AOS browsers still get reveal
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // if element contains bar-fill, fill it
        entry.target.querySelectorAll && entry.target.querySelectorAll('.bar-fill').forEach(b => {
          const pct = b.getAttribute('data-fill') || 0;
          b.style.width = pct + '%';
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.card, .exp, .skill-pill').forEach(el => observer.observe(el));
});
