import { getApp } from 'https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js';
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult, setPersistence, browserLocalPersistence } from 'https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js';

const auth = getAuth(getApp());
const OWNER_EMAIL = 'leasim.sousa@gmail.com';

function showMessage(text, error=false){
  const el=document.getElementById('authMessage');
  if(!el) return;
  el.hidden=false;
  el.textContent=text;
  el.className=error?'authMessage error':'authMessage';
}

async function completeLogin(user){
  if(!user) return;
  const email=String(user.email||'').toLowerCase();
  if(email===OWNER_EMAIL){
    showMessage('Administrador principal conectado. Carregando permissões…');
  }else{
    showMessage('Conta Google conectada. Verificando autorização administrativa…');
  }
  setTimeout(()=>location.reload(),350);
}

async function handleRedirectReturn(){
  try{
    const result=await getRedirectResult(auth);
    if(result?.user) await completeLogin(result.user);
  }catch(err){
    showMessage('Falha no retorno do login Google: '+(err.code||err.message),true);
  }
}

async function login(e){
  e.preventDefault();
  e.stopPropagation();
  e.stopImmediatePropagation();
  const btn=document.getElementById('loginBtn');
  if(btn) btn.disabled=true;
  showMessage('Abrindo autenticação Google…');
  const provider=new GoogleAuthProvider();
  provider.setCustomParameters({prompt:'select_account'});
  try{
    await setPersistence(auth,browserLocalPersistence);
    const result=await signInWithPopup(auth,provider);
    await completeLogin(result.user);
  }catch(err){
    const code=err?.code||'';
    if(code==='auth/popup-blocked'||code==='auth/operation-not-supported-in-this-environment'){
      showMessage('O navegador bloqueou a janela. Redirecionando para o Google…');
      try{
        await signInWithRedirect(auth,provider);
        return;
      }catch(redirErr){
        showMessage('Não foi possível iniciar o login: '+(redirErr.code||redirErr.message),true);
      }
    }else if(code==='auth/popup-closed-by-user'){
      showMessage('A janela de login foi fechada antes da conclusão.',true);
    }else if(code==='auth/unauthorized-domain'){
      showMessage('O domínio do aplicativo ainda não está autorizado no Firebase Authentication. Autorize misael-cbmba.github.io em Authentication > Settings > Authorized domains.',true);
    }else{
      showMessage('Erro no login Google: '+(err.code||err.message),true);
    }
    if(btn) btn.disabled=false;
  }
}

const btn=document.getElementById('loginBtn');
if(btn){
  btn.addEventListener('click',login,true);
}
handleRedirectReturn();
