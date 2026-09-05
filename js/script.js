const btn=document.getElementById('menuBtn'),menu=document.getElementById('menu');
btn.addEventListener('click',()=>{const open=menu.classList.toggle('open');btn.setAttribute('aria-expanded',open);menu.setAttribute('aria-hidden',!open)});
document.querySelectorAll('.menu a').forEach(a=>a.addEventListener('click',()=>{menu.classList.remove('open');btn.setAttribute('aria-expanded','false');menu.setAttribute('aria-hidden','true')}));
const secret=document.getElementById('secret'),secretText=document.getElementById('secretText');
secret.addEventListener('click',()=>secretText.classList.toggle('show'));
const hero=document.querySelector('.hero');
hero.addEventListener('pointermove',e=>{const x=e.clientX/innerWidth-.5,y=e.clientY/innerHeight-.5;document.querySelectorAll('.cloud,.moon,.sun').forEach((el,i)=>{const n=(i+1)*4;el.style.marginLeft=`${x*n}px`;el.style.marginTop=`${y*n}px`})});
