delete from promo_codes a
using promo_codes b
where a.code = b.code and a.id > b.id;

create unique index if not exists promo_codes_code_uidx on promo_codes (code);
