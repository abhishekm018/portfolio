/* typing effect */
(() => {
  const el = document.getElementById('typing');
  const phrases = ['SDET','GenAI Tester','Software Test Engineer','R&D Enthusiast'];
  let p = 0, ch = 0, del = false;
  el.textContent = '';
  setTimeout(loop, 300);
  function loop() {
    const cur = phrases[p];
    if (!del) {
      ch++; el.textContent = cur.slice(0, ch);
      if (ch === cur.length) { del = true; setTimeout(loop, 900); return; }
    } else {
      ch--; el.textContent = cur.slice(0, ch);
      if (ch === 0) { del = false; p = (p + 1) % phrases.length; }
    }
    setTimeout(loop, del ? 40 : 90);
  }
})();

/* scroll reveal + progress bars */
(() => {
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
})();

/* lightbox */
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
      const caption = img.closest('figure') ? img.closest('figure').querySelector('figcaption').innerText : '';
      open(img.src, caption);
    });
  });

  lbClose.addEventListener('click', close);
  lb.addEventListener('click', e => { if (e.target === lb) close(); });

  // fallback: hide broken images slightly
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('img').forEach(img => {
      img.onerror = () => { img.style.opacity = 0.08; img.alt = 'Image missing'; };
    });
  });
})();
