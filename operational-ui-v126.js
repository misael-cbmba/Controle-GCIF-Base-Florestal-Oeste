// Compatibilidade: carrega a implementação mestre e a limpeza estrutural.
(async()=>{
  try{
    await import('./operational-master-v127.js?v=135');
    await import('./realtime-cleanup-v129.js?v=129');
  }catch(err){
    console.error('Falha ao carregar painel operacional v135',err);
  }
})();
