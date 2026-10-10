# Café Haven Webサイト

## 構成
- `public/` 公開ページ（ホーム・メニュー・従業員募集・ログイン・料金計算）
- `functions/api/` Cloudflare Pages Functions（認証・商品取得・請求文コピー用データ）
- `schema.sql` Cloudflare D1のテーブル定義
- `wrangler.toml` PagesのD1バインディング例

## 公開・設定手順
1. GitHubリポジトリに、このフォルダの中身をアップロードします。
2. Cloudflare PagesでGitHubリポジトリを接続します。
   - Build command: 空欄
   - Build output directory: `public`
3. Cloudflare Dashboard の Workers & Pages > D1 でデータベースを作成し、`schema.sql` を実行します。
4. Pagesプロジェクトの Settings > Functions > D1 database bindings で、binding name を `DB` にして作成したD1を紐づけます。
5. `schema.sql` の初期商品データが登録されていることを確認します。
6. 管理者アカウントを初期設定します。`/setup.html` は初回のみ使用し、管理者パスワードを設定したら削除またはアクセスを無効にしてください。

## 注意
- `functions/_middleware.js` で料金計算ページへの未ログインアクセスをサーバー側でログインページへリダイレクトします。
- 静的なHTMLだけでログイン制限を実現することはできません。このプロジェクトはPages Functions側でセッションを検証する設計です。
- 初期設定ページは、初期管理者が未作成のときだけ動作します。初期設定後は再利用できません。
- 回復効果は数値が未提供のため、公開メニューには「要確認」と表示します。D1の `products` テーブルから後で設定できます。


## お客様向けメニュー表の更新

お客様向け `/menu.html` は「区分・商品名・単価」の表形式で表示し、回復効果は表示しません。表示する価格はD1の商品情報に連動します。

既に公開済みのD1データを今回の6商品・価格に合わせる場合は、Cloudflare Dashboard の D1 Console で `migrations/20261011_customer_menu.sql` のSQLを一度実行してください。新規DBの場合は `schema.sql` の初期データが基準になります。
