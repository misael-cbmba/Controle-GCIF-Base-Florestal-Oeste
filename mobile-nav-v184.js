// v195 — navegação móvel fixa com 5 atalhos, priorizando o novo mapa com geolocalização.
(()=>{const mobile=()=>window.matchMedia('(max-width:700px)').matches;const findVehicle=()=>document.querySelector('#vehicleControl94')||[...document.querySelectorAll('h1,h2,h3')].find(el=>/controle de viaturas/i.test(el.textContent||''))?.closest('section,div');const go=key=>{let el=null;if(key==='general')el=document.querySelector('.generalPanel');if(key==='map')el=document.querySelector('#geoMap186')||document.querySelector('#geoMap93');if(key==='gcifs')el=document.querySelector('#board')?.closest('section')||document.querySelector('#board');if(key==='vehicles')el=findVehicle();if(key==='base')el=document.querySelector('.basePanel');if(el)el.scrollIntoView({behavior:'smooth',block:'start'})};const init=()=>{if(!mobile())return;document.getElementById('mobileNav184')?.remove();document.getElementById('mobileNav185')?.remove();const nav=document.createElement('nav');nav.id='mobileNav185';nav.className='mobileNav184 mobileNav185';nav.setAttribute('aria-label','Navegação rápida');nav.innerHTML=`<button data-go="general"><span>🏠</span><b>Geral</b></button><button data-go="map"><span>📍</span><b>Mapa</b></button><button data-go="gcifs"><span>🚒</span><b>GCIFs</b></button><button data-go="vehicles"><span>🚑</span><b>Viaturas</b></button><button data-go="base"><span>⚙️</span><b>Base</b></button>`;document.body.appendChild(nav);
 // v195: durante a rolagem para baixo, a barra recolhe para não encobrir cards,
 // controles de viaturas ou botões administrativos. Reaparece ao subir.
 let lastY=window.scrollY,scheduled=false;
 const update=()=>{scheduled=false;const y=window.scrollY,delta=y-lastY;
  if(document.querySelector('dialog[open]')){nav.classList.remove('navHidden195');lastY=y;return}
  if(y<100||delta< -5)nav.classList.remove('navHidden195');
  else if(delta>7&&y>160)nav.classList.add('navHidden195');
  lastY=y;
 };
 window.addEventListener('scroll',()=>{if(!scheduled){scheduled=true;requestAnimationFrame(update)}},{passive:true});
 nav.addEventListener('focusin',()=>nav.classList.remove('navHidden195'));
 nav.addEventListener('click',()=>nav.classList.remove('navHidden195'));
 nav.addEventListener('click',e=>{const b=e.target.closest('button[data-go]');if(b)go(b.dataset.go)})};if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init()})();