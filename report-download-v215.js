// v147 — menu de relatórios PDF por tópicos relevantes.
import{getApps}from'https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js';
import{getFirestore,collection,onSnapshot}from'https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js';
const BASES=[['chapada','BASE CHAPADA - LENÇÓIS'],['meio-oeste','BASE MEIO OESTE (B. JESUS DA LAPA)'],['norte','BASE NORTE (JUAZEIRO)'],['oeste','BASE OESTE (BARREIRAS)'],['sudoeste','BASE SUDOESTE (V. DA CONQUISTA)']];
const bn=k=>(BASES.find(x=>x[0]===k)||BASES[3])[1],clean=s=>String(s||'').trim(),esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const cat=s=>{s=clean(s).toUpperCase();if(s==='COMBATE')return'COMBATE';if(s==='MONITORAMENTO'||s==='M')return'MONITORAMENTO';if(s==='ATIVIDADES PREVENTIVAS'||s==='PREVENTIVA'||s==='PREVENTIVO')return'ATIVIDADES PREVENTIVAS';return'ECD-BASE'};
let rows=[],vehicles=[],configs={};try{const db=getFirestore(getApps()[0]);onSnapshot(collection(db,'gcifs'),s=>rows=s.docs.map(d=>({id:d.id,...d.data()})));onSnapshot(collection(db,'vehicles'),s=>vehicles=s.docs.map(d=>({id:d.id,...d.data()})),()=>{});onSnapshot(collection(db,'config'),s=>{configs={};s.docs.forEach(d=>{const x=d.data()||{};const k=x.baseKey||(d.id==='operation'?'oeste':d.id.startsWith('operation_')?d.id.replace('operation_',''):'');if(k)configs[k]=x})},()=>{})}catch(e){}
function baseFilter(){const k=localStorage.getItem('gcifBase')||'oeste';return rows.filter(x=>(x.base||'oeste')===k)}
const statusLabel=s=>cat(s)==='ATIVIDADES PREVENTIVAS'?'ATIVIDADES PREVENTIVAS':cat(s);
function tableGCIF(a){return `<table><thead><tr><th>GCIF</th><th>Base</th><th>Situação</th><th>Município</th><th>Viatura</th><th>Equipe</th><th>Motorista</th><th>CPCIF</th></tr></thead><tbody>${a.length?a.map(g=>`<tr><td>${esc(g.id||'—')}</td><td>${esc(bn(g.base||'oeste'))}</td><td>${esc(statusLabel(g.status))}</td><td>${esc(g.city||'—')}</td><td>${esc(g.vehicle||'—')}</td><td>${esc((g.team||[]).join(' • ')||'—')}</td><td>${esc(g.driver||'—')}</td><td>${esc((Array.isArray(g.cpcif)?g.cpcif:[]).join(' • ')||'—')}</td></tr>`).join(''):'<tr><td colspan="8">Nenhum registro.</td></tr>'}</tbody></table>`}
function staffCount(c={}){return new Set([c.commander,c.planning,c.operations,c.logistics,...(Array.isArray(c.adminSupport)?c.adminSupport:[]),...(Array.isArray(c.vehicleControl)?c.vehicleControl:[])].map(clean).filter(Boolean).map(x=>x.toUpperCase())).size}
function reportSummary(a){const keys=new Set(a===rows?BASES.map(x=>x[0]):[localStorage.getItem('gcifBase')||'oeste']);const staff=[...keys].reduce((n,k)=>n+staffCount(configs[k]||{}),0);const members=a.reduce((n,g)=>n+(Array.isArray(g.team)?g.team.filter(clean).length:0),0),cpcif=a.reduce((n,g)=>n+(Array.isArray(g.cpcif)?g.cpcif.filter(clean).length:0),0),linked=a.filter(g=>clean(g.vehicle)).length;return '<div class="cards"><div class="card"><b>'+a.length+'</b>GCIFs</div><div class="card"><b>'+(members+staff)+'</b>Efetivo total (inclui staff)</div><div class="card"><b>'+members+'</b>Militares em equipes GCIF</div><div class="card"><b>'+staff+'</b>Staff das Bases</div><div class="card"><b>'+cpcif+'</b>Militares com CPCIF</div><div class="card"><b>'+linked+'</b>Viaturas vinculadas aos GCIFs</div></div>'}
function doc(title,subtitle,body){const d=new Date();return `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>${esc(title)}</title><style>@page{size:A4 landscape;margin:10mm}*{box-sizing:border-box}body{font-family:Arial,sans-serif;color:#102019;font-size:11px;margin:0}header{background:#123529;color:white;padding:16px 20px;border-radius:9px;margin-bottom:12px}h1{margin:0;font-size:24px}h1 span{color:#ffd21a}h2{margin:4px 0 0;font-size:15px}header p{margin:7px 0 0;color:#e8f3ed}.cards{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin:10px 0}.card{border:1px solid #cbd8d1;border-radius:8px;padding:10px;background:#f7faf8}.card b{display:block;font-size:21px}.section{margin:13px 0 6px;font-size:14px;font-weight:800;color:#0b633f}table{width:100%;border-collapse:collapse;table-layout:fixed}th{background:#173c30;color:#fff;padding:7px;text-align:left}td{border:1px solid #ccd5d0;padding:7px;vertical-align:top;overflow-wrap:anywhere}tbody tr:nth-child(even){background:#f5f8f6}.danger{color:#b71c1c;font-weight:800}.foot{margin-top:12px;border-top:1px solid #bbb;padding-top:7px;color:#667;font-size:9px}@media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact}}</style></head><body><header><h1>CBMBA — <span>OPERAÇÃO FLORESTAL</span></h1><h2>${esc(title)}</h2><p>${esc(subtitle)} • Emitido em ${d.toLocaleDateString('pt-BR')} às ${d.toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'})}</p></header>${body}<div class="foot">Controle Operacional • Operação Florestal • CBMBA • Desenvolvido pelo CAP QOABM Misael Sousa - 2026</div><script>window.onload=()=>setTimeout(()=>window.print(),350)<\/script></body></html>`}

