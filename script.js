// typing effect (hero)
(() => {
  const el = document.getElementById('typing');
  const phrases = ['SDET','GenAI Tester','Software Test Engineer','R&D Enthusiast'];
  let iPhrase = 0, iChar = 0, deleting = false;
  el.textContent = '';
  setTimeout(typeLoop, 400);

  function typeLoop() {
    const current = phrases[iPhrase];
    if (!deleting) {
      iChar++;
      el.textContent = current.slice(0, iChar);
      if (iChar === current.length) { deleting = true; setTimeout(typeLoop, 900); return; }
      setTimeout(typeLoop, 90);
    } else {
      iChar--;
      el.textContent = current.slice(0, iChar);
      if (iChar === 0) { deleting = false; iPhrase = (iPhrase + 1) % phrases.length; setTimeout(typeLoop, 400); }
      else setTimeout(typeLoop, 40);
    }
  }
})();

// scroll reveal and language bar animation
(() => {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // animate language bars inside
        entry.target.querySelectorAll && entry.target.querySelectorAll('.bar-fill').forEach(b => {
          const pct = b.getAttribute('data-fill') || 0;
          b.style.width = pct + '%';
        });
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.anim').forEach(el => obs.observe(el));
})();

// gallery lightbox
(() => {
  const lb = document.getElementById('lightbox');
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
      const cap = img.closest('figure') ? img.closest('figure').querySelector('figcaption').innerText : '';
      open(img.src, cap);
    });
  });

  lbClose.addEventListener('click', close);
  lb.addEventListener('click', (e) => { if (e.target === lb) close(); });
})();

// image error fallback to avoid blank boxes
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('img').forEach(img => {
    img.onerror = () => {
      img.style.opacity = 0.08;
      img.alt = 'Image missing';
    };
  });
});
