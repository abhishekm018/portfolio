// typing effect
(() => {
  const el = document.getElementById('typing');
  const phrases = ['SDET','GenAI Tester','Software Test Engineer','R&D Enthusiast'];
  let i=0,j=0,del=false;
  function loop(){
    const cur=phrases[i];
    if(!del){
      el.textContent=cur.slice(0,++j);
      if(j===cur.length){del=true;setTimeout(loop,1000);return;}
    } else {
      el.textContent=cur.slice(0,--j);
      if(j===0){del=false;i=(i+1)%phrases.length;}
    }
    setTimeout(loop,del?50:100);
  }
  loop();
})();
