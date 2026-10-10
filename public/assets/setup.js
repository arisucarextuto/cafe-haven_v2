const form=document.querySelector("#setup-form"),msg=document.querySelector("#setup-message");
form.addEventListener("submit",async e=>{e.preventDefault();msg.textContent="設定中…";msg.className="form-message";
 const data=Object.fromEntries(new FormData(form));
 try{const r=await fetch("/api/setup",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(data)});const j=await r.json();if(!r.ok)throw new Error(j.error||"設定できませんでした。");msg.textContent="管理者を作成しました。ログインページへ移動します。";setTimeout(()=>location.href="/login.html",1200);}
 catch(err){msg.textContent=err.message;msg.className="form-message error";}
});
