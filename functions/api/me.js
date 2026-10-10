import { currentUser } from "./_auth.js";
export async function onRequestGet({ request, env }) {
  const user = await currentUser(request, env);
  if (!user) return Response.json({ error: "ログインが必要です。" }, { status: 401, headers: { "Cache-Control": "no-store" } });
  return Response.json(user, { headers: { "Cache-Control": "no-store" } });
}
