// v161 — resumo da Base: somente as quatro situações operacionais oficiais.
(()=>{
 const cat=v=>{const s=String(v||'').trim().toUpperCase();if(s==='COMBATE')return'COMBATE';if(s==='MONITORAMENTO'||s==='M')return'MONITORAMENTO';if(['ATIVIDADES PREVENTIVAS','PREVENTIVA','PREVENTIVO'].includes(s))return'ATIVIDADES PREVENTIVAS';return'ECD-BASE'};
 function fix(){
  const s=document.getElementById('summary'); if(!s)return;
  const cards=[...document.querySelectorAll('#board article.card')];
  let c=0,m=0,p=0,e=0;
  cards.forEach(card=>{const b=(card.querySelector('.badge')?.textContent||'').toUpperCase();const cl=card.className.toUpperCase();const x=cat(b.includes('COMBATE')?'COMBATE':b.includes('MONITOR')||b==='M'?'MONITORAMENTO':b.includes('PREVENT')?'ATIVIDADES PREVENTIVAS':cl.includes('COMBATE')?'COMBATE':cl.includes('MONITOR')?'MONITORAMENTO':cl.includes('PREVENT')?'ATIVIDADES PREVENTIVAS':'ECD-BASE');if(x==='COMBATE')c++;else if(x==='MONITORAMENTO')m++;else if(x==='ATIVIDADES PREVENTIVAS')p++;else e++});
  s.innerHTML=`<div class="stat bs161 combat"><b>🔥 ${c}</b><small>COMBATE</small></div><div class="stat bs161 monitor"><b>🔎 ${m}</b><small>MONITORAMENTO</small></div><div class="stat bs161 preventive"><b>🌱 ${p}</b><small>ATIVIDADES PREVENTIVAS</small></div><div class="stat bs161 ecd"><b>● ${e}</b><small>ECD-BASE</small></div>`;
 }
 const css=document.createElement('style');css.textContent=`#summary{grid-template-columns:repeat(4,minmax(0,1fr))!important}.bs161 b{font-size:25px!important}.bs161 small{font-weight:800!important}.bs161.combat{border:2px solid #d73a32!important;background:#fff5f4!important}.bs161.monitor{border:2px solid #2878b8!important;background:#f1f7fc!important}.bs161.preventive{border:2px solid #4c8b43!important;background:#f2f9f0!important}.bs161.ecd{border:2px solid #178b49!important;background:#eff9f3!important}@media(max-width:700px){#summary{grid-template-columns:repeat(2,minmax(0,1fr))!important}}`;document.head.appendChild(css);
 new MutationObserver(()=>{clearTimeout(window.__bs161);window.__bs161=setTimeout(fix,80)}).observe(document.getElementById('board')||document.body,{childList:true,subtree:true});
 setTimeout(fix,900);setInterval(fix,2500);
})();