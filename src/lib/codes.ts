import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getSql } from "@/lib/db";
import { defaultExpiresAt, todayIso } from "@/lib/expiry";

const PIZZA_HUT = "Pizza Hut";
const OWNER_TOKEN_PATTERN = /^[a-f0-9]{64}$/;
const NAME_FIRST = [
  "Baila",
  "Cheesy",
  "Chill",
  "Cosmic",
  "Crispy",
  "Dancing",
  "Funky",
  "Happy",
  "Lucky",
  "Mighty",
  "Saucy",
  "Sneaky",
  "Spicy",
  "Toasty",
  "Turbo",
  "Zesty",
] as const;
const NAME_SECOND = [
  "Buddy",
  "Coconut",
  "Comet",
  "Drummer",
  "Firefly",
  "Gecko",
  "Lion",
  "Machan",
  "Mango",
  "Parrot",
  "Pepper",
  "Rocket",
  "Slice",
  "TukTuk",
  "Vibe",
  "Wizard",
] as const;

type CodeStatus = "open" | "claimed" | "invalid" | "expired";
type CodeKind = "one_time" | "reusable" | "loyalty" | "ges";
export type OfferType = "loyalty" | "ges";

export type PromoCode = {
  id: number;
  brand: string;
  code: string;
  discount: string;
  category: string;
  note: string;
  kind: CodeKind;
  offer_type: OfferType;
  sharer_name: string;
  expires_at: string | null;
  status: CodeStatus;
  grabs: number;
  thanks: number;
  created_at: string;
};

const STATUS_SQL = `case
  when status = 'open' and expires_at is not null and expires_at < current_date then 'expired'
  else status
end`;

const HUT = `brand = 'Pizza Hut'`;
const OFFER_TYPE_SQL = `case when kind = 'ges' then 'ges' else 'loyalty' end`;

function randomItem<const T extends readonly string[]>(items: T): T[number] {
  const random = crypto.getRandomValues(new Uint32Array(1))[0] ?? 0;
  return items[random % items.length];
}

function createSharerName() {
  return `${randomItem(NAME_FIRST)} ${randomItem(NAME_SECOND)}`;
}

const listInput = z.object({
  view: z.enum(["open", "all"]).optional().default("open"),
  sort: z.enum(["expiry", "recent"]).optional().default("expiry"),
});

export const listCodes = createServerFn({ method: "GET" })
  .validator(listInput)
  .handler(async ({ data }): Promise<PromoCode[]> => {
    const sql = await getSql();
    const where: string[] = [HUT];

    if (data.view !== "all") {
      where.push(`status = 'open' and (expires_at is null or expires_at >= current_date)`);
    }

    const clause = `where ${where.join(" and ")}`;
    const order =
      data.sort === "recent"
        ? `created_at desc`
        : `case
           when (${STATUS_SQL}) = 'open' then 0
           when (${STATUS_SQL}) = 'claimed' then 1
           else 2
         end,
         expires_at asc nulls last,
         created_at asc`;
    const rows = await sql.query<PromoCode>(
      `select
         id, brand, code, discount, category, note, kind,
         ${OFFER_TYPE_SQL} as offer_type, sharer_name,
         expires_at, ${STATUS_SQL} as status,
         grabs, thanks, created_at::text as created_at
       from promo_codes
       ${clause}
       order by ${order}
       limit 80`,
    );
    return rows;
  });

const createInput = z.object({
  code: z.string().trim().min(3).max(40),
  offer_type: z.enum(["loyalty", "ges"]),
  survey_code: z.string().trim().max(64).default(""),
  owner_token: z.string().regex(OWNER_TOKEN_PATTERN, "Invalid management key"),
  expires_at: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Expiry date is required")
    .or(z.literal(""))
    .transform((value) => value || defaultExpiresAt())
    .refine((value) => value >= todayIso(), "Expiry date cannot be in the past"),
});

async function hashOwnerToken(token: string) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(token));
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export const createCode = createServerFn({ method: "POST" })
  .validator(createInput)
  .handler(async ({ data }): Promise<PromoCode> => {
    const sql = await getSql();
    const code = data.code.replace(/\s+/g, "").toUpperCase();
    const surveyCode = data.survey_code.replace(/\s+/g, "").toUpperCase();
    if (data.offer_type === "ges" && surveyCode.length < 3) {
      throw new Error("Add the GES Survey Code from the receipt.");
    }
    const discount = data.offer_type === "ges" ? "20% off · max Rs. 1,000" : "15% off";
    const sharerName = createSharerName();
    const ownerTokenHash = await hashOwnerToken(data.owner_token);
    const existing = await sql.query<{ id: number }>(
      `select id from promo_codes where code = $1 limit 1`,
      [code],
    );
    if (existing.length) {
      throw new Error("That code is already in the jar.");
    }
    const rows = await sql.query<PromoCode>(
      `insert into promo_codes (
         brand, code, discount, category, note, kind, expires_at, owner_token_hash, sharer_name
       )
       values ($1, $2, $3, 'food', $4, $5, $6, $7, $8)
       returning
         id, brand, code, discount, category, note, kind,
         ${OFFER_TYPE_SQL} as offer_type, sharer_name,
         expires_at, status, grabs, thanks, created_at::text as created_at`,
      [
        PIZZA_HUT,
        code,
        discount,
        data.offer_type === "ges" ? surveyCode : "",
        data.offer_type,
        data.expires_at,
        ownerTokenHash,
        sharerName,
      ],
    );
    const row = rows[0];
    if (!row) throw new Error("Could not drop that code.");
    return row;
  });

