// Bootstrap v106: restaura o elemento legado esperado pelo app.js antes de reinicializar o módulo principal.
// O botão antigo permanece oculto; a edição continua somente nos cards de cada GCIF.
if (!document.getElementById('editMode')) {
  const legacy = document.createElement('button');
  legacy.id = 'editMode';
  legacy.type = 'button';
  legacy.hidden = true;
  legacy.style.display = 'none';
  legacy.setAttribute('aria-hidden', 'true');
  document.body.appendChild(legacy);
}

// app.js da versão antiga interrompia a execução ao procurar #editMode, que havia sido removido da tela.
// Recarrega o módulo com uma URL versionada depois de restaurar a dependência invisível.
import('./app.js?v=106').catch(err => {
  console.error('Falha ao reinicializar Controle GCIF:', err);
  const box = document.getElementById('authMessage');
  if (box) {
    box.hidden = false;
    box.className = 'authMessage error';
    box.textContent = 'Falha ao inicializar o acesso administrativo: ' + (err?.code || err?.message || err);
  }
});
