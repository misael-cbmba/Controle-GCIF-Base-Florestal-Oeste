// v129 — limpeza estrutural do painel voltado exclusivamente ao acompanhamento em tempo real.
(function(){
  let cleaning=false;
  const removeAll=(selector)=>document.querySelectorAll(selector).forEach(el=>el.remove());
  function clean(){
    if(cleaning)return;
    cleaning=true;
    try{
      // Recursos históricos/ocorrências não pertencem ao panorama operacional em tempo real.
      removeAll('#planningEvolution, #incidentDialog');

      // Extensões antigas ainda tentam acrescentar ao resumo informações que já existem
      // na implementação mestre. Removemos somente as cópias legadas, preservando os
      // cards canônicos gerados pelo operational-master-v127.
      removeAll('#generalSummary [data-preventiva-general]');
      removeAll('#generalSummary #planningCapacity');
      removeAll('#generalSummary #planningUnavailable');
      removeAll('#generalSummary #generalCpcifStat');

      // Os cards mestres já apresentam esses dados em resources127; elimina linhas
      // duplicadas injetadas por módulos de compatibilidade antigos.
      removeAll('#generalBases .master127 [data-preventiva-base]');
      removeAll('#generalBases .master127 .planningBaseLine');
      removeAll('#generalBases .master127 .cpcifBaseLine');
    } finally {
      cleaning=false;
    }
  }
  clean();
  const observer=new MutationObserver(()=>{
    clearTimeout(window.__realtimeCleanup129);
    window.__realtimeCleanup129=setTimeout(clean,20);
  });
  observer.observe(document.documentElement,{childList:true,subtree:true});
  window.addEventListener('load',()=>setTimeout(clean,50));
  setTimeout(clean,300);
  setTimeout(clean,1200);
})();
