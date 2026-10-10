const form=document.querySelector("#login-form"),msg=document.querySelector("#login-error");
form.addEventListener("submit",async e=>{e.preventDefault();msg.textContent="ログイン中…";msg.className="form-message";
 const data=Object.fromEntries(new FormData(form));
 try{const r=await fetch("/api/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(data)});const j=await r.json();if(!r.ok)throw new Error(j.error||"ログインできませんでした。");location.href="/calculator.html";}
 catch(err){msg.textContent=err.message;msg.className="form-message error";}
});
