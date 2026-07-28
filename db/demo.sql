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
delete from users where nickname in ('のらねこ', '三日坊主', 'こもれび', 'しろくま', 'まめだいふく', 'kome3', 'ゆず', 'かもめ729', 'すずめ', 'やどかり', 'ことりん', 'たんぽぽ', 'はるか', 'けんた', 'みお', 'さとし', 'ゆい', 'なおき', 'あかり', 'そう', 'みなみ', 'りく', 'かなえ', 'いつき');

insert into users (id, nickname) values
  ('c98d8a17-09d2-5825-bb7e-9da759119fe5', 'のらねこ'),
  ('18c812f1-fc3a-5255-b2e1-4dd62a65362b', '三日坊主'),
  ('158cd6fd-9554-5f9f-93d3-c4a80de20700', 'こもれび'),
  ('687498b5-f176-51fe-a914-67d917f1dca5', 'しろくま'),
  ('9fa9765f-22a3-54c1-84c5-256e8b6eaad1', 'まめだいふく'),
  ('9cdcf9fd-dd18-50b6-bead-70c1a118e704', 'kome3'),
  ('c5f59c7b-6bdb-53a1-9ad6-a956047ea8aa', 'ゆず'),
  ('1db63907-c315-53ba-a88b-7747948defa5', 'かもめ729'),
  ('a8ec94db-5483-5a2f-b4c2-f4e72282a59b', 'すずめ'),
  ('f95999f6-8a6e-5c10-8182-750f4e0f5bad', 'やどかり'),
  ('83169263-c97d-5078-8d3b-2492cf3286e8', 'ことりん'),
  ('c873a593-d0c6-5c9d-9deb-3b1e5ca42041', 'たんぽぽ');

-- 1. のらねこ が偉人の言葉を受け取って書く
insert into deliveries (user_id, word_id, delivered_at)
values ('c98d8a17-09d2-5825-bb7e-9da759119fe5'::uuid, (select id from words where text = '危険思想とは常識を実行に移そうとする思想である。' and source_type = 'classic'), now() - interval '9 days')
on conflict do nothing;
insert into words (id, text, author, source_type, author_user_id, parent_word_id, created_at)
values ('5dd686a0-8ff0-526a-b58c-b8b148fcaf1b'::uuid, '常識のほうが先にあって、自分の考えは後から来るものだと思っていた。逆かもしれない。おかしいと思ったことを口に出さずに飲み込んできたのは、常識を守るためというより、波風を立てたくなかっただけだった。', 'のらねこ', 'user', 'c98d8a17-09d2-5825-bb7e-9da759119fe5'::uuid, (select id from words where text = '危険思想とは常識を実行に移そうとする思想である。' and source_type = 'classic'), now() - interval '9 days');

-- 2. 三日坊主 がのらねこさんの言葉を受け取って書く
insert into deliveries (user_id, word_id, delivered_at)
values ('18c812f1-fc3a-5255-b2e1-4dd62a65362b'::uuid, '5dd686a0-8ff0-526a-b58c-b8b148fcaf1b'::uuid, now() - interval '6 days')
on conflict do nothing;
insert into words (id, text, author, source_type, author_user_id, parent_word_id, created_at)
values ('df76e7ed-7b77-58a0-9be4-559a2365b4bb'::uuid, '波風を立てたくない、が自分にもある。会議で違和感を持っても「まあいいか」で終わらせる。でもそれを何回か続けたら、自分がその案に賛成したことになっていた。黙るのは中立じゃなかった。', '三日坊主', 'user', '18c812f1-fc3a-5255-b2e1-4dd62a65362b'::uuid, '5dd686a0-8ff0-526a-b58c-b8b148fcaf1b'::uuid, now() - interval '6 days');

