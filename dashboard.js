import { initializeApp, getApps } from 'https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js';
import { getFirestore, collection, onSnapshot } from 'https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js';
const firebaseConfig={apiKey:'AIzaSyB6vG41F_gaQRk6jMMgBT-AEclDFlBWLOo',authDomain:'controle-gcif-oeste.firebaseapp.com',projectId:'controle-gcif-oeste',storageBucket:'controle-gcif-oeste.firebasestorage.app',messagingSenderId:'43290614749',appId:'1:43290614749:web:16c567c1164e3c5aac3434'};
const app=getApps()[0]||initializeApp(firebaseConfig),db=getFirestore(app);
const BASES=[['chapada','BASE CHAPADA - LENÇÓIS'],['meio-oeste','BASE MEIO OESTE (B. JESUS DA LAPA)'],['norte','BASE NORTE (JUAZEIRO)'],['oeste','BASE OESTE (BARREIRAS)'],['sudoeste','BASE SUDOESTE (V. DA CONQUISTA)']];
const count=(a,s)=>a.filter(x=>x.status===s).length;
function render(rows){
 const total={n:rows.length,combate:count(rows,'COMBATE'),m:count(rows,'MONITORAMENTO'),prt:count(rows,'PRONTIDÃO'),base:count(rows,'BASE'),x:count(rows,'X')};
 const s=document.getElementById('generalSummary'); if(!s)return;
 s.innerHTML=`<div class="stat"><b>${total.n}</b><small>Total GCIF</small></div><div class="stat"><b>🔥 ${total.combate}</b><small>Combate</small></div><div class="stat"><b>M ${total.m}</b><small>Monitoramento</small></div><div class="stat"><b>PRT ${total.prt}</b><small>Prontidão</small></div><div class="stat"><b>X ${total.x}</b><small>Outra Base</small></div><div class="stat"><b>● ${total.base}</b><small>Base</small></div>`;
 const cards=document.getElementById('generalBases');
 cards.innerHTML=BASES.map(([key,name])=>{const a=rows.filter(x=>(x.base||'oeste')===key);return `<button type="button" class="generalBaseCard" data-general-base="${key}"><strong>${name}</strong><span><b>${a.length}</b> GCIF</span><small>🔥 ${count(a,'COMBATE')} Combate &nbsp; • &nbsp; M ${count(a,'MONITORAMENTO')} &nbsp; • &nbsp; PRT ${count(a,'PRONTIDÃO')} &nbsp; • &nbsp; X ${count(a,'X')} &nbsp; • &nbsp; ● ${count(a,'BASE')}</small><em>Ver detalhes da Base →</em></button>`}).join('');
}
document.getElementById('generalBases')?.addEventListener('click',e=>{const b=e.target.closest('[data-general-base]');if(!b)return;localStorage.setItem('gcifBase',b.dataset.generalBase);location.reload()});
onSnapshot(collection(db,'gcifs'),snap=>render(snap.docs.map(d=>d.data())),()=>{const x=document.getElementById('generalStatus');if(x)x.textContent='Não foi possível atualizar o Painel Geral.'});