// Complemento visual leve para ATIVIDADES PREVENTIVAS.
// Os dados e totais são processados pelos módulos principais; este arquivo não abre nova conexão com o Firebase.
function patchPreventiveCards(){
 document.querySelectorAll('#board .card').forEach(card=>{
  const badge=card.querySelector('.badge');
  if(!badge)return;
  // app.js trata status desconhecido como BASE; quando o texto já vier de outro módulo, apenas estilizamos.
  if(badge.textContent.includes('PREVENTIVA')){
   card.classList.remove('base','combate','monitoramento','prontidao','transfer');
   card.classList.add('preventiva');
  }
 });
}
let scheduled=false;
const schedule=()=>{if(scheduled)return;scheduled=true;requestAnimationFrame(()=>{scheduled=false;patchPreventiveCards()})};
const board=document.getElementById('board');
if(board)new MutationObserver(schedule).observe(board,{childList:true,subtree:true});
const style=document.createElement('style');
style.textContent='.card.preventiva{border-left:6px solid #2e7d32!important;background:#eef8ef!important}.card.preventiva .badge{background:#2e7d32!important;color:#fff!important}.card.preventiva .place{color:#1b5e20!important}[data-preventiva-stat],[data-preventiva-general]{border:2px solid #2e7d32!important;background:#eef8ef!important}[data-preventiva-stat] b,[data-preventiva-general] b{color:#1b5e20!important}';
document.head.appendChild(style);
schedule();
