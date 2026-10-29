(()=>{
 const norm=s=>String(s||'').trim().toUpperCase();
 function apply(){
  document.querySelectorAll('#board .card').forEach(card=>{
   const cpcifTag=card.querySelector('[data-cpcif-card]');
   if(!cpcifTag)return;
   const names=(cpcifTag.dataset.names||'').split('|').map(norm).filter(Boolean);
   if(!names.length)return;
   card.querySelectorAll('li').forEach(li=>{
    if(li.dataset.cpcifMarked==='1')return;
    const raw=li.textContent.replace(/🚒\s*MOTORISTA/gi,'').trim();
    if(names.includes(norm(raw))){
      li.dataset.cpcifMarked='1';li.classList.add('cpcifMember');
      const badge=document.createElement('span');badge.className='cpcifMemberBadge';badge.textContent=' 🔥🌲 CPCIF';li.appendChild(badge);
    }
   });
  });
 }
 const obs=new MutationObserver(()=>requestAnimationFrame(apply));obs.observe(document.body,{subtree:true,childList:true});
 const st=document.createElement('style');st.textContent=`#board li.cpcifMember{background:#dff3e5!important;border-left:4px solid #17723f!important;border-radius:7px!important;padding:4px 7px!important;font-weight:800!important;color:#0d5b32!important;margin:2px 0!important}.cpcifMemberBadge{display:inline-block;margin-left:5px;color:#b45309!important;background:#fff4cf!important;border:1px solid #e6c45a!important;border-radius:999px!important;padding:2px 7px!important;font-size:11px!important;font-weight:900!important;white-space:nowrap}`;document.head.appendChild(st);
 apply();
})();