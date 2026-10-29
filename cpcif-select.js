(()=>{
 const q=s=>document.querySelector(s), clean=s=>String(s||'').trim();
 let selected=[];
 function names(){return (q('#eTeam')?.value||'').split('\n').map(clean).filter(Boolean)}
 function install(){
  const driver=q('#eDriver'); if(!driver)return;
  const old=q('#cpcifField'); if(old)old.style.display='none';
  let wrap=q('#cpcifSelectWrap');
  if(!wrap){wrap=document.createElement('label');wrap.id='cpcifSelectWrap';wrap.innerHTML='Especialista(s) CPCIF<select id="eCpcif" multiple size="5"></select><small style="display:block;margin-top:6px;color:#53605a;font-weight:400">Selecione um ou mais militares com CPCIF. No computador use Ctrl para selecionar mais de um; no celular toque nos nomes disponíveis.</small>';driver.closest('label').insertAdjacentElement('afterend',wrap)}
  render();
 }
 function render(){
  const sel=q('#eCpcif'); if(!sel)return;
  const keep=new Set(selected.map(x=>x.toUpperCase()));
  [...sel.selectedOptions].forEach(o=>keep.add(o.value.toUpperCase()));
  sel.innerHTML=names().map(n=>`<option value="${n.replace(/"/g,'&quot;')}" ${keep.has(n.toUpperCase())?'selected':''}>${n}</option>`).join('');
  selected=[...sel.selectedOptions].map(o=>o.value);
  sel.onchange=()=>{selected=[...sel.selectedOptions].map(o=>o.value)};
 }
 const ed=q('#editor');
 if(ed)new MutationObserver(()=>{if(ed.open){selected=[];setTimeout(install,100)}}).observe(ed,{attributes:true,attributeFilter:['open']});
 q('#eTeam')?.addEventListener('input',render);
 q('#save')?.addEventListener('click',()=>{
  const hidden=q('#cpcifChoices'); if(!hidden)return;
  const chosen=new Set([...q('#eCpcif')?.selectedOptions||[]].map(o=>o.value.toUpperCase()));
  hidden.querySelectorAll('input').forEach(i=>i.checked=chosen.has(i.value.toUpperCase()));
 },true);
 const st=document.createElement('style');st.textContent='#cpcifSelectWrap{display:block;margin:14px 0;font-weight:800}#eCpcif{width:100%;min-height:150px;margin-top:7px;padding:6px;border:1px solid #cfd8d3;border-radius:12px;background:#fff;font-size:16px}#eCpcif option{padding:10px 12px;border-radius:7px;margin:2px 0}#eCpcif option:checked{background:#176b3a;color:#fff}';document.head.appendChild(st);
})();