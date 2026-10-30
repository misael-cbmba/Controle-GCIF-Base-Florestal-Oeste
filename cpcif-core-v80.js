import { initializeApp, getApps } from 'https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js';
import { getFirestore, collection, onSnapshot, doc, setDoc } from 'https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js';
const firebaseConfig={apiKey:'AIzaSyB6vG41F_gaQRk6jMMgBT-AEclDFlBWLOo',authDomain:'controle-gcif-oeste.firebaseapp.com',projectId:'controle-gcif-oeste',storageBucket:'controle-gcif-oeste.firebasestorage.app',messagingSenderId:'43290614749',appId:'1:43290614749:web:16c567c1164e3c5aac3434'};
const app=getApps()[0]||initializeApp(firebaseConfig),db=getFirestore(app);
let rows=[];
const clean=s=>String(s||'').trim();
const key=s=>clean(s).normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/\s+/g,' ').replace(/\bBM\b/g,'').replace(/\s+/g,' ').trim().toUpperCase();
const baseKey=()=>localStorage.getItem('gcifBase')||'oeste';
const inBase=(g,k)=>k==='oeste'?(!g.base||g.base==='oeste'):g.base===k;
const list=g=>Array.isArray(g?.cpcif)?g.cpcif.map(clean).filter(Boolean):[];
const same=(a,b)=>key(a)===key(b);
function draw(){
 document.querySelectorAll('#board .card').forEach(card=>{
  const id=Number((card.querySelector('h3')?.textContent.match(/\d+/)||[])[0]);
  const g=rows.find(x=>inBase(x,baseKey())&&Number(x.id)===id); if(!g)return;
  const cp=list(g),team=Array.isArray(g.team)?g.team:[],driver=clean(g.driver),ul=card.querySelector('ul.team');
  if(ul)ul.innerHTML=team.map(n=>{const d=same(n,driver),c=cp.some(v=>same(n,v));return `<li class="${d?'driver ':''}${c?'cpcifV80':''}"><span>${clean(n)}</span>${d?'<span class="driverTag">🚒 MOTORISTA</span>':''}${c?'<span class="cpcifV80Tag">🔥🌲 CPCIF</span>':''}</li>`}).join('');
  card.querySelectorAll('[data-cpcif-v80],[data-cpcif-card],[data-cpcif-core],.cpcifV80Info').forEach(x=>x.remove());
  if(cp.length){const info=document.createElement('div');info.className='cpcifV80Info';info.dataset.cpcifV80='1';info.innerHTML=`<b>🔥🌲 CPCIF:</b> ${cp.map(clean).join(' • ')}`;card.appendChild(info)}
 });
}
function installEditor(){
 const driver=document.querySelector('#eDriver');if(!driver||document.querySelector('#eCpcifV80'))return;
 const label=document.createElement('label');label.id='cpcifV80Label';label.style.display='none';label.innerHTML='Militar(es) com CPCIF<select id="eCpcifV80" multiple size="5"></select><small>Selecione os militares que possuem o CPCIF.</small>';driver.closest('label').insertAdjacentElement('afterend',label);
}
function fillEditor(){
 installEditor();const sel=document.querySelector('#eCpcifV80');if(!sel)return;
 const id=Number((document.querySelector('#editTitle')?.textContent.match(/\d+/)||[])[0]),g=rows.find(x=>inBase(x,baseKey())&&Number(x.id)===id),saved=list(g),team=(document.querySelector('#eTeam')?.value||'').split('\n').map(clean).filter(Boolean);
 sel.innerHTML=team.map(n=>`<option value="${n.replace(/"/g,'&quot;')}" ${saved.some(v=>same(n,v))?'selected':''}>${n}</option>`).join('');
 window.dispatchEvent(new CustomEvent('gcif-cpcif-loaded',{detail:{saved,team}}));
}
async function saveCpcif(){
 const box=document.querySelector('#eCpcif');
 const chosen=box?[...box.querySelectorAll('input:checked')].map(i=>clean(i.value)):[];
 const legacy=document.querySelector('#eCpcifV80');
 const cpcif=chosen.length?chosen:(legacy?[...legacy.selectedOptions].map(o=>clean(o.value)):[]);
 const id=Number((document.querySelector('#editTitle')?.textContent.match(/\d+/)||[])[0]);if(!id)return;
 const k=baseKey(),idDoc=k==='oeste'?String(id):`${k}__${String(id).padStart(2,'0')}`;
 try{await setDoc(doc(db,'gcifs',idDoc),{cpcif},{merge:true})}catch(e){console.error('Erro ao salvar CPCIF',e);alert('Não foi possível salvar o CPCIF. Tente novamente.')}
}
onSnapshot(collection(db,'gcifs'),s=>{rows=s.docs.map(d=>({...d.data(),id:Number(d.data().id||String(d.id).split('__').pop())}));draw();if(document.querySelector('#editor')?.open)setTimeout(fillEditor,80)});
new MutationObserver(()=>{clearTimeout(window.__cp80);window.__cp80=setTimeout(()=>{draw();if(document.querySelector('#editor')?.open)fillEditor()},80)}).observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['open']});
document.querySelector('#eTeam')?.addEventListener('input',()=>setTimeout(fillEditor,0));
document.querySelector('#save')?.addEventListener('click',saveCpcif,true);
const st=document.createElement('style');st.textContent=`#board li.cpcifV80{background:#d8f1df!important;border-left:5px solid #08783e!important;border-radius:8px!important;padding:5px 8px!important;font-weight:900!important;color:#075b35!important;margin:3px 0!important}#board li.cpcifV80.driver{background:linear-gradient(90deg,#fff0ae 0 48%,#d8f1df 48% 100%)!important}.cpcifV80Tag{display:inline-block;margin-left:7px;background:#08783e;color:#fff!important;border-radius:999px;padding:2px 8px;font-size:11px;font-weight:900;white-space:nowrap}.cpcifV80Info{margin-top:10px;padding:8px 10px;background:#e8f6ec;border:1px solid #9dceb0;border-radius:9px;color:#075b35;font-size:13px;font-weight:700}#cpcifV80Label small{display:block;margin-top:5px;color:#53605a}#eCpcifV80{width:100%;min-height:145px;margin-top:7px;padding:6px;border:1px solid #cfd8d3;border-radius:10px}`;document.head.appendChild(st);
installEditor();