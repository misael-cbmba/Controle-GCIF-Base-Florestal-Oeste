// v189 — melhorias progressivas de usabilidade móvel, sem alterar gravações ou permissões.
import{initializeApp,getApps}from'https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js';
import{getFirestore,collection,onSnapshot}from'https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js';
const app=getApps()[0]||initializeApp({apiKey:'AIzaSyB6vG41F_gaQRk6jMMgBT-AEclDFlBWLOo',authDomain:'controle-gcif-oeste.firebaseapp.com',projectId:'controle-gcif-oeste',appId:'1:43290614749:web:16c567c1164e3c5aac3434'});
const db=getFirestore(app);let rows=[];
const mobile=()=>matchMedia('(max-width:700px)').matches;
const key=()=>localStorage.getItem('gcifBase')||'oeste';
const getRecord=id=>rows.find(g=>Number(g.id)===Number(id)&&(key()==='oeste'?(!g.base||g.base==='oeste'):g.base===key()));
const when=v=>{if(!v)return'Horário não informado';const d=v?.toDate?.()||new Date(v);return Number.isNaN(d.getTime())?'Horário não informado':d.toLocaleString('pt-BR',{day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'})};
function enhance(){if(!mobile())return;document.querySelectorAll('#board article.card').forEach(card=>{
 const id=Number((card.querySelector('h3')?.textContent||'').match(/GCIF\\s*(\\d+)/i)?.[1]);if(!id)return;
 const g=getRecord(id),timestamp=when(g?.updatedAt);
 let time=card.querySelector('.last189');if(!time){time=document.createElement('div');time.className='last189';(card.querySelector('.vehicle')||card.querySelector('.place'))?.after(time)}
 time.textContent='🕒 Última atualização: '+timestamp;
 const parts=[...card.querySelectorAll('.team,.notes,.geo186')];if(!parts.length)return;
 let details=card.querySelector('details.details189');
 if(!details){details=document.createElement('details');details.className='details189';const sum=document.createElement('summary');sum.textContent='Ver equipe, observações e detalhes';details.appendChild(sum);const anchor=card.querySelector('.editBtn');if(anchor)anchor.before(details);else card.appendChild(details)}
 for(const part of parts)details.appendChild(part);
 });
}
let queued=false;function schedule(){if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;enhance()})}
const board=document.getElementById('board');if(board)new MutationObserver(records=>{if(records.some(r=>[...r.addedNodes].some(n=>n.nodeType===1&&!n.classList?.contains('last189')&&!n.classList?.contains('details189'))))schedule()}).observe(board,{childList:true,subtree:false});
onSnapshot(collection(db,'gcifs'),s=>{rows=s.docs.map(d=>({...d.data(),_doc:d.id}));schedule()});
document.addEventListener('click',e=>{const b=e.target.closest('#mobileNav185 button[data-go]');if(!b)return;document.querySelectorAll('#mobileNav185 button[data-go]').forEach(x=>{x.classList.toggle('active189',x===b);x.setAttribute('aria-current',x===b?'page':'false')})});
const css=document.createElement('style');css.textContent=`@media(max-width:700px){body{padding-bottom:92px!important}main{padding-bottom:95px!important}#board article.card{overflow:visible}#board .last189{font-size:12px;color:#59675f;margin:8px 0}.details189{margin:10px 0;border-top:1px solid #e0e6e2;padding-top:9px}.details189 summary{cursor:pointer;color:#0b633f;font-weight:700;min-height:35px}.details189[open] summary{margin-bottom:10px}#mobileNav185 button.active189{color:#086b46!important;background:#eaf5ef!important;border-radius:12px}#mobileNav185 button{min-width:0;min-height:55px}#geoMap186,#board,.generalPanel,.basePanel{scroll-margin-top:12px}.hero{padding-bottom:10px}.hero .brandText strong{font-size:11px}.hero .brandText span{font-size:12px}.generalHead{gap:8px}.generalHead h2{font-size:19px}}`;document.head.appendChild(css);
schedule();
