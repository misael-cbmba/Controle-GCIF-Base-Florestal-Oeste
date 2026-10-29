(()=>{
 const q=s=>document.querySelector(s), clean=s=>String(s||'').trim();
 const norm=s=>clean(s).normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/\s+/g,' ').replace(/\bBM\b/g,'').replace(/\s+/g,' ').trim().toUpperCase();
 function names(){return (q('#eTeam')?.value||'').split('\n').map(clean).filter(Boolean)}
 function install(){
  const driver=q('#eDriver'); if(!driver)return;
  const old=q('#cpcifField'); if(old)old.style.display='none';
  const legacy=q('#cpcifV80Label'); if(legacy)legacy.style.display='none';
  let wrap=q('#cpcifSelectWrap');
  if(!wrap){wrap=document.createElement('label');wrap.id='cpcifSelectWrap';wrap.innerHTML='<span>Militar(es) com CPCIF</span><div id="eCpcif"></div><small>Marque um ou mais militares que possuem o CPCIF.</small>';driver.closest('label').insertAdjacentElement('afterend',wrap)}
  render();
 }
 function saved(){
  const legacy=q('#eCpcifV80');
  if(legacy)return [...legacy.selectedOptions].map(o=>o.value);
  return [];
 }
 function render(){
  const box=q('#eCpcif'); if(!box)return;
  const current=new Set([...box.querySelectorAll('input:checked')].map(i=>norm(i.value)));
  saved().forEach(n=>current.add(norm(n)));
  box.innerHTML=names().map((n,i)=>`<label class="cpcifChoice"><input type="checkbox" value="${n.replace(/"/g,'&quot;')}" ${current.has(norm(n))?'checked':''}><span>${n}</span><b>🔥🌲 CPCIF</b></label>`).join('')||'<em>Informe primeiro os militares da equipe.</em>';
 }
 function sync(){
  const chosen=[...q('#eCpcif')?.querySelectorAll('input:checked')||[]].map(i=>i.value);
  const legacy=q('#eCpcifV80');
  if(legacy)[...legacy.options].forEach(o=>o.selected=chosen.some(n=>norm(n)===norm(o.value)));
  const hidden=q('#cpcifChoices');
  if(hidden)hidden.querySelectorAll('input').forEach(i=>i.checked=chosen.some(n=>norm(n)===norm(i.value)));
 }
 const ed=q('#editor');
 if(ed)new MutationObserver(()=>{if(ed.open)setTimeout(install,180)}).observe(ed,{attributes:true,attributeFilter:['open']});
 q('#eTeam')?.addEventListener('input',()=>setTimeout(render,0));
 q('#save')?.addEventListener('click',sync,true);
 const st=document.createElement('style');st.textContent=`#cpcifSelectWrap{display:block;margin:14px 0;font-weight:800}#cpcifSelectWrap>small{display:block;margin-top:6px;color:#53605a;font-weight:400}#eCpcif{display:grid;gap:6px;margin-top:7px}.cpcifChoice{display:flex!important;align-items:center;gap:9px;padding:10px 12px;border:1px solid #cfd8d3;border-radius:10px;background:#fff;font-weight:600!important;cursor:pointer}.cpcifChoice input{width:20px;height:20px;flex:0 0 auto}.cpcifChoice span{flex:1}.cpcifChoice b{display:none;color:#08783e;font-size:11px}.cpcifChoice:has(input:checked){background:#d8f1df;border-color:#08783e;color:#075b35}.cpcifChoice:has(input:checked) b{display:inline-block}#eCpcif em{font-weight:400;color:#65756c;padding:8px}`;document.head.appendChild(st);
 install();
})();