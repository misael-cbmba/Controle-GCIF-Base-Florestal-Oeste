// v190 — compactação não destrutiva dos cards móveis. Não modifica Firebase nem permissões.
(()=>{const board=document.getElementById('board');if(!board)return;const mobile=()=>matchMedia('(max-width:700px)').matches;
const observer=new MutationObserver(()=>schedule());let scheduled=false,working=false;
function enhance(){if(!mobile()||working)return;working=true;observer.disconnect();try{
board.querySelectorAll('article.card').forEach(card=>{
 let details=card.querySelector('details.details190');if(!details){details=document.createElement('details');details.className='details190';const summary=document.createElement('summary');summary.textContent='Ver detalhes';details.appendChild(summary);const after=card.querySelector('.vehicle');if(after)after.after(details);else card.appendChild(details)}
 const legacy=card.querySelector('details.details189');if(legacy){for(const child of [...legacy.children])if(child.tagName!=='SUMMARY')details.appendChild(child);legacy.remove()}
 const time=card.querySelector('.last189');const meta=[...card.querySelectorAll('[class*="updated"],[class*="history"],[class*="audit"],[class*="meta"],[class*="timeline"],[class*="lastUpdate"],[class*="statusTime"]')].filter(el=>el!==time&&!el.closest('details.details190')&&!el.closest('.top'));
 // Ações e metadados existentes permanecem acessíveis em Ver detalhes.
 for(const el of [...card.querySelectorAll('.team,.notes,.geo186,.editBtn,.deleteGcif117'),...meta]){if(el!==details&&!el.contains(details))details.appendChild(el)}
 // Remove repetições da data no resumo: mantém um único horário de referência.
 const textNodes=[...card.querySelectorAll('div,p,small,span')].filter(el=>!el.closest('.details190')&&!el.closest('.top')&&el!==time&&el.children.length===0&&/última atualiza[çc][ãa]o/i.test(el.textContent||''));
 if(time){time.textContent=time.textContent.replace(/Última atualização:/i,'Atualizado:');for(const el of textNodes)el.remove()}
 // Caso metadados adicionais sejam injetados depois, o observador os recolhe.
 const controls=[...card.querySelectorAll('button')].filter(b=>/^(Editar GCIF|Excluir GCIF)/i.test((b.textContent||'').trim()));for(const b of controls)details.appendChild(b);
 details.querySelectorAll('.editBtn,.deleteGcif117').forEach(b=>b.classList.add('action190'));
 const count=details.querySelectorAll('.team,.notes,.geo186,.editBtn,.deleteGcif117').length;if(!count&&details.children.length===1)details.remove();
});
}finally{working=false;observer.observe(board,{childList:true,subtree:true})}}
function schedule(){if(scheduled)return;scheduled=true;requestAnimationFrame(()=>{scheduled=false;enhance()})}
observer.observe(board,{childList:true,subtree:true});schedule();
const css=document.createElement('style');css.textContent=`@media(max-width:700px){#board article.card{padding:14px 16px!important;margin-bottom:12px!important}#board article.card .top{margin-bottom:7px!important}#board article.card .place{font-weight:800!important;margin-bottom:3px!important}#board article.card .vehicle{margin-bottom:6px!important}#board article.card .last189{font-size:12px!important;margin:6px 0!important}#board .details190{border-top:1px solid #e1e6e2;margin-top:10px;padding-top:6px}#board .details190>summary{min-height:44px;display:flex;align-items:center;cursor:pointer;font-weight:800;color:#0a6544;list-style:none}#board .details190>summary::-webkit-details-marker{display:none}#board .details190>summary:before{content:'▸';margin-right:8px}#board .details190[open]>summary:before{content:'▾'}#board .details190 .team{margin:8px 0!important}#board .details190 .editBtn,#board .details190 .deleteGcif117{width:100%!important;min-height:42px!important;padding:9px 12px!important;margin:8px 0!important;border-radius:10px!important}#board .details190 .geo186{font-size:12px!important}#board .details190 [class*="meta"],#board .details190 [class*="history"]{font-size:12px!important}#board article.card:has(.details190)>.editBtn,#board article.card:has(.details190)>.deleteGcif117{display:none!important}}`;document.head.appendChild(css);
})();
