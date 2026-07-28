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
delete from users where nickname in ('はるか', 'けんた', 'みお', 'さとし', 'ゆい', 'なおき', 'あかり', 'そう', 'みなみ', 'りく', 'かなえ', 'いつき');

insert into users (id, nickname) values
  ('a7402832-908a-58cd-b4bc-41f8ecf7ad97', 'はるか'),
  ('30d1cec5-a328-5059-b3c4-98bae7d883f5', 'けんた'),
  ('71d6b0d9-74ee-5aec-8c37-aa45d4476db2', 'みお'),
  ('6ae80660-5790-5328-b45a-9981f4914254', 'さとし'),
  ('8598fffa-08b6-502c-b956-de4db7d9948e', 'ゆい'),
  ('a79c59ff-e6c8-526a-8fba-3b3e162bca3d', 'なおき'),
  ('231fce90-3749-5e60-9972-bc389e022479', 'あかり'),
  ('ae9251fd-2544-53a0-91a3-1c9c3bec061e', 'そう'),
  ('16f3f6f1-a0fa-5a17-8fb4-bfce8c7aa977', 'みなみ'),
  ('168c48ed-ca3e-513a-bfe0-bd48875fdf25', 'りく'),
  ('1f756766-5482-52a9-9fc8-be9be0107061', 'かなえ'),
  ('3b1288c7-77f5-56c8-b741-efdee2b4bd89', 'いつき');

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

-- 6. ゆい が偉人の言葉を受け取って書く
insert into deliveries (user_id, word_id, delivered_at)
values ('8598fffa-08b6-502c-b956-de4db7d9948e'::uuid, (select id from words where text = '過ちを改めないこと、それを過ちという。' and source_type = 'classic'), now() - interval '8 days')
on conflict do nothing;
insert into words (id, text, author, source_type, author_user_id, parent_word_id, created_at)
values ('8629d177-8f60-5acc-961a-7a51d6bf5721'::uuid, 'バイトで発注を間違えて、その場ではちゃんと謝った。でも次の週も同じやり方で発注していた。謝ることと直すことは別なんだと、二回目のミスで気づいた。', 'ゆい', 'user', '8598fffa-08b6-502c-b956-de4db7d9948e'::uuid, (select id from words where text = '過ちを改めないこと、それを過ちという。' and source_type = 'classic'), now() - interval '8 days');

-- 7. なおき が偉人の言葉を受け取って書く
insert into deliveries (user_id, word_id, delivered_at)
values ('a79c59ff-e6c8-526a-8fba-3b3e162bca3d'::uuid, (select id from words where text = '頭のよい人は、あまりに多く頭の力を過信する恐れがある。' and source_type = 'classic'), now() - interval '7 days')
on conflict do nothing;
insert into words (id, text, author, source_type, author_user_id, parent_word_id, created_at)
values ('a620b607-adcf-56d0-9cb1-2394fac088f0'::uuid, '後輩に説明が伝わらないのは、相手の理解力の問題だと思っていた。あとで思い返したら、自分は三回説明して三回とも同じ言い方をしていた。', 'なおき', 'user', 'a79c59ff-e6c8-526a-8fba-3b3e162bca3d'::uuid, (select id from words where text = '頭のよい人は、あまりに多く頭の力を過信する恐れがある。' and source_type = 'classic'), now() - interval '7 days');

-- 8. あかり が偉人の言葉を受け取って書く
insert into deliveries (user_id, word_id, delivered_at)
values ('231fce90-3749-5e60-9972-bc389e022479'::uuid, (select id from words where text = '恥の多い生涯を送って来ました。' and source_type = 'classic'), now() - interval '6 days')
on conflict do nothing;
insert into words (id, text, author, source_type, author_user_id, parent_word_id, created_at)
values ('7949df37-ba76-5200-b237-10c76c3b3e50'::uuid, '祖母が同じ話を何度もする。そのたびに「それ聞いた」と言っていた。祖母は話したかったんじゃなくて、私と話したかったんだと思う。今日は最後まで聞いた。', 'あかり', 'user', '231fce90-3749-5e60-9972-bc389e022479'::uuid, (select id from words where text = '恥の多い生涯を送って来ました。' and source_type = 'classic'), now() - interval '6 days');

