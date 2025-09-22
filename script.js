// scroll reveal + progress bars + lightbox
document.addEventListener('DOMContentLoaded', () => {
  // reveal + bars
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
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

    document.querySelectorAll('.gallery .thumb img, .thumb img').forEach(img => {
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
