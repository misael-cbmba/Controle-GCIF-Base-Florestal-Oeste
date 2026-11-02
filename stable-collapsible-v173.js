// v173 — Etapa 3: elementos recolhíveis estáveis no celular. Sem MutationObserver e sem alteração de dados.
(()=>{
  const mobile=()=>window.matchMedia('(max-width:700px)').matches;
  const makeToggle=(id,label,target,open=false)=>{
    if(!mobile()||document.getElementById(id)||!target)return;
    const btn=document.createElement('button');
    btn.type='button'; btn.id=id; btn.className='stableCollapseToggle';
    btn.setAttribute('aria-expanded',String(open));
    btn.innerHTML=`<span>${label}</span><span class="stableChevron">${open?'▴':'▾'}</span>`;
    target.before(btn);
    target.classList.toggle('stableCollapsed',!open);
    btn.addEventListener('click',()=>{
      const closed=target.classList.toggle('stableCollapsed');
      btn.setAttribute('aria-expanded',String(!closed));
      btn.querySelector('.stableChevron').textContent=closed?'▾':'▴';
    });
  };
  const init=()=>{
    if(!mobile())return;
    makeToggle('staffToggle173','👥 Equipe da Base',document.getElementById('staff'),false);
    makeToggle('legendToggle173','ⓘ Entenda as situações operacionais',document.querySelector('.legend.detailed'),false);
    const admin=document.getElementById('adminBar');
    if(admin)makeToggle('adminToggle173','⚙️ Administração',admin,false);
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true}); else init();
})();
