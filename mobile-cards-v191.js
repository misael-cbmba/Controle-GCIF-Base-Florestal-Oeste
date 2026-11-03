// v191 — um único resumo por GCIF no celular; detalhes e ações permanecem acessíveis.
import{initializeApp,getApps}from'https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js';
import{getFirestore,collection,onSnapshot}from'https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js';
const app=getApps()[0]||initializeApp({apiKey:'AIzaSyB6vG41F_gaQRk6jMMgBT-AEclDFlBWLOo',authDomain:'controle-gcif-oeste.firebaseapp.com',projectId:'controle-gcif-oeste',appId:'1:43290614749:web:16c567c1164e3c5aac3434'});
const db=getFirestore(app),board=document.getElementById('board');let rows=[];
const base=()=>localStorage.getItem('gcifBase')||'oeste';
const when=v=>{if(!v)return'Não informada';let d=v?.toDate?.()||new Date(v);return isNaN(d.getTime())?'Não informada':d.toLocaleString('pt-BR',{day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'})};
const rec=id=>rows.find(g=>Number(g.id)===id&&(base()==='oeste'?(!g.base||g.base==='oeste'):g.base===base()));
let busy=false,queued=false;const observer=new MutationObserver(()=>schedule());
function process(){if(busy||!matchMedia('(max-width:700px)').matches)return;busy=true;observer.disconnect();try{
board?.querySelectorAll('article.card').forEach(card=>{
 const id=Number((card.querySelector('h3')?.textContent||'').match(/GCIF\s*(\d+)/i)?.[1]);if(!id)return;
 const prior=card.querySelector('details.details191');const wasOpen=prior?.open===true;
 let details=prior;if(!details){details=document.createElement('details');details.className='details191';const summary=document.createElement('summary');summary.textContent='Ver detalhes';details.appendChild(summary)}
 // Move todos os elementos complementares, sem clonar botões nem recriar handlers.
 const sources=[...card.querySelectorAll('.team,.notes,.geo186,.cpcifV80Info,.editBtn,.deleteGcif117,.read174Extra,.read174Updated,.read174Details,.details189,.details190')];
 for(const el of sources){if(el===details||el.contains(details))continue;if(el.matches('.read174Details,.read174Updated')){el.remove();continue}
 if(el.matches('.details189,.details190')){for(const child of [...el.children])if(child.tagName!=='SUMMARY')details.appendChild(child);el.remove();continue}
 if(el.matches('.read174Extra')){for(const child of [...el.children])details.appendChild(child);el.remove();continue}
 if(el.parentElement!==details)details.appendChild(el)}
 // Metadados e históricos já exibidos por outros módulos passam a ficar dentro dos detalhes.
 for(const el of [...card.children]){if(el===details||el.matches('.top,.place,.vehicle,.last191,.last189'))continue;if(el.querySelector?.('.top,.place,.vehicle'))continue;details.appendChild(el)}
 // Um único horário visível no resumo; informações históricas ficam nos detalhes.
 card.querySelectorAll('.last189').forEach(el=>el.remove());
 let last=card.querySelector('.last191');if(!last){last=document.createElement('div');last.className='last191'}
 last.textContent='🕒 Atualizado: '+when(rec(id)?.updatedAt);
 const vehicle=card.querySelector('.vehicle');if(vehicle)vehicle.after(last);
 if(!details.isConnected)last.after(details);
 // Duplicatas de atualização são ocultadas apenas visualmente; não apagamos o histórico.
 const dup=[...details.querySelectorAll('div,small,span,p')].filter(el=>el.children.length===0&&/^(🕒|🕓|⏱|⌚|\s)*\s*(Última atualização|Atualizado)\s*:/i.test(el.textContent?.trim()||''));dup.forEach(el=>el.classList.add('duplicate191'));
 // Equipe e localização primeiro; ações administrativas por último.
 const actions=[...details.querySelectorAll('.editBtn,.deleteGcif117')];actions.forEach(el=>details.appendChild(el));
 details.open=wasOpen;details.querySelector(':scope > summary').textContent=wasOpen?'Ocultar detalhes':'Ver detalhes';
 if(!details.dataset.bound191){details.addEventListener('toggle',()=>{const s=details.querySelector(':scope > summary');if(s)s.textContent=details.open?'Ocultar detalhes':'Ver detalhes'});details.dataset.bound191='1'}
});
}finally{busy=false;observer.observe(board,{childList:true,subtree:true})}}
function schedule(){if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;process()})}
if(board){observer.observe(board,{childList:true,subtree:true});schedule()}
onSnapshot(collection(db,'gcifs'),snap=>{rows=snap.docs.map(d=>d.data());schedule()});
const css=document.createElement('style');css.textContent=`@media(max-width:700px){#board article.card{padding:14px 16px!important;margin-bottom:12px!important}#board article.card>.top{margin-bottom:8px!important}#board article.card>.place{font-weight:800!important}#board article.card>.last191{font-size:12px;color:#62726a;margin:8px 0 10px}#board .details191{border-top:1px solid #dce5df;padding-top:6px;margin-top:6px}#board .details191>summary{display:flex;align-items:center;min-height:44px;font-weight:800;color:#09663f;cursor:pointer;list-style:none}#board .details191>summary::-webkit-details-marker{display:none}#board .details191>summary:before{content:'▸';margin-right:9px}#board .details191[open]>summary:before{content:'▾'}#board .details191:not([open])>*:not(summary){display:none!important}#board .details191 .duplicate191{display:none!important}#board .details191 .team{margin:8px 0!important}#board .details191 .geo186{margin:10px 0!important}#board .details191 .editBtn,#board .details191 .deleteGcif117{width:100%!important;min-height:44px!important;margin:8px 0!important;padding:9px 12px!important}#board .details191 .read174Extra{display:block!important}#board .details191 .read174Details{display:none!important}}`;document.head.appendChild(css);
