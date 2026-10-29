import { initializeApp, getApps } from 'https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js';
import { getFirestore, collection, onSnapshot, doc, setDoc, getDoc, getDocs, deleteDoc } from 'https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js';
const firebaseConfig={apiKey:'AIzaSyB6vG41F_gaQRk6jMMgBT-AEclDFlBWLOo',authDomain:'controle-gcif-oeste.firebaseapp.com',projectId:'controle-gcif-oeste',storageBucket:'controle-gcif-oeste.firebasestorage.app',messagingSenderId:'43290614749',appId:'1:43290614749:web:16c567c1164e3c5aac3434'};
const app=getApps()[0]||initializeApp(firebaseConfig),db=getFirestore(app),auth=getAuth(app);
const BASES=[['chapada','BASE CHAPADA - LENÇÓIS'],['meio-oeste','BASE MEIO OESTE (B. JESUS DA LAPA)'],['norte','BASE NORTE (JUAZEIRO)'],['oeste','BASE OESTE (BARREIRAS)'],['sudoeste','BASE SUDOESTE (V. DA CONQUISTA)']];
const baseName=k=>(BASES.find(x=>x[0]===k)||BASES[3])[1];
const count=(a,s)=>a.filter(x=>x.status===s).length;
function render(rows){
 const total={n:rows.length,combate:count(rows,'COMBATE'),m:count(rows,'MONITORAMENTO'),prt:count(rows,'PRONTIDÃO'),base:count(rows,'BASE'),x:count(rows,'X')};
 const s=document.getElementById('generalSummary'); if(!s)return;
 s.innerHTML=`<div class="stat"><b>${total.n}</b><small>Total GCIF</small></div><div class="stat generalCombatStat"><b>🔥 ${total.combate}</b><small>Combate</small></div><div class="stat"><b>M ${total.m}</b><small>Monitoramento</small></div><div class="stat"><b>PRT ${total.prt}</b><small>Prontidão</small></div><div class="stat"><b>X ${total.x}</b><small>Outra Base</small></div><div class="stat"><b>● ${total.base}</b><small>Base</small></div>`;
 const cards=document.getElementById('generalBases');
 cards.innerHTML=BASES.map(([key,name])=>{const a=rows.filter(x=>(x.base||'oeste')===key),combate=count(a,'COMBATE'),alert=combate>0;return `<button type="button" class="generalBaseCard${alert?' combatAlert':''}" data-general-base="${key}">${alert?`<span class="combatAlertLabel">🔥 ATENÇÃO — ${combate} GCIF${combate>1?'s':''} EM COMBATE</span>`:''}<strong>${name}</strong><span><b>${a.length}</b> GCIF</span><small>🔥 ${combate} Combate &nbsp; • &nbsp; M ${count(a,'MONITORAMENTO')} &nbsp; • &nbsp; PRT ${count(a,'PRONTIDÃO')} &nbsp; • &nbsp; X ${count(a,'X')} &nbsp; • &nbsp; ● ${count(a,'BASE')}</small><em>Ver detalhes da Base →</em></button>`}).join('');
}
document.getElementById('generalBases')?.addEventListener('click',e=>{const b=e.target.closest('[data-general-base]');if(!b)return;localStorage.setItem('gcifBase',b.dataset.generalBase);location.reload()});
onSnapshot(collection(db,'gcifs'),snap=>render(snap.docs.map(d=>d.data())),()=>{const x=document.getElementById('generalStatus');if(x)x.textContent='Não foi possível atualizar o Painel Geral.'});

