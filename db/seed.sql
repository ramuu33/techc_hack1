-- 偉人の言葉 48 件(すべてパブリックドメイン)
--
-- このファイルは自動生成される。直接編集しないこと。
--   生成元: data/words.seed.json
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

insert into words (text, author, source_type, source, source_url, original, translation_note)
select '道徳とは、都合のよさの別名だ。「左側を歩く」という決まりと似たようなものだ。', '芥川龍之介', 'classic', '侏儒の言葉', 'https://www.aozora.gr.jp/cards/000879/files/158_15132.html', '道徳は便宜の異名である。「左側通行」と似たものである。', '原文(文語)より現代語に'
where not exists (select 1 from words where text = '道徳とは、都合のよさの別名だ。「左側を歩く」という決まりと似たようなものだ。' and source_type = 'classic');

insert into words (text, author, source_type, source, source_url, original, translation_note)
select '道徳は常に古着である。', '芥川龍之介', 'classic', '侏儒の言葉', 'https://www.aozora.gr.jp/cards/000879/files/158_15132.html', null, null
where not exists (select 1 from words where text = '道徳は常に古着である。' and source_type = 'classic');

insert into words (text, author, source_type, source, source_url, original, translation_note)
select '危険思想とは常識を実行に移そうとする思想である。', '芥川龍之介', 'classic', '侏儒の言葉', 'https://www.aozora.gr.jp/cards/000879/files/158_15132.html', null, null
where not exists (select 1 from words where text = '危険思想とは常識を実行に移そうとする思想である。' and source_type = 'classic');

insert into words (text, author, source_type, source, source_url, original, translation_note)
select '人生の悲劇の第一幕は親子となったことにはじまっている。', '芥川龍之介', 'classic', '侏儒の言葉', 'https://www.aozora.gr.jp/cards/000879/files/158_15132.html', null, null
where not exists (select 1 from words where text = '人生の悲劇の第一幕は親子となったことにはじまっている。' and source_type = 'classic');

insert into words (text, author, source_type, source, source_url, original, translation_note)
select '自由は山の頂の空気に似ている。どちらも、弱い者には耐えられない。', '芥川龍之介', 'classic', '侏儒の言葉', 'https://www.aozora.gr.jp/cards/000879/files/158_15132.html', '自由は山巓の空気に似ている。どちらも弱い者には堪えることは出来ない。', '原文(文語)より現代語に'
where not exists (select 1 from words where text = '自由は山の頂の空気に似ている。どちらも、弱い者には耐えられない。' and source_type = 'classic');

insert into words (text, author, source_type, source, source_url, original, translation_note)
select '阿呆はいつも、自分以外の人間をひとり残らず阿呆だと思っている。', '芥川龍之介', 'classic', '侏儒の言葉', 'https://www.aozora.gr.jp/cards/000879/files/158_15132.html', '阿呆はいつも彼以外の人人を悉く阿呆と考えている。', '原文(文語)より現代語に'
where not exists (select 1 from words where text = '阿呆はいつも、自分以外の人間をひとり残らず阿呆だと思っている。' and source_type = 'classic');

insert into words (text, author, source_type, source, source_url, original, translation_note)
select '他人を弁護するより、自分を弁護するほうが難しい。疑うなら、弁護士を見てみるといい。', '芥川龍之介', 'classic', '侏儒の言葉', 'https://www.aozora.gr.jp/cards/000879/files/158_15132.html', '他人を弁護するよりも自己を弁護するのは困難である。疑うものは弁護士を見よ。', '原文(文語)より現代語に'
where not exists (select 1 from words where text = '他人を弁護するより、自分を弁護するほうが難しい。疑うなら、弁護士を見てみるといい。' and source_type = 'classic');

insert into words (text, author, source_type, source, source_url, original, translation_note)
select '幸福について考えないことは今日の人間の特徴である。', '三木清', 'classic', '人生論ノート', 'https://www.aozora.gr.jp/cards/000218/files/1914_63525.html', null, null
where not exists (select 1 from words where text = '幸福について考えないことは今日の人間の特徴である。' and source_type = 'classic');

