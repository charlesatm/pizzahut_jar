import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getSql } from "@/lib/db";
import { defaultExpiresAt } from "@/lib/expiry";

export const PIZZA_HUT = "Pizza Hut";

export type CodeStatus = "open" | "claimed" | "invalid" | "expired";
export type CodeKind = "one_time" | "reusable";

export type PromoCode = {
  id: number;
  brand: string;
  code: string;
  discount: string;
  category: string;
  note: string;
  kind: CodeKind;
  expires_at: string | null;
  status: CodeStatus;
  grabs: number;
  thanks: number;
  created_at: string;
};

export type JarStats = {
  open_count: number;
  grab_count: number;
  thanks_count: number;
};

const STATUS_SQL = `case
  when status = 'open' and expires_at is not null and expires_at < current_date then 'expired'
  else status
end`;

const HUT = `brand = 'Pizza Hut'`;

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
      where.push(
        `status = 'open' and (expires_at is null or expires_at >= current_date)`,
      );
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
         expires_at, ${STATUS_SQL} as status,
         grabs, thanks, created_at::text as created_at
       from promo_codes
       ${clause}
       order by ${order}
       limit 80`,
    );
    return rows;
  });

export const getStats = createServerFn({ method: "GET" }).handler(
  async (): Promise<JarStats> => {
    const sql = await getSql();
    const rows = await sql.query<JarStats>(
      `select
         count(*) filter (
           where status = 'open'
             and (expires_at is null or expires_at >= current_date)
         )::int as open_count,
         coalesce(sum(grabs), 0)::int as grab_count,
         coalesce(sum(thanks), 0)::int as thanks_count
       from promo_codes
       where ${HUT}`,
    );
    return rows[0] ?? { open_count: 0, grab_count: 0, thanks_count: 0 };
  },
);

const createInput = z.object({
  code: z.string().trim().min(3).max(40),
  discount: z.string().trim().min(2).max(40).default("15% off"),
  expires_at: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Expiry date is required")
    .or(z.literal(""))
    .transform((value) => value || defaultExpiresAt()),
});

export const createCode = createServerFn({ method: "POST" })
  .validator(createInput)
  .handler(async ({ data }): Promise<PromoCode> => {
    const sql = await getSql();
    const code = data.code.replace(/\s+/g, "").toUpperCase();
    const discount = data.discount.trim() || "15% off";
    const existing = await sql.query<{ id: number }>(
      `select id from promo_codes where code = $1 limit 1`,
      [code],
    );
    if (existing.length) {
      throw new Error("That code is already in the jar.");
    }
    const rows = await sql.query<PromoCode>(
      `insert into promo_codes (brand, code, discount, category, note, kind, expires_at)
       values ($1, $2, $3, 'food', '', 'one_time', $4)
       returning
         id, brand, code, discount, category, note, kind,
         expires_at, status, grabs, thanks, created_at::text as created_at`,
      [PIZZA_HUT, code, discount, data.expires_at],
    );
    const row = rows[0];
    if (!row) throw new Error("Could not drop that code.");
    return row;
  });

const idInput = z.object({ id: z.coerce.number().int().positive() });

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

export const thankCode = createServerFn({ method: "POST" })
  .validator(idInput)
  .handler(async ({ data }): Promise<{ thanks: number }> => {
    const sql = await getSql();
    const rows = await sql.query<{ thanks: number }>(
      `update promo_codes set thanks = thanks + 1
       where id = $1 and ${HUT}
       returning thanks`,
      [data.id],
    );
    return rows[0] ?? { thanks: 0 };
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