-- 3. こもれび が三日坊主さんの言葉を受け取って書く
insert into deliveries (user_id, word_id, delivered_at)
values ('158cd6fd-9554-5f9f-93d3-c4a80de20700'::uuid, 'df76e7ed-7b77-58a0-9be4-559a2365b4bb'::uuid, now() - interval '3 days')
on conflict do nothing;
insert into words (id, text, author, source_type, author_user_id, parent_word_id, created_at)
values ('b38f2ecf-a84c-5329-b1fe-fd9f1ce637cf'::uuid, '黙るのは中立じゃない、という一文で、先月の自分を思い出した。友達が誰かの悪口を言っていたとき、否定も肯定もしなかった。あれは優しさのつもりだったけど、その場にいた誰にとってもそう見えていなかったと思う。', 'こもれび', 'user', '158cd6fd-9554-5f9f-93d3-c4a80de20700'::uuid, 'df76e7ed-7b77-58a0-9be4-559a2365b4bb'::uuid, now() - interval '3 days');

-- 4. しろくま が偉人の言葉を受け取って書く
insert into deliveries (user_id, word_id, delivered_at)
values ('687498b5-f176-51fe-a914-67d917f1dca5'::uuid, (select id from words where text = '世界がぜんたい幸福にならないうちは個人の幸福はあり得ない' and source_type = 'classic'), now() - interval '5 days')
on conflict do nothing;
insert into words (id, text, author, source_type, author_user_id, parent_word_id, created_at)
values ('b334f6eb-3b82-580f-a36b-b21cd706884d'::uuid, '自分ひとりが幸せになる方法ばかり考えていた。就活の軸も、給料と休みの日数で決めていた。それが間違いだとは思わないけれど、その軸しか持っていないことには気づいていなかった。', 'しろくま', 'user', '687498b5-f176-51fe-a914-67d917f1dca5'::uuid, (select id from words where text = '世界がぜんたい幸福にならないうちは個人の幸福はあり得ない' and source_type = 'classic'), now() - interval '5 days');

-- 5. しろくま が偉人の言葉を受け取って書く
insert into deliveries (user_id, word_id, delivered_at)
values ('687498b5-f176-51fe-a914-67d917f1dca5'::uuid, (select id from words where text = '不確実なものが確実なものの基礎である。' and source_type = 'classic'), now() - interval '1 days')
on conflict do nothing;
insert into words (id, text, author, source_type, author_user_id, parent_word_id, created_at)
values ('28249761-8329-52ac-8062-7b95830fa2fb'::uuid, '確実なことだけを積み上げて進もうとしていた。だから何も決められなかった。決めてから確かめる、という順番があることを、考えたことがなかった。', 'しろくま', 'user', '687498b5-f176-51fe-a914-67d917f1dca5'::uuid, (select id from words where text = '不確実なものが確実なものの基礎である。' and source_type = 'classic'), now() - interval '1 days');

-- 6. まめだいふく が偉人の言葉を受け取って書く
insert into deliveries (user_id, word_id, delivered_at)
values ('9fa9765f-22a3-54c1-84c5-256e8b6eaad1'::uuid, (select id from words where text = '過ちを改めないこと、それを過ちという。' and source_type = 'classic'), now() - interval '8 days')
on conflict do nothing;
insert into words (id, text, author, source_type, author_user_id, parent_word_id, created_at)
values ('ed06bb0f-d04d-5e9f-87a1-971936ec0e0f'::uuid, 'バイトで発注を間違えて、その場ではちゃんと謝った。でも次の週も同じやり方で発注していた。謝ることと直すことは別なんだと、二回目のミスで気づいた。', 'まめだいふく', 'user', '9fa9765f-22a3-54c1-84c5-256e8b6eaad1'::uuid, (select id from words where text = '過ちを改めないこと、それを過ちという。' and source_type = 'classic'), now() - interval '8 days');

