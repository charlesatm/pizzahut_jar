create table if not exists promo_codes (
  id serial primary key,
  brand text not null,
  code text not null,
  discount text not null,
  category text not null default 'food',
  note text not null default '',
  kind text not null default 'one_time',
  expires_at date,
  status text not null default 'open',
  grabs integer not null default 0,
  thanks integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists promo_codes_status_idx on promo_codes (status, created_at desc);
create index if not exists promo_codes_category_idx on promo_codes (category);
