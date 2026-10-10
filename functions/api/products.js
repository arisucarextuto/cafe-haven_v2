export async function onRequestGet({ env }) {
  try {
    const { results } = await env.DB.prepare(
      "SELECT id, category, name, price, recovery_effect FROM products WHERE active = 1 ORDER BY sort_order, id"
    ).all();
    return Response.json({ products: results || [] }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return Response.json({ error: "商品情報を取得できません。D1の設定を確認してください。" }, { status: 500 });
  }
}