-- 7. kome3 が偉人の言葉を受け取って書く
insert into deliveries (user_id, word_id, delivered_at)
values ('9cdcf9fd-dd18-50b6-bead-70c1a118e704'::uuid, (select id from words where text = '頭のよい人は、あまりに多く頭の力を過信する恐れがある。' and source_type = 'classic'), now() - interval '7 days')
on conflict do nothing;
insert into words (id, text, author, source_type, author_user_id, parent_word_id, created_at)
values ('c5a35956-af46-5b14-b7db-a2efc5bdfda6'::uuid, '後輩に説明が伝わらないのは、相手の理解力の問題だと思っていた。あとで思い返したら、自分は三回説明して三回とも同じ言い方をしていた。', 'kome3', 'user', '9cdcf9fd-dd18-50b6-bead-70c1a118e704'::uuid, (select id from words where text = '頭のよい人は、あまりに多く頭の力を過信する恐れがある。' and source_type = 'classic'), now() - interval '7 days');

-- 8. ゆず が偉人の言葉を受け取って書く
insert into deliveries (user_id, word_id, delivered_at)
values ('c5f59c7b-6bdb-53a1-9ad6-a956047ea8aa'::uuid, (select id from words where text = '恥の多い生涯を送って来ました。' and source_type = 'classic'), now() - interval '6 days')
on conflict do nothing;
insert into words (id, text, author, source_type, author_user_id, parent_word_id, created_at)
values ('f1886a0f-32fa-52ba-b3ff-2858e58ba39d'::uuid, '祖母が同じ話を何度もする。そのたびに「それ聞いた」と言っていた。祖母は話したかったんじゃなくて、私と話したかったんだと思う。今日は最後まで聞いた。', 'ゆず', 'user', 'c5f59c7b-6bdb-53a1-9ad6-a956047ea8aa'::uuid, (select id from words where text = '恥の多い生涯を送って来ました。' and source_type = 'classic'), now() - interval '6 days');

-- 9. かもめ729 が偉人の言葉を受け取って書く
insert into deliveries (user_id, word_id, delivered_at)
values ('1db63907-c315-53ba-a88b-7747948defa5'::uuid, (select id from words where text = '自分を軽蔑する者も、軽蔑する者としては、やはり自分を尊重している。' and source_type = 'classic'), now() - interval '5 days')
on conflict do nothing;
insert into words (id, text, author, source_type, author_user_id, parent_word_id, created_at)
values ('256bfb8d-753d-54d1-9ff8-dcabe21c8b92'::uuid, '自分なんて、と言うのが癖になっていた。でもそう言うとき、頭の中には「本当はもっとできるはずの自分」がいる。卑下しているつもりで、いちばん自分を高く見積もっていた。', 'かもめ729', 'user', '1db63907-c315-53ba-a88b-7747948defa5'::uuid, (select id from words where text = '自分を軽蔑する者も、軽蔑する者としては、やはり自分を尊重している。' and source_type = 'classic'), now() - interval '5 days');

-- 10. すずめ が偉人の言葉を受け取って書く
insert into deliveries (user_id, word_id, delivered_at)
values ('a8ec94db-5483-5a2f-b4c2-f4e72282a59b'::uuid, (select id from words where text = '幸福について考えないことは今日の人間の特徴である。' and source_type = 'classic'), now() - interval '4 days')
on conflict do nothing;
insert into words (id, text, author, source_type, author_user_id, parent_word_id, created_at)
values ('f088fd5b-bfc5-5577-b83a-067bd56beaa6'::uuid, '面接で「あなたにとっての幸せは」と聞かれて、何も出てこなかった。志望動機は三日かけて考えたのに、自分がどうなりたいかは一度も考えていなかった。', 'すずめ', 'user', 'a8ec94db-5483-5a2f-b4c2-f4e72282a59b'::uuid, (select id from words where text = '幸福について考えないことは今日の人間の特徴である。' and source_type = 'classic'), now() - interval '4 days');

