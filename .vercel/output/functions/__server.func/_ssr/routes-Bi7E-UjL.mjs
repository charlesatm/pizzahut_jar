import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { a as Search, c as Check, i as Ticket, n as TriangleAlert, o as Heart, r as Trash2, s as Copy } from "../_libs/lucide-react.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { a as SiteHeader, i as SiteFooter, n as DropDialog, o as cn, r as Input, s as useClipsStore, t as Button } from "./site-header-BNQtBK1w.mjs";
import { a as getStats, c as markInvalid, l as markUsed, n as Route$1, o as grabCode, s as listCodes, u as thankCode } from "./router-Cp92vq_-.mjs";
import { n as format, r as isValid, t as parseISO } from "../_libs/date-fns.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-Bi7E-UjL.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var badgeVariants = cva("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium tracking-wide", {
	variants: { variant: {
		default: "border-transparent bg-secondary text-secondary-foreground",
		outline: "border-border text-muted-foreground",
		forest: "border-transparent bg-primary/10 text-primary"
	} },
	defaultVariants: { variant: "default" }
});
function Badge({ className, variant, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn(badgeVariants({ variant }), className),
		...props
	});
}
var STATUS_LABEL = {
	open: "Open",
	claimed: "Used",
	invalid: "No good",
	expired: "Expired"
};
function formatExpiry(value) {
	if (!value) return null;
	const date = parseISO(value);
	if (!isValid(date)) return null;
	return format(date, "MMM d, yyyy");
}
function fallbackCopy(text) {
	const el = document.createElement("textarea");
	el.value = text;
	el.setAttribute("readonly", "");
	el.style.position = "fixed";
	el.style.left = "-9999px";
	document.body.appendChild(el);
	el.select();
	const ok = document.execCommand("copy");
	el.remove();
	return ok;
}
function CodeTicket({ code }) {
	const queryClient = useQueryClient();
	const [copied, setCopied] = (0, import_react.useState)(false);
	const addClip = useClipsStore((s) => s.addClip);
	const hasThanked = useClipsStore((s) => s.hasThanked(code.id));
	const markThanked = useClipsStore((s) => s.markThanked);
	const closed = code.status !== "open";
	const invalidate = () => {
		queryClient.invalidateQueries({ queryKey: ["codes"] });
		queryClient.invalidateQueries({ queryKey: ["stats"] });
	};
	const grab = useMutation({
		mutationFn: () => grabCode({ data: { id: code.id } }),
		onSuccess: invalidate
	});
	const used = useMutation({
		mutationFn: () => markUsed({ data: { id: code.id } }),
		onSuccess: () => {
			toast.success("Marked used. Thanks for closing the loop.");
			invalidate();
		},
		onError: (err) => toast.error(err.message)
	});
	const invalid = useMutation({
		mutationFn: () => markInvalid({ data: { id: code.id } }),
		onSuccess: () => {
			toast.message("Noted. That code is out of the jar.");
			invalidate();
		},
		onError: (err) => toast.error(err.message)
	});
	const thanks = useMutation({
		mutationFn: () => thankCode({ data: { id: code.id } }),
		onSuccess: () => {
			markThanked(code.id);
			invalidate();
		}
	});
	async function handleCopy() {
		let copiedOk = false;
		try {
			await navigator.clipboard.writeText(code.code);
			copiedOk = true;
		} catch {
			copiedOk = fallbackCopy(code.code);
		}
		addClip({
			brand: code.brand,
			code: code.code,
			discount: code.discount,
			category: code.category,
			note: code.note,
			source: "copied"
		});
		if (!closed) grab.mutate();
		if (copiedOk) {
			setCopied(true);
			window.setTimeout(() => setCopied(false), 1600);
			toast.success("Copied. It is also in My clips.");
		} else toast.message("Saved to My clips. Select the code if copy is blocked.");
	}
	const expiry = formatExpiry(code.expires_at);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: cn("ticket flex flex-col overflow-hidden", closed && "opacity-70"),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "ticket-holes" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-1 flex-col gap-4 p-5 pt-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "min-w-0",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "truncate font-display text-xl font-semibold tracking-tight",
							children: code.brand
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: cn("stamp text-[10px]", code.status === "open" && "text-primary", code.status === "claimed" && "text-muted-foreground", code.status === "expired" && "text-muted-foreground", code.status === "invalid" && "text-destructive"),
						children: STATUS_LABEL[code.status]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => void handleCopy(),
					className: "group rounded-md bg-muted/60 px-3 py-3 text-left transition-colors duration-150 hover:bg-muted",
					"aria-label": `Copy code ${code.code}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-mono text-lg font-semibold tracking-[0.18em] text-foreground sm:text-xl",
						children: code.code
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs text-muted-foreground",
						children: "Tap to copy"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-lg font-medium tracking-tight",
						children: code.discount
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						variant: "outline",
						children: code.kind === "one_time" ? "One use" : "Reusable"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-auto flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground",
					children: [
						expiry ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Expires ", expiry] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "No expiry listed" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "tabular-nums",
							children: [code.grabs, " grabs"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "tabular-nums",
							children: [code.thanks, " thanks"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/how-to",
							className: "font-medium text-foreground underline-offset-4 hover:underline",
							children: "How to redeem"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "sm",
						onClick: () => void handleCopy(),
						className: "min-h-11 w-full",
						children: [copied ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, {}), copied ? "Copied" : "Copy code"]
					}), code.status === "open" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2",
						children: [
							code.kind === "one_time" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								size: "sm",
								variant: "outline",
								disabled: used.isPending,
								onClick: () => used.mutate(),
								className: "min-h-11 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ticket, {}), "I used it"]
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								size: "sm",
								variant: "ghost",
								disabled: invalid.isPending,
								onClick: () => invalid.mutate(),
								className: "min-h-11 flex-1 text-muted-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {}), "No good"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								size: "sm",
								variant: "ghost",
								disabled: hasThanked || thanks.isPending,
								onClick: () => thanks.mutate(),
								className: "min-h-11 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, { className: cn(hasThanked && "fill-primary text-primary") }), "Thanks"]
							})
						]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "sm",
						variant: "ghost",
						disabled: hasThanked || thanks.isPending,
						onClick: () => thanks.mutate(),
						className: "min-h-11 w-full",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, { className: cn(hasThanked && "fill-primary text-primary") }), "Thanks"]
					})]
				})
			]
		})]
	});
}
function MyClips() {
	const clips = useClipsStore((s) => s.clips);
	const markUsed = useClipsStore((s) => s.markUsed);
	const removeClip = useClipsStore((s) => s.removeClip);
	const [ready, setReady] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		setReady(true);
	}, []);
	if (!ready) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "py-16 text-center text-sm text-muted-foreground",
		children: "Opening your clips…"
	});
	if (!clips.length) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-md py-16 text-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "font-display text-2xl font-semibold tracking-tight",
			children: "Nothing in your clips yet"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 text-sm leading-relaxed text-muted-foreground",
			children: "Copy a code from the jar, or drop one and keep it private. Clips live on this device only."
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
		className: "grid gap-4 sm:grid-cols-2",
		children: clips.map((clip) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClipRow, {
			clip,
			onUsed: () => markUsed(clip.id),
			onRemove: () => removeClip(clip.id)
		}, clip.id))
	});
}
function ClipRow({ clip, onUsed, onRemove }) {
	const [copied, setCopied] = (0, import_react.useState)(false);
	async function copy() {
		let ok = false;
		try {
			await navigator.clipboard.writeText(clip.code);
			ok = true;
		} catch {
			const el = document.createElement("textarea");
			el.value = clip.code;
			el.setAttribute("readonly", "");
			el.style.position = "fixed";
			el.style.left = "-9999px";
			document.body.appendChild(el);
			el.select();
			ok = document.execCommand("copy");
			el.remove();
		}
		if (ok) {
			setCopied(true);
			window.setTimeout(() => setCopied(false), 1600);
			toast.success("Copied.");
		} else toast.error("Select the code to copy.");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
		className: "ticket overflow-hidden",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "ticket-holes" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col gap-3 p-5 pt-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground",
						children: clip.category
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-display text-lg font-semibold tracking-tight",
						children: clip.brand
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						variant: clip.used ? "outline" : "forest",
						children: clip.used ? "Used" : clip.source === "copied" ? "From jar" : "Private"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-mono text-lg font-semibold tracking-[0.16em]",
					children: clip.code
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: clip.discount
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "sm",
							onClick: () => void copy(),
							className: "min-h-11",
							children: [copied ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, {}), "Copy"]
						}),
						!clip.used ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: "outline",
							onClick: onUsed,
							className: "min-h-11",
							children: "Mark used"
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "sm",
							variant: "ghost",
							onClick: onRemove,
							className: "min-h-11 text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, {}), "Remove"]
						})
					]
				})
			]
		})]
	});
}
function Skeleton({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("animate-pulse rounded-md bg-muted", className),
		...props
	});
}
function Home() {
	const initial = Route$1.useLoaderData();
	const [tab, setTab] = (0, import_react.useState)("jar");
	const [qInput, setQInput] = (0, import_react.useState)("");
	const [q, setQ] = (0, import_react.useState)("");
	const [view, setView] = (0, import_react.useState)("open");
	const clipCount = useClipsStore((s) => s.clips.length);
	const [clipReady, setClipReady] = (0, import_react.useState)(false);
	const [live, setLive] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		setClipReady(true);
		setLive(true);
	}, []);
	(0, import_react.useEffect)(() => {
		const t = window.setTimeout(() => setQ(qInput.trim()), 220);
		return () => window.clearTimeout(t);
	}, [qInput]);
	const isDefault = q === "" && view === "open";
	const codesQuery = useQuery({
		queryKey: [
			"codes",
			q,
			view
		],
		queryFn: () => listCodes({ data: {
			q,
			view
		} }),
		enabled: live,
		placeholderData: (previous) => previous ?? (isDefault ? initial.codes : void 0)
	});
	const statsQuery = useQuery({
		queryKey: ["stats"],
		queryFn: () => getStats(),
		enabled: live,
		placeholderData: initial.stats
	});
	const codes = codesQuery.data ?? [];
	const stats = statsQuery.data ?? initial.stats;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-svh",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "mx-auto max-w-6xl px-4 pb-20 sm:px-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "stagger-in grid gap-8 py-10 sm:py-14 lg:grid-cols-[1.15fr_0.85fr] lg:items-end",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-medium uppercase tracking-[0.2em] text-primary",
							children: "Pizza Hut only"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "mt-3 max-w-xl font-display text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl",
							children: "Spare Hut codes belong in the jar."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg",
							children: "Sitting on 15% off you will not use? Drop it. Need one for dinner tonight? Take it. No accounts — just leftover Pizza Hut codes, moving on."
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
						className: "grid grid-cols-3 gap-3 rounded-xl bg-card p-4 shadow-ticket sm:p-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
								label: "Open",
								value: stats.open_count
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
								label: "Grabs",
								value: stats.grab_count
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
								label: "Thanks",
								value: stats.thanks_count
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-6 flex gap-1 rounded-lg bg-muted p-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabButton, {
						active: tab === "jar",
						onClick: () => setTab("jar"),
						children: "The jar"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabButton, {
						active: tab === "clips",
						onClick: () => setTab("clips"),
						children: ["My clips", clipReady && clipCount > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "ml-1.5 tabular-nums text-xs opacity-70",
							children: clipCount
						}) : null]
					})]
				}),
				tab === "clips" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MyClips, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative w-full sm:max-w-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: qInput,
								onChange: (e) => setQInput(e.target.value),
								placeholder: "Search a code or deal",
								className: "pl-9",
								"aria-label": "Search a code or deal"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex items-center gap-2 text-sm text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "checkbox",
								className: "size-4 accent-primary",
								checked: view === "all",
								onChange: (e) => setView(e.target.checked ? "all" : "open")
							}), "Show used, expired, and no-good"]
						})]
					}),
					codesQuery.isError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "rounded-lg border border-border bg-card px-4 py-6 text-sm text-muted-foreground",
						children: "Could not load the jar. Refresh and try again."
					}) : null,
					codesQuery.isPending && !codes.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid gap-4 sm:grid-cols-2 xl:grid-cols-3",
						children: Array.from({ length: 6 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-72 rounded-xl" }, i))
					}) : codes.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-dashed border-border bg-card/60 px-6 py-16 text-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-display text-2xl font-semibold tracking-tight",
								children: "The jar is empty here"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground",
								children: "No matching Pizza Hut codes. Drop a spare, or clear the search."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-5 flex justify-center",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropDialog, {})
							})
						]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid gap-4 sm:grid-cols-2 xl:grid-cols-3",
						children: codes.map((code) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CodeTicket, { code }, code.id))
					})
				] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteFooter, {})
			]
		})]
	});
}
function Stat({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "text-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
			className: "text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
			className: "mt-1 font-display text-2xl font-semibold tabular-nums tracking-tight sm:text-3xl",
			children: value
		})]
	});
}
function TabButton({ active, onClick, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		onClick,
		className: cn("h-11 flex-1 rounded-md text-sm font-medium transition-colors duration-150", active ? "bg-card text-foreground shadow-ticket" : "text-muted-foreground hover:text-foreground"),
		children
	});
}
//#endregion
export { Home as component };
