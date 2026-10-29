import { initializeApp, getApps } from 'https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js';
import { getFirestore, collection, onSnapshot } from 'https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js';
const firebaseConfig={apiKey:'AIzaSyB6vG41F_gaQRk6jMMgBT-AEclDFlBWLOo',authDomain:'controle-gcif-oeste.firebaseapp.com',projectId:'controle-gcif-oeste',storageBucket:'controle-gcif-oeste.firebasestorage.app',messagingSenderId:'43290614749',appId:'1:43290614749:web:16c567c1164e3c5aac3434'};
const app=getApps()[0]||initializeApp(firebaseConfig),db=getFirestore(app);
const BASES=[['chapada','BASE CHAPADA - LENÇÓIS'],['meio-oeste','BASE MEIO OESTE (B. JESUS DA LAPA)'],['norte','BASE NORTE (JUAZEIRO)'],['oeste','BASE OESTE (BARREIRAS)'],['sudoeste','BASE SUDOESTE (V. DA CONQUISTA)']];
let rows=[];
const baseKey=()=>localStorage.getItem('gcifBase')||'oeste';
const inBase=(g,k)=>k==='oeste'?(!g.base||g.base==='oeste'):g.base===k;
const count=(a,s)=>a.filter(g=>g.status===s).length;
function installControls(){
 const status=document.getElementById('eStatus');
 if(status&&!status.querySelector('option[value="ATIVIDADES PREVENTIVAS"]')){const o=document.createElement('option');o.value='ATIVIDADES PREVENTIVAS';o.textContent='🌱 ATIVIDADES PREVENTIVAS';status.insertBefore(o,status.querySelector('option[value="X"]'))}
 const filter=document.getElementById('filter');
 if(filter&&!filter.querySelector('option[value="ATIVIDADES PREVENTIVAS"]')){const o=document.createElement('option');o.value='ATIVIDADES PREVENTIVAS';o.textContent='ATIVIDADES PREVENTIVAS';filter.insertBefore(o,filter.querySelector('option[value="BASE"]'))}
 const legend=document.querySelector('.legend.detailed');
 if(legend&&!legend.querySelector('[data-preventiva]')){const s=document.createElement('span');s.dataset.preventiva='1';s.innerHTML='<b>🌱 ATIVIDADES PREVENTIVAS</b> — GCIF realizando ações de orientação à população local relacionadas à prevenção de incêndios florestais';legend.insertBefore(s,legend.lastElementChild)}
}
function patchCards(){
 const current=rows.filter(g=>inBase(g,baseKey()));
 document.querySelectorAll('#board .card').forEach(card=>{const m=card.querySelector('h3')?.textContent.match(/(\d+)/);if(!m)return;const g=current.find(x=>Number(x.id)===Number(m[1]));if(g?.status!=='ATIVIDADES PREVENTIVAS')return;card.classList.remove('base','combate','monitoramento','prontidao','transfer');card.classList.add('preventiva');const b=card.querySelector('.badge');if(b)b.textContent='🌱 PREVENTIVA'});
 const s=document.getElementById('summary');if(s){const a=current,p=count(a,'ATIVIDADES PREVENTIVAS');let el=s.querySelector('[data-preventiva-stat]');if(!el){el=document.createElement('div');el.className='stat';el.dataset.preventivaStat='1';s.appendChild(el)}el.innerHTML=`<b>🌱 ${p}</b><small>Atividades Preventivas</small>`}
}
function patchGeneral(){
 const total=count(rows,'ATIVIDADES PREVENTIVAS'),s=document.getElementById('generalSummary');if(s){let el=s.querySelector('[data-preventiva-general]');if(!el){el=document.createElement('div');el.className='stat';el.dataset.preventivaGeneral='1';const baseStat=[...s.children].find(x=>x.textContent.includes('Base'));s.insertBefore(el,baseStat||null)}el.innerHTML=`<b>🌱 ${total}</b><small>Atividades Preventivas</small>`}
 document.querySelectorAll('[data-general-base]').forEach(card=>{const k=card.dataset.generalBase,a=rows.filter(g=>inBase(g,k)),p=count(a,'ATIVIDADES PREVENTIVAS');let line=card.querySelector('[data-preventiva-base]');if(!line){line=document.createElement('small');line.dataset.preventivaBase='1';const em=card.querySelector('em');card.insertBefore(line,em)}line.innerHTML=`🌱 ${p} Atividades Preventivas`})
}
function patch(){installControls();patchCards();patchGeneral()}
const obs=new MutationObserver(()=>requestAnimationFrame(patch));obs.observe(document.body,{subtree:true,childList:true});
onSnapshot(collection(db,'gcifs'),s=>{rows=s.docs.map(d=>d.data());patch()});
installControls();
const style=document.createElement('style');style.textContent='.card.preventiva{border-left:6px solid #2e7d32!important;background:#eef8ef!important}.card.preventiva .badge{background:#2e7d32!important;color:#fff!important}.card.preventiva .place{color:#1b5e20!important}[data-preventiva-stat],[data-preventiva-general]{border:2px solid #2e7d32!important;background:#eef8ef!important}[data-preventiva-stat] b,[data-preventiva-general] b{color:#1b5e20!important}';document.head.appendChild(style);

// Complementa o relatório PDF com o novo status operacional.
const nativeOpen=window.open.bind(window);
window.open=(...args)=>{
 const w=nativeOpen(...args);if(!w)return w;
 const originalWrite=w.document.write.bind(w.document);
 w.document.write=(html)=>{
  if(typeof html==='string'&&html.includes('RELATÓRIO GERAL DE FUNCIONAMENTO DAS BASES FLORESTAIS')){
   const totalPrev=count(rows,'ATIVIDADES PREVENTIVAS');
   const summaryStat=`<div class="stat" style="border:2px solid #2e7d32;background:#eef8ef"><b style="color:#1b5e20">🌱 ${totalPrev}</b><span>Atividades Preventivas</span></div>`;
   html=html.replace('</div><div class="label">Visão rápida por Base</div>',summaryStat+'</div><div class="label">Visão rápida por Base</div>');
   BASES.forEach(([k])=>{
    const a=rows.filter(g=>inBase(g,k)),p=count(a,'ATIVIDADES PREVENTIVAS'),prt=count(a,'PRONTIDÃO'),m=count(a,'MONITORAMENTO'),b=count(a,'BASE'),x=count(a,'X');
    html=html.replace(`PRT ${prt} • M ${m} • Base ${b} • X ${x}`,`PRT ${prt} • M ${m} • 🌱 Preventivas ${p} • Base ${b} • X ${x}`);
    html=html.replace(`<span>M ${m}</span><span>● ${b} Base</span>`,`<span>M ${m}</span><span>🌱 ${p} Ativ. Preventivas</span><span>● ${b} Base</span>`);
   });
  }
  return originalWrite(html);
 };
 return w;
};
