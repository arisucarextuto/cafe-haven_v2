import { passwordHash, sha256, jsonError } from "./_auth.js";
export async function onRequestPost({ request, env }) {
  let body;
  try { body = await request.json(); } catch { return jsonError("入力内容を確認してください。"); }
  const username = String(body.username || "").trim();
  const password = String(body.password || "");
  if (!username || !password) return jsonError("ユーザー名とパスワードを入力してください。");
  const user = await env.DB.prepare("SELECT id, username, password_hash, display_name, active FROM users WHERE username = ?").bind(username).first();
  if (!user || !user.active) return jsonError("ユーザー名またはパスワードが違います。", 401);
  const [salt, stored] = user.password_hash.split("$");
  const actual = await passwordHash(password, salt);
  if (!stored || actual !== stored) return jsonError("ユーザー名またはパスワードが違います。", 401);
  const token = crypto.randomUUID() + crypto.randomUUID();
  const tokenHash = await sha256(token);
  await env.DB.prepare("INSERT INTO sessions (user_id, token_hash, expires_at) VALUES (?, ?, datetime('now', '+12 hours'))").bind(user.id, tokenHash).run();
  return Response.json({ ok: true }, { headers: { "Set-Cookie": `cafe_session=${encodeURIComponent(token)}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=43200`, "Cache-Control": "no-store" } });
}
