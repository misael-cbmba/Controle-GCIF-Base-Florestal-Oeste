(()=>{
 const norm=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/🔥|🌲|🚒/g,'').replace(/MOTORISTA|CPCIF/gi,'').replace(/[^A-Z0-9]+/gi,' ').trim().replace(/\s+/g,' ').toUpperCase();
 function same(a,b){const x=norm(a),y=norm(b);return x===y||x.endsWith(y)||y.endsWith(x)}
 function apply(){
  document.querySelectorAll('#board .card').forEach(card=>{
   const cpcifTag=card.querySelector('[data-cpcif-card]');
   if(!cpcifTag)return;
   const names=(cpcifTag.dataset.names||'').split('|').map(x=>x.trim()).filter(Boolean);
   if(!names.length)return;
   card.querySelectorAll('li').forEach(li=>{
    li.querySelector('.cpcifMemberBadge')?.remove();
    li.classList.remove('cpcifMember');
    const raw=li.textContent;
    if(names.some(n=>same(raw,n))){
      li.classList.add('cpcifMember');
      const badge=document.createElement('span');
      badge.className='cpcifMemberBadge';
      badge.textContent=' 🔥🌲 CPCIF';
      li.appendChild(badge);
    }
   });
  });
 }
 let queued=false;
 const run=()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;apply()})};
 new MutationObserver(run).observe(document.getElementById('board')||document.body,{subtree:true,childList:true});
 const st=document.createElement('style');st.textContent=`#board li.cpcifMember{background:#dff3e5!important;border-left:5px solid #17723f!important;border-radius:7px!important;padding:4px 7px!important;font-weight:900!important;color:#0b5d32!important;margin:2px 0!important}.cpcifMemberBadge{display:inline-block;margin-left:6px;color:#fff!important;background:#17723f!important;border-radius:999px!important;padding:2px 7px!important;font-size:11px!important;font-weight:900!important;white-space:nowrap}`;document.head.appendChild(st);
 setInterval(apply,1200);apply();
})();