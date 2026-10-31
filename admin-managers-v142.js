import { getApps } from 'https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js';
import { getAuth,onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js';
import { getFirestore,doc,getDoc,setDoc,deleteDoc,getDocs,collection } from 'https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js';

const OWNER_EMAIL='leasim.sousa@gmail.com';
const BASES={chapada:'BASE CHAPADA - LENÇÓIS','meio-oeste':'BASE MEIO OESTE (B. JESUS DA LAPA)',norte:'BASE NORTE (JUAZEIRO)',oeste:'BASE OESTE (BARREIRAS)',sudoeste:'BASE SUDOESTE (V. DA CONQUISTA)'};
const waitApp=()=>new Promise(resolve=>{const t=setInterval(()=>{const a=getApps()[0];if(a){clearInterval(t);resolve(a)}},50)});
const app=await waitApp(),auth=getAuth(app),db=getFirestore(app);
let user=null,owner=false,manager=false;
const $=s=>document.querySelector(s);
const message=(t,e=false)=>{const x=$('#authMessage');if(x){x.hidden=false;x.textContent=t;x.className=e?'authMessage error':'authMessage'}};
const baseName=k=>BASES[k]||BASES.oeste;

async function role(){user=auth.currentUser;owner=!!user&&String(user.email||'').toLowerCase()===OWNER_EMAIL;manager=false;if(user&&!owner){try{const s=await getDoc(doc(db,'admins',user.uid));manager=s.exists()&&s.data().role==='manager'}catch(e){}}const b=$('#manageAdminsBtn');if(b&&(owner||manager)){b.hidden=false;b.textContent=manager?'👥 Gerenciar administradores (Gestor)':'👥 Gerenciar administradores';}}

async function load(){if(!(owner||manager))return;const [rq,ad]=await Promise.all([getDocs(collection(db,'requests')),getDocs(collection(db,'admins'))]);
 $('#requestsList').innerHTML='<h3>Solicitações pendentes</h3>'+(rq.empty?'<p>Nenhuma solicitação pendente.</p>':rq.docs.map(d=>{const x=d.data();return `<div style="padding:12px 0;border-bottom:1px solid #ddd"><b>${x.rank?x.rank+' ':''}${x.name||x.email||d.id}</b><br><small>${x.email||''}</small><br><strong>${x.baseName||baseName(x.base)}</strong><br><button type="button" data-v142-approve="${d.id}">Autorizar nesta Base</button> <button type="button" data-v142-reject="${d.id}">Recusar</button></div>`}).join(''));
 $('#adminsList').innerHTML='<h3>Administradores cadastrados</h3>'+(ad.empty?'<p>Nenhum administrador adicional.</p>':ad.docs.map(d=>{const x=d.data(),isMgr=x.role==='manager';return `<div style="padding:12px 0;border-bottom:1px solid #ddd"><b>${x.rank?x.rank+' ':''}${x.name||x.email||d.id}</b> ${isMgr?'<span style="font-weight:800;color:#087443">• GESTOR DE ADMINISTRADORES</span>':''}<br><small>${x.email||''}</small><br>${isMgr?'<strong>Acesso à gestão de administradores das cinco Bases</strong>':`<strong>${x.baseName||baseName(x.base)}</strong>`}<br>${owner&&!isMgr?`<button type="button" data-v142-promote="${d.id}">Tornar Gestor de Administradores</button> `:''}${owner&&isMgr?`<button type="button" data-v142-demote="${d.id}">Remover função de Gestor</button> `:''}${!isMgr?`<button type="button" data-v142-revoke="${d.id}">Revogar acesso</button>`:''}</div>`}).join(''));
}

document.addEventListener('click',async e=>{
 const manage=e.target.closest('#manageAdminsBtn');if(manage&&(owner||manager)){e.preventDefault();e.stopImmediatePropagation();await load();$('#adminsDialog')?.showModal();return}
 const approve=e.target.closest('[data-v142-approve]'),reject=e.target.closest('[data-v142-reject]'),revoke=e.target.closest('[data-v142-revoke]'),promote=e.target.closest('[data-v142-promote]'),demote=e.target.closest('[data-v142-demote]');
 if(!(approve||reject||revoke||promote||demote))return;
 e.preventDefault();e.stopImmediatePropagation();
 try{
  if(approve&&(owner||manager)){const id=approve.dataset.v142Approve,s=await getDoc(doc(db,'requests',id)),x=s.data()||{};await setDoc(doc(db,'admins',id),{uid:id,email:x.email||'',name:x.name||'',rank:x.rank||'',base:x.base||'oeste',baseName:x.baseName||baseName(x.base),role:'base',authorizedAt:new Date().toISOString(),authorizedBy:user.email});await deleteDoc(doc(db,'requests',id));message('Administrador autorizado para '+(x.baseName||baseName(x.base))+'.')}
  if(reject&&(owner||manager)){await deleteDoc(doc(db,'requests',reject.dataset.v142Reject));message('Solicitação recusada.')}
  if(revoke&&(owner||manager)){const id=revoke.dataset.v142Revoke,s=await getDoc(doc(db,'admins',id));if(s.exists()&&s.data().role==='manager'&&!owner)throw new Error('Somente o Administrador Principal pode alterar um Gestor.');await deleteDoc(doc(db,'admins',id));message('Acesso administrativo revogado.')}
  if(promote&&owner){const id=promote.dataset.v142Promote,s=await getDoc(doc(db,'admins',id));if(s.exists())await setDoc(doc(db,'admins',id),{...s.data(),role:'manager',managerSince:new Date().toISOString(),managerAuthorizedBy:user.email});message('Gestor de Administradores autorizado.')}
  if(demote&&owner){const id=demote.dataset.v142Demote,s=await getDoc(doc(db,'admins',id));if(s.exists())await setDoc(doc(db,'admins',id),{...s.data(),role:'base',managerRemovedAt:new Date().toISOString(),managerRemovedBy:user.email});message('Função de Gestor removida. O usuário permanece administrador da Base cadastrada.')}
  await load();
 }catch(err){message('Não foi possível concluir: '+(err.code||err.message),true)}
},true);

onAuthStateChanged(auth,async()=>{await role()});