-- 9. そう が偉人の言葉を受け取って書く
insert into deliveries (user_id, word_id, delivered_at)
values ('ae9251fd-2544-53a0-91a3-1c9c3bec061e'::uuid, (select id from words where text = '自分を軽蔑する者も、軽蔑する者としては、やはり自分を尊重している。' and source_type = 'classic'), now() - interval '5 days')
on conflict do nothing;
insert into words (id, text, author, source_type, author_user_id, parent_word_id, created_at)
values ('56ec2796-acf0-5112-a2fe-50981d57076a'::uuid, '自分なんて、と言うのが癖になっていた。でもそう言うとき、頭の中には「本当はもっとできるはずの自分」がいる。卑下しているつもりで、いちばん自分を高く見積もっていた。', 'そう', 'user', 'ae9251fd-2544-53a0-91a3-1c9c3bec061e'::uuid, (select id from words where text = '自分を軽蔑する者も、軽蔑する者としては、やはり自分を尊重している。' and source_type = 'classic'), now() - interval '5 days');

-- 10. みなみ が偉人の言葉を受け取って書く
insert into deliveries (user_id, word_id, delivered_at)
values ('16f3f6f1-a0fa-5a17-8fb4-bfce8c7aa977'::uuid, (select id from words where text = '幸福について考えないことは今日の人間の特徴である。' and source_type = 'classic'), now() - interval '4 days')
on conflict do nothing;
insert into words (id, text, author, source_type, author_user_id, parent_word_id, created_at)
values ('1fb18000-42a5-5b73-a177-fc4ffd4dcb01'::uuid, '面接で「あなたにとっての幸せは」と聞かれて、何も出てこなかった。志望動機は三日かけて考えたのに、自分がどうなりたいかは一度も考えていなかった。', 'みなみ', 'user', '16f3f6f1-a0fa-5a17-8fb4-bfce8c7aa977'::uuid, (select id from words where text = '幸福について考えないことは今日の人間の特徴である。' and source_type = 'classic'), now() - interval '4 days');

-- 11. りく が偉人の言葉を受け取って書く
insert into deliveries (user_id, word_id, delivered_at)
values ('168c48ed-ca3e-513a-bfe0-bd48875fdf25'::uuid, (select id from words where text = '阿呆はいつも、自分以外の人間をひとり残らず阿呆だと思っている。' and source_type = 'classic'), now() - interval '3 days')
on conflict do nothing;
insert into words (id, text, author, source_type, author_user_id, parent_word_id, created_at)
values ('ee10ebac-81ca-5eaa-a01b-4286652af27b'::uuid, 'タイムラインで見当違いなことを言っている人を、よく笑っていた。同じことを自分がされていないと言い切れる根拠が、どこにもないと気づいた。', 'りく', 'user', '168c48ed-ca3e-513a-bfe0-bd48875fdf25'::uuid, (select id from words where text = '阿呆はいつも、自分以外の人間をひとり残らず阿呆だと思っている。' and source_type = 'classic'), now() - interval '3 days');

-- 12. かなえ がみなみさんの言葉を受け取って書く
insert into deliveries (user_id, word_id, delivered_at)
values ('1f756766-5482-52a9-9fc8-be9be0107061'::uuid, '1fb18000-42a5-5b73-a177-fc4ffd4dcb01'::uuid, now() - interval '2 days')
on conflict do nothing;
insert into words (id, text, author, source_type, author_user_id, parent_word_id, created_at)
values ('4f00ce28-dec0-5ecb-b392-2641a8b918fc'::uuid, '幸せがすぐ出てこなかった、という話。私も出てこない。ただ私の場合は、考えたことがないんじゃなくて、答えたら笑われる気がして言わずにきただけだった。', 'かなえ', 'user', '1f756766-5482-52a9-9fc8-be9be0107061'::uuid, '1fb18000-42a5-5b73-a177-fc4ffd4dcb01'::uuid, now() - interval '2 days');

-- 13. いつき があかりさんの言葉を受け取って書く
insert into deliveries (user_id, word_id, delivered_at)
values ('3b1288c7-77f5-56c8-b741-efdee2b4bd89'::uuid, '7949df37-ba76-5200-b237-10c76c3b3e50'::uuid, now() - interval '1 days')
on conflict do nothing;
insert into words (id, text, author, source_type, author_user_id, parent_word_id, created_at)
values ('b6eb5ea0-4354-5a13-b437-4b4c37261107'::uuid, '同じ話を最後まで聞いた、という話を読んだ。自分は父に対してそれができていない。話が始まると先に結論を言ってしまう。早く終わらせたいのは自分の都合だった。', 'いつき', 'user', '3b1288c7-77f5-56c8-b741-efdee2b4bd89'::uuid, '7949df37-ba76-5200-b237-10c76c3b3e50'::uuid, now() - interval '1 days');

