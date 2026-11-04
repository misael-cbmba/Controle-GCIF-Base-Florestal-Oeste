// v202 — validações de integridade e sinalização discreta das viaturas sem condição.
const $=s=>document.querySelector(s);
document.addEventListener('click',e=>{
 const save=e.target.closest('#save');if(!save)return;
 const city=$('#eCity')?.value.trim()||'',team=($('#eTeam')?.value||'').split('\n').map(x=>x.trim()).filter(Boolean);
 const lat=($('#eLatitude')?.value||'').trim().replace(',','.'),lng=($('#eLongitude')?.value||'').trim().replace(',','.');
 const chosen=[...document.querySelectorAll('#eCpcif input:checked')].map(x=>x.value);
 const invalid=!city||((lat&&!lng)||(!lat&&lng))||(lat&&(!Number.isFinite(+lat)||+lat< -90||+lat>90))||(lng&&(!Number.isFinite(+lng)||+lng< -180||+lng>180))||chosen.some(n=>!team.includes(n));
 if(invalid){e.preventDefault();e.stopImmediatePropagation();alert('Revise o cadastro: informe o município, coordenadas válidas em par ou militares CPCIF pertencentes à equipe. Nenhuma alteração foi salva.')}
},true);
document.addEventListener('click',e=>{
 const b=e.target.closest('.deleteGcif117');if(!b)return;
 if(!confirm('CONFIRMAÇÃO ADICIONAL: excluir definitivamente o GCIF '+b.dataset.gcifId+'? Esta ação remove o registro operacional.')){e.preventDefault();e.stopImmediatePropagation()}
},true);
function highlight(){
 const stat=$('#vcStats94');if(!stat)return;
 const last=stat.children[4];if(!last)return;
 const count=Number(last.querySelector('b')?.textContent.replace(/\D/g,''))||0;
 last.classList.toggle('vehicleWarning201',count>0);
 last.title=count+' viatura(s) sem condição informada; isso não significa indisponibilidade.';
}
new MutationObserver(highlight).observe(document.body,{childList:true,subtree:true});
const style=document.createElement('style');style.textContent='.vehicleWarning201{background:#fff3d7!important;border-color:#dcae54!important}.vehicleWarning201 b{color:#805200!important}';document.head.appendChild(style);
highlight();