insert into words (text, author, source_type, source, source_url, original, translation_note)
select '幸福になるということは人格になるということである。', '三木清', 'classic', '人生論ノート', 'https://www.aozora.gr.jp/cards/000218/files/1914_63525.html', null, null
where not exists (select 1 from words where text = '幸福になるということは人格になるということである。' and source_type = 'classic');

insert into words (text, author, source_type, source, source_url, original, translation_note)
select '不確実なものが確実なものの基礎である。', '三木清', 'classic', '人生論ノート', 'https://www.aozora.gr.jp/cards/000218/files/1914_63525.html', null, null
where not exists (select 1 from words where text = '不確実なものが確実なものの基礎である。' and source_type = 'classic');

insert into words (text, author, source_type, source, source_url, original, translation_note)
select '論理から疑いが生まれるのではない。疑いがあるから、論理が求められるのだ。', '三木清', 'classic', '人生論ノート', 'https://www.aozora.gr.jp/cards/000218/files/1914_63525.html', '論理によって懐疑が出てくるのでなく、懐疑から論理が求められてくるのである。', '原文(文語)より現代語に'
where not exists (select 1 from words where text = '論理から疑いが生まれるのではない。疑いがあるから、論理が求められるのだ。' and source_type = 'classic');

insert into words (text, author, source_type, source, source_url, original, translation_note)
select '世界がぜんたい幸福にならないうちは個人の幸福はあり得ない', '宮沢賢治', 'classic', '農民芸術概論綱要', 'https://www.aozora.gr.jp/cards/000081/files/2386_13825.html', null, null
where not exists (select 1 from words where text = '世界がぜんたい幸福にならないうちは個人の幸福はあり得ない' and source_type = 'classic');

insert into words (text, author, source_type, source, source_url, original, translation_note)
select 'わたしたちは、世界のほんとうの幸福を探しに行こう。探し求めること自体が、すでに道なのだ。', '宮沢賢治', 'classic', '農民芸術概論綱要', 'https://www.aozora.gr.jp/cards/000081/files/2386_13825.html', 'われらは世界のまことの幸福を索ねよう　求道すでに道である', '原文(文語)より現代語に'
where not exists (select 1 from words where text = 'わたしたちは、世界のほんとうの幸福を探しに行こう。探し求めること自体が、すでに道なのだ。' and source_type = 'classic');

insert into words (text, author, source_type, source, source_url, original, translation_note)
select '科学者になるには自然を恋人としなければならない。', '寺田寅彦', 'classic', '科学者とあたま', 'https://www.aozora.gr.jp/cards/000042/files/2359_13797.html', null, null
where not exists (select 1 from words where text = '科学者になるには自然を恋人としなければならない。' and source_type = 'classic');

insert into words (text, author, source_type, source, source_url, original, translation_note)
select '科学の歴史はある意味では錯覚と失策の歴史である。', '寺田寅彦', 'classic', '科学者とあたま', 'https://www.aozora.gr.jp/cards/000042/files/2359_13797.html', null, null
where not exists (select 1 from words where text = '科学の歴史はある意味では錯覚と失策の歴史である。' and source_type = 'classic');

insert into words (text, author, source_type, source, source_url, original, translation_note)
select '頭のよい人は、あまりに多く頭の力を過信する恐れがある。', '寺田寅彦', 'classic', '科学者とあたま', 'https://www.aozora.gr.jp/cards/000042/files/2359_13797.html', null, null
where not exists (select 1 from words where text = '頭のよい人は、あまりに多く頭の力を過信する恐れがある。' and source_type = 'classic');

insert into words (text, author, source_type, source, source_url, original, translation_note)
select 'いわゆる頭のいい人は、言わば足の早い旅人のようなものである。', '寺田寅彦', 'classic', '科学者とあたま', 'https://www.aozora.gr.jp/cards/000042/files/2359_13797.html', null, null
where not exists (select 1 from words where text = 'いわゆる頭のいい人は、言わば足の早い旅人のようなものである。' and source_type = 'classic');

