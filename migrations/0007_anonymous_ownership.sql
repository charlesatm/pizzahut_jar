alter table promo_codes
  add column if not exists owner_token_hash text;
