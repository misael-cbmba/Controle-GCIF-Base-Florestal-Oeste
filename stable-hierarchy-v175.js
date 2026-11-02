/* v175 — hierarquia móvel: GCIFs aponta somente para Situação Operacional e viaturas ficam compactas. Sem MutationObserver. */
(()=>{
 const mobile=()=>window.matchMedia('(max-width:700px)').matches;
 function init(){
  if(!mobile())return;
  const nav=document.getElementById('stableNav172');
  const gcifLink=nav?.querySelector('a[href="#board"]');
  if(gcifLink){
   gcifLink.setAttribute('aria-label','Ir para Situação Operacional dos GCIFs');
   gcifLink.onclick=e=>{
    e.preventDefault();
    const title=document.querySelector('.sectionTitle')||document.getElementById('board');
    title?.scrollIntoView({behavior:'smooth',block:'start'});
    nav.querySelectorAll('a').forEach(a=>a.classList.remove('active174'));
    gcifLink.classList.add('active174');
   };
  }
  const vc=document.getElementById('vehicleControl94');
  if(vc&&!document.getElementById('vehicleToggle175')){
   const head=vc.querySelector('.vc94head');
   const body=[vc.querySelector('.vcFilters94'),vc.querySelector('.vcStats94'),vc.querySelector('.vcLegend94'),vc.querySelector('.vcList94')].filter(Boolean);
   const btn=document.createElement('button');
   btn.type='button';btn.id='vehicleToggle175';btn.className='vehicleToggle175';btn.setAttribute('aria-expanded','false');
   btn.innerHTML='<span>🚒 Ver controle de viaturas</span><span>▾</span>';
   head?.after(btn);
   body.forEach(el=>el.classList.add('vehicleCollapsed175'));
   btn.addEventListener('click',()=>{
    const opening=btn.getAttribute('aria-expanded')!=='true';
    btn.setAttribute('aria-expanded',String(opening));
    btn.lastElementChild.textContent=opening?'▴':'▾';
    body.forEach(el=>el.classList.toggle('vehicleCollapsed175',!opening));
   });
  }
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(init,250),{once:true});else setTimeout(init,250);
})();