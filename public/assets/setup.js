
const form = document.querySelector("#setup-form");
const msg = document.querySelector("#setup-message");

async function readApiResponse(response) {
  const text = await response.text();
  let data;

  try {
    data = JSON.parse(text);
  } catch {
    const hint = response.status === 404
      ? " /api/setup が見つかりません。Cloudflare Pages Functions がデプロイされているか確認してください。"
      : " Cloudflare Pages Functions のデプロイ状態と D1 バインディングを確認してください。";

    throw new Error(
      `APIからJSON以外の応答が返されました（HTTP ${response.status}）。${hint}`
    );
  }

  if (!response.ok) {
    throw new Error(
      data.error || `初期設定に失敗しました（HTTP ${response.status}）。`
    );
  }

  return data;
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  msg.textContent = "設定中…";
  msg.className = "form-message";

  const data = Object.fromEntries(new FormData(form));

  try {
    const response = await fetch("/api/setup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(data)
    });

    await readApiResponse(response);

    msg.textContent =
      "管理者を作成しました。ログインページへ移動します。";

    setTimeout(() => {
      location.href = "/login.html";
    }, 1200);
  } catch (error) {
    msg.textContent =
      error.message ||
      "通信に失敗しました。ページを再読み込みしてお試しください。";

    msg.className = "form-message error";
  }
});
