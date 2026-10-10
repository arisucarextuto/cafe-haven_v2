import { passwordHash, jsonError } from "./_auth.js";
export async function onRequestPost({ request, env }) {
  let body;
  try { body = await request.json(); } catch { return jsonError("入力内容を確認してください。"); }
  const username = String(body.username || "").trim();
  const displayName = String(body.display_name || "").trim();
  const password = String(body.password || "");
  if (username.length < 3 || !displayName || password.length < 12) return jsonError("ユーザー名は3文字以上、表示名必須、パスワードは12文字以上にしてください。");
  const existing = await env.DB.prepare("SELECT COUNT(*) AS n FROM users WHERE role = 'admin'").first();
  if (existing?.n > 0) return jsonError("管理者はすでに設定されています。", 403);
  const salt = crypto.randomUUID();
  const hash = await passwordHash(password, salt);
  try {
    await env.DB.prepare("INSERT INTO users (username, display_name, password_hash, role) VALUES (?, ?, ?, 'admin')").bind(username, displayName, `${salt}$${hash}`).run();
    return Response.json({ ok: true }, { status: 201, headers: { "Cache-Control": "no-store" } });
  } catch { return jsonError("作成に失敗しました。ユーザー名が重複していないか確認してください。", 409); }
}
