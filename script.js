// Reveal on scroll
const obs = new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      e.target.classList.add("visible");
      e.target.querySelectorAll(".bar-fill").forEach(b=>{
        const pct=b.getAttribute("data-fill")||0;
        b.style.width=pct+"%";
      });
      obs.unobserve(e.target);
    }
  });
},{threshold:0.15});
document.querySelectorAll(".anim").forEach(el=>obs.observe(el));