const idInput = z.object({ id: z.coerce.number().int().positive() });

const manageInput = z.object({
  id: z.coerce.number().int().positive(),
  owner_token: z.string().regex(OWNER_TOKEN_PATTERN, "Invalid management key"),
});

const updateInput = manageInput.extend({
  code: z.string().trim().min(3).max(40),
  offer_type: z.enum(["loyalty", "ges"]),
  survey_code: z.string().trim().max(64).default(""),
  expires_at: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Expiry date is required")
    .refine((value) => value >= todayIso(), "Expiry date cannot be in the past"),
});

export const updateCode = createServerFn({ method: "POST" })
  .validator(updateInput)
  .handler(async ({ data }): Promise<PromoCode> => {
    const sql = await getSql();
    const code = data.code.replace(/\s+/g, "").toUpperCase();
    const surveyCode = data.survey_code.replace(/\s+/g, "").toUpperCase();
    if (data.offer_type === "ges" && surveyCode.length < 3) {
      throw new Error("Add the GES Survey Code from the receipt.");
    }
    const discount = data.offer_type === "ges" ? "20% off · max Rs. 1,000" : "15% off";
    const ownerTokenHash = await hashOwnerToken(data.owner_token);
    const duplicate = await sql.query<{ id: number }>(
      `select id from promo_codes where code = $1 and id <> $2 limit 1`,
      [code, data.id],
    );
    if (duplicate.length) throw new Error("That code is already in the jar.");
    const rows = await sql.query<PromoCode>(
      `update promo_codes
       set code = $1, expires_at = $2, note = $3, kind = $4, discount = $5
       where id = $6 and ${HUT} and owner_token_hash = $7
       returning
         id, brand, code, discount, category, note, kind,
         ${OFFER_TYPE_SQL} as offer_type, sharer_name,
         expires_at, status, grabs, thanks, created_at::text as created_at`,
      [
        code,
        data.expires_at,
        data.offer_type === "ges" ? surveyCode : "",
        data.offer_type,
        discount,
        data.id,
        ownerTokenHash,
      ],
    );
    const row = rows[0];
    if (!row) throw new Error("This browser cannot manage that code.");
    return row;
  });

export const deleteCode = createServerFn({ method: "POST" })
  .validator(manageInput)
  .handler(async ({ data }): Promise<{ ok: true }> => {
    const sql = await getSql();
    const ownerTokenHash = await hashOwnerToken(data.owner_token);
    const rows = await sql.query<{ id: number }>(
      `delete from promo_codes
       where id = $1 and ${HUT} and owner_token_hash = $2
       returning id`,
      [data.id, ownerTokenHash],
    );
    if (!rows.length) throw new Error("This browser cannot manage that code.");
    return { ok: true };
  });

export const grabCode = createServerFn({ method: "POST" })
  .validator(idInput)
  .handler(async ({ data }): Promise<{ grabs: number }> => {
    const sql = await getSql();
    const rows = await sql.query<{ grabs: number }>(
      `update promo_codes set grabs = grabs + 1
       where id = $1 and ${HUT}
       returning grabs`,
      [data.id],
    );
    return rows[0] ?? { grabs: 0 };
  });

export const markUsed = createServerFn({ method: "POST" })
  .validator(idInput)
  .handler(async ({ data }): Promise<{ ok: boolean }> => {
    const sql = await getSql();
    const rows = await sql.query<{ id: number }>(
      `update promo_codes
       set status = 'claimed', grabs = grabs + 1
       where id = $1 and ${HUT} and status = 'open'
       returning id`,
      [data.id],
    );
    if (!rows.length) throw new Error("That code is already gone.");
    return { ok: true };
  });

export const markInvalid = createServerFn({ method: "POST" })
  .validator(idInput)
  .handler(async ({ data }): Promise<{ ok: boolean }> => {
    const sql = await getSql();
    const rows = await sql.query<{ id: number }>(
      `update promo_codes
       set status = 'invalid'
       where id = $1 and ${HUT} and status = 'open'
       returning id`,
      [data.id],
    );
    if (!rows.length) throw new Error("That code is already closed.");
    return { ok: true };
  });
