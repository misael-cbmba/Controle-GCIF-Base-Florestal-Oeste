// v169 — hotfix de estabilidade móvel: sem MutationObserver recursivo.
(()=>{
 const mobile=()=>matchMedia('(max-width:760px)').matches;
 let scheduled=false;
 function apply(){
  scheduled=false;
  if(!mobile()) return;
  document.body.classList.add('clean168');
  const s=document.getElementById('summary');
  if(s){
   s.style.setProperty('display','grid','important');
   s.style.setProperty('grid-template-columns','repeat(2,minmax(0,1fr))','important');
   s.style.setProperty('gap','10px','important');
   [...s.children].forEach(el=>{if(el.classList.contains('stat')){el.style.setProperty('width','auto','important');el.style.setProperty('min-width','0','important');el.style.setProperty('max-width','none','important')}});
  }
  const map=document.getElementById('geoMap93');
  if(map){[...map.querySelectorAll('button,a')].forEach(el=>{if((el.textContent||'').toUpperCase().includes('PAINEL DO FOGO'))el.classList.add('fireBtn168')})}
 }
 function schedule(){if(scheduled)return;scheduled=true;setTimeout(apply,120)}
 const css=document.createElement('style');css.textContent=`@media(max-width:760px){
 body.clean168{padding-bottom:118px!important}.clean168 main{padding-bottom:112px!important}
 .clean168 #summary{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:10px!important;padding:12px!important}
 .clean168 #summary:before{grid-column:1/-1!important;margin-bottom:0!important}
 .clean168 #summary .stat{width:auto!important;min-width:0!important;max-width:none!important;min-height:92px!important;padding:14px 15px!important;display:flex!important;flex-direction:column!important;justify-content:center!important;align-items:flex-start!important;overflow:hidden!important}
 .clean168 #summary .stat b{font-size:27px!important;line-height:1.05!important;white-space:nowrap!important}.clean168 #summary .stat small{font-size:12px!important;line-height:1.2!important;max-width:100%!important;white-space:normal!important;word-break:normal!important;overflow-wrap:normal!important;hyphens:none!important}
 .clean168 #geoMap93{padding:16px!important}.clean168 #geoMap93 .fireBtn168{min-height:40px!important;padding:9px 13px!important;font-size:13px!important;line-height:1.15!important;width:auto!important;max-width:170px!important;border-radius:10px!important;white-space:normal!important}
 .clean168 #geoMap93 h2,.clean168 #geoMap93 h3{font-size:22px!important;line-height:1.15!important;margin-bottom:4px!important}.clean168 #geoMap93 button:not(.fireBtn168){font-size:13px!important;min-height:42px!important;padding:9px 10px!important}
 .clean168 #nav164,.clean168 #nav165{bottom:14px!important;z-index:9999!important}.clean168 #geoMap93 .leaflet-container{margin-bottom:12px!important}.clean168 footer{padding-bottom:90px!important}}
 @media(max-width:390px){.clean168 #summary .stat{padding:12px!important}.clean168 #summary .stat small{font-size:11px!important}.clean168 #summary .stat b{font-size:25px!important}}`;document.head.appendChild(css);
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>{apply();setTimeout(apply,700);setTimeout(apply,2200)},{once:true});else{apply();setTimeout(apply,700);setTimeout(apply,2200)}
 addEventListener('resize',schedule,{passive:true});
})();