-- デモ用データ(4世代の系譜 + 配信履歴)
--
-- このファイルは自動生成される。直接編集しないこと。
--   生成元: scripts/demo-data.ts
--   生成:   npm run db:export
--
-- Supabase の SQL Editor にそのまま貼って実行できる。
-- 先に db/schema.sql を実行しておくこと。
--
-- ⚠️ コピーは GitHub の Raw 表示から行うこと。
--    通常のファイル表示は長いファイルを仮想スクロールするため、
--    全選択しても末尾まで取れず、途中で切れた SQL を貼ることになる。
--    (切れると文字列リテラルが途中で終わり、英文の一部がテーブル名として解釈される)

begin;

-- デモ用ユーザーを作り直す(words と deliveries は cascade で消える)
delete from users where nickname in ('はるか', 'けんた', 'みお', 'さとし');

insert into users (id, nickname) values
  ('a7402832-908a-58cd-b4bc-41f8ecf7ad97', 'はるか'),
  ('30d1cec5-a328-5059-b3c4-98bae7d883f5', 'けんた'),
  ('71d6b0d9-74ee-5aec-8c37-aa45d4476db2', 'みお'),
  ('6ae80660-5790-5328-b45a-9981f4914254', 'さとし');

-- 1. はるか が偉人の言葉を受け取って書く
insert into deliveries (user_id, word_id, delivered_at)
values ('a7402832-908a-58cd-b4bc-41f8ecf7ad97'::uuid, (select id from words where text = '危険思想とは常識を実行に移そうとする思想である。' and source_type = 'classic'), now() - interval '9 days')
on conflict do nothing;
insert into words (id, text, author, source_type, author_user_id, parent_word_id, created_at)
values ('12ba1155-9957-5733-825e-a80c522e7c09'::uuid, '常識のほうが先にあって、自分の考えは後から来るものだと思っていた。逆かもしれない。おかしいと思ったことを口に出さずに飲み込んできたのは、常識を守るためというより、波風を立てたくなかっただけだった。', 'はるか', 'user', 'a7402832-908a-58cd-b4bc-41f8ecf7ad97'::uuid, (select id from words where text = '危険思想とは常識を実行に移そうとする思想である。' and source_type = 'classic'), now() - interval '9 days');

-- 2. けんた がはるかさんの言葉を受け取って書く
insert into deliveries (user_id, word_id, delivered_at)
values ('30d1cec5-a328-5059-b3c4-98bae7d883f5'::uuid, '12ba1155-9957-5733-825e-a80c522e7c09'::uuid, now() - interval '6 days')
on conflict do nothing;
insert into words (id, text, author, source_type, author_user_id, parent_word_id, created_at)
values ('308be7fd-f99d-5439-82aa-feabb59c1ec2'::uuid, '波風を立てたくない、が自分にもある。会議で違和感を持っても「まあいいか」で終わらせる。でもそれを何回か続けたら、自分がその案に賛成したことになっていた。黙るのは中立じゃなかった。', 'けんた', 'user', '30d1cec5-a328-5059-b3c4-98bae7d883f5'::uuid, '12ba1155-9957-5733-825e-a80c522e7c09'::uuid, now() - interval '6 days');

-- 3. みお がけんたさんの言葉を受け取って書く
insert into deliveries (user_id, word_id, delivered_at)
values ('71d6b0d9-74ee-5aec-8c37-aa45d4476db2'::uuid, '308be7fd-f99d-5439-82aa-feabb59c1ec2'::uuid, now() - interval '3 days')
on conflict do nothing;
insert into words (id, text, author, source_type, author_user_id, parent_word_id, created_at)
values ('e348d3fa-859a-5397-ae19-6420277b5594'::uuid, '黙るのは中立じゃない、という一文で、先月の自分を思い出した。友達が誰かの悪口を言っていたとき、否定も肯定もしなかった。あれは優しさのつもりだったけど、その場にいた誰にとってもそう見えていなかったと思う。', 'みお', 'user', '71d6b0d9-74ee-5aec-8c37-aa45d4476db2'::uuid, '308be7fd-f99d-5439-82aa-feabb59c1ec2'::uuid, now() - interval '3 days');

