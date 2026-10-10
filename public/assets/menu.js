const fallbackProducts = [
 {category:"食べ物",name:"木漏れびサンド",price:30000},
 {category:"食べ物",name:"雪どけパンケーキ",price:30000},
 {category:"飲み物",name:"木漏れび珈琲",price:30000},
 {category:"飲み物",name:"琥珀ラテ",price:30000},
 {category:"食べ物・飲み物",name:"陽だまりクリームセット",price:80000},
 {category:"食べ物・飲み物",name:"陽だまりアフタヌーンティーセット",price:80000}
];
const categoryOrder = ["食べ物", "飲み物", "食べ物・飲み物"];
const yen = n => "¥" + Number(n).toLocaleString("ja-JP");

async function loadMenu(){
 const body=document.querySelector("#menu-groups");
 body.replaceChildren();
 let products=fallbackProducts;
 try {
  const res=await fetch("/api/products", {cache:"no-store"});
  if(res.ok){
   const data=await res.json();
   if(Array.isArray(data.products) && data.products.length) products=data.products;
  }
 } catch {}
 products = products.slice().sort((a,b) => {
  const categoryDiff = categoryOrder.indexOf(a.category) - categoryOrder.indexOf(b.category);
  if(categoryDiff !== 0) return categoryDiff;
  return Number(a.sort_order || 0) - Number(b.sort_order || 0);
 });
 for(const product of products){
  const row=document.createElement("tr");
  const category=document.createElement("td"); category.textContent=product.category;
  const name=document.createElement("td"); name.textContent=product.name;
  const price=document.createElement("td"); price.className="customer-menu-price"; price.textContent=yen(product.price);
  row.append(category,name,price); body.append(row);
 }
 if(!products.length){
  const row=document.createElement("tr"); const cell=document.createElement("td");
  cell.colSpan=3; cell.textContent="現在、掲載中の商品はありません。"; row.append(cell); body.append(row);
 }
}
document.querySelector("#reload-menu").addEventListener("click",loadMenu);
loadMenu();
