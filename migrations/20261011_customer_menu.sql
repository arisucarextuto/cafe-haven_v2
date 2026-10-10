-- Café Haven customer-facing menu correction (run once against the existing Cloudflare D1 database)
UPDATE products SET category = '食べ物', name = '木漏れびサンド', price = 30000, sort_order = 1 WHERE name = '木漏れびサンド';
UPDATE products SET category = '食べ物', name = '雪どけパンケーキ', price = 30000, sort_order = 2 WHERE name = '雪どけパンケーキ';
UPDATE products SET category = '飲み物', name = '木漏れび珈琲', price = 30000, sort_order = 3 WHERE name = '木漏れび珈琲';
UPDATE products SET category = '飲み物', name = '琥珀ラテ', price = 30000, sort_order = 4 WHERE name = '琥珀ラテ';
UPDATE products SET category = '食べ物・飲み物', name = '陽だまりクリームセット', price = 80000, sort_order = 5 WHERE name = '陽だまりクリームセット';
UPDATE products SET category = '食べ物・飲み物', name = '陽だまりアフタヌーンティーセット', price = 80000, sort_order = 6 WHERE name = '陽だまりアフタヌーンティーセット';
