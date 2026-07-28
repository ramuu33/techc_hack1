-- ことづて — スキーマ
--
-- 設計の要点:
--   1. 偉人の言葉とユーザーの言葉が words に同じ形式で並ぶ。
--      「思想家とは有名人ではなく誰かの考えを変えた人」という思想をデータ構造で表現している。
--   2. parent_word_id が影響の来歴を保持する(ニーチェ → Aさん → Bさん → あなた)。
--      継承ではなく「この言葉がなければ、この言葉は生まれなかった」を記録している。
--   3. deliveries が3つの役割を同時に果たす:
--        - 同じ言葉を同じ人に重複配信しない (unique 制約)
--        - 「あなたの言葉が◯人に届きました」を数える
--        - 循環が実際に回っている証跡になる

create table if not exists users (
  id         uuid primary key default gen_random_uuid(),
  nickname   text        not null check (char_length(nickname) between 1 and 20),
  created_at timestamptz not null default now()
);

create table if not exists words (
  id       uuid primary key default gen_random_uuid(),
  text     text not null check (char_length(text) between 1 and 500),
  author   text not null,

  -- 'classic' = 偉人 / 'user' = ユーザーが書いた言葉
  source_type text not null check (source_type in ('classic', 'user')),

  -- 偉人の言葉の出典情報(パブリックドメインであることを追跡可能にする)
  source           text,
  source_url       text,
  original         text,
  translation_note text,

  -- ユーザーの言葉のとき、書いた人。偉人の言葉では null
  author_user_id uuid references users (id) on delete cascade,

  -- この言葉を生んだ言葉(来歴)。偉人の言葉では null
  parent_word_id uuid references words (id) on delete set null,

  created_at timestamptz not null default now(),

  -- source_type と author_user_id の整合性を保証する
  constraint words_author_consistency check (
    (source_type = 'classic' and author_user_id is null) or
    (source_type = 'user'    and author_user_id is not null)
  )
);

create table if not exists deliveries (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references users (id) on delete cascade,
  word_id      uuid not null references words (id) on delete cascade,
  delivered_at timestamptz not null default now(),

  -- 同じ言葉は同じ人に二度届かない
  unique (user_id, word_id)
);

-- 偉人の言葉は本文が一意。seed を何度流しても重複しないための土台になる。
-- ユーザーの言葉は対象外(別々の人が同じ一文を書くことはありうる)。
create unique index if not exists words_classic_text_idx
  on words (text) where source_type = 'classic';

create index if not exists words_source_type_idx     on words (source_type);
create index if not exists words_author_user_id_idx  on words (author_user_id);
create index if not exists words_parent_word_id_idx  on words (parent_word_id);
create index if not exists deliveries_user_id_idx    on deliveries (user_id, delivered_at desc);
create index if not exists deliveries_word_id_idx    on deliveries (word_id);
