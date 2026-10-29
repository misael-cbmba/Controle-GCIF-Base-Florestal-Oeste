// Ajuste visual v95 — cards de viaturas responsivos, sem rolagem lateral
function apply95(){
  const host=document.getElementById('vehicleControl94');
  const list=document.getElementById('vcList94');
  if(!host||!list)return;
  host.classList.add('vc95');
  list.classList.add('vcList95');
}
const st=document.createElement('style');
st.textContent=`
#vehicleControl94{width:100%;max-width:100%;overflow:hidden;box-sizing:border-box}
#vehicleControl94 *{box-sizing:border-box;min-width:0}
#vehicleControl94 .vcList94,#vehicleControl94 .vcList95{display:grid!important;grid-template-columns:repeat(auto-fit,minmax(280px,1fr))!important;gap:12px!important;width:100%!important;max-width:100%!important;overflow:visible!important}
#vehicleControl94 .vcCard94{width:100%!important;max-width:100%!important;min-width:0!important;overflow:hidden!important;padding:14px!important;display:flex!important;flex-direction:column!important;gap:10px!important}
#vehicleControl94 .vcTop94{display:flex!important;align-items:flex-start!important;justify-content:space-between!important;gap:8px!important;flex-wrap:wrap!important}
#vehicleControl94 .vcTop94>strong{font-size:18px!important;line-height:1.15;overflow-wrap:anywhere}
#vehicleControl94 .vcCondition94{max-width:100%;white-space:normal!important;text-align:center;line-height:1.2}
#vehicleControl94 .vcGrid94{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:8px!important;margin-top:0!important;width:100%!important}
#vehicleControl94 .vcGrid94>div{width:100%!important;min-width:0!important;padding:8px!important;overflow:hidden!important}
#vehicleControl94 .vcGrid94 small,#vehicleControl94 .vcNote94 small{font-size:9px!important;line-height:1.2}
#vehicleControl94 .vcGrid94 b,#vehicleControl94 .vcNote94 b{display:block!important;font-size:11px!important;line-height:1.25!important;white-space:normal!important;overflow-wrap:anywhere!important;word-break:normal!important}
#vehicleControl94 .vcNote94{width:100%!important;margin-top:0!important;overflow:hidden!important}
#vehicleControl94 .vcStats94{grid-template-columns:repeat(auto-fit,minmax(145px,1fr))!important;width:100%!important}
@media(min-width:1500px){#vehicleControl94 .vcList94,#vehicleControl94 .vcList95{grid-template-columns:repeat(4,minmax(0,1fr))!important}}
@media(min-width:1050px) and (max-width:1499px){#vehicleControl94 .vcList94,#vehicleControl94 .vcList95{grid-template-columns:repeat(3,minmax(0,1fr))!important}}
@media(min-width:700px) and (max-width:1049px){#vehicleControl94 .vcList94,#vehicleControl94 .vcList95{grid-template-columns:repeat(2,minmax(0,1fr))!important}}
@media(max-width:699px){
 #vehicleControl94 .vcList94,#vehicleControl94 .vcList95{grid-template-columns:1fr!important}
 #vehicleControl94 .vcGrid94{grid-template-columns:repeat(2,minmax(0,1fr))!important}
 #vehicleControl94 .vc94head{align-items:stretch!important}
 #vehicleControl94 .vc94head button{width:100%!important}
}
@media(max-width:390px){#vehicleControl94 .vcGrid94{grid-template-columns:1fr!important}}
`;
document.head.appendChild(st);
apply95();
new MutationObserver(()=>apply95()).observe(document.body,{childList:true,subtree:true});
