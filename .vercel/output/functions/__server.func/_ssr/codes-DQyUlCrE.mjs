import { n as TSS_SERVER_FUNCTION, t as createServerFn } from "./ssr.mjs";
import { a as string, i as object, r as number, t as _enum } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/codes-DQyUlCrE.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var _0002_promo_codes_default = "create table if not exists promo_codes (\n  id serial primary key,\n  brand text not null,\n  code text not null,\n  discount text not null,\n  category text not null default 'food',\n  note text not null default '',\n  kind text not null default 'one_time',\n  expires_at date,\n  status text not null default 'open',\n  grabs integer not null default 0,\n  thanks integer not null default 0,\n  created_at timestamptz not null default now()\n);\n\ncreate index if not exists promo_codes_status_idx on promo_codes (status, created_at desc);\ncreate index if not exists promo_codes_category_idx on promo_codes (category);\n\ninsert into promo_codes (brand, code, discount, category, note, kind, expires_at, status, grabs, thanks, created_at)\nselect * from (\n  values\n    (\n      'Pizza Hut',\n      'HUT20OFF',\n      '20% off',\n      'food',\n      'Works on delivery over $20. One use — drop it back if you will not order.',\n      'one_time',\n      '2026-09-30'::date,\n      'open',\n      4,\n      2,\n      now() - interval '2 hours'\n    ),\n    (\n      'Domino''s',\n      'CARRYOUT50',\n      '50% off carryout',\n      'food',\n      'Carryout only. Mix and match large pizzas.',\n      'reusable',\n      '2026-10-15'::date,\n      'open',\n      11,\n      6,\n      now() - interval '6 hours'\n    ),\n    (\n      'Chipotle',\n      'BOGO-BURRITO',\n      'BOGO burrito',\n      'food',\n      'Buy one, get one free. In-app checkout.',\n      'one_time',\n      '2026-09-12'::date,\n      'open',\n      1,\n      0,\n      now() - interval '1 day'\n    ),\n    (\n      'Uber Eats',\n      'EATS15OFF',\n      '$15 off $30+',\n      'food',\n      'New-user style code. Try it — report if it is burnt.',\n      'one_time',\n      '2026-09-08'::date,\n      'open',\n      7,\n      3,\n      now() - interval '1 day 4 hours'\n    ),\n    (\n      'Dunkin''',\n      'COLDBREW2',\n      '2 for 1 cold brew',\n      'food',\n      'Show at the counter or enter in the app.',\n      'reusable',\n      '2026-11-01'::date,\n      'open',\n      18,\n      9,\n      now() - interval '2 days'\n    ),\n    (\n      'Target',\n      'CIRCLE20HOME',\n      '20% off home',\n      'retail',\n      'Circle offer, home department. Stacks with a RedCard at some stores.',\n      'reusable',\n      '2026-09-22'::date,\n      'open',\n      5,\n      2,\n      now() - interval '3 days'\n    ),\n    (\n      'Nike',\n      'MOVE25',\n      '25% off apparel',\n      'retail',\n      'Member checkout. Footwear excluded.',\n      'one_time',\n      '2026-10-02'::date,\n      'open',\n      2,\n      1,\n      now() - interval '4 days'\n    ),\n    (\n      'IKEA',\n      'FAMILY15',\n      '15% off',\n      'retail',\n      'IKEA Family number. Furniture as marked.',\n      'reusable',\n      '2026-12-31'::date,\n      'open',\n      9,\n      4,\n      now() - interval '5 days'\n    ),\n    (\n      'Netflix',\n      'FIRSTMONTH',\n      'First month free',\n      'streaming',\n      'Referral-style. One household.',\n      'one_time',\n      '2026-09-18'::date,\n      'open',\n      3,\n      1,\n      now() - interval '6 days'\n    ),\n    (\n      'Spotify',\n      'PREMIUM3MO',\n      '3 months Premium',\n      'streaming',\n      'For accounts that have not tried Premium.',\n      'one_time',\n      '2026-10-31'::date,\n      'open',\n      8,\n      5,\n      now() - interval '7 days'\n    ),\n    (\n      'Airbnb',\n      'STAY75',\n      '$75 off $250+',\n      'travel',\n      'First booking. Apply at checkout.',\n      'one_time',\n      '2026-11-15'::date,\n      'open',\n      0,\n      0,\n      now() - interval '8 days'\n    ),\n    (\n      'Trader Joe''s',\n      'FLOWERS5',\n      '$5 off flowers',\n      'grocery',\n      'In-store at register. Weekends excluded at some locations.',\n      'reusable',\n      '2026-09-28'::date,\n      'open',\n      6,\n      3,\n      now() - interval '9 days'\n    ),\n    (\n      'Whole Foods',\n      'PRIME10',\n      '$10 off $50',\n      'grocery',\n      'Prime member checkout, in-store or delivery.',\n      'reusable',\n      '2026-08-01'::date,\n      'open',\n      14,\n      4,\n      now() - interval '20 days'\n    ),\n    (\n      'Adidas',\n      'CONFIRMED20',\n      '20% off',\n      'retail',\n      'Already used — leaving it here so nobody wastes a trip.',\n      'one_time',\n      '2026-09-01'::date,\n      'claimed',\n      1,\n      1,\n      now() - interval '12 days'\n    )\n) as v(brand, code, discount, category, note, kind, expires_at, status, grabs, thanks, created_at)\nwhere not exists (select 1 from promo_codes);\n";
var _0003_pizzahut_only_default = "delete from promo_codes where brand <> 'Pizza Hut';\n\ninsert into promo_codes (brand, code, discount, category, note, kind, expires_at, status, grabs, thanks, created_at)\nselect v.brand, v.code, v.discount, v.category, v.note, v.kind, v.expires_at, v.status, v.grabs, v.thanks, v.created_at\nfrom (\n  values\n    (\n      'Pizza Hut',\n      'HUTWINGS',\n      '50% off wings',\n      'food',\n      'Online or in-app. Mix and match flavor packs.',\n      'reusable',\n      '2026-10-12'::date,\n      'open',\n      8,\n      3,\n      now() - interval '5 hours'\n    ),\n    (\n      'Pizza Hut',\n      'CARRYOUT25',\n      '25% off carryout',\n      'food',\n      'Carryout only. Large pizzas as marked.',\n      'reusable',\n      '2026-09-28'::date,\n      'open',\n      6,\n      2,\n      now() - interval '1 day'\n    ),\n    (\n      'Pizza Hut',\n      'HUTB1G1',\n      'BOGO pizza',\n      'food',\n      'Buy one pizza, get one free. Equal or lesser value.',\n      'one_time',\n      '2026-09-18'::date,\n      'open',\n      2,\n      1,\n      now() - interval '2 days'\n    ),\n    (\n      'Pizza Hut',\n      'FREEDEL15',\n      'Free delivery $15+',\n      'food',\n      'Delivery fee waived on orders over $15.',\n      'reusable',\n      '2026-10-31'::date,\n      'open',\n      12,\n      5,\n      now() - interval '3 days'\n    ),\n    (\n      'Pizza Hut',\n      'HUT10OFF',\n      '$10 off $30',\n      'food',\n      'One use. Apply at online checkout.',\n      'one_time',\n      '2026-09-14'::date,\n      'open',\n      1,\n      0,\n      now() - interval '4 days'\n    ),\n    (\n      'Pizza Hut',\n      'MELTCOMBO',\n      'Melts combo $10.99',\n      'food',\n      'Two melts plus drinks. App checkout.',\n      'reusable',\n      '2026-11-01'::date,\n      'open',\n      4,\n      2,\n      now() - interval '6 days'\n    )\n) as v(brand, code, discount, category, note, kind, expires_at, status, grabs, thanks, created_at)\nwhere not exists (\n  select 1 from promo_codes p where p.code = v.code\n);\n";
var _0004_pizzahut_codes_default = "insert into promo_codes (brand, code, discount, category, note, kind, expires_at, status, grabs, thanks, created_at)\nselect 'Pizza Hut', 'HUTWINGS', '50% off wings', 'food',\n  'Online or in-app. Mix and match flavor packs.',\n  'reusable', '2026-10-12'::date, 'open', 8, 3, now() - interval '5 hours'\nwhere not exists (select 1 from promo_codes where code = 'HUTWINGS');\n\ninsert into promo_codes (brand, code, discount, category, note, kind, expires_at, status, grabs, thanks, created_at)\nselect 'Pizza Hut', 'CARRYOUT25', '25% off carryout', 'food',\n  'Carryout only. Large pizzas as marked.',\n  'reusable', '2026-09-28'::date, 'open', 6, 2, now() - interval '1 day'\nwhere not exists (select 1 from promo_codes where code = 'CARRYOUT25');\n\ninsert into promo_codes (brand, code, discount, category, note, kind, expires_at, status, grabs, thanks, created_at)\nselect 'Pizza Hut', 'HUTB1G1', 'BOGO pizza', 'food',\n  'Buy one pizza, get one free. Equal or lesser value.',\n  'one_time', '2026-09-18'::date, 'open', 2, 1, now() - interval '2 days'\nwhere not exists (select 1 from promo_codes where code = 'HUTB1G1');\n\ninsert into promo_codes (brand, code, discount, category, note, kind, expires_at, status, grabs, thanks, created_at)\nselect 'Pizza Hut', 'FREEDEL15', 'Free delivery $15+', 'food',\n  'Delivery fee waived on orders over $15.',\n  'reusable', '2026-10-31'::date, 'open', 12, 5, now() - interval '3 days'\nwhere not exists (select 1 from promo_codes where code = 'FREEDEL15');\n\ninsert into promo_codes (brand, code, discount, category, note, kind, expires_at, status, grabs, thanks, created_at)\nselect 'Pizza Hut', 'HUT10OFF', '$10 off $30', 'food',\n  'One use. Apply at online checkout.',\n  'one_time', '2026-09-14'::date, 'open', 1, 0, now() - interval '4 days'\nwhere not exists (select 1 from promo_codes where code = 'HUT10OFF');\n\ninsert into promo_codes (brand, code, discount, category, note, kind, expires_at, status, grabs, thanks, created_at)\nselect 'Pizza Hut', 'MELTCOMBO', 'Melts combo $10.99', 'food',\n  'Two melts plus drinks. App checkout.',\n  'reusable', '2026-11-01'::date, 'open', 4, 2, now() - interval '6 days'\nwhere not exists (select 1 from promo_codes where code = 'MELTCOMBO');\n";
/**
* Migration bookkeeping shared by the two appliers — `scripts/migrate.mjs`
* (deploy, `readdir`) and `src/lib/db.ts` (PGLite preview, `import.meta.glob`).
*
* Applied files are keyed by BASENAME, so the same file applies once no matter
* which directory it is globbed from. That is what makes the auth schema safe to
* copy from `migrations/auth/` into `migrations/` when an app turns sign-in on:
* a database that already has `0001_auth.sql` will not re-run it.
*
* Neither applier descends into subdirectories, so `migrations/auth/*.sql` is
* out of scope for both until it is copied up.
*/
/**
* The `_migrations` key for a migration path (or bare filename).
* @param {string} path
* @returns {string}
*/
function migrationName(path) {
	return path.split("/").pop() ?? path;
}
/**
* @param {string} path
* @returns {boolean}
*/
function isMigrationFile(path) {
	return path.endsWith(".sql");
}
/**
* Migrations in `paths` that are not yet in `applied`, in apply order.
* Non-`.sql` entries (a `readdir` also yields `migrations/auth/`) are dropped.
* @param {Iterable<string>} paths
* @param {Iterable<string>} applied
* @returns {Array<{ name: string, path: string }>}
*/
function pendingMigrations(paths, applied) {
	const done = new Set(applied);
	return [...paths].filter(isMigrationFile).map((path) => ({
		name: migrationName(path),
		path
	})).sort((a, b) => a.name.localeCompare(b.name)).filter(({ name }) => !done.has(name));
}
var rawDatabaseUrl = typeof process !== "undefined" ? process.env.DATABASE_URL : void 0;
var databaseUrl = rawDatabaseUrl && rawDatabaseUrl.trim() ? rawDatabaseUrl : void 0;
/**
* Active backend: real **Neon** when `DATABASE_URL` is set (deployed / configured
* sandbox), otherwise a local embedded **PGLite** (Postgres compiled to WASM) so
* the app has a working database even with nothing configured — the live preview
* included. Swap in Neon later by just setting `DATABASE_URL`; no code changes.
*/
var dbSource = databaseUrl ? "neon" : "pglite";
/**
* Init state lives on globalThis as promises: dev HMR creates new instances of
* this module, and two instances racing module-level state would open a second
* pool or run two concurrent PGLite migration passes (whose duplicate
* `_migrations` insert rejects — and would get memoized, poisoning every later
* `getSql()`). A failed init clears its slot so the next call retries.
*/
var globalRef = globalThis;
/**
* Result-type parity: Postgres sends every value as text plus a type OID — the
* JS value is the DRIVER's parsing choice, and pg and PGLite disagree (pg:
* int8 -> string, date -> local-midnight Date; PGLite: int8 -> BigInt, which
* JSON.stringify rejects, date -> UTC Date). Normalize both so preview and
* production return identical, JSON-safe shapes:
*   int8/bigint (incl. count(*)) -> number (past 2^53 loses precision — cast
*                                   `::text` if you ever need huge integers)
*   date                         -> 'YYYY-MM-DD' string
*   interval                     -> Postgres interval text
* numeric already comes back as a string on both (arbitrary precision).
*/
var OID_INT8 = 20;
var OID_DATE = 1082;
var OID_INTERVAL = 1186;
var identity = (v) => v;
/** Wrap a query runner in the tagged-template + `.query()` `Sql` surface. */
function toSql(run) {
	const sql = (async (strings, ...values) => {
		let text = strings[0];
		for (let i = 0; i < values.length; i += 1) text += `$${i + 1}${strings[i + 1]}`;
		return run(text, values);
	});
	sql.query = (text, params = []) => run(text, params);
	return sql;
}
function createNeonSql() {
	globalRef.__pgSqlPromise__ ??= (async () => {
		const { Pool, types } = await import("../_libs/pg.mjs").then((n) => n.t);
		types.setTypeParser(OID_INT8, Number);
		types.setTypeParser(OID_DATE, identity);
		types.setTypeParser(OID_INTERVAL, identity);
		const pool = new Pool({ connectionString: databaseUrl });
		return toSql(async (text, params) => {
			return (await pool.query(text, params)).rows;
		});
	})().catch((err) => {
		globalRef.__pgSqlPromise__ = void 0;
		throw err;
	});
	return globalRef.__pgSqlPromise__;
}
async function createPgliteSql() {
	globalRef.__pgliteInstance__ ??= (async () => {
		const { PGlite } = await import("../_libs/electric-sql__pglite.mjs").then((n) => n.t);
		const pg = new PGlite({ parsers: {
			[OID_INT8]: Number,
			[OID_DATE]: identity,
			[OID_INTERVAL]: identity
		} });
		await pg.waitReady;
		await pg.exec("create table if not exists _migrations (name text primary key, applied_at timestamptz not null default now())");
		return pg;
	})().catch((err) => {
		globalRef.__pgliteInstance__ = void 0;
		throw err;
	});
	const pg = await globalRef.__pgliteInstance__;
	const migrate = async () => {
		const migrations = /* #__PURE__ */ Object.assign({
			"/migrations/0002_promo_codes.sql": _0002_promo_codes_default,
			"/migrations/0003_pizzahut_only.sql": _0003_pizzahut_only_default,
			"/migrations/0004_pizzahut_codes.sql": _0004_pizzahut_codes_default
		});
		const done = (await pg.query("select name from _migrations")).rows.map((r) => r.name);
		for (const { name, path } of pendingMigrations(Object.keys(migrations), done)) await pg.transaction(async (tx) => {
			await tx.exec(migrations[path]);
			await tx.query("insert into _migrations (name) values ($1)", [name]);
		});
	};
	const pass = (globalRef.__pgliteMigrateChain__ ?? Promise.resolve()).catch(() => void 0).then(migrate);
	globalRef.__pgliteMigrateChain__ = pass;
	await pass;
	return toSql(async (text, params) => {
		return (await pg.query(text, params)).rows;
	});
}
var sqlPromise = null;
async function createSql() {
	if (typeof window !== "undefined") throw new Error("@/lib/db is server-only — call getSql() from a createServerFn handler or a server route loader, never from client code.");
	return dbSource === "neon" ? createNeonSql() : createPgliteSql();
}
/**
* Get the shared, **server-only** SQL client. Neon when `DATABASE_URL` is set,
* otherwise the local PGLite fallback. Memoized — safe to call per request.
*
* Schema comes from `migrations/*.sql`, auto-applied before the first query on
* both backends — define tables there, never inline in server functions.
*/
function getSql() {
	sqlPromise ??= createSql().catch((err) => {
		sqlPromise = null;
		throw err;
	});
	return sqlPromise;
}
/**
* Finish DB bootstrap before the server handles traffic.
*
* - **PGLite** (preview / no `DATABASE_URL`): open the in-memory DB and apply
*   `migrations/*.sql`. Idempotent — concurrent callers share one promise.
* - **Neon**: no-op (pool is created lazily on first query).
*
* Vite `configureServer` awaits this at dev startup; production imports of this
* module kick it off immediately (see bottom of file).
*/
function ensureDbReady() {
	if (dbSource !== "pglite") return Promise.resolve();
	return getSql().then(() => void 0);
}
var globalBoot = globalThis;
if (typeof window === "undefined" && dbSource === "pglite") globalBoot.__pgBootstrapPromise__ ??= ensureDbReady().catch((err) => {
	globalBoot.__pgBootstrapPromise__ = void 0;
	console.error("[db] PGLite bootstrap failed:", err);
	throw err;
});
var PIZZA_HUT = "Pizza Hut";
var STATUS_SQL = `case
  when status = 'open' and expires_at is not null and expires_at < current_date then 'expired'
  else status
end`;
var HUT = `brand = 'Pizza Hut'`;
var listInput = object({
	q: string().optional().default(""),
	view: _enum(["open", "all"]).optional().default("open")
});
var listCodes_createServerFn_handler = createServerRpc({
	id: "09e48ffa99da9a3a4f80f8173b5b3b51252fac9d5f23ebb704b3a27319123e6b",
	name: "listCodes",
	filename: "src/lib/codes.ts"
}, (opts) => listCodes.__executeServer(opts));
var listCodes = createServerFn({ method: "GET" }).validator(listInput).handler(listCodes_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	const params = [];
	const where = [HUT];
	const q = data.q.trim();
	if (q) {
		params.push(`%${q}%`);
		const i = params.length;
		where.push(`(code ilike $${i} or discount ilike $${i})`);
	}
	if (data.view !== "all") where.push(`status = 'open' and (expires_at is null or expires_at >= current_date)`);
	const clause = `where ${where.join(" and ")}`;
	return await sql.query(`select
         id, brand, code, discount, category, note, kind,
         expires_at, ${STATUS_SQL} as status,
         grabs, thanks, created_at::text as created_at
       from promo_codes
       ${clause}
       order by
         case
           when (${STATUS_SQL}) = 'open' then 0
           when (${STATUS_SQL}) = 'claimed' then 1
           else 2
         end,
         created_at desc
       limit 80`, params);
});
var getStats_createServerFn_handler = createServerRpc({
	id: "38f36c68bcad0e851ed493418c07fead12c3b31deff5206585612a50c50c9792",
	name: "getStats",
	filename: "src/lib/codes.ts"
}, (opts) => getStats.__executeServer(opts));
var getStats = createServerFn({ method: "GET" }).handler(getStats_createServerFn_handler, async () => {
	return (await (await getSql()).query(`select
         count(*) filter (
           where status = 'open'
             and (expires_at is null or expires_at >= current_date)
         )::int as open_count,
         coalesce(sum(grabs), 0)::int as grab_count,
         coalesce(sum(thanks), 0)::int as thanks_count
       from promo_codes
       where ${HUT}`))[0] ?? {
		open_count: 0,
		grab_count: 0,
		thanks_count: 0
	};
});
var createInput = object({
	code: string().trim().min(3).max(40),
	discount: string().trim().min(2).max(40).default("15% off"),
	kind: _enum(["one_time", "reusable"]),
	expires_at: string().regex(/^\d{4}-\d{2}-\d{2}$/, "Expiry date is required")
});
var createCode_createServerFn_handler = createServerRpc({
	id: "ae695431145f432348b82c42eb44012b597e9934a10318661013082e995c7f8d",
	name: "createCode",
	filename: "src/lib/codes.ts"
}, (opts) => createCode.__executeServer(opts));
var createCode = createServerFn({ method: "POST" }).validator(createInput).handler(createCode_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	const code = data.code.replace(/\s+/g, "").toUpperCase();
	const discount = data.discount.trim() || "15% off";
	const row = (await sql.query(`insert into promo_codes (brand, code, discount, category, note, kind, expires_at)
       values ($1, $2, $3, 'food', '', $4, $5)
       returning
         id, brand, code, discount, category, note, kind,
         expires_at, status, grabs, thanks, created_at::text as created_at`, [
		PIZZA_HUT,
		code,
		discount,
		data.kind,
		data.expires_at
	]))[0];
	if (!row) throw new Error("Could not drop that code.");
	return row;
});
var idInput = object({ id: number().int().positive() });
var grabCode_createServerFn_handler = createServerRpc({
	id: "eeca44e263b368c3d00ff381a2a621f80d6b0261eb7fe3703e3241e91e9425a3",
	name: "grabCode",
	filename: "src/lib/codes.ts"
}, (opts) => grabCode.__executeServer(opts));
var grabCode = createServerFn({ method: "POST" }).validator(idInput).handler(grabCode_createServerFn_handler, async ({ data }) => {
	return (await (await getSql()).query(`update promo_codes set grabs = grabs + 1
       where id = $1 and ${HUT}
       returning grabs`, [data.id]))[0] ?? { grabs: 0 };
});
var thankCode_createServerFn_handler = createServerRpc({
	id: "9401020b9e6d7d6ce5f59ebd784670dc038a75403bf43c3e954047b60c5bb0d2",
	name: "thankCode",
	filename: "src/lib/codes.ts"
}, (opts) => thankCode.__executeServer(opts));
var thankCode = createServerFn({ method: "POST" }).validator(idInput).handler(thankCode_createServerFn_handler, async ({ data }) => {
	return (await (await getSql()).query(`update promo_codes set thanks = thanks + 1
       where id = $1 and ${HUT}
       returning thanks`, [data.id]))[0] ?? { thanks: 0 };
});
var markUsed_createServerFn_handler = createServerRpc({
	id: "919801227d241262dfceb76726169d628e4cd51fb83fc80ccfd1cd29c28ea59f",
	name: "markUsed",
	filename: "src/lib/codes.ts"
}, (opts) => markUsed.__executeServer(opts));
var markUsed = createServerFn({ method: "POST" }).validator(idInput).handler(markUsed_createServerFn_handler, async ({ data }) => {
	if (!(await (await getSql()).query(`update promo_codes
       set status = 'claimed', grabs = grabs + 1
       where id = $1 and ${HUT} and status = 'open' and kind = 'one_time'
       returning id`, [data.id])).length) throw new Error("That code is already gone.");
	return { ok: true };
});
var markInvalid_createServerFn_handler = createServerRpc({
	id: "0b9a8a436da80f351c40001270d0ad2a3128a7065f1201f1abad6211a7a1040b",
	name: "markInvalid",
	filename: "src/lib/codes.ts"
}, (opts) => markInvalid.__executeServer(opts));
var markInvalid = createServerFn({ method: "POST" }).validator(idInput).handler(markInvalid_createServerFn_handler, async ({ data }) => {
	if (!(await (await getSql()).query(`update promo_codes
       set status = 'invalid'
       where id = $1 and ${HUT} and status = 'open'
       returning id`, [data.id])).length) throw new Error("That code is already closed.");
	return { ok: true };
});
//#endregion
export { createCode_createServerFn_handler, getStats_createServerFn_handler, grabCode_createServerFn_handler, listCodes_createServerFn_handler, markInvalid_createServerFn_handler, markUsed_createServerFn_handler, thankCode_createServerFn_handler };