-- 書いた言葉が、さらに他の人にも届いたことにする(「◯人に届きました」を0にしないため)
insert into deliveries (user_id, word_id, delivered_at)
values ('71d6b0d9-74ee-5aec-8c37-aa45d4476db2'::uuid, '12ba1155-9957-5733-825e-a80c522e7c09'::uuid, now() - interval '5 days')
on conflict do nothing;
insert into deliveries (user_id, word_id, delivered_at)
values ('6ae80660-5790-5328-b45a-9981f4914254'::uuid, '12ba1155-9957-5733-825e-a80c522e7c09'::uuid, now() - interval '5 days')
on conflict do nothing;
insert into deliveries (user_id, word_id, delivered_at)
values ('8598fffa-08b6-502c-b956-de4db7d9948e'::uuid, '12ba1155-9957-5733-825e-a80c522e7c09'::uuid, now() - interval '5 days')
on conflict do nothing;
insert into deliveries (user_id, word_id, delivered_at)
values ('168c48ed-ca3e-513a-bfe0-bd48875fdf25'::uuid, '12ba1155-9957-5733-825e-a80c522e7c09'::uuid, now() - interval '5 days')
on conflict do nothing;
insert into deliveries (user_id, word_id, delivered_at)
values ('71d6b0d9-74ee-5aec-8c37-aa45d4476db2'::uuid, '308be7fd-f99d-5439-82aa-feabb59c1ec2'::uuid, now() - interval '2 days')
on conflict do nothing;
insert into deliveries (user_id, word_id, delivered_at)
values ('6ae80660-5790-5328-b45a-9981f4914254'::uuid, '308be7fd-f99d-5439-82aa-feabb59c1ec2'::uuid, now() - interval '2 days')
on conflict do nothing;
insert into deliveries (user_id, word_id, delivered_at)
values ('a79c59ff-e6c8-526a-8fba-3b3e162bca3d'::uuid, '308be7fd-f99d-5439-82aa-feabb59c1ec2'::uuid, now() - interval '2 days')
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
insert into deliveries (user_id, word_id, delivered_at)
values ('231fce90-3749-5e60-9972-bc389e022479'::uuid, 'e348d3fa-859a-5397-ae19-6420277b5594'::uuid, now() - interval '0 days')
on conflict do nothing;
insert into deliveries (user_id, word_id, delivered_at)
values ('a79c59ff-e6c8-526a-8fba-3b3e162bca3d'::uuid, '8629d177-8f60-5acc-961a-7a51d6bf5721'::uuid, now() - interval '4 days')
on conflict do nothing;
insert into deliveries (user_id, word_id, delivered_at)
values ('ae9251fd-2544-53a0-91a3-1c9c3bec061e'::uuid, '8629d177-8f60-5acc-961a-7a51d6bf5721'::uuid, now() - interval '4 days')
on conflict do nothing;
insert into deliveries (user_id, word_id, delivered_at)
values ('3b1288c7-77f5-56c8-b741-efdee2b4bd89'::uuid, '7949df37-ba76-5200-b237-10c76c3b3e50'::uuid, now() - interval '3 days')
on conflict do nothing;
insert into deliveries (user_id, word_id, delivered_at)
values ('16f3f6f1-a0fa-5a17-8fb4-bfce8c7aa977'::uuid, '7949df37-ba76-5200-b237-10c76c3b3e50'::uuid, now() - interval '3 days')
on conflict do nothing;
insert into deliveries (user_id, word_id, delivered_at)
values ('ae9251fd-2544-53a0-91a3-1c9c3bec061e'::uuid, '7949df37-ba76-5200-b237-10c76c3b3e50'::uuid, now() - interval '3 days')
on conflict do nothing;
insert into deliveries (user_id, word_id, delivered_at)
values ('1f756766-5482-52a9-9fc8-be9be0107061'::uuid, '1fb18000-42a5-5b73-a177-fc4ffd4dcb01'::uuid, now() - interval '2 days')
on conflict do nothing;
insert into deliveries (user_id, word_id, delivered_at)
values ('168c48ed-ca3e-513a-bfe0-bd48875fdf25'::uuid, '1fb18000-42a5-5b73-a177-fc4ffd4dcb01'::uuid, now() - interval '2 days')
on conflict do nothing;
insert into deliveries (user_id, word_id, delivered_at)
values ('8598fffa-08b6-502c-b956-de4db7d9948e'::uuid, 'a620b607-adcf-56d0-9cb1-2394fac088f0'::uuid, now() - interval '1 days')
on conflict do nothing;

commit;
