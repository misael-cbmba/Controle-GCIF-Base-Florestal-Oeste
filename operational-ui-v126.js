// Compatibilidade: carrega a implementação mestre e, em seguida, a limpeza estrutural v129.
(async()=>{
  try{
    await import('./operational-master-v127.js?v=129');
    await import('./realtime-cleanup-v129.js?v=129');
  }catch(err){
    console.error('Falha ao carregar painel operacional v129',err);
  }
})();