-- 4. さとし が偉人の言葉を受け取って書く
insert into deliveries (user_id, word_id, delivered_at)
values ('6ae80660-5790-5328-b45a-9981f4914254'::uuid, (select id from words where text = '世界がぜんたい幸福にならないうちは個人の幸福はあり得ない' and source_type = 'classic'), now() - interval '5 days')
on conflict do nothing;
insert into words (id, text, author, source_type, author_user_id, parent_word_id, created_at)
values ('14d2878b-af7a-52a2-bae1-64d1138a6ada'::uuid, '自分ひとりが幸せになる方法ばかり考えていた。就活の軸も、給料と休みの日数で決めていた。それが間違いだとは思わないけれど、その軸しか持っていないことには気づいていなかった。', 'さとし', 'user', '6ae80660-5790-5328-b45a-9981f4914254'::uuid, (select id from words where text = '世界がぜんたい幸福にならないうちは個人の幸福はあり得ない' and source_type = 'classic'), now() - interval '5 days');

-- 5. さとし が偉人の言葉を受け取って書く
insert into deliveries (user_id, word_id, delivered_at)
values ('6ae80660-5790-5328-b45a-9981f4914254'::uuid, (select id from words where text = '不確実なものが確実なものの基礎である。' and source_type = 'classic'), now() - interval '1 days')
on conflict do nothing;
insert into words (id, text, author, source_type, author_user_id, parent_word_id, created_at)
values ('566b03ee-cb17-54c8-bad5-835618e24854'::uuid, '確実なことだけを積み上げて進もうとしていた。だから何も決められなかった。決めてから確かめる、という順番があることを、考えたことがなかった。', 'さとし', 'user', '6ae80660-5790-5328-b45a-9981f4914254'::uuid, (select id from words where text = '不確実なものが確実なものの基礎である。' and source_type = 'classic'), now() - interval '1 days');

-- 書いた言葉が、さらに他の人にも届いたことにする(「◯人に届きました」を0にしないため)
insert into deliveries (user_id, word_id, delivered_at)
values ('71d6b0d9-74ee-5aec-8c37-aa45d4476db2'::uuid, '12ba1155-9957-5733-825e-a80c522e7c09'::uuid, now() - interval '5 days')
on conflict do nothing;
insert into deliveries (user_id, word_id, delivered_at)
values ('6ae80660-5790-5328-b45a-9981f4914254'::uuid, '12ba1155-9957-5733-825e-a80c522e7c09'::uuid, now() - interval '5 days')
on conflict do nothing;
insert into deliveries (user_id, word_id, delivered_at)
values ('71d6b0d9-74ee-5aec-8c37-aa45d4476db2'::uuid, '308be7fd-f99d-5439-82aa-feabb59c1ec2'::uuid, now() - interval '2 days')
on conflict do nothing;
insert into deliveries (user_id, word_id, delivered_at)
values ('6ae80660-5790-5328-b45a-9981f4914254'::uuid, '308be7fd-f99d-5439-82aa-feabb59c1ec2'::uuid, now() - interval '2 days')
on conflict do nothing;
insert into deliveries (user_id, word_id, delivered_at)
values ('a7402832-908a-58cd-b4bc-41f8ecf7ad97'::uuid, 'e348d3fa-859a-5397-ae19-6420277b5594'::uuid, now() - interval '0 days')
on conflict do nothing;
insert into deliveries (user_id, word_id, delivered_at)
values ('30d1cec5-a328-5059-b3c4-98bae7d883f5'::uuid, 'e348d3fa-859a-5397-ae19-6420277b5594'::uuid, now() - interval '0 days')
on conflict do nothing;
insert into deliveries (user_id, word_id, delivered_at)
values ('6ae80660-5790-5328-b45a-9981f4914254'::uuid, 'e348d3fa-859a-5397-ae19-6420277b5594'::uuid, now() - interval '0 days')
on conflict do nothing;

commit;
