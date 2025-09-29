AOS.init({duration:800,once:true});

// Scrollspy
const sections=document.querySelectorAll('section');
const navLinks=document.querySelectorAll('.nav-links a');
window.addEventListener('scroll',()=>{
  let current='';
  sections.forEach(sec=>{
    const top=window.scrollY;
    const offset=sec.offsetTop-150;
    const height=sec.offsetHeight;
    if(top>=offset && top<offset+height){current=sec.getAttribute('id');}
  });
  navLinks.forEach(a=>{
    a.classList.remove('active');
    if(a.getAttribute('href')==='#'+current){a.classList.add('active');}
  });
});

// Timeline arrows
const tlWrapper=document.getElementById('timeline-wrapper');
document.getElementById('tl-prev').addEventListener('click',()=>{tlWrapper.scrollBy({left:-220,behavior:'smooth'});});
document.getElementById('tl-next').addEventListener('click',()=>{tlWrapper.scrollBy({left:220,behavior:'smooth'});});

// Lightbox
const lightbox=document.getElementById('lightbox');
const lightImg=document.getElementById('lightbox-img');
const lightCap=document.getElementById('lightbox-caption');
document.querySelectorAll('.gallery-grid img').forEach(img=>{
  img.addEventListener('click',()=>{
    lightbox.style.display='flex';
    lightImg.src=img.src;
    lightCap.textContent=img.nextElementSibling.textContent;
  });
});
document.getElementById('lightbox-close').onclick=()=>lightbox.style.display='none';

// Year
document.getElementById('year').textContent=new Date().getFullYear();

// R&D Tabs with smooth fade
const rdBtns=document.querySelectorAll('.rd-btn');
const rdContents=document.querySelectorAll('.rd-tab-content');
rdBtns.forEach(btn=>{
  btn.addEventListener('click',()=>{
    rdBtns.forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    rdContents.forEach(c=>{
      c.classList.remove('active');
    });
    const target=document.getElementById(btn.dataset.tab);
    target.classList.add('active');
  });
});
