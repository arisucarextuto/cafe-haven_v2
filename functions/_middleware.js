import { currentUser } from "./api/_auth.js";
export async function onRequest(context) {
 const url = new URL(context.request.url);
 if (url.pathname === "/calculator.html" || url.pathname === "/admin.html") {
  const user = await currentUser(context.request, context.env);
  if (!user) return Response.redirect(new URL("/login.html", url), 302);
  if (url.pathname === "/admin.html" && user.role !== "admin") return Response.redirect(new URL("/calculator.html", url), 302);
 }
 return context.next();
}
