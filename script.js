// typing effect (cycles through phrases)
(() => {
  const el = document.getElementById('typing');
  const phrases = [
    'SDET',
    'GenAI Tester',
    'Software Test Engineer',
    'R&D Enthusiast'
  ];
  let iPhrase = 0, iChar = 0, deleting = false;

  el.textContent = '';
  setTimeout(() => { typeLoop(); }, 600);

  function typeLoop() {
    const current = phrases[iPhrase];
    if (!deleting) {
      iChar++;
      el.textContent = current.slice(0, iChar);
      if (iChar === current.length) {
        deleting = true;
        setTimeout(typeLoop, 1000);
      } else setTimeout(typeLoop, 80);
    } else {
      iChar--;
      el.textContent = current.slice(0, iChar);
      if (iChar === 0) {
        deleting = false;
        iPhrase = (iPhrase + 1) % phrases.length;
        setTimeout(typeLoop, 400);
      } else setTimeout(typeLoop, 40);
    }
  }
})();

// intersection observer for scroll reveal and language bars
(() => {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(ent => {
      if (ent.isIntersecting) {
        ent.target.classList.add('visible');
        ent.target.querySelectorAll && ent.target.querySelectorAll('.bar-fill').forEach(b => {
          const pct = b.getAttribute('data-fill') || 0;
          b.style.width = pct + '%';
        });
        obs.unobserve(ent.target);
      }
    });
  }, {threshold: 0.15});

  document.querySelectorAll('.anim').forEach(el => obs.observe(el));
})();

// lightbox for gallery thumbnails
(() => {
  const lb = document.getElementById('lightbox');
  const lbImg = document.getElementById('lb-img');
  const lbCap = document.getElementById('lb-cap');
  const lbClose = document.getElementById('lb-close');

  function openLightbox(src, caption) {
    lbImg.src = src;
    lbCap.textContent = caption || '';
    lb.classList.add('active');
    lb.setAttribute('aria-hidden', 'false');
  }

  function closeLightbox() {
    lb.classList.remove('active');
    lbImg.src = '';
    lbCap.textContent = '';
    lb.setAttribute('aria-hidden', 'true');
  }

  // attach click handlers to gallery images
  document.querySelectorAll('.gallery .thumb img').forEach(img => {
    img.addEventListener('click', () => {
      openLightbox(img.src, img.closest('figure') ? img.closest('figure').querySelector('figcaption').innerText : '');
    });
  });

  lbClose.addEventListener('click', closeLightbox);
  lb.addEventListener('click', (e) => { if (e.target === lb) closeLightbox(); });
})();
