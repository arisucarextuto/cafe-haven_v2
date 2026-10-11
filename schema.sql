
-- =========================================
-- Café Haven データベース初期設定
-- =========================================

-- 従業員・管理者アカウント
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'employee'
    CHECK (role IN ('admin', 'employee')),
  active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 商品管理
CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  category TEXT NOT NULL,
  name TEXT NOT NULL,
  price INTEGER NOT NULL DEFAULT 0,
  recovery_effect TEXT NOT NULL DEFAULT '要確認',
  active INTEGER NOT NULL DEFAULT 1,
  sort_order INTEGER NOT NULL DEFAULT 0
);

-- セッション管理
CREATE TABLE IF NOT EXISTS sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL UNIQUE,
  expires_at TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- セッション検索用インデックス
CREATE INDEX IF NOT EXISTS idx_sessions_token_hash
ON sessions(token_hash);

-- =========================================
-- Café Haven 初期商品データ
-- =========================================

INSERT INTO products
  (category, name, price, recovery_effect, sort_order)
SELECT '食べ物', '木漏れびサンド', 30000, '要確認', 1
WHERE NOT EXISTS (
  SELECT 1 FROM products WHERE name = '木漏れびサンド'
);

INSERT INTO products
  (category, name, price, recovery_effect, sort_order)
SELECT '食べ物', '雪どけパンケーキ', 30000, '要確認', 2
WHERE NOT EXISTS (
  SELECT 1 FROM products WHERE name = '雪どけパンケーキ'
);

INSERT INTO products
  (category, name, price, recovery_effect, sort_order)
SELECT '飲み物', '木漏れび珈琲', 30000, '要確認', 3
WHERE NOT EXISTS (
  SELECT 1 FROM products WHERE name = '木漏れび珈琲'
);

INSERT INTO products
  (category, name, price, recovery_effect, sort_order)
SELECT '飲み物', '琥珀ラテ', 30000, '要確認', 4
WHERE NOT EXISTS (
  SELECT 1 FROM products WHERE name = '琥珀ラテ'
);

INSERT INTO products
  (category, name, price, recovery_effect, sort_order)
SELECT '食べ物・飲み物', '陽だまりクリームセット', 80000, '要確認', 5
WHERE NOT EXISTS (
  SELECT 1 FROM products WHERE name = '陽だまりクリームセット'
);

INSERT INTO products
  (category, name, price, recovery_effect, sort_order)
SELECT '食べ物・飲み物', '陽だまりアフタヌーンティーセット', 80000, '要確認', 6
WHERE NOT EXISTS (
  SELECT 1 FROM products
  WHERE name = '陽だまりアフタヌーンティーセット'
);