// v211: gerador PDF local, sem CDN, impressora ou aba about:blank.
class OfflinePDF211{
 constructor(){this.pages=[[]];this.fontSize=10;this.bold=false;this.rgb=[0,0,0]}
 addPage(){this.pages.push([])}
 setFont(f,weight){this.bold=weight==='bold'}
 setFontSize(n){this.fontSize=n}
 setTextColor(r,g,b){this.rgb=[r,g,b]}
 fillRect(x,y,w,h,color){
  const [r,g,b]=color.map(v=>(v/255).toFixed(3));
  const mm=72/25.4;
  this.pages[this.pages.length-1].push(r+' '+g+' '+b+' rg '+(x*mm).toFixed(2)+' '+((297-y-h)*mm).toFixed(2)+' '+(w*mm).toFixed(2)+' '+(h*mm).toFixed(2)+' re f');
 }
 line(x1,y1,x2,y2,color=[220,229,224]){
  const mm=72/25.4;
  this.pages[this.pages.length-1].push(color.map(v=>(v/255).toFixed(3)).join(' ')+' RG 0.5 w '+(x1*mm).toFixed(2)+' '+((297-y1)*mm).toFixed(2)+' m '+(x2*mm).toFixed(2)+' '+((297-y2)*mm).toFixed(2)+' l S');
 }

