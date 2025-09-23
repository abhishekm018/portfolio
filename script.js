document.addEventListener('DOMContentLoaded', () => {
  // Initialize AOS safely
  try { if (window.AOS) AOS.init({ once: true, duration: 700, easing: 'cubic-bezier(.2,.8,.2,1)' }); } catch(e){ console.warn(e); }

  // Fill progress bars
  document.querySelectorAll('.bar-fill').forEach(b => {
    const pct = b.getAttribute('data-fill') || 0;
    // small timeout so AOS/IO can play nicely
    setTimeout(()=> b.style.width = pct + '%', 120);
  });

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
        const capEl = img.closest('figure') ? img.closest('figure').querySelector('figcaption') : null;
        const cap = capEl ? capEl.innerText : '';
        openLightbox(img.src, cap);
        e.stopPropagation();
      });
    });

    lbClose && lbClose.addEventListener('click', closeLightbox);
    lb.addEventListener('click', (e) => { if (e.target === lb) closeLightbox(); });

    // fallback styling on broken images
    document.querySelectorAll('img').forEach(img => {
      img.addEventListener('error', () => {
        img.style.opacity = 0.18;
        img.style.filter = 'grayscale(60%)';
        img.alt = 'Image not found';
      });
    });
  }

  // IntersectionObserver fallback for reveal + bar animations
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        entry.target.querySelectorAll && entry.target.querySelectorAll('.bar-fill').forEach(b => {
          b.style.width = (b.getAttribute('data-fill') || 0) + '%';
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.card, .exp, .skill-pill').forEach(el => observer.observe(el));
});