insert into words (text, author, source_type, source, source_url, original, translation_note)
select '頭の悪い人は前途に霧がかかっているためにかえって楽観的である。', '寺田寅彦', 'classic', '科学者とあたま', 'https://www.aozora.gr.jp/cards/000042/files/2359_13797.html', null, null
where not exists (select 1 from words where text = '頭の悪い人は前途に霧がかかっているためにかえって楽観的である。' and source_type = 'classic');

insert into words (text, author, source_type, source, source_url, original, translation_note)
select '富士はやはり登ってみなければわからない。', '寺田寅彦', 'classic', '科学者とあたま', 'https://www.aozora.gr.jp/cards/000042/files/2359_13797.html', null, null
where not exists (select 1 from words where text = '富士はやはり登ってみなければわからない。' and source_type = 'classic');

insert into words (text, author, source_type, source, source_url, original, translation_note)
select '恥の多い生涯を送って来ました。', '太宰治', 'classic', '人間失格', 'https://www.aozora.gr.jp/cards/000035/files/301_14912.html', null, null
where not exists (select 1 from words where text = '恥の多い生涯を送って来ました。' and source_type = 'classic');

insert into words (text, author, source_type, source, source_url, original, translation_note)
select '自分には、人間の生活というものが、見当つかないのです。', '太宰治', 'classic', '人間失格', 'https://www.aozora.gr.jp/cards/000035/files/301_14912.html', null, null
where not exists (select 1 from words where text = '自分には、人間の生活というものが、見当つかないのです。' and source_type = 'classic');

insert into words (text, author, source_type, source, source_url, original, translation_note)
select '人間は、こぶしを固く握りながら笑えるものでは無いのである。', '太宰治', 'classic', '人間失格', 'https://www.aozora.gr.jp/cards/000035/files/301_14912.html', null, null
where not exists (select 1 from words where text = '人間は、こぶしを固く握りながら笑えるものでは無いのである。' and source_type = 'classic');

insert into words (text, author, source_type, source, source_url, original, translation_note)
select '隣人の苦しみの性質、程度が、まるで見当つかないのです。', '太宰治', 'classic', '人間失格', 'https://www.aozora.gr.jp/cards/000035/files/301_14912.html', null, null
where not exists (select 1 from words where text = '隣人の苦しみの性質、程度が、まるで見当つかないのです。' and source_type = 'classic');

insert into words (text, author, source_type, source, source_url, original, translation_note)
select '自分は、修身教科書的な正義とか何とかいう道徳には、あまり関心を持てないのです。', '太宰治', 'classic', '人間失格', 'https://www.aozora.gr.jp/cards/000035/files/301_14912.html', null, null
where not exists (select 1 from words where text = '自分は、修身教科書的な正義とか何とかいう道徳には、あまり関心を持てないのです。' and source_type = 'classic');