 splitTextToSize(value,maxMM){
  const max=Math.max(12,Math.floor(maxMM*72/25.4/(this.fontSize*.54)));
  const lines=[];
  for(const paragraph of String(value).split(/\n/)){
   let current='';
   for(const word of paragraph.split(/\s+/)){
    if(!word)continue;
    if((current+' '+word).trim().length>max&&current){lines.push(current);current=''}
    if(word.length>max){if(current){lines.push(current);current=''}for(let i=0;i<word.length;i+=max)lines.push(word.slice(i,i+max))}
    else current+=(current?' ':'')+word;
   }
   if(current||!paragraph)lines.push(current);
  }
  return lines;
 }
 text(value,x,y){
  const safe=String(value).normalize('NFC').replace(/[\u2022\u2026\u2014\u2013]/g,c=>({'•':'-','…':'...','—':'-','–':'-'}[c]));
  const chars=Array.from(safe).map(c=>{let n=c.codePointAt(0);if(n>255)n=63;return n===40||n===41||n===92?'\\'+String.fromCharCode(n):String.fromCharCode(n)}).join('');
  const xx=(x*72/25.4).toFixed(2),yy=((297-y)*72/25.4).toFixed(2);
  const color=this.rgb.map(c=>(c/255).toFixed(3)).join(' ');
  this.pages[this.pages.length-1].push(color+' rg BT /'+(this.bold?'F2':'F1')+' '+this.fontSize+' Tf 1 0 0 1 '+xx+' '+yy+' Tm ('+chars+') Tj ET');
 }
 save(filename){
  const objects=[null],add=o=>{objects.push(o);return objects.length-1};
  const catalog=add(''),pages=add('');
  const normal=add('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>');
  const bold=add('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>');
  const kids=[];
  for(const lines of this.pages){
   const stream=lines.join('\n')+'\n';
   const data=add('<< /Length '+stream.length+' >>\nstream\n'+stream+'endstream');
   kids.push(add('<< /Type /Page /Parent '+pages+' 0 R /MediaBox [0 0 595.28 841.89] /Resources << /Font << /F1 '+normal+' 0 R /F2 '+bold+' 0 R >> >> /Contents '+data+' 0 R >>'));
  }
  objects[catalog]='<< /Type /Catalog /Pages '+pages+' 0 R >>';
  objects[pages]='<< /Type /Pages /Count '+kids.length+' /Kids ['+kids.map(i=>i+' 0 R').join(' ')+'] >>';
  const enc=new TextEncoder();const chunks=[];let size=0;
  const push=t=>{const v=Uint8Array.from(Array.from(t),c=>c.charCodeAt(0)&255);chunks.push(v);size+=v.length};
  push('%PDF-1.4\n%PDF\n');const offsets=[0];
  for(let i=1;i<objects.length;i++){offsets[i]=size;push(i+' 0 obj\n'+objects[i]+'\nendobj\n')}
  const xref=size;push('xref\n0 '+objects.length+'\n0000000000 65535 f \n');
  for(let i=1;i<objects.length;i++)push(String(offsets[i]).padStart(10,'0')+' 00000 n \n');
  push('trailer\n<< /Size '+objects.length+' /Root '+catalog+' 0 R >>\nstartxref\n'+xref+'\n%%EOF');
  const blob=new Blob(chunks,{type:'application/pdf'});
  const url=URL.createObjectURL(blob),link=document.createElement('a');
  link.href=url;link.download=filename;link.style.display='none';document.body.appendChild(link);link.click();link.remove();
  setTimeout(()=>URL.revokeObjectURL(url),60000);
 }
}
function loadPdf209(){return Promise.resolve(OfflinePDF211)}
async function downloadPdf209(type){
 if(!rows.length){alert('Aguarde o carregamento dos GCIFs e tente novamente.');return}
 const base=localStorage.getItem('gcifBase')||'oeste';
 const data=type==='base'?baseFilter():type==='combate'?rows.filter(g=>cat(g.status)==='COMBATE'):type==='monitoramento'?rows.filter(g=>cat(g.status)==='MONITORAMENTO'):type==='preventivas'?rows.filter(g=>cat(g.status)==='ATIVIDADES PREVENTIVAS'):type==='ecd'?rows.filter(g=>cat(g.status)==='ECD-BASE'):type==='indisponiveis'?rows.filter(g=>g.unavailable===true||clean(g.unavailableReason)):rows;
 const names={geral:'RELATÓRIO OPERACIONAL GERAL',base:'RELATÓRIO POR BASE',combate:'GCIFs EM COMBATE',monitoramento:'GCIFs EM MONITORAMENTO',preventivas:'ATIVIDADES PREVENTIVAS',ecd:'GCIFs EM ECD-BASE',indisponiveis:'GCIFs INDISPONÍVEIS',viaturas:'CONTROLE DE VIATURAS'};
 const JS=await loadPdf209(),pdf=new JS({orientation:'portrait',unit:'mm',format:'a4'});
 const green=[9,84,57],ink=[32,49,42],muted=[92,110,102],soft=[241,247,243],red=[176,44,36];
 let y=0;
 const color=c=>pdf.setTextColor(...c);
 const write=(v,x,yy,size=9,bold=false,c=ink)=>{color(c);pdf.setFont('helvetica',bold?'bold':'normal');pdf.setFontSize(size);pdf.text(String(v??'-'),x,yy)};
 const wrap=(v,width=175,size=9)=>{pdf.setFontSize(size);return pdf.splitTextToSize(String(v??'-'),width)};
 const paragraph=(v,x=17,width=175,size=9,bold=false,c=ink)=>{
  const lines=wrap(v,width,size);for(const l of lines){ensure(5.1);write(l,x,y,size,bold,c);y+=5.1}
 };
 function header(){
  pdf.fillRect(0,0,210,27,green);
  write('CBMBA',16,11,16,true,[255,255,255]);
  write('CORPO DE BOMBEIROS MILITAR DA BAHIA',16,17,7.5,false,[227,245,232]);
  write('OPERAÇÃO FLORESTAL  |  DOCUMENTO OPERACIONAL',16,23,8,true,[255,255,255]);
  y=34;
 }
 function ensure(height=12){if(y+height>281){pdf.addPage();header()}}
 header();
 write(names[type]||names.geral,16,y,14,true,green);y+=8;
 write('Emissão: '+new Date().toLocaleString('pt-BR')+'  |  Fonte: registros do aplicativo',16,y,8,false,muted);y+=10;
 const staffKeys=type==='geral'?BASES.map(x=>x[0]):[base];
 const staff=staffKeys.reduce((n,k)=>n+staffCount(configs[k]||{}),0);
 const members=data.reduce((n,g)=>n+(Array.isArray(g.team)?g.team.filter(clean).length:0),0);
 const cpcif=data.reduce((n,g)=>n+(Array.isArray(g.cpcif)?g.cpcif.filter(clean).length:0),0);
 const linked=data.filter(g=>clean(g.vehicle)).length;
 const normName=v=>clean(v).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toUpperCase().replace(/\b(BM|QOBM)\b/g,'').replace(/\s+/g,' ').trim();
 const inconsistencies=data.flatMap(g=>{
   const team=Array.isArray(g.team)?g.team:[];
   return (Array.isArray(g.cpcif)?g.cpcif:[]).filter(n=>!team.some(t=>normName(t)===normName(n))).map(n=>({g,n}));
 });
 if(type==='geral'||type==='base'){
  pdf.fillRect(14,y,182,8,soft);write('SÍNTESE OPERACIONAL',18,y+5.7,10,true,green);y+=13;
  const metrics=[['GCIFs',data.length],['COMBATE',data.filter(g=>cat(g.status)==='COMBATE').length],['MONITORAMENTO',data.filter(g=>cat(g.status)==='MONITORAMENTO').length],['PREVENÇÃO',data.filter(g=>cat(g.status)==='ATIVIDADES PREVENTIVAS').length],['ECD-BASE',data.filter(g=>cat(g.status)==='ECD-BASE').length],['EFETIVO TOTAL',members+staff],['EQUIPES',members],['STAFF',staff],['VIATURAS VINC.',linked],['CPCIF',cpcif]];
  metrics.forEach(([label,value],i)=>{const col=i%5,row=Math.floor(i/5),w=35.2,x=14+col*36.8,top=y+row*20;pdf.fillRect(x,top,w,18,[246,249,247]);write(String(value),x+3,top+8,13,true,i===1?red:green);write(label,x+3,top+14,6.5,false,muted)});
  y+=45;
  if(inconsistencies.length){
   ensure(13);
   pdf.fillRect(14,y,182,9,[255,241,235]);
   write('ATENÇÃO: '+inconsistencies.length+' CPCIF(s) não consta(m) na equipe cadastrada. Verificar os cartões.',17,y+6,8,true,red);
   y+=13;
  }
  if(type==='geral'){
   ensure(48);pdf.fillRect(14,y,182,8,soft);write('DISTRIBUIÇÃO POR BASE',18,y+5.7,10,true,green);y+=13;
   for(const [k,name] of BASES){
    const g=data.filter(v=>(v.base||'oeste')===k);
    ensure(7);write(name,16,y,8,true,ink);
    write('GCIFs '+g.length+'  |  Combate '+g.filter(v=>cat(v.status)==='COMBATE').length+'  |  Militares '+g.reduce((n,v)=>n+(Array.isArray(v.team)?v.team.filter(clean).length:0),0),116,y,7,false,muted);y+=7;
   }
   y+=4;
  }
 }
 if(type==='viaturas'){
  pdf.fillRect(14,y,182,8,soft);write('RELAÇÃO DE VIATURAS',18,y+5.7,10,true,green);y+=14;
  const m=new Map();rows.forEach(g=>{if(clean(g.vehicle))m.set(clean(g.vehicle).toUpperCase(),{prefix:g.vehicle,base:g.base,gcif:g.id})});
  vehicles.forEach(v=>{const p=clean(v.prefix||v.vehicle||v.id);if(p)m.set(p.toUpperCase(),{...(m.get(p.toUpperCase())||{}),...v,prefix:p})});
  for(const v of m.values()){ensure(17);pdf.fillRect(14,y-4,182,16,[246,249,247]);write(v.prefix,18,y+2,10,true,green);write('Base: '+bn(v.base||'oeste')+'  |  GCIF: '+(v.gcif||v.gcifId||'-'),18,y+9,8,false,ink);y+=19}
 }else{
  const groups=type==='geral'?BASES.map(b=>[b[0],data.filter(g=>(g.base||'oeste')===b[0])]):type==='base'?[[base,data]]:BASES.map(b=>[b[0],data.filter(g=>(g.base||'oeste')===b[0])]).filter(g=>g[1].length);
  for(const [k,list] of groups){
   const ordered=[...list].sort((a,b)=>Number(a.id)-Number(b.id)||String(a.id).localeCompare(String(b.id),'pt-BR'));
   const cardHeight=g=>{
    const fields=['Município: '+(g.city||'Não informado')+'   |   Viatura: '+(g.vehicle||'Não informada'),'Motorista: '+(g.driver||'Não informado'),'Equipe: '+((Array.isArray(g.team)?g.team:[]).join('  •  ')||'Não informada')];
    if(Array.isArray(g.cpcif)&&g.cpcif.length)fields.push('CPCIF: '+g.cpcif.join('  •  '));
    const names=new Set((Array.isArray(g.team)?g.team:[]).map(normName));
    const missing=(Array.isArray(g.cpcif)?g.cpcif:[]).filter(v=>!names.has(normName(v)));
    if(missing.length)fields.push('CONFERIR CADASTRO: CPCIF fora da equipe: '+missing.join(', '));
    if(type==='indisponiveis')fields.push('Motivo: '+(g.unavailableReason||'Não informado'));
    return 9+fields.flatMap(v=>wrap(v,169,7.5)).length*3.65+2.5;
   };
   // Never leave a base title alone at the foot of a page.
   ensure(14+(ordered.length?cardHeight(ordered[0])+2:0));
   pdf.fillRect(14,y,182,9,green);write(bn(k)+'  |  '+list.length+' GCIFs',18,y+6.1,10,true,[255,255,255]);y+=14;
   for(let gi=0;gi<ordered.length;gi++){
    const g=ordered[gi];
    // If only two GCIFs remain, keep them together instead of leaving
    // the last one alone on a mostly empty page.
    if(gi===ordered.length-2){
     const pairHeight=cardHeight(ordered[gi])+cardHeight(ordered[gi+1])+4;
     if(y+pairHeight>281&&pairHeight<240){pdf.addPage();header()}
    }
    const team=(Array.isArray(g.team)?g.team:[]).join('  •  ')||'Não informada';
    const trained=(Array.isArray(g.cpcif)?g.cpcif:[]).join('  •  ');
    const fields=[
     'Município: '+(g.city||'Não informado')+'   |   Viatura: '+(g.vehicle||'Não informada'),
     'Motorista: '+(g.driver||'Não informado'),
     'Equipe: '+team
    ];
    if(trained)fields.push('CPCIF: '+trained);
    const teamNames=new Set((Array.isArray(g.team)?g.team:[]).map(normName));
    const missing=(Array.isArray(g.cpcif)?g.cpcif:[]).filter(v=>!teamNames.has(normName(v)));
    if(missing.length)fields.push('CONFERIR CADASTRO: CPCIF fora da equipe: '+missing.join(', '));
    if(type==='indisponiveis')fields.push('Motivo: '+(g.unavailableReason||'Não informado'));
    const lines=fields.flatMap(v=>wrap(v,169,7.5));
    const height=9+lines.length*3.65+2.5;
    ensure(height+2);
    pdf.fillRect(14,y,182,height,[247,250,248]);
    const status=cat(g.status),statusColor=status==='COMBATE'?red:status==='MONITORAMENTO'?[31,108,157]:status==='ATIVIDADES PREVENTIVAS'?[47,128,64]:muted;
    pdf.fillRect(14,y,2.5,height,statusColor);
    write('GCIF '+g.id,19,y+5.5,9,true,green);
    write(status,116,y+5.5,7.5,true,statusColor);
    y+=9.5;
    for(const line of lines){write(line,19,y,7.5,/^CONFERIR CADASTRO/.test(line),/^CONFERIR CADASTRO/.test(line)?red:ink);y+=3.65}
    y+=3.5;
   }
   y+=1;
  }
 }
 const total=pdf.pages.length;
 for(let i=0;i<total;i++){
  const saved=pdf.pages;const current=saved[i];
  pdf.pages=[current];pdf.line(14,283,196,283);
  write('CBMBA  •  OPERAÇÃO FLORESTAL  |  Documento gerado pelo aplicativo',14,289,7,false,muted);
  write('Página '+(i+1)+' de '+total,169,289,7,false,muted);
  pdf.pages=saved;
 }
 pdf.save('CBMBA_'+type+'_'+new Date().toISOString().slice(0,10)+'.pdf');
}

