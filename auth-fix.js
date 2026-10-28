(function(){
  const CONFIG={apiKey:'AIzaSyB6vG41F_gaQRk6jMMgBT-AEclDFlBWLOo',authDomain:'controle-gcif-oeste.firebaseapp.com',projectId:'controle-gcif-oeste',storageBucket:'controle-gcif-oeste.firebasestorage.app',messagingSenderId:'43290614749',appId:'1:43290614749:web:16c567c1164e3c5aac3434'};
  function msg(t,err){const m=document.getElementById('authMessage');if(!m)return;m.hidden=!t;m.className=err?'authMessage error':'authMessage';m.textContent=t||'';}
  function install(){
    const btn=document.getElementById('loginBtn');
    if(!btn||!window.firebase)return;
    if(!firebase.apps.length)firebase.initializeApp(CONFIG);
    const auth=firebase.auth();
    btn.onclick=async function(e){
      e.preventDefault();e.stopPropagation();
      msg('Abrindo a janela segura do Google…');
      const p=new firebase.auth.GoogleAuthProvider();p.setCustomParameters({prompt:'select_account'});
      try{
        const r=await auth.signInWithPopup(p);
        if(r&&r.user){msg('Login realizado. Carregando acesso…');setTimeout(()=>location.reload(),250);}
      }catch(x){
        if(x.code==='auth/popup-closed-by-user'){msg('A janela do Google foi fechada antes da conclusão.',true);return;}
        if(x.code==='auth/popup-blocked'){msg('O navegador bloqueou a janela do Google. Permita pop-ups para este site e clique novamente.',true);return;}
        msg('Erro no login: '+(x.code||x.message),true);
      }
    };
  }
  window.addEventListener('load',()=>{install();setTimeout(install,1000);setTimeout(install,3000);});
})();