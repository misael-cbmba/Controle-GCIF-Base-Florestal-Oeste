(()=>{
 const URL='https://misael-cbmba.github.io/Controle-GCIF-Base-Florestal-Oeste/';
 const title='CBMBA — Operação Florestal | Controle de GCIFs';
 function fallback(){
  let box=document.getElementById('shareFallback218');
  if(!box){
   box=document.createElement('dialog');box.id='shareFallback218';
   box.innerHTML='<div class="share218"><h3>Compartilhar aplicativo</h3><p>Copie o endereço ou abra o WhatsApp para enviar o acesso.</p><input aria-label="Endereço do aplicativo" readonly><div class="share218actions"><button type="button" data-act="copy">Copiar link</button><button type="button" data-act="whatsapp">WhatsApp</button><button type="button" data-act="close">Fechar</button></div><small aria-live="polite"></small></div>';
   document.body.append(box);
   box.addEventListener('click',async e=>{
    const act=e.target.closest('[data-act]')?.dataset.act;if(!act)return;
    if(act==='close'){box.close();return}
    if(act==='whatsapp'){window.open('https://wa.me/?text='+encodeURIComponent(title+'\n'+URL),'_blank','noopener,noreferrer');return}
    const input=box.querySelector('input');
    try{await navigator.clipboard.writeText(URL);box.querySelector('small').textContent='Link copiado!'}catch(_){input.focus();input.select();box.querySelector('small').textContent='Selecione e copie o endereço acima.'}
   });
  }
  box.querySelector('input').value=URL;
  if(!box.open)box.showModal();
 }
 async function share(e){
  e.preventDefault();e.stopImmediatePropagation();
  if(navigator.share){
   try{await navigator.share({title,text:'Acompanhe a Operação Florestal do CBMBA',url:URL});return}
   catch(err){if(err?.name==='AbortError')return;console.warn('Compartilhamento nativo indisponível',err)}
  }
  fallback();
 }
 function install(){
  const btn=document.getElementById('share');
  if(btn&&!btn.dataset.share218){btn.dataset.share218='1';btn.addEventListener('click',share,true)}
 }
 const st=document.createElement('style');st.textContent='#shareFallback218{border:0;border-radius:16px;padding:0;max-width:min(92vw,460px);width:100%;box-shadow:0 18px 70px #0004}#shareFallback218::backdrop{background:#0008}.share218{padding:20px;color:#193b2c;font-family:inherit}.share218 h3{margin:0 0 8px}.share218 p{font-size:14px}.share218 input{box-sizing:border-box;width:100%;padding:12px;border:1px solid #c7d9ce;border-radius:8px;font-size:13px}.share218actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:14px}.share218actions button{flex:1;min-height:44px;background:#075c3d;color:white;border:0;border-radius:8px;font-weight:700}.share218actions button:last-child{background:#e7eee9;color:#17432e}.share218 small{display:block;margin-top:10px}';document.head.append(st);
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});else install();
})();