-- 11. やどかり が偉人の言葉を受け取って書く
insert into deliveries (user_id, word_id, delivered_at)
values ('f95999f6-8a6e-5c10-8182-750f4e0f5bad'::uuid, (select id from words where text = '阿呆はいつも、自分以外の人間をひとり残らず阿呆だと思っている。' and source_type = 'classic'), now() - interval '3 days')
on conflict do nothing;
insert into words (id, text, author, source_type, author_user_id, parent_word_id, created_at)
values ('23889b63-9dbf-5131-b835-5958ec24badd'::uuid, 'タイムラインで見当違いなことを言っている人を、よく笑っていた。同じことを自分がされていないと言い切れる根拠が、どこにもないと気づいた。', 'やどかり', 'user', 'f95999f6-8a6e-5c10-8182-750f4e0f5bad'::uuid, (select id from words where text = '阿呆はいつも、自分以外の人間をひとり残らず阿呆だと思っている。' and source_type = 'classic'), now() - interval '3 days');

-- 12. ことりん がすずめさんの言葉を受け取って書く
insert into deliveries (user_id, word_id, delivered_at)
values ('83169263-c97d-5078-8d3b-2492cf3286e8'::uuid, 'f088fd5b-bfc5-5577-b83a-067bd56beaa6'::uuid, now() - interval '2 days')
on conflict do nothing;
insert into words (id, text, author, source_type, author_user_id, parent_word_id, created_at)
values ('b0c788e4-ba27-5352-9472-c2a704441e1d'::uuid, '幸せがすぐ出てこなかった、という話。私も出てこない。ただ私の場合は、考えたことがないんじゃなくて、答えたら笑われる気がして言わずにきただけだった。', 'ことりん', 'user', '83169263-c97d-5078-8d3b-2492cf3286e8'::uuid, 'f088fd5b-bfc5-5577-b83a-067bd56beaa6'::uuid, now() - interval '2 days');

-- 13. たんぽぽ がゆずさんの言葉を受け取って書く
insert into deliveries (user_id, word_id, delivered_at)
values ('c873a593-d0c6-5c9d-9deb-3b1e5ca42041'::uuid, 'f1886a0f-32fa-52ba-b3ff-2858e58ba39d'::uuid, now() - interval '1 days')
on conflict do nothing;
insert into words (id, text, author, source_type, author_user_id, parent_word_id, created_at)
values ('cdff230b-59a5-5a72-9df3-c513355f7575'::uuid, '同じ話を最後まで聞いた、という話を読んだ。自分は父に対してそれができていない。話が始まると先に結論を言ってしまう。早く終わらせたいのは自分の都合だった。', 'たんぽぽ', 'user', 'c873a593-d0c6-5c9d-9deb-3b1e5ca42041'::uuid, 'f1886a0f-32fa-52ba-b3ff-2858e58ba39d'::uuid, now() - interval '1 days');

