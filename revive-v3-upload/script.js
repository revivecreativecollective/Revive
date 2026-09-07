const opening=document.querySelector('#opening'),enter=document.querySelector('#enterSite'),toggle=document.querySelector('#menuToggle'),menu=document.querySelector('#siteMenu');
enter?.addEventListener('click',()=>opening.classList.add('gone'));
function closeMenu(){menu.classList.remove('open');menu.setAttribute('aria-hidden','true');toggle.setAttribute('aria-expanded','false')}
toggle?.addEventListener('click',()=>{const open=menu.classList.toggle('open');menu.setAttribute('aria-hidden',String(!open));toggle.setAttribute('aria-expanded',String(open))});
menu?.querySelectorAll('a').forEach(link=>link.addEventListener('click',closeMenu));
const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting)entry.target.classList.add('visible')}),{threshold:.12});document.querySelectorAll('.reveal').forEach(item=>observer.observe(item));
