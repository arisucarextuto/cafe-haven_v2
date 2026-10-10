let products=[], quantities={};
const yen=n=>"¥"+Number(n).toLocaleString("ja-JP");
const el=id=>document.getElementById(id);
function esc(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
async function init(){
 try{
  const me=await fetch("/api/me");if(!me.ok){location.href="/login.html";return;}
  const user=await me.json();el("staff-label").textContent=`ログイン中：${user.display_name||user.username}${user.role==="admin"?"（管理者）":""}`;
  if(user.role==="admin")el("admin-panel").classList.remove("hidden");
  const res=await fetch("/api/products");if(!res.ok)throw new Error("商品情報を取得できませんでした。");
  const data=await res.json();products=data.products||[];render();
 }catch(e){el("calculator-list").textContent=e.message;}
}
function render(){
 const q=el("search-products").value.trim().toLowerCase();const root=el("calculator-list");root.innerHTML="";
 const shown=products.filter(p=>p.name.toLowerCase().includes(q)||p.category.toLowerCase().includes(q));
 if(!shown.length){root.textContent="該当する商品がありません。";updateTotal();return;}
 shown.forEach(p=>{
  const qty=quantities[p.id]||0;const card=document.createElement("article");card.className="calc-item";
  card.innerHTML=`<div><h3>${esc(p.name)}</h3><p>${esc(p.category)} · ${yen(p.price)} / 個</p></div><div class="qty-control"><button type="button" data-delta="-1" data-id="${p.id}" aria-label="1個減らす">−</button><input type="number" min="0" step="1" value="${qty}" data-qty="${p.id}" aria-label="${esc(p.name)}の数量"><button type="button" data-delta="1" data-id="${p.id}" aria-label="1個増やす">＋</button></div><div class="item-subtotal">${yen(qty*p.price)}</div>`;
  root.append(card);
 });
 root.querySelectorAll("[data-delta]").forEach(b=>b.addEventListener("click",()=>{const id=Number(b.dataset.id);quantities[id]=Math.max(0,(quantities[id]||0)+Number(b.dataset.delta));render();}));
 root.querySelectorAll("[data-qty]").forEach(i=>i.addEventListener("change",()=>{const v=Math.floor(Number(i.value)||0);quantities[Number(i.dataset.qty)]=Math.max(0,Math.min(999,v));render();}));
 updateTotal();
}
function selected(){return products.filter(p=>(quantities[p.id]||0)>0);}
function total(){return selected().reduce((sum,p)=>sum+p.price*quantities[p.id],0);}
function updateTotal(){
 el("grand-total").textContent=yen(total());
 const lines=selected().map(p=>`${p.name} × ${quantities[p.id]}　${yen(p.price*quantities[p.id])}`);
 const customer=el("customer-name").value.trim();
 el("billing-message").value=selected().length?`【Café Haven 請求】${customer?`\nお客様：${customer}\n`:"\n"}${lines.join("\n")}\n合計金額：${yen(total())}\nご利用ありがとうございます！`:"商品を選択してください。";
}
el("search-products").addEventListener("input",render);
el("customer-name").addEventListener("input",updateTotal);
el("reset").addEventListener("click",()=>{quantities={};el("customer-name").value="";el("calc-message").textContent="数量をリセットしました。";render();});
async function copy(text){try{await navigator.clipboard.writeText(text);el("calc-message").textContent="コピーしました。";el("calc-message").className="form-message";}catch{el("calc-message").textContent="コピーできませんでした。テキストを選択してコピーしてください。";el("calc-message").className="form-message error";}}
el("copy-billing").addEventListener("click",()=>{if(!selected().length){el("calc-message").textContent="商品を1つ以上選択してください。";return;}copy(el("billing-message").value);});
el("copy-total").addEventListener("click",()=>copy(yen(total())));
el("logout").addEventListener("click",async()=>{await fetch("/api/logout",{method:"POST"});location.href="/login.html";});
init();
