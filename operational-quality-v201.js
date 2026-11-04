// v201 — alertas de atualizacao, protecao da edicao e qualidade do controle de viaturas.
import{getApps}from'https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js';
import{getFirestore,collection,onSnapshot}from'https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js';
const db=getFirestore(getApps()[0]),$=s=>document.querySelector(s);
let rows=[],vehicleRows=[],hours=Number(localStorage.getItem('gcifAlertHours201'))||12;
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const base=()=>localStorage.getItem('gcifBase')||'oeste';
const stamp=v=>{if(!v)return NaN;let d=v?.toDate?.()||new Date(v);return d.getTime()};
const age=g=>{let t=stamp(g.updatedAt);return Number.isFinite(t)?(Date.now()-t)/3600000:Infinity};
function install(){
 if($('#quality201'))return;
 const panel=document.createElement('section');panel.id='quality201';
 panel.innerHTML='<div class="qualityHead201"><div><h3>⏱ Atualização das equipes</h3><small>Alertas informativos: não alteram a situação operacional</small></div><label>Alertar após <select id="age201"><option value="6">6 horas</option><option value="12">12 horas</option><option value="24">24 horas</option></select></label></div><div id="qualityStats201"></div><details id="qualityDetails201"><summary>Ver equipes que precisam de atualização</summary><div id="qualityList201"></div></details>';
 const map=$('#geoMap186')||$('#geoMap93');if(map)map.before(panel);else $('.generalPanel')?.after(panel);
 $('#age201').value=String([6,12,24].includes(hours)?hours:12);
 $('#age201').addEventListener('change',e=>{hours=Number(e.target.value);localStorage.setItem('gcifAlertHours201',String(hours));draw()});
}
function draw(){
 install();const active=rows.filter(g=>['COMBATE','MONITORAMENTO','ATIVIDADES PREVENTIVAS','ECD-BASE'].includes(String(g.status||'').toUpperCase()));
 const old=active.filter(g=>age(g)>=hours),missing=old.filter(g=>!Number.isFinite(stamp(g.updatedAt)));
 const st=$('#qualityStats201'),list=$('#qualityList201'),d=$('#qualityDetails201');if(!st||!list)return;
 st.innerHTML='<b>'+old.length+' de '+active.length+' GCIFs</b> sem atualização recente (ou sem data registrada). <small>'+missing.length+' sem data de atualização.</small>';
 list.innerHTML=old.length?old.sort((a,b)=>age(b)-age(a)).map(g=>'<div class="qualityItem201"><strong>GCIF '+esc(String(g.id).padStart(2,'0'))+' · '+esc(g.base||'oeste')+'</strong><span>'+esc(g.city||'Município não informado')+' · '+(Number.isFinite(stamp(g.updatedAt))?Math.max(0,Math.floor(age(g)))+' h desde a atualização':'Data não registrada')+'</span></div>').join(''):'<p>Todas as equipes possuem atualização dentro do período selecionado.</p>';
 d.querySelector('summary').textContent='Ver '+old.length+' equipe(s) que precisam de atualização';
 const stats=$('#vcStats94');if(stats){const cards=[...stats.children],last=cards[4];if(last){const num=Number(last.querySelector('b')?.textContent.replace(/\D/g,''))||0;last.classList.toggle('vehicleWarning201',num>0);last.title=num+' viatura(s) sem condição informada; não significa indisponibilidade.'}}
}
function validate(e){
 const save=e.target.closest('#save');if(!save)return;
 const city=$('#eCity')?.value.trim()||'',team=($('#eTeam')?.value||'').split('\n').map(x=>x.trim()).filter(Boolean);
 const lat=($('#eLatitude')?.value||'').trim().replace(',','.'),lng=($('#eLongitude')?.value||'').trim().replace(',','.');
 const chosen=[...document.querySelectorAll('#eCpcif input:checked')].map(x=>x.value);
 const invalid=(!city||((lat&&!lng)||(!lat&&lng))||(lat&&(!Number.isFinite(+lat)||+lat< -90||+lat>90))||(lng&&(!Number.isFinite(+lng)||+lng< -180||+lng>180))||chosen.some(n=>!team.includes(n)));
 if(invalid){e.preventDefault();e.stopImmediatePropagation();alert('Revise o cadastro: informe o município, coordenadas válidas em par ou militares CPCIF pertencentes à equipe. Nenhuma alteração foi salva.')}
}
document.addEventListener('click',validate,true);
document.addEventListener('click',e=>{const b=e.target.closest('.deleteGcif117');if(!b)return;const id=b.dataset.gcifId;if(!confirm('CONFIRMAÇÃO ADICIONAL: excluir definitivamente o GCIF '+id+'? Esta ação remove o registro operacional.')){e.preventDefault();e.stopImmediatePropagation()}},true);
onSnapshot(collection(db,'gcifs'),s=>{rows=s.docs.map(d=>d.data());draw()});
onSnapshot(collection(db,'vehicles'),s=>{vehicleRows=s.docs.map(d=>d.data());draw()},()=>{});
new MutationObserver(()=>{if(!$('#quality201'))install()}).observe(document.body,{childList:true,subtree:false});
setInterval(draw,60000);install();draw();
const style=document.createElement('style');style.textContent='#quality201{margin:14px 0;padding:14px;border:1px solid #d7e3dc;border-radius:13px;background:#f7faf8;scroll-margin-top:90px}.qualityHead201{display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap}.qualityHead201 h3{margin:0;font-size:17px}.qualityHead201 small{color:#65756c}.qualityHead201 label{font-size:12px;font-weight:700}.qualityHead201 select{padding:7px;border:1px solid #cbd7d0;border-radius:8px}#qualityStats201{margin:12px 0;color:#334d40;font-size:13px}#qualityStats201 b{color:#a05200;font-size:17px}#qualityStats201 small{display:block;color:#65756c}#qualityDetails201 summary{color:#075f3d;font-weight:800;cursor:pointer;padding:8px 0}.qualityItem201{display:flex;flex-direction:column;padding:9px;border-top:1px solid #dbe5df;gap:3px;font-size:12px}.qualityItem201 span{color:#65756c}.vehicleWarning201{background:#fff3d7!important;border-color:#dcae54!important}.vehicleWarning201 b{color:#805200!important}@media(max-width:700px){#quality201{padding:12px;margin:12px 0}.qualityHead201{align-items:flex-start}}';document.head.appendChild(style);
