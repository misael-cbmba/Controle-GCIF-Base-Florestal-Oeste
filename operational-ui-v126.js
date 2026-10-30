// Compatibilidade: a antiga camada v126 agora apenas carrega a implementação definitiva v127.
import('./operational-master-v127.js?v=127').catch(err=>console.error('Falha ao carregar painel operacional v127',err));
