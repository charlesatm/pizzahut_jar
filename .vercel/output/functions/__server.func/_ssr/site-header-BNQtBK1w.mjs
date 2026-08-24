import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { a as DialogOverlay$1, c as DialogTrigger$1, i as DialogDescription$1, n as DialogClose, o as DialogPortal$1, r as DialogContent$1, s as DialogTitle$1, t as Dialog$1, u as Slot } from "../_libs/@radix-ui/react-dialog+[...].mjs";
import { t as X } from "../_libs/lucide-react.mjs";
import { i as useQueryClient, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { t as Root } from "../_libs/radix-ui__react-label.mjs";
import { n as create, t as persist } from "../_libs/zustand.mjs";
import { i as createCode, r as PIZZA_HUT } from "./router-Cp92vq_-.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/site-header-BNQtBK1w.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-[color,background-color,box-shadow,transform,opacity] duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:not-disabled:scale-[0.96]", {
	variants: {
		variant: {
			default: "bg-primary text-primary-foreground hover:bg-primary/90",
			secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
			outline: "border border-border bg-card text-foreground hover:bg-muted",
			ghost: "text-foreground hover:bg-muted",
			destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90"
		},
		size: {
			default: "h-11 px-4",
			sm: "h-9 rounded-sm px-3 text-xs",
			lg: "h-12 rounded-lg px-5",
			icon: "size-11"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
var Button = import_react.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size,
			className
		})),
		ref,
		...props
	});
});
Button.displayName = "Button";
var Dialog = Dialog$1;
var DialogTrigger = DialogTrigger$1;
var DialogPortal = DialogPortal$1;
var DialogOverlay = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay$1, {
	ref,
	className: cn("fixed inset-0 z-50 bg-foreground/30 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
	...props
}));
DialogOverlay.displayName = DialogOverlay$1.displayName;
var DialogContent = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent$1, {
	ref,
	className: cn("fixed left-1/2 top-1/2 z-50 grid w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 gap-4 rounded-xl border border-border bg-card p-6 text-card-foreground shadow-ticket duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95", className),
	...props,
	children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogClose, {
		className: "absolute right-3 top-3 rounded-sm p-2 text-muted-foreground opacity-80 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring/40",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "sr-only",
			children: "Close"
		})]
	})]
})] }));
DialogContent.displayName = DialogContent$1.displayName;
function DialogHeader({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("flex flex-col gap-1.5 pr-8 text-left", className),
		...props
	});
}
function DialogFooter({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className),
		...props
	});
}
var DialogTitle = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle$1, {
	ref,
	className: cn("font-display text-xl font-semibold tracking-tight text-foreground", className),
	...props
}));
DialogTitle.displayName = DialogTitle$1.displayName;
var DialogDescription = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription$1, {
	ref,
	className: cn("text-sm text-muted-foreground", className),
	...props
}));
DialogDescription.displayName = DialogDescription$1.displayName;
var Input = import_react.forwardRef(({ className, type, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		type,
		className: cn("flex h-11 w-full rounded-md border border-input bg-card px-3 py-2 text-base text-foreground shadow-none transition-[box-shadow,border-color] duration-150 placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm", className),
		ref,
		...props
	});
});
Input.displayName = "Input";
var Label = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Root, {
	ref,
	className: cn("text-sm font-medium leading-none text-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70", className),
	...props
}));
Label.displayName = Root.displayName;
var useClipsStore = create()(persist((set, get) => ({
	clips: [],
	thanked: [],
	addClip: (clip) => {
		if (get().clips.some((c) => c.code.toUpperCase() === clip.code.toUpperCase() && c.brand.toLowerCase() === clip.brand.toLowerCase())) return;
		set((s) => ({ clips: [{
			...clip,
			id: crypto.randomUUID(),
			savedAt: (/* @__PURE__ */ new Date()).toISOString(),
			used: false
		}, ...s.clips] }));
	},
	markUsed: (id) => set((s) => ({ clips: s.clips.map((c) => c.id === id ? {
		...c,
		used: true
	} : c) })),
	removeClip: (id) => set((s) => ({ clips: s.clips.filter((c) => c.id !== id) })),
	hasThanked: (codeId) => get().thanked.includes(codeId),
	markThanked: (codeId) => set((s) => s.thanked.includes(codeId) ? s : { thanked: [...s.thanked, codeId] })
}), { name: "code-jar-clips" }));
var emptyForm = {
	code: "",
	discount: "15% off",
	kind: "one_time",
	expires_at: "",
	keepPrivate: false
};
function DropDialog({ triggerClassName }) {
	const [open, setOpen] = (0, import_react.useState)(false);
	const [form, setForm] = (0, import_react.useState)(emptyForm);
	const queryClient = useQueryClient();
	const addClip = useClipsStore((s) => s.addClip);
	const create = useMutation({
		mutationFn: () => createCode({ data: {
			code: form.code,
			discount: form.discount,
			kind: form.kind,
			expires_at: form.expires_at
		} }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["codes"] });
			queryClient.invalidateQueries({ queryKey: ["stats"] });
		}
	});
	function set(key, value) {
		setForm((f) => ({
			...f,
			[key]: value
		}));
	}
	function saveLocal(code) {
		addClip({
			brand: PIZZA_HUT,
			code,
			discount: form.discount.trim() || "15% off",
			category: "food",
			note: "",
			source: "private"
		});
	}
	async function onSubmit(e) {
		e.preventDefault();
		if (!form.expires_at) {
			toast.error("Expiry date is required.");
			return;
		}
		const code = form.code.replace(/\s+/g, "").toUpperCase();
		if (form.keepPrivate) {
			saveLocal(code);
			toast.success("Saved to My clips. Not in the jar.");
			setForm(emptyForm);
			setOpen(false);
			return;
		}
		try {
			await create.mutateAsync();
			saveLocal(code);
			toast.success("Dropped in the jar.");
			setForm(emptyForm);
			setOpen(false);
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Could not drop that.");
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Dialog, {
		open,
		onOpenChange: setOpen,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTrigger, {
			asChild: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				className: cn("min-h-11", triggerClassName),
				children: "Drop a code"
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-h-[90vh] overflow-y-auto",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Drop a Pizza Hut code" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Spare 15% off you will not use? Put it in the jar. Skip names, emails, and anything personal — just the code." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: (e) => void onSubmit(e),
				className: "grid gap-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "code",
							children: "Promo code"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "code",
							required: true,
							minLength: 3,
							maxLength: 40,
							placeholder: "HUT15OFF",
							className: "font-mono tracking-wider uppercase",
							value: form.code,
							onChange: (e) => set("code", e.target.value)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "discount",
							children: "The deal"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "discount",
							required: true,
							minLength: 2,
							maxLength: 40,
							value: form.discount,
							onChange: (e) => set("discount", e.target.value)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Kind" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => set("kind", "one_time"),
								className: cn("h-11 rounded-md border px-3 text-sm transition-colors duration-150", form.kind === "one_time" ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card hover:bg-muted"),
								children: "One use"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => set("kind", "reusable"),
								className: cn("h-11 rounded-md border px-3 text-sm transition-colors duration-150", form.kind === "reusable" ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card hover:bg-muted"),
								children: "Reusable"
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "expires",
							children: "Expires"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "expires",
							type: "date",
							required: true,
							value: form.expires_at,
							onChange: (e) => set("expires_at", e.target.value)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex items-center gap-2 text-sm text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							className: "size-4 accent-primary",
							checked: form.keepPrivate,
							onChange: (e) => set("keepPrivate", e.target.checked)
						}), "Keep in My clips only — do not drop in the jar"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogFooter, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						disabled: create.isPending,
						className: "min-h-11",
						children: form.keepPrivate ? "Save privately" : "Drop in the jar"
					}) })
				]
			})]
		})]
	});
}
function JarMark({ className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 32 32",
		className: cn("size-8", className),
		"aria-hidden": "true",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				width: "32",
				height: "32",
				rx: "8",
				fill: "currentColor"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "11",
				y: "5",
				width: "10",
				height: "2.6",
				rx: "0.8",
				fill: "var(--color-background)"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "12.2",
				y: "7.6",
				width: "7.6",
				height: "1.6",
				rx: "0.4",
				fill: "var(--color-background)"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				fill: "var(--color-background)",
				d: "M10 10.2h12l-1.05 14.1A2.6 2.6 0 0 1 18.38 27h-4.76a2.6 2.6 0 0 1-2.57-2.7L10 10.2z"
			})
		]
	});
}
function SiteHeader() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
		className: "sticky top-0 z-40 border-b border-border/80 bg-background/90 backdrop-blur-sm",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/",
				className: "flex items-center gap-2.5 text-primary",
				"aria-label": "Code Jar home",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(JarMark, { className: "size-8 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display text-lg font-semibold leading-none tracking-tight text-foreground",
					children: "Code Jar"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-0.5 hidden text-xs text-muted-foreground sm:block",
					children: "Pizza Hut spare codes"
				})] })]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-1 sm:gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/how-to",
					className: cn("inline-flex h-11 items-center rounded-md px-3 text-sm font-medium", "text-muted-foreground transition-colors duration-150 hover:text-foreground"),
					children: "How to"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropDialog, {})]
			})]
		})
	});
}
function SiteFooter() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
		className: "mt-16 border-t border-border py-8 text-sm text-muted-foreground",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
			"Pizza Hut codes, shared by whoever dropped them. No guarantees they still work. Do not post personal information, accounts, or payment details.",
			" ",
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/how-to",
				className: "font-medium text-foreground underline-offset-4 hover:underline",
				children: "How to redeem"
			})
		] })
	});
}
//#endregion
export { SiteHeader as a, SiteFooter as i, DropDialog as n, cn as o, Input as r, useClipsStore as s, Button as t };
