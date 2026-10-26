const initial=[
[1,'PRONTIDÃO','BARRA','AR 1624',['ASP BARANHOS','CB BORGES','SD CÉSAR AUGUSTO','SD VICTOR ALVES','SD RENATO']],
[2,'PRONTIDÃO','BARRA','AR 7130',['ASP MEIRELES','SGT ADONIRAN','CB PAULA DIOGO','SD MASCARENHAS','SD ARTHUR']],
[3,'BASE','BASE','AR 7133',['ASP BM CUSTÓDIO','SGT FERNANDES','CB TIAGO','SD LISBOA','SD WASHINGTON GOES']],
[4,'BASE','BASE','AR 0346',['CB CIRIO','SD MARCOS VINÍCIUS','SD ALBAN','SD KLAYTON']],
[5,'COMBATE','COTEGIPE','AR 0910',['SGT LAERCIO','SD TELES','SD FREITAS','SD ALVES','SD VINÍCIUS']],
[6,'COMBATE','COTEGIPE','AR 7155',['ASP CLARA','SGT ALDEMIR','SD BM MICHEL','SD BM BONFIM','SD BM PEDRO LIMA']],
[7,'PRONTIDÃO','BARRA','AR 1022',['TEN CRUSOÉ','CB BRITO (FLORESTAL)','SD ANUNCIAÇÃO','SD LINCOLN','SD VICTOR LOPES']],
[8,'PRONTIDÃO','B. JESUS DA LAPA','AR 0227',['CB MAIA','SD ALEXANDRE','SD CELINE','SD CINTRA']],
[9,'COMBATE','SÃO DESIDÉRIO','AR 1411',['SGT BM ROCHA','SD BM GALVÃO','SD BM SILVA','SD BM THALLES']],
[10,'PRONTIDÃO','LEM','AR 7131',['SUB TEN MARCOS ARAUJO','SD MOREIRA','SD AQUA','SD CORREIA SANTOS','SD SAIGON']],
[11,'PRONTIDÃO','B. JESUS DA LAPA','CGFROTA 1',['SGT BRITO SOARES','SD MENDONÇA','SD ALEXANDRIA','SD ALEX YAN','SD LIMA']],
[12,'PRONTIDÃO','BARRA','CGFROTA 2',['SD BM MATOS','SD BM KLEITON LIRA','SD BM BADARO','SD BM VIEIRA','SD BM HORTÊNCIA']],
[13,'COMBATE','BARREIRAS','AR 1718',['CB ROBSON PINTO','SD JOABE','SD IGOR CRUZ','SD BEATRIZ COELHO','SD CAVALCANTE']],
[14,'BASE','BASE','AR 2011',['CB GESNER','SD LAPA','SD MILTON','SD TAIUAN']],
[15,'BASE','BASE','AR 0210',['SGT ERIC','SD OTÁVIO GOMES','SD PORTO','SD VIEIRA ANDRADE']],
[16,'BASE','BASE','',['SGT LIMA','SD JÚLIO','SD CLEYTON REIS']],
[17,'BASE','BASE','',[]],[18,'BASE','BASE','',[]],[19,'BASE','BASE','',[]],[20,'BASE','BASE','',[]]
].map(x=>({id:x[0],status:x[1],city:x[2],vehicle:x[3],team:x[4],notes:''}));
let data=JSON.parse(localStorage.getItem('gcif-data')||'null')||initial;let current=null;
const $=s=>document.querySelector(s), board=$('#board');
function cls(s){return s==='COMBATE'?'combate':s==='MONITORAMENTO'?'monitoramento':s==='PRONTIDÃO'?'prontidao':'base'}
function icon(s){return s==='COMBATE'?'🔥':s==='MONITORAMENTO'?'Ⓜ':s==='PRONTIDÃO'?'PRT':'●'}
function render(){let q=$('#search').value.toLowerCase(),f=$('#filter').value;let shown=data.filter(g=>(f==='TODOS'||g.status===f)&&JSON.stringify(g).toLowerCase().includes(q));board.innerHTML=shown.map(g=>`<article class="card ${cls(g.status)}"><div class="top"><h3>GCIF ${String(g.id).padStart(2,'0')}</h3><span class="badge">${icon(g.status)} ${g.status}</span></div><div class="place">${g.city||'—'}</div><div class="vehicle">🚒 ${g.vehicle||'Viatura não informada'}</div>${g.team.length?`<ul class="team">${g.team.map(n=>`<li>${n}</li>`).join('')}</ul>`:'<p class="notes">Equipe não informada</p>'}${g.notes?`<p class="notes">${g.notes}</p>`:''}<button class="editBtn" onclick="openEdit(${g.id})">Editar GCIF</button></article>`).join('');
let c=s=>data.filter(g=>g.status===s).length;$('#summary').innerHTML=`<div class="stat"><b>${data.length}</b><small>Total GCIF</small></div><div class="stat"><b>🔥 ${c('COMBATE')}</b><small>Combate</small></div><div class="stat"><b>Ⓜ ${c('MONITORAMENTO')}</b><small>Monitoramento</small></div><div class="stat"><b>PRT ${c('PRONTIDÃO')}</b><small>Prontidão</small></div><div class="stat"><b>● ${c('BASE')}</b><small>Base / Disponível</small></div>`}
window.openEdit=id=>{current=data.find(g=>g.id===id);$('#editTitle').textContent=`Editar GCIF ${String(id).padStart(2,'0')}`;$('#eStatus').value=current.status;$('#eCity').value=current.city;$('#eVehicle').value=current.vehicle;$('#eTeam').value=current.team.join('\n');$('#eNotes').value=current.notes;$('#editor').showModal()};
$('#save').onclick=e=>{e.preventDefault();current.status=$('#eStatus').value;current.city=$('#eCity').value.trim();current.vehicle=$('#eVehicle').value.trim();current.team=$('#eTeam').value.split('\n').map(x=>x.trim()).filter(Boolean);current.notes=$('#eNotes').value.trim();localStorage.setItem('gcif-data',JSON.stringify(data));$('#editor').close();render()};
$('#search').oninput=render;$('#filter').onchange=render;$('#editMode').onclick=()=>{document.body.classList.toggle('editing');$('#editMode').textContent=document.body.classList.contains('editing')?'Concluir edição':'Editar'};
$('#share').onclick=async()=>{let url=location.href,title='Controle GCIF — Base Florestal Oeste';if(navigator.share)navigator.share({title,url});else window.open('https://wa.me/?text='+encodeURIComponent(title+' '+url),'_blank')};
if('serviceWorker'in navigator)navigator.serviceWorker.register('sw.js');render();