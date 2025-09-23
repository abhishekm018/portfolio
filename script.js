document.addEventListener('DOMContentLoaded', () => {
  // Initialize AOS if available
  try {
    if (window.AOS) {
      AOS.init({ once: true, duration: 700, easing: 'cubic-bezier(.2,.8,.2,1)' });
    }
  } catch (e) {
    console.warn('AOS init failed:', e);
  }

  // Fill progress bars
  function fillBars() {
    document.querySelectorAll('.bar-fill').forEach(b => {
      const pct = b.getAttribute('data-fill') || 0;
      b.style.width = pct + '%';
    });
  }
  fillBars();

  // Lightbox
  const lb = document.getElementById('lightbox');
  if (lb) {
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
        const cap = img.closest('figure') ? img.closest('figure').querySelector('figcaption').innerText : '';
        openLightbox(img.src, cap);
        e.stopPropagation();
      });
    });

    lbClose && lbClose.addEventListener('click', closeLightbox);
    lb.addEventListener('click', (e) => { if (e.target === lb) closeLightbox(); });

    // image fallback handling
    document.querySelectorAll('img').forEach(img => {
      img.addEventListener('error', () => {
        img.style.opacity = 0.14;
        img.style.filter = 'grayscale(40%)';
        img.alt = 'Image not found';
      });
    });
  }

  // IntersectionObserver fallback: add 'visible' class for non-AOS
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        entry.target.querySelectorAll && entry.target.querySelectorAll('.bar-fill').forEach(b => {
          b.style.width = (b.getAttribute('data-fill') || 0) + '%';
        });
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.card, .exp, .skill-pill').forEach(el => io.observe(el));
});