// Dados funcionais adicionais para solicitação e gestão de administradores
const requestDialog=document.getElementById('requestDialog'),rank=document.getElementById('requestRank');
if(requestDialog&&rank&&!document.getElementById('requestFullName')){
 const rankLabel=rank.closest('label');
 rankLabel.insertAdjacentHTML('afterend',`<label>Nome completo<input id="requestFullName" type="text" autocomplete="name" required placeholder="Informe o nome completo"></label><label>Matrícula<input id="requestRegistration" type="text" required placeholder="Informe a matrícula"></label><label>OBM<input id="requestObm" type="text" required placeholder="Informe a OBM"></label>`);
}
const requestBtn=document.getElementById('requestBtn');
requestBtn?.addEventListener('click',()=>{setTimeout(()=>{const u=auth.currentUser;const n=document.getElementById('requestFullName');if(n&&!n.value)n.value=u?.displayName||'';const m=document.getElementById('requestRegistration');const o=document.getElementById('requestObm');if(m)m.value='';if(o)o.value=''},0)});
const sendRequest=document.getElementById('sendRequest');
if(sendRequest)sendRequest.onclick=async e=>{
 e.preventDefault();
 const u=auth.currentUser,rankValue=rank?.value||'',fullName=document.getElementById('requestFullName')?.value.trim()||'',registration=document.getElementById('requestRegistration')?.value.trim()||'',obm=document.getElementById('requestObm')?.value.trim()||'',base=localStorage.getItem('gcifBase')||'oeste';
 if(!u)return;
 if(!rankValue||!fullName||!registration||!obm){alert('Preencha nível hierárquico, nome completo, matrícula e OBM.');return}
 try{await setDoc(doc(db,'requests',u.uid),{uid:u.uid,email:u.email||'',name:fullName,fullName,registration,obm,rank:rankValue,base,baseName:baseName(base),requestedAt:new Date().toISOString()});requestDialog.close();alert('Solicitação enviada para '+baseName(base)+'.')}catch(x){alert('Não foi possível enviar a solicitação: '+(x.code||x.message))}
};
function adminIdentity(x,id){const name=x.fullName||x.name||x.email||id,reg=x.registration?` • Matrícula: ${x.registration}`:'',obm=x.obm?` • OBM: ${x.obm}`:'';return `<b>${x.rank?x.rank+' ':''}${name}</b><br><small>${x.email||''}${reg}${obm}</small>`}
async function loadAdminsV52(){
 try{const [rq,ad]=await Promise.all([getDocs(collection(db,'requests')),getDocs(collection(db,'admins'))]);
  const rl=document.getElementById('requestsList'),al=document.getElementById('adminsList');
  if(rl)rl.innerHTML=rq.empty?'<p>Nenhuma solicitação pendente.</p>':rq.docs.map(d=>{const x=d.data();return `<div style="padding:10px;border-bottom:1px solid #ddd">${adminIdentity(x,d.id)}<br><strong>${x.baseName||baseName(x.base||'oeste')}</strong><br><button type="button" data-approve-v52="${d.id}">Autorizar nesta Base</button> <button type="button" data-reject-v52="${d.id}">Recusar</button></div>`}).join('');
  if(al)al.innerHTML=ad.empty?'<p>Nenhum administrador adicional.</p>':ad.docs.map(d=>{const x=d.data();return `<div style="padding:10px;border-bottom:1px solid #ddd">${adminIdentity(x,d.id)}<br><strong>${x.baseName||baseName(x.base||'oeste')}</strong><br><button type="button" data-revoke-v52="${d.id}">Revogar acesso</button></div>`}).join('');
 }catch(e){alert('Não foi possível carregar administradores: '+(e.code||e.message))}
}
const manage=document.getElementById('manageAdminsBtn'),adminsDialog=document.getElementById('adminsDialog');
if(manage)manage.onclick=async()=>{await loadAdminsV52();adminsDialog?.showModal()};
const requestsList=document.getElementById('requestsList');
if(requestsList)requestsList.onclick=async e=>{const a=e.target.dataset.approveV52,r=e.target.dataset.rejectV52;if(!a&&!r)return;try{if(a){const s=await getDoc(doc(db,'requests',a)),x=s.data()||{};await setDoc(doc(db,'admins',a),{uid:a,email:x.email||'',name:x.fullName||x.name||'',fullName:x.fullName||x.name||'',registration:x.registration||'',obm:x.obm||'',rank:x.rank||'',base:x.base||'oeste',baseName:x.baseName||baseName(x.base||'oeste'),authorizedAt:new Date().toISOString(),authorizedBy:auth.currentUser?.email||''});await deleteDoc(doc(db,'requests',a))}if(r)await deleteDoc(doc(db,'requests',r));await loadAdminsV52()}catch(err){alert('Não foi possível concluir: '+(err.code||err.message))}};
const adminsList=document.getElementById('adminsList');
if(adminsList)adminsList.onclick=async e=>{const id=e.target.dataset.revokeV52;if(!id)return;try{await deleteDoc(doc(db,'admins',id));await loadAdminsV52()}catch(err){alert('Não foi possível revogar: '+(err.code||err.message))}};