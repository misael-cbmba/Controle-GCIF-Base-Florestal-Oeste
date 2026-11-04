import {initializeApp,getApps} from 'https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js';
import {getFirestore,collection,onSnapshot} from 'https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js';
const cfg={apiKey:'AIzaSyB6vG41F_gaQRk6jMMgBT-AEclDFlBWLOo',authDomain:'controle-gcif-oeste.firebaseapp.com',projectId:'controle-gcif-oeste',storageBucket:'controle-gcif-oeste.firebasestorage.app',messagingSenderId:'43290614749',appId:'1:43290614749:web:16c567c1164e3c5aac3434'};
const db=getFirestore(getApps()[0]||initializeApp(cfg));
const bases={chapada:'Chapada', 'meio-oeste':'Meio Oeste',norte:'Norte',oeste:'Oeste',sudoeste:'Sudoeste'};
const norm=v=>String(v||'').trim().toLocaleUpperCase('pt-BR').replace(/\s+/g,' ');
let current=[];
function render(){
 let host=document.getElementById('vehicleDuplicate217');
 if(!host){host=document.createElement('section');host.id='vehicleDuplicate217';host.className='vehicleDuplicate217';const target=document.getElementById('vehicleControl94');if(target)target.prepend(host);else document.querySelector('main')?.append(host)}
 if(!host)return;
 const byPrefix=new Map();
 for(const g of current){
  const prefix=norm(g.vehicle);if(!prefix)continue;
  if(!byPrefix.has(prefix))byPrefix.set(prefix,[]);
  byPrefix.get(prefix).push(g);
 }
 const duplicates=[...byPrefix].filter(([p,arr])=>arr.length>1).sort((a,b)=>a[0].localeCompare(b[0],'pt-BR'));
 host.replaceChildren();
 const summary=document.createElement('details');summary.className='vd217details';
 const title=document.createElement('summary');title.textContent=duplicates.length?'⚠️ '+duplicates.length+' prefixo(s) de viatura repetido(s) — conferir vínculos':'✓ Nenhum prefixo de viatura repetido entre GCIFs';
 summary.append(title);
 const desc=document.createElement('p');desc.textContent='Conferência automática dos GCIFs cadastrados nas cinco Bases. A repetição é um alerta para verificação, não uma confirmação de erro. Nenhum cadastro será alterado.';summary.append(desc);
 for(const [prefix,arr] of duplicates){
  const card=document.createElement('div');card.className='vd217card';
  const h=document.createElement('strong');h.textContent='🚒 '+prefix+' · '+arr.length+' vínculos';card.append(h);
  for(const g of arr){const row=document.createElement('p');row.textContent=(bases[g.base||'oeste']||g.base||'Base não informada')+' · GCIF '+g.id+' · '+(g.city||'Município não informado');card.append(row)}
  summary.append(card);
 }
 host.append(summary);
}
onSnapshot(collection(db,'gcifs'),snap=>{current=snap.docs.map(d=>d.data());render()},err=>{console.warn('Verificação de prefixos indisponível',err)});
const css=document.createElement('style');css.textContent=`
#vehicleDuplicate217{margin:8px 0 16px}.vd217details{border:1px solid #d8e5dc;border-radius:12px;background:#f5faf7;padding:12px;color:#194633}.vd217details:has(.vd217card){background:#fff9e9;border-color:#e7ca82;color:#76500b}.vd217details summary{cursor:pointer;font-weight:800;line-height:1.45}.vd217details>p{font-size:12px;line-height:1.5;margin:10px 0}.vd217card{border:1px solid #e7d9af;border-radius:9px;background:white;padding:10px;margin:8px 0}.vd217card strong{font-size:14px}.vd217card p{font-size:13px;margin:5px 0;line-height:1.4}`;document.head.append(css);
document.addEventListener('DOMContentLoaded',render,{once:true});
