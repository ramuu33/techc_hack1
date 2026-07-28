-- ことづて — データベースを作り直す
--
-- ⚠️ すべてのデータが消える。ユーザー・書かれた言葉・配信履歴のすべて。
--
-- 使うのは、収録テキストを入れ替えたとき。
-- db/seed.sql は「同じ本文がなければ入れる」方式なので、
-- 本文を書き換えた言葉は別の行として追加されてしまい、古い版が残る。
-- 収録内容を変えたら、作り直すのがいちばん確実。
--
-- 実行順:
--   1. db/reset.sql   ← このファイル
--   2. db/schema.sql
--   3. db/seed.sql
--   4. db/demo.sql
--
-- そのあと、RLS を有効にし直すこと(テーブルを作り直すと設定も消える):
--   alter table users      enable row level security;
--   alter table words      enable row level security;
--   alter table deliveries enable row level security;

drop table if exists deliveries cascade;
drop table if exists words cascade;
drop table if exists users cascade;