function generate(type){return downloadPdf209(type).catch(e=>{console.error('Falha ao gerar PDF',e);alert('Não foi possível baixar o PDF: '+e.message)})}

function install(){const btn=document.getElementById('pdfReportBtn');if(!btn||document.getElementById('reportMenu147'))return;btn.textContent='📄 Exportar relatório PDF ▾';btn.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();document.getElementById('reportDialog147').showModal()},true);const dlg=document.createElement('dialog');dlg.id='reportDialog147';dlg.innerHTML=`<form method="dialog" class="report147"><h2>📄 Exportar relatório PDF</h2><p>Selecione o tópico do relatório:</p><div id="reportMenu147"><button type="button" data-r="geral">📊 Relatório operacional geral</button><button type="button" data-r="base">🏢 Base em visualização</button><button type="button" data-r="combate">🔥 GCIF em combate</button><button type="button" data-r="monitoramento">🔎 Monitoramento</button><button type="button" data-r="preventivas">🌱 Atividades preventivas</button><button type="button" data-r="ecd">● ECD-BASE</button><button type="button" data-r="indisponiveis">⚠️ GCIF indisponíveis</button><button type="button" data-r="viaturas">🚒 Viaturas</button></div><button value="cancel" class="close147">Fechar</button></form>`;document.body.appendChild(dlg);dlg.addEventListener('click',e=>{const b=e.target.closest('[data-r]');if(b){dlg.close();generate(b.dataset.r)}});const st=document.createElement('style');st.textContent=`#reportDialog147{border:0;border-radius:16px;padding:0;max-width:520px;width:min(92vw,520px);box-shadow:0 18px 55px #0005}#reportDialog147::backdrop{background:#07150f99}.report147{padding:20px}.report147 h2{margin:0 0 5px}.report147 p{color:#607068;margin:0 0 14px}#reportMenu147{display:grid;grid-template-columns:1fr 1fr;gap:9px}#reportMenu147 button{min-height:58px;border:1px solid #cfdad4;border-radius:10px;background:#f7faf8;text-align:left;padding:10px;font-weight:700;color:#173c30}.close147{margin-top:14px;width:100%;padding:12px;border:0;border-radius:9px}@media(max-width:600px){#reportMenu147{grid-template-columns:1fr}.report147{padding:15px}#reportMenu147 button{min-height:48px}}`;document.head.appendChild(st)}
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',install):install();