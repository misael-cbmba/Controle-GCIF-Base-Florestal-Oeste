// v203 — visão executiva compacta, apenas leitura, com acesso rápido às Bases.
import{getApps}from'https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js';
import{getFirestore,collection,onSnapshot}from'https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js';
const db=getFirestore(getApps()[0]);
const bases=[['chapada','Chapada'],['meio-oeste','Meio Oeste'],['norte','Norte'],['oeste','Oeste'],['sudoeste','Sudoeste']];
const clean=x=>String(x??'').trim(),cat=g=>g.unavailable?'INDISPONÍVEL':clean(g.status).toUpperCase(),bk=g=>clean(g.base)||'oeste';
const css=document.createElement('style');css.textContent='#quick203{padding:14px;border:1px solid #d8e5dd;border-radius:14px;background:#f7faf8;margin:12px 0 18px}#quick203 h3{margin:0 0 5px;font-size:18px;color:#153d2a}#quick203 p{margin:0 0 12px;color:#5e7066;font-size:12px}.quick203Grid{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:9px}.quick203Base{background:white;border:1px solid #d8e5dd;border-radius:11px;padding:12px 9px;text-align:left;color:#1b3529;cursor:pointer;min-height:108px}.quick203Base:focus-visible{outline:3px solid #0a754c}.quick203Base strong{display:block;font-size:13px;margin-bottom:6px}.quick203Base span{display:block;font-size:12px;line-height:1.5}.quick203Base .quickCombat{color:#aa251f;font-weight:800}.quick203Base em{font-size:11px;font-style:normal;color:#08623e;text-decoration:underline}.quick203Base.hasCombat{border-left:5px solid #c7342d;background:#fffafa}@media(max-width:700px){#quick203{padding:12px}.quick203Grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}.quick203Base{min-height:100px}.quick203Base:last-child{grid-column:1/-1}}';document.head.appendChild(css);
const panel=document.createElement('section');panel.id='quick203';panel.setAttribute('aria-label','Resumo rápido das Bases');panel.innerHTML='<h3>🧭 Resumo rápido por Base</h3><p>Toque em uma Base para visualizar suas equipes. Quantidades calculadas a partir dos GCIFs cadastrados.</p><div class="quick203Grid" id="quick203Grid">Carregando informações…</div>';
document.querySelector('.generalPanel')?.appendChild(panel);
function render(rows){
 const el=document.getElementById('quick203Grid');if(!el)return;
 el.innerHTML=bases.map(([key,name])=>{const a=rows.filter(g=>bk(g)===key),combat=a.filter(g=>cat(g)==='COMBATE').length,monitor=a.filter(g=>cat(g)==='MONITORAMENTO').length,prevent=a.filter(g=>cat(g)==='ATIVIDADES PREVENTIVAS').length,ecd=a.filter(g=>cat(g)==='ECD-BASE').length,staff=a.reduce((n,g)=>n+(Array.isArray(g.team)?g.team.filter(clean).length:0),0),veh=new Set(a.map(g=>clean(g.vehicle).toUpperCase()).filter(Boolean)).size;
 return '<button type="button" class="quick203Base'+(combat?' hasCombat':'')+'" data-base203="'+key+'"><strong>'+name+'</strong><span>'+a.length+' GCIFs · '+staff+' militares</span><span class="quickCombat">🔥 '+combat+' em combate</span><span>🔎 '+monitor+' monitorando · 🌱 '+prevent+' prevenção</span><span>● '+ecd+' na Base · 🚒 '+veh+' viaturas vinculadas</span><em>Ver GCIFs desta Base</em></button>'}).join('');
}
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
