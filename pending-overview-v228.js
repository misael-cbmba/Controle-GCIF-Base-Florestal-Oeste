// v222 — painel consolidado de pendências, exclusivamente de leitura.
import{initializeApp,getApps}from'https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js';
import{getFirestore,collection,onSnapshot}from'https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js';
const cfg={apiKey:'AIzaSyB6vG41F_gaQRk6jMMgBT-AEclDFlBWLOo',authDomain:'controle-gcif-oeste.firebaseapp.com',projectId:'controle-gcif-oeste',storageBucket:'controle-gcif-oeste.firebasestorage.app',messagingSenderId:'43290614749',appId:'1:43290614749:web:16c567c1164e3c5aac3434'};
const db=getFirestore(getApps()[0]||initializeApp(cfg));
const KNOWN={'BARREIRAS':[-12.1528,-44.9908],'SÃO DESIDÉRIO':[-12.3633,-44.9733],'SAO DESIDERIO':[-12.3633,-44.9733],'COTEGIPE':[-12.0228,-44.2566],'RIACHÃO DAS NEVES':[-11.7469,-44.9117],'RIACHAO DAS NEVES':[-11.7469,-44.9117],'BARRA':[-11.0894,-43.1417],'BOM JESUS DA LAPA':[-13.2506,-43.4108],'B. JESUS DA LAPA':[-13.2506,-43.4108],'LUÍS EDUARDO MAGALHÃES':[-12.0956,-45.7866],'LUIS EDUARDO MAGALHAES':[-12.0956,-45.7866],'LEM':[-12.0956,-45.7866],'LENÇÓIS':[-12.5616,-41.3928],'LENCOIS':[-12.5616,-41.3928],'JUAZEIRO':[-9.4162,-40.5033],'VITÓRIA DA CONQUISTA':[-14.8619,-40.8442],'VITORIA DA CONQUISTA':[-14.8619,-40.8442],'SEABRA':[-12.4169,-41.7700],'IRAQUARA':[-12.2426,-41.6155],'XIQUE-XIQUE':[-10.8230,-42.7245],'XIQUE XIQUE':[-10.8230,-42.7245],'PARAMIRIM':[-13.4425,-42.2389],'IRECÊ':[-11.3033,-41.8558],'IRECE':[-11.3033,-41.8558],'JACOBINA':[-11.1814,-40.5117],'BRUMADO':[-14.2036,-41.6653],'JEQUIÉ':[-13.8578,-40.0831],'JEQUIE':[-13.8578,-40.0831],'FORMOSA DO RIO PRETO':[-11.0480,-45.1930],'CORRENTINA':[-13.3430,-44.6360],'SANTA RITA DE CÁSSIA':[-11.0060,-44.5250],'SANTA RITA DE CASSIA':[-11.0060,-44.5250],'CRISTÓPOLIS':[-12.2240,-44.4210],'CRISTOPOLIS':[-12.2240,-44.4210],'ANGICAL':[-12.0060,-44.7000],'CATOLÂNDIA':[-12.3100,-44.8650],'CATOLANDIA':[-12.3100,-44.8650]},HQ={chapada:[-12.5616,-41.3928],'meio-oeste':[-13.2506,-43.4108],norte:[-9.4162,-40.5033],oeste:[-12.1528,-44.9908],sudoeste:[-14.8619,-40.8442]};
const names={chapada:'Chapada','meio-oeste':'Meio Oeste',norte:'Norte',oeste:'Oeste',sudoeste:'Sudoeste'};
const clean=v=>String(v??'').trim(),norm=v=>clean(v).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toUpperCase().replace(/\s+/g,' ');
const key=g=>{const b=clean(g.base).toLowerCase();if(names[b])return b;for(const k of Object.keys(names))if(clean(g._doc).toLowerCase().startsWith(k+'__'))return k;return'oeste'};
const label=g=>names[key(g)]+' · GCIF '+(g.id||'—')+' · '+(g.city||'Município não informado');
const distance=(a,b)=>Math.hypot((a[0]-b[0])*111,(a[1]-b[1])*100);
function locationIssue(g){
 const situation=norm(g.status).replace(/[\s_–—]+/g,'-');
 if(['ECD-BASE','BASE','ECD BASE'].includes(situation)|| (norm(g.city)==='BASE' && !['COMBATE','MONITORAMENTO','ATIVIDADES PREVENTIVAS','PREVENCAO','PRONTIDAO'].includes(situation)))return''; // localização da sede, sem alterar cadastro
 const lat=clean(g.latitude),lng=clean(g.longitude);
 if(!lat||!lng)return'Coordenadas não cadastradas';
 const a=Number(lat),b=Number(lng);
 if(!Number.isFinite(a)||!Number.isFinite(b)||Math.abs(a)>90||Math.abs(b)>180)return'Coordenadas inválidas';
 const cp=Object.entries(KNOWN).find(([city])=>norm(city)===norm(g.city))?.[1];
 if(cp&&distance([a,b],cp)>120)return'Coordenadas incompatíveis com o município';
 if(distance([a,b],HQ[key(g)])>700)return'Coordenadas incompatíveis com a região da Base';
 return'';
}
let rows=[],error='';
function render(){
 let host=document.getElementById('pendingOverview222');
 if(!host){host=document.createElement('section');host.id='pendingOverview222';document.querySelector('.generalPanel')?.after(host)}
 if(!host)return;
 const open=host.querySelector('details')?.open||false;
 host.replaceChildren();
 const d=document.createElement('details');d.open=open;
 const summary=document.createElement('summary');summary.textContent='⚠️ Painel de pendências operacionais';d.append(summary);
 const intro=document.createElement('p');intro.textContent='Alertas para conferência pelas Bases. Equipes em ECD-BASE utilizam a localização da sede. Nenhum cadastro é alterado automaticamente.';d.append(intro);
 if(error){const p=document.createElement('p');p.textContent='Não foi possível atualizar os alertas: '+error;d.append(p);host.append(d);return}
 const alerts=[];
 const prefixes=new Map();
 for(const g of rows){const v=norm(g.vehicle);if(v){if(!prefixes.has(v))prefixes.set(v,[]);prefixes.get(v).push(g)}}
 for(const [prefix,group] of prefixes)if(group.length>1)alerts.push({type:'Viatura',title:prefix+' — '+group.length+' vínculos',description:group.map(label).join(' | ')});
 for(const g of rows){
  const issue=locationIssue(g);
  if(issue)alerts.push({type:'Localização',title:label(g),description:issue});
  const missing=[];
  if(!clean(g.city))missing.push('município');
  if(!clean(g.status))missing.push('situação operacional');
  if(!Array.isArray(g.team)||!g.team.some(x=>clean(x)))missing.push('integrantes da equipe');
  if(!clean(g.vehicle))missing.push('prefixo da viatura');
  const team=new Set((Array.isArray(g.team)?g.team:[]).map(norm));
  const outside=(Array.isArray(g.cpcif)?g.cpcif:[]).filter(x=>!team.has(norm(x)));
  if(outside.length)missing.push('CPCIF fora da equipe: '+outside.join(', '));
  if(missing.length)alerts.push({type:'Cadastro',title:label(g),description:'Conferir: '+missing.join('; ')});
 }
 const counts={Localização:0,Viatura:0,Cadastro:0};alerts.forEach(a=>counts[a.type]++);
 const count=document.createElement('div');count.className='po222counts';count.textContent='📍 Localização: '+counts.Localização+' · 🚒 Viaturas: '+counts.Viatura+' · 📋 Cadastros: '+counts.Cadastro;d.append(count);
 if(!alerts.length){const p=document.createElement('p');p.textContent='Nenhuma pendência identificada pelas verificações disponíveis.';d.append(p)}
 for(const type of ['Localização','Viatura','Cadastro']){
  const group=alerts.filter(a=>a.type===type);if(!group.length)continue;
  const section=document.createElement('div');section.className='po222group';
  const h=document.createElement('h3');h.textContent=(type==='Viatura'?'Viaturas':type==='Cadastro'?'Cadastros':'Localização')+' ('+group.length+')';section.append(h);
  for(const a of group){const item=document.createElement('div');item.className='po222item';const title=document.createElement('strong');title.textContent=a.title;const p=document.createElement('p');p.textContent=a.description;item.append(title,p);section.append(item)}
  d.append(section);
 }
 host.append(d);
}
const style=document.createElement('style');style.textContent='#pendingOverview222{margin:14px 0 20px}#pendingOverview222 details{border:1px solid #e5d29d;background:#fffaf0;border-radius:15px;padding:14px;color:#60470d}#pendingOverview222 summary{font-size:17px;font-weight:800;cursor:pointer;line-height:1.5}#pendingOverview222 p{font-size:13px;line-height:1.5;margin:8px 0}#pendingOverview222 .po222counts{padding:9px 10px;background:#fff1d0;border-radius:8px;font-size:13px;font-weight:700}#pendingOverview222 .po222group{margin-top:14px}#pendingOverview222 h3{font-size:15px;margin:8px 0}#pendingOverview222 .po222item{background:white;border:1px solid #ebdfc5;border-radius:9px;padding:9px;margin:7px 0;overflow-wrap:anywhere}#pendingOverview222 .po222item strong{font-size:13px}';document.head.append(style);
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',render,{once:true});else render();
onSnapshot(collection(db,'gcifs'),snap=>{rows=snap.docs.map(d=>({...d.data(),_doc:d.id}));error='';render()},e=>{error='acesso aos dados indisponível';render()});