insert into words (text, author, source_type, source, source_url, original, translation_note)
select '山のあなたの空遠く
「幸」住むと人のいふ。
噫、われひとゝ尋めゆきて、
涙さしぐみ、かへりきぬ。
山のあなたになほ遠く
「幸」住むと人のいふ。', 'カアル・ブッセ', 'classic', '海潮音(上田敏訳)「山のあなた」', 'https://www.aozora.gr.jp/cards/000235/files/2259_34474.html', null, null
where not exists (select 1 from words where text = '山のあなたの空遠く
「幸」住むと人のいふ。
噫、われひとゝ尋めゆきて、
涙さしぐみ、かへりきぬ。
山のあなたになほ遠く
「幸」住むと人のいふ。' and source_type = 'classic');

insert into words (text, author, source_type, source, source_url, original, translation_note)
select '時は春、
日は朝、
朝は七時、
片岡に露みちて、
揚雲雀なのりいで、
蝸牛枝に這ひ、
神、そらに知ろしめす。
すべて世は事も無し。', 'ロバアト・ブラウニング', 'classic', '海潮音(上田敏訳)「春の朝」', 'https://www.aozora.gr.jp/cards/000235/files/2259_34474.html', null, null
where not exists (select 1 from words where text = '時は春、
日は朝、
朝は七時、
片岡に露みちて、
揚雲雀なのりいで、
蝸牛枝に這ひ、
神、そらに知ろしめす。
すべて世は事も無し。' and source_type = 'classic');

insert into words (text, author, source_type, source, source_url, original, translation_note)
select '秋の日の
ヴィオロンの
ためいきの
身にしみて
ひたぶるに
うら悲し。', 'ポオル・ヴェルレエヌ', 'classic', '海潮音(上田敏訳)「落葉」', 'https://www.aozora.gr.jp/cards/000235/files/2259_34474.html', null, null
where not exists (select 1 from words where text = '秋の日の
ヴィオロンの
ためいきの
身にしみて
ひたぶるに
うら悲し。' and source_type = 'classic');

insert into words (text, author, source_type, source, source_url, original, translation_note)
select '学んでも考えなければ、身につかない。考えても学ばなければ、危うい。', '孔子', 'classic', '論語 為政第二', 'https://zh.wikisource.org/wiki/論語', '學而不思則罔，思而不學則殆。', '原文(漢文)より訳出'
where not exists (select 1 from words where text = '学んでも考えなければ、身につかない。考えても学ばなければ、危うい。' and source_type = 'classic');

insert into words (text, author, source_type, source, source_url, original, translation_note)
select '君子は、ひとつの用途しか持たない器であってはならない。', '孔子', 'classic', '論語 為政第二', 'https://zh.wikisource.org/wiki/論語', '君子不器。', '原文(漢文)より訳出'
where not exists (select 1 from words where text = '君子は、ひとつの用途しか持たない器であってはならない。' and source_type = 'classic');

insert into words (text, author, source_type, source, source_url, original, translation_note)
select '知っていることを知っているとし、知らないことを知らないとする。それが知るということだ。', '孔子', 'classic', '論語 為政第二', 'https://zh.wikisource.org/wiki/論語', '知之爲知之，不知爲不知，是知也。', '原文(漢文)より訳出'
where not exists (select 1 from words where text = '知っていることを知っているとし、知らないことを知らないとする。それが知るということだ。' and source_type = 'classic');

insert into words (text, author, source_type, source, source_url, original, translation_note)
select '過ちを改めないこと、それを過ちという。', '孔子', 'classic', '論語 衞霊公第十五', 'https://zh.wikisource.org/wiki/論語', '過而不改，是謂過矣。', '原文(漢文)より訳出'
where not exists (select 1 from words where text = '過ちを改めないこと、それを過ちという。' and source_type = 'classic');

insert into words (text, author, source_type, source, source_url, original, translation_note)
select '遠い先を考えない者には、必ず近くの憂いがある。', '孔子', 'classic', '論語 衞霊公第十五', 'https://zh.wikisource.org/wiki/論語', '人無遠慮，必有近憂。', '原文(漢文)より訳出'
where not exists (select 1 from words where text = '遠い先を考えない者には、必ず近くの憂いがある。' and source_type = 'classic');

insert into words (text, author, source_type, source, source_url, original, translation_note)
select '君子は自分に求め、小人は他人に求める。', '孔子', 'classic', '論語 衞霊公第十五', 'https://zh.wikisource.org/wiki/論語', '君子求諸己，小人求諸人。', '原文(漢文)より訳出'
where not exists (select 1 from words where text = '君子は自分に求め、小人は他人に求める。' and source_type = 'classic');

insert into words (text, author, source_type, source, source_url, original, translation_note)
select '人が道を広めるのであって、道が人を広めるのではない。', '孔子', 'classic', '論語 衞霊公第十五', 'https://zh.wikisource.org/wiki/論語', '人能弘道，非道弘人。', '原文(漢文)より訳出'
where not exists (select 1 from words where text = '人が道を広めるのであって、道が人を広めるのではない。' and source_type = 'classic');

insert into words (text, author, source_type, source, source_url, original, translation_note)
select '人が自分を知らないことを憂えるな。自分が人を知らないことを憂えよ。', '孔子', 'classic', '論語 学而第一', 'https://zh.wikisource.org/wiki/論語', '不患人之不己知，患不知人也。', '原文(漢文)より訳出'
where not exists (select 1 from words where text = '人が自分を知らないことを憂えるな。自分が人を知らないことを憂えよ。' and source_type = 'classic');

insert into words (text, author, source_type, source, source_url, original, translation_note)
select '教えるということに、身分の別はない。', '孔子', 'classic', '論語 衞霊公第十五', 'https://zh.wikisource.org/wiki/論語', '有教無類。', '原文(漢文)より訳出'
where not exists (select 1 from words where text = '教えるということに、身分の別はない。' and source_type = 'classic');

insert into words (text, author, source_type, source, source_url, original, translation_note)
select '道を同じくしない者とは、共に謀らない。', '孔子', 'classic', '論語 衞霊公第十五', 'https://zh.wikisource.org/wiki/論語', '道不同，不相爲謀。', '原文(漢文)より訳出'
where not exists (select 1 from words where text = '道を同じくしない者とは、共に謀らない。' and source_type = 'classic');

insert into words (text, author, source_type, source, source_url, original, translation_note)
select '怪物と戦う者は、その過程で自分が怪物にならぬよう気をつけるがいい。深淵をのぞくとき、深淵もまたこちらをのぞいている。', 'ニーチェ', 'classic', '善悪の彼岸', 'https://www.gutenberg.org/ebooks/4363', 'He who fights with monsters should be careful lest he thereby become a monster. And if thou gaze long into an abyss, the abyss will also gaze into thee.', 'Helen Zimmern英訳(1907, パブリックドメイン)より訳出'
where not exists (select 1 from words where text = '怪物と戦う者は、その過程で自分が怪物にならぬよう気をつけるがいい。深淵をのぞくとき、深淵もまたこちらをのぞいている。' and source_type = 'classic');

insert into words (text, author, source_type, source, source_url, original, translation_note)
select '「私がやった」と記憶は言う。「私がやったはずがない」と誇りは言い、決して譲らない。やがて――折れるのは記憶のほうだ。', 'ニーチェ', 'classic', '善悪の彼岸', 'https://www.gutenberg.org/ebooks/4363', '"I did that," says my memory. "I could not have done that," says my pride, and remains inexorable. Eventually--the memory yields.', 'Helen Zimmern英訳(1907, パブリックドメイン)より訳出'
where not exists (select 1 from words where text = '「私がやった」と記憶は言う。「私がやったはずがない」と誇りは言い、決して譲らない。やがて――折れるのは記憶のほうだ。' and source_type = 'classic');

insert into words (text, author, source_type, source, source_url, original, translation_note)
select '自分を軽蔑する者も、軽蔑する者としては、やはり自分を尊重している。', 'ニーチェ', 'classic', '善悪の彼岸', 'https://www.gutenberg.org/ebooks/4363', 'He who despises himself, nevertheless esteems himself thereby, as a despiser.', 'Helen Zimmern英訳(1907, パブリックドメイン)より訳出'
where not exists (select 1 from words where text = '自分を軽蔑する者も、軽蔑する者としては、やはり自分を尊重している。' and source_type = 'classic');

insert into words (text, author, source_type, source, source_url, original, translation_note)
select '偉大な人間をつくるのは、感情の強さではなく、その感情が持続する長さである。', 'ニーチェ', 'classic', '善悪の彼岸', 'https://www.gutenberg.org/ebooks/4363', 'It is not the strength, but the duration of great sentiments that makes great men.', 'Helen Zimmern英訳(1907, パブリックドメイン)より訳出'
where not exists (select 1 from words where text = '偉大な人間をつくるのは、感情の強さではなく、その感情が持続する長さである。' and source_type = 'classic');

insert into words (text, author, source_type, source, source_url, original, translation_note)
select '理想に到達した者は、まさにそのことによって、理想を追い越してしまう。', 'ニーチェ', 'classic', '善悪の彼岸', 'https://www.gutenberg.org/ebooks/4363', 'He who attains his ideal, precisely thereby surpasses it.', 'Helen Zimmern英訳(1907, パブリックドメイン)より訳出'
where not exists (select 1 from words where text = '理想に到達した者は、まさにそのことによって、理想を追い越してしまう。' and source_type = 'classic');

insert into words (text, author, source_type, source, source_url, original, translation_note)
select '恐ろしい経験は、それを経験した者もまた恐ろしい何かではないのか、という問いを呼び起こす。', 'ニーチェ', 'classic', '善悪の彼岸', 'https://www.gutenberg.org/ebooks/4363', 'Dreadful experiences raise the question whether he who experiences them is not something dreadful also.', 'Helen Zimmern英訳(1907, パブリックドメイン)より訳出'
where not exists (select 1 from words where text = '恐ろしい経験は、それを経験した者もまた恐ろしい何かではないのか、という問いを呼び起こす。' and source_type = 'classic');

insert into words (text, author, source_type, source, source_url, original, translation_note)
select 'ただ一人だけを愛することは野蛮である。それは他のすべてを犠牲にして行われるのだから。', 'ニーチェ', 'classic', '善悪の彼岸', 'https://www.gutenberg.org/ebooks/4363', 'Love to one only is a barbarity, for it is exercised at the expense of all others.', 'Helen Zimmern英訳(1907, パブリックドメイン)より訳出'
where not exists (select 1 from words where text = 'ただ一人だけを愛することは野蛮である。それは他のすべてを犠牲にして行われるのだから。' and source_type = 'classic');

insert into words (text, author, source_type, source, source_url, original, translation_note)
select 'この世界はただ変化であり、この人生は意見にすぎない。', 'マルクス・アウレリウス', 'classic', '自省録', 'https://www.gutenberg.org/ebooks/2680', 'This world is mere change, and this life, opinion.', 'Meric Casaubon英訳(パブリックドメイン)より訳出'
where not exists (select 1 from words where text = 'この世界はただ変化であり、この人生は意見にすぎない。' and source_type = 'classic');

insert into words (text, author, source_type, source, source_url, original, translation_note)
select '意見を取り去れば、誰も自分が害されたとは思わない。誰も害されたと思わなければ、害というものはもう存在しない。', 'マルクス・アウレリウス', 'classic', '自省録', 'https://www.gutenberg.org/ebooks/2680', 'Let opinion be taken away, and no man will think himself wronged. If no man shall think himself wronged, then is there no more any such thing as wrong.', 'Meric Casaubon英訳(パブリックドメイン)より訳出'
where not exists (select 1 from words where text = '意見を取り去れば、誰も自分が害されたとは思わない。誰も害されたと思わなければ、害というものはもう存在しない。' and source_type = 'classic');

insert into words (text, author, source_type, source, source_url, original, translation_note)
select 'いつでも好きなときに、自分の内へ退いて休むことができる。それはあなたの力の内にある。', 'マルクス・アウレリウス', 'classic', '自省録', 'https://www.gutenberg.org/ebooks/2680', 'At what time soever thou wilt, it is in thy power to retire into thyself, and to be at rest, and free from all businesses.', 'Meric Casaubon英訳(パブリックドメイン)より訳出'
where not exists (select 1 from words where text = 'いつでも好きなときに、自分の内へ退いて休むことができる。それはあなたの力の内にある。' and source_type = 'classic');

insert into words (text, author, source_type, source, source_url, original, translation_note)
select '死は頭上にかかっている。まだ生きているうちに、まだできるうちに、善くあれ。', 'マルクス・アウレリウス', 'classic', '自省録', 'https://www.gutenberg.org/ebooks/2680', 'Death hangs over thee: whilst yet thou livest, whilst thou mayest, be good.', 'Meric Casaubon英訳(パブリックドメイン)より訳出'
where not exists (select 1 from words where text = '死は頭上にかかっている。まだ生きているうちに、まだできるうちに、善くあれ。' and source_type = 'classic');

commit;