-- 書いた言葉が、さらに他の人にも届いたことにする(「◯人に届きました」を0にしないため)
insert into deliveries (user_id, word_id, delivered_at)
values ('158cd6fd-9554-5f9f-93d3-c4a80de20700'::uuid, '5dd686a0-8ff0-526a-b58c-b8b148fcaf1b'::uuid, now() - interval '5 days')
on conflict do nothing;
insert into deliveries (user_id, word_id, delivered_at)
values ('687498b5-f176-51fe-a914-67d917f1dca5'::uuid, '5dd686a0-8ff0-526a-b58c-b8b148fcaf1b'::uuid, now() - interval '5 days')
on conflict do nothing;
insert into deliveries (user_id, word_id, delivered_at)
values ('9fa9765f-22a3-54c1-84c5-256e8b6eaad1'::uuid, '5dd686a0-8ff0-526a-b58c-b8b148fcaf1b'::uuid, now() - interval '5 days')
on conflict do nothing;
insert into deliveries (user_id, word_id, delivered_at)
values ('f95999f6-8a6e-5c10-8182-750f4e0f5bad'::uuid, '5dd686a0-8ff0-526a-b58c-b8b148fcaf1b'::uuid, now() - interval '5 days')
on conflict do nothing;
insert into deliveries (user_id, word_id, delivered_at)
values ('158cd6fd-9554-5f9f-93d3-c4a80de20700'::uuid, 'df76e7ed-7b77-58a0-9be4-559a2365b4bb'::uuid, now() - interval '2 days')
on conflict do nothing;
insert into deliveries (user_id, word_id, delivered_at)
values ('687498b5-f176-51fe-a914-67d917f1dca5'::uuid, 'df76e7ed-7b77-58a0-9be4-559a2365b4bb'::uuid, now() - interval '2 days')
on conflict do nothing;
insert into deliveries (user_id, word_id, delivered_at)
values ('9cdcf9fd-dd18-50b6-bead-70c1a118e704'::uuid, 'df76e7ed-7b77-58a0-9be4-559a2365b4bb'::uuid, now() - interval '2 days')
on conflict do nothing;
insert into deliveries (user_id, word_id, delivered_at)
values ('c98d8a17-09d2-5825-bb7e-9da759119fe5'::uuid, 'b38f2ecf-a84c-5329-b1fe-fd9f1ce637cf'::uuid, now() - interval '0 days')
on conflict do nothing;
insert into deliveries (user_id, word_id, delivered_at)
values ('18c812f1-fc3a-5255-b2e1-4dd62a65362b'::uuid, 'b38f2ecf-a84c-5329-b1fe-fd9f1ce637cf'::uuid, now() - interval '0 days')
on conflict do nothing;
insert into deliveries (user_id, word_id, delivered_at)
values ('687498b5-f176-51fe-a914-67d917f1dca5'::uuid, 'b38f2ecf-a84c-5329-b1fe-fd9f1ce637cf'::uuid, now() - interval '0 days')
on conflict do nothing;
insert into deliveries (user_id, word_id, delivered_at)
values ('c5f59c7b-6bdb-53a1-9ad6-a956047ea8aa'::uuid, 'b38f2ecf-a84c-5329-b1fe-fd9f1ce637cf'::uuid, now() - interval '0 days')
on conflict do nothing;
insert into deliveries (user_id, word_id, delivered_at)
values ('9cdcf9fd-dd18-50b6-bead-70c1a118e704'::uuid, 'ed06bb0f-d04d-5e9f-87a1-971936ec0e0f'::uuid, now() - interval '4 days')
on conflict do nothing;
insert into deliveries (user_id, word_id, delivered_at)
values ('1db63907-c315-53ba-a88b-7747948defa5'::uuid, 'ed06bb0f-d04d-5e9f-87a1-971936ec0e0f'::uuid, now() - interval '4 days')
on conflict do nothing;
insert into deliveries (user_id, word_id, delivered_at)
values ('c873a593-d0c6-5c9d-9deb-3b1e5ca42041'::uuid, 'f1886a0f-32fa-52ba-b3ff-2858e58ba39d'::uuid, now() - interval '3 days')
on conflict do nothing;
insert into deliveries (user_id, word_id, delivered_at)
values ('a8ec94db-5483-5a2f-b4c2-f4e72282a59b'::uuid, 'f1886a0f-32fa-52ba-b3ff-2858e58ba39d'::uuid, now() - interval '3 days')
on conflict do nothing;
insert into deliveries (user_id, word_id, delivered_at)
values ('1db63907-c315-53ba-a88b-7747948defa5'::uuid, 'f1886a0f-32fa-52ba-b3ff-2858e58ba39d'::uuid, now() - interval '3 days')
on conflict do nothing;
insert into deliveries (user_id, word_id, delivered_at)
values ('83169263-c97d-5078-8d3b-2492cf3286e8'::uuid, 'f088fd5b-bfc5-5577-b83a-067bd56beaa6'::uuid, now() - interval '2 days')
on conflict do nothing;
insert into deliveries (user_id, word_id, delivered_at)
values ('f95999f6-8a6e-5c10-8182-750f4e0f5bad'::uuid, 'f088fd5b-bfc5-5577-b83a-067bd56beaa6'::uuid, now() - interval '2 days')
on conflict do nothing;
insert into deliveries (user_id, word_id, delivered_at)
values ('9fa9765f-22a3-54c1-84c5-256e8b6eaad1'::uuid, 'c5a35956-af46-5b14-b7db-a2efc5bdfda6'::uuid, now() - interval '1 days')
on conflict do nothing;

commit;
