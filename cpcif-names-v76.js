(()=>{
 const norm=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/\s+/g,' ').trim().toUpperCase();
 function mark(){
  document.querySelectorAll('#board .card').forEach(card=>{
   const tag=card.querySelector('[data-cpcif-card]');
   if(!tag)return;
   const names=(tag.dataset.names||'').split('|').map(s=>s.trim()).filter(Boolean);
   card.querySelectorAll('[data-cpcif-name-list]').forEach(x=>x.remove());
   if(!names.length)return;
   const wanted=names.map(norm);
   card.querySelectorAll('li').forEach(li=>{
    li.classList.remove('cpcifNameV76');
    li.querySelector('.cpcifBadgeV76')?.remove();
    const original=li.textContent.replace(/🚒\s*MOTORISTA/gi,'').replace(/🔥🌲\s*CPCIF/gi,'').trim();
    const n=norm(original);
    const hit=wanted.some(w=>n===w||n.includes(w)||w.includes(n));
    if(hit){
      li.classList.add('cpcifNameV76');
      const badge=document.createElement('span');
      badge.className='cpcifBadgeV76';
      badge.textContent=' 🔥🌲 CPCIF';
      li.appendChild(badge);
    }
   });
   const list=document.createElement('div');
   list.dataset.cpcifNameList='1';
   list.className='cpcifNameListV76';
   list.innerHTML='<strong>🔥🌲 CPCIF:</strong> '+names.map(n=>`<span>${n.replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]))}</span>`).join('');
   tag.insertAdjacentElement('afterend',list);
  });
 }
 const css=document.createElement('style');
 css.textContent=`#board li.cpcifNameV76{background:#d9f3e1!important;border-left:5px solid #0b633f!important;border-radius:7px!important;padding:4px 7px!important;font-weight:900!important;color:#075b35!important;margin:2px 0!important}.cpcifBadgeV76{display:inline-block;margin-left:6px;background:#0b633f;color:#fff!important;border-radius:999px;padding:2px 8px;font-size:11px;font-weight:900;white-space:nowrap}.cpcifNameListV76{margin-top:7px;padding:7px 9px;border-radius:8px;background:#e9f7ee;color:#075b35;font-size:12px;font-weight:700}.cpcifNameListV76 strong{margin-right:5px}.cpcifNameListV76 span{display:inline-block;margin:2px 5px 2px 0;padding:3px 7px;border-radius:999px;background:#0b633f;color:#fff;font-weight:800}`;
 document.head.appendChild(css);
 const obs=new MutationObserver(()=>requestAnimationFrame(mark));
 obs.observe(document.body,{subtree:true,childList:true});
 setInterval(mark,1200);
 mark();
})();