AOS.init({ duration:800, once:true });

// Hamburger toggle
const toggle = document.getElementById('nav-toggle');
const links = document.getElementById('nav-links');
toggle.addEventListener('click', ()=> {
  links.classList.toggle('open');
});

// Scrollspy
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', () => {
  let current='';
  sections.forEach(sec => {
    const top = window.scrollY;
    const offset = sec.offsetTop-150;
    const height = sec.offsetHeight;
    if(top>=offset && top<offset+height){ current=sec.getAttribute('id'); }
  });
  navLinks.forEach(a=>{ a.classList.remove('active');
    if(a.getAttribute('href')==='#'+current){ a.classList.add('active'); }
  });
});

// Lightbox
const lightbox = document.getElementById('lightbox');
const lightImg = document.getElementById('lightbox-img');
const lightCap = document.getElementById('lightbox-caption');
document.querySelectorAll('.gallery-grid img').forEach(img=>{
  img.addEventListener('click',()=>{
    lightbox.style.display='flex';
    lightImg.src=img.src;
    lightCap.textContent=img.nextElementSibling.textContent;
  });
});
document.getElementById('lightbox-close').onclick=()=>lightbox.style.display='none';
