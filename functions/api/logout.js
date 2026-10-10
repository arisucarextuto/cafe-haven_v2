import { getCookie, sha256 } from "./_auth.js";
export async function onRequestPost({ request, env }) {
  const token = getCookie(request, "cafe_session");
  if (token) await env.DB.prepare("DELETE FROM sessions WHERE token_hash = ?").bind(await sha256(token)).run();
  return Response.json({ ok: true }, { headers: { "Set-Cookie": "cafe_session=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0", "Cache-Control": "no-store" } });
}
