/* v172 — etapa 2: navegação móvel estável. Sem MutationObserver, sem timers recorrentes e sem reorganizar o DOM existente. */
(()=>{
  function init(){
    if(!window.matchMedia('(max-width:760px)').matches) return;
    if(document.getElementById('stableNav172')) return;
    const nav=document.createElement('nav');
    nav.id='stableNav172';
    nav.className='stableNav172';
    nav.setAttribute('aria-label','Navegação rápida');
    nav.innerHTML=`
      <a href="#generalSummary" aria-label="Ir para visão geral"><span class="ico">🏠</span><span>Geral</span></a>
      <a href="#geoMap93" aria-label="Ir para o mapa"><span class="ico">📍</span><span>Mapa</span></a>
      <a href="#board" aria-label="Ir para os GCIFs"><span class="ico">🚒</span><span>GCIFs</span></a>
      <a href="#baseName" aria-label="Ir para a Base"><span class="ico">⚙️</span><span>Base</span></a>`;
    document.body.appendChild(nav);
    nav.addEventListener('click',e=>{
      const a=e.target.closest('a[href^="#"]');
      if(!a)return;
      const target=document.querySelector(a.getAttribute('href'));
      if(!target)return;
      e.preventDefault();
      target.scrollIntoView({behavior:'smooth',block:'start'});
    });
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();