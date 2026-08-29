alter table promo_codes
  add column if not exists sharer_name text;

update promo_codes
set sharer_name = 'Anonymous Machan'
where sharer_name is null or btrim(sharer_name) = '';

alter table promo_codes
  alter column sharer_name set default 'Anonymous Machan',
  alter column sharer_name set not null;
