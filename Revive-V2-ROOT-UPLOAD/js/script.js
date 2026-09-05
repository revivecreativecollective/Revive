const toggle=document.getElementById("menuToggle");
const nav=document.getElementById("nav");
toggle?.addEventListener("click",()=>{
  const open=nav.classList.toggle("open");
  toggle.setAttribute("aria-expanded",open);
  nav.setAttribute("aria-hidden",!open);
});
document.querySelectorAll(".nav a").forEach(a=>a.addEventListener("click",()=>{
  nav.classList.remove("open");
  toggle?.setAttribute("aria-expanded","false");
  nav?.setAttribute("aria-hidden","true");
}));

const sky=document.querySelector(".sky");
const movers=document.querySelectorAll(".cloud,.moon,.sun-glow");
sky?.addEventListener("pointermove",(e)=>{
  const x=e.clientX/innerWidth-.5, y=e.clientY/innerHeight-.5;
  movers.forEach((el,i)=>{
    const amount=(i+1)*3;
    el.style.marginLeft=`${x*amount}px`;
    el.style.marginTop=`${y*amount}px`;
  });
});

const observer=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting) entry.target.classList.add("seen");
  });
},{threshold:.15});
document.querySelectorAll(".world-copy,.meadow-copy,.water-copy,.service-list,.night-copy").forEach(el=>observer.observe(el));
