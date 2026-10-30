// Autenticação administrativa v105.
// O app principal não inicia mais um segundo fluxo Firebase concorrente.
// O login é centralizado em login.html, evitando dois listeners disputando o mesmo botão.
const btn=document.getElementById('loginBtn');
if(btn){
  btn.addEventListener('click',(e)=>{
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    location.href='./login.html?v=105';
  },true);
}
