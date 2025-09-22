// Init behavior: AOS is initialized in HTML; here we add lightbox and bar-fill logic
document.addEventListener('DOMContentLoaded', () => {

  // fill language bars when their section enters view using AOS events
  // We'll also set immediate width for already visible items
  function fillBars() {
    document.querySelectorAll('.bar-fill').forEach(b => {
      const pct = b.getAttribute('data-fill') || 0;
      b.style.width = pct + '%';
    });
  }
  // call once on load and rely on AOS to animate on scroll
  fillBars();

  // Lightbox: open on thumbnail click
  const lb = document.getElementById('lightbox');
  if (!lb) return;
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

  // fallback: if image fails to load, mark low-opacity and prevent 'disabled' feel
  document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', () => {
      img.style.opacity = 0.14;
      img.style.filter = 'grayscale(40%)';
      img.alt = 'Image not found';
    });
  });

});
