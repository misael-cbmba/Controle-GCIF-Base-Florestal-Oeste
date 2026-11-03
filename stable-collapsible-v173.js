// v186 — recolhíveis estáveis + navegação móvel + módulo opcional de geolocalização.
(()=>{
  const mobile=()=>window.matchMedia('(max-width:700px)').matches;
  const makeToggle=(id,label,target,open=false)=>{
    if(!mobile()||document.getElementById(id)||!target)return;
    const btn=document.createElement('button');
    btn.type='button'; btn.id=id; btn.className='stableCollapseToggle';
    btn.setAttribute('aria-expanded',String(open));
    btn.innerHTML=`<span>${label}</span><span class="stableChevron">${open?'▴':'▾'}</span>`;
    target.before(btn); target.classList.toggle('stableCollapsed',!open);
    btn.addEventListener('click',()=>{const closed=target.classList.toggle('stableCollapsed');btn.setAttribute('aria-expanded',String(!closed));btn.querySelector('.stableChevron').textContent=closed?'▾':'▴'});
  };
  const loadNav=()=>{if(!mobile())return;if(!document.querySelector('link[data-nav184]')){const l=document.createElement('link');l.rel='stylesheet';l.href='mobile-nav-v184.css?v=185';l.dataset.nav184='1';document.head.appendChild(l)}if(!document.querySelector('script[data-nav184]')){const s=document.createElement('script');s.src='mobile-nav-v184.js?v=185';s.defer=true;s.dataset.nav184='1';document.body.appendChild(s)}};
  const loadGeo=()=>{if(document.querySelector('script[data-geo186]'))return;const s=document.createElement('script');s.type='module';s.src='geolocation-v186.js?v=186';s.dataset.geo186='1';document.body.appendChild(s)};
  const init=()=>{if(mobile()){makeToggle('staffToggle173','👥 Equipe da Base',document.getElementById('staff'),false);makeToggle('legendToggle173','ⓘ Entenda as situações operacionais',document.querySelector('.legend.detailed'),false);const admin=document.getElementById('adminBar');if(admin)makeToggle('adminToggle173','⚙️ Administração',admin,false);loadNav()}loadGeo()};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true}); else init();
})();
