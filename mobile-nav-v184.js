// v184 — restaura navegação móvel fixa, sem observers e sem alterar dados.
(()=>{
 const mobile=()=>window.matchMedia('(max-width:700px)').matches;
 const go=(sel)=>{const el=document.querySelector(sel);if(el)el.scrollIntoView({behavior:'smooth',block:'start'});};
 const init=()=>{
  if(!mobile()||document.getElementById('mobileNav184'))return;
  const nav=document.createElement('nav'); nav.id='mobileNav184'; nav.className='mobileNav184'; nav.setAttribute('aria-label','Navegação rápida');
  nav.innerHTML=`<button data-go=".generalPanel"><span>🏠</span><b>Geral</b></button><button data-go="#geoMap93"><span>📍</span><b>Mapa</b></button><button data-go="#board"><span>🚒</span><b>GCIFs</b></button><button data-go="#vehicleControl94"><span>🚑</span><b>Viaturas</b></button><button data-go=".basePanel"><span>⚙️</span><b>Base</b></button>`;
  document.body.appendChild(nav);
  nav.addEventListener('click',e=>{const b=e.target.closest('button[data-go]');if(!b)return;go(b.dataset.go);});
 };
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
