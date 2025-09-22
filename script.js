document.addEventListener('DOMContentLoaded', () => {
  // Intersection reveal (with exp movie effect)
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((entry, idx) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // fill bars if any
        entry.target.querySelectorAll && entry.target.querySelectorAll('.bar-fill').forEach(b => {
          const pct = b.getAttribute('data-fill') || 0;
          b.style.width = pct + '%';
        });
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.anim').forEach(el => obs.observe(el));

  // Lightbox
  const lb = document.getElementById('lightbox');
  if (lb) {
    const lbImg = document.getElementById('lb-img');
    const lbCap = document.getElementById('lb-cap');
    const lbClose = document.getElementById('lb-close');

    function open(src, caption) {
      lbImg.src = src;
      lbCap.textContent = caption || '';
      lb.classList.add('active');
      lb.setAttribute('aria-hidden', 'false');
    }
    function close() {
      lb.classList.remove('active');
      lbImg.src = '';
      lbCap.textContent = '';
      lb.setAttribute('aria-hidden', 'true');
    }

    document.querySelectorAll('.gallery .thumb img').forEach(img => {
      img.addEventListener('click', () => {
        const caption = img.closest('figure') ? img.closest('figure').querySelector('figcaption').innerText : '';
        open(img.src, caption);
      });
    });

    lbClose && lbClose.addEventListener('click', close);
    lb.addEventListener('click', (e) => { if (e.target === lb) close(); });

    // graceful fallback for missing images
    document.querySelectorAll('img').forEach(img => {
      img.onerror = () => {
        img.style.opacity = 0.12;
        img.alt = 'Image missing';
        if (img.parentElement && img.parentElement.classList.contains('thumb')) {
          img.style.height = '110px';
          img.style.objectFit = 'cover';
        }
      };
    });
  }
});
