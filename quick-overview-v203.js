// v203 — visão executiva compacta, apenas leitura, com acesso rápido às Bases.
import{getApps}from'https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js';
import{getFirestore,collection,onSnapshot}from'https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js';
const db=getFirestore(getApps()[0]);
const bases=[['chapada','Chapada'],['meio-oeste','Meio Oeste'],['norte','Norte'],['oeste','Oeste'],['sudoeste','Sudoeste']];
const clean=x=>String(x??'').trim(),cat=g=>{const v=clean(g.status).toUpperCase();return v==='COMBATE'?'COMBATE':v==='MONITORAMENTO'||v==='M'?'MONITORAMENTO':v==='ATIVIDADES PREVENTIVAS'||v==='PREVENTIVA'||v==='PREVENTIVO'?'ATIVIDADES PREVENTIVAS':'ECD-BASE'},bk=g=>clean(g.base)||'oeste';
const css=document.createElement('style');css.textContent="#quick203{padding:12px;border:1px solid #d8e5dd;border-radius:14px;background:#f7faf8;margin:12px 0 18px}#quick203 h3{margin:0 0 4px;font-size:17px;color:#153d2a}#quick203 p{margin:0 0 10px;color:#5e7066;font-size:12px}.quick203Grid{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:8px}.quick203Base{background:#fff;border:1px solid #d8e5dd;border-left:4px solid #d8e5dd;border-radius:11px;padding:10px;text-align:left;color:#1b3529;cursor:pointer;min-height:0;display:flex;flex-direction:column;gap:5px}.quick203Base:focus-visible{outline:3px solid #0a754c}.quick203Base strong{font-size:13px;line-height:1.25}.quick203Base .quickMetric{display:flex;justify-content:space-between;gap:6px;align-items:center;font-size:12px;line-height:1.25}.quick203Base .quickMetric b{font-size:13px}.quick203Base .quickCombat{color:#aa251f;font-weight:800}.quick203Base .quickSelected{font-size:10px;color:#08623e;font-weight:800}.quick203Base em{font-size:11px;font-style:normal;color:#08623e;text-decoration:underline;margin-top:3px}.quick203Base.hasCombat{border-left-color:#c7342d}.quick203Base.isSelected205{border:2px solid #08794c;border-left:5px solid #08794c;background:#e8f6ee;box-shadow:0 0 0 1px #b7dfc8}.quick203Base.isSelected205.hasCombat{border-left-color:#c7342d}.quick203Base[aria-pressed=true] strong{color:#075f3e}@media(max-width:700px){#quick203{padding:10px}.quick203Grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:7px}.quick203Base{padding:9px 10px;gap:4px}.quick203Base:last-child{grid-column:1/-1}.quick203Base .quickMetric{font-size:11px}}";document.head.appendChild(css);
const panel=document.createElement('section');panel.id='quick203';panel.setAttribute('aria-label','Resumo rápido das Bases');panel.innerHTML='<h3>🧭 Resumo rápido por Base</h3><p>Toque em uma Base para visualizar suas equipes. Quantidades calculadas a partir dos GCIFs cadastrados.</p><div class="quick203Grid" id="quick203Grid">Carregando informações…</div>';
document.querySelector('.generalPanel')?.appendChild(panel);
function render(rows){
 const el=document.getElementById('quick203Grid');if(!el)return;
 el.innerHTML=bases.map(([key,name])=>{const a=rows.filter(g=>bk(g)===key),combat=a.filter(g=>cat(g)==='COMBATE').length,monitor=a.filter(g=>cat(g)==='MONITORAMENTO').length,prevent=a.filter(g=>cat(g)==='ATIVIDADES PREVENTIVAS').length,ecd=a.filter(g=>cat(g)==='ECD-BASE').length,staff=a.reduce((n,g)=>n+(Array.isArray(g.team)?g.team.filter(clean).length:0),0),veh=a.filter(g=>clean(g.vehicle)).length;
 const selected=localStorage.getItem('gcifBase')===key;
 return '<button type="button" class="quick203Base'+(combat?' hasCombat':'')+(selected?' isSelected205':'')+'" data-base203="'+key+'" aria-pressed="'+selected+'"><strong>'+name+'</strong>'+(selected?'<span class="quickSelected">✓ BASE SELECIONADA</span>':'')+'<span class="quickMetric"><span>GCIFs</span><b>'+a.length+'</b></span><span class="quickMetric"><span>👥 Militares</span><b>'+staff+'</b></span><span class="quickMetric quickCombat"><span>🔥 Combate</span><b>'+combat+'</b></span><span class="quickMetric"><span>🔎 Monitoramento</span><b>'+monitor+'</b></span><span class="quickMetric"><span>🌱 Prevenção</span><b>'+prevent+'</b></span><span class="quickMetric"><span>● Na Base</span><b>'+ecd+'</b></span><span class="quickMetric"><span>🚒 Viaturas vinculadas</span><b>'+veh+'</b></span><em>Ver GCIFs desta Base</em></button>'}).join('');
 syncSelected206();
}
// v206: manter o destaque sincronizado mesmo quando a Base é escolhida pelo menu superior.
function syncSelected206(k=localStorage.getItem('gcifBase')||'oeste'){
 document.querySelectorAll('#quick203 [data-base203]').forEach(card=>{
  const selected=card.dataset.base203===k;
  card.classList.toggle('isSelected205',selected);
  card.setAttribute('aria-pressed',String(selected));
  let marker=card.querySelector('.quickSelected');
  if(selected&&!marker){marker=document.createElement('span');marker.className='quickSelected';marker.textContent='✓ BASE SELECIONADA';card.querySelector('strong')?.after(marker)}
  if(!selected)marker?.remove();
 });
}
document.getElementById('baseChoices')?.addEventListener('click',e=>{
 const b=e.target.closest('[data-base]');if(b)syncSelected206(b.dataset.base);
});
// v204: utilizar a troca de Base do aplicativo sem recarregar a página.
let changing204=false;
panel.addEventListener('click',async e=>{
 const b=e.target.closest('[data-base203]');if(!b||changing204)return;
 const k=b.dataset.base203;if(!bases.some(x=>x[0]===k))return;
 const selector=document.querySelector('#baseChoices [data-base="'+k+'"]');
 if(!selector){alert('Não foi possível selecionar esta Base.');return}
 changing204=true;
 try{
  selector.click();
  document.querySelectorAll('#quick203 [data-base203]').forEach(card=>{const chosen=card.dataset.base203===k;card.classList.toggle('isSelected205',chosen);card.setAttribute('aria-pressed',String(chosen));const marker=card.querySelector('.quickSelected');if(chosen&&!marker){const m=document.createElement('span');m.className='quickSelected';m.textContent='✓ BASE SELECIONADA';card.querySelector('strong')?.after(m)}else if(!chosen)marker?.remove()});
  // A troca é assíncrona: aguardar a seleção e a atualização dos cartões.
  for(let n=0;n<40;n++){
   if(localStorage.getItem('gcifBase')===k&&document.querySelector('#board article.card'))break;
   await new Promise(r=>setTimeout(r,120));
  }
  const board=document.querySelector('#board');
  if(board){
   const target=board.closest('section')||board;
   target.scrollIntoView({behavior:'smooth',block:'start'});
   const heading=target.querySelector('h2');
   if(heading)heading.setAttribute('tabindex','-1');
   heading?.focus({preventScroll:true});
  }
 }finally{changing204=false}
});
onSnapshot(collection(db,'gcifs'),s=>render(s.docs.map(d=>d.data())),()=>{const e=document.getElementById('quick203Grid');if(e)e.textContent='Não foi possível carregar o resumo das Bases.'});
