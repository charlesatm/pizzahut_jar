import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { a as SiteHeader, i as SiteFooter } from "./site-header-BNQtBK1w.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/how-to-Bh1hV0A5.js
var import_jsx_runtime = require_jsx_runtime();
function HowToPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-svh",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "mx-auto max-w-2xl px-4 pb-20 pt-10 sm:px-6 sm:pt-14",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-medium uppercase tracking-[0.2em] text-primary",
					children: "Pizza Hut"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-3 font-display text-4xl font-semibold leading-[1.1] tracking-tight",
					children: "How to use a code"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 text-base leading-relaxed text-muted-foreground",
					children: "Every ticket in the jar is a Pizza Hut promo. Same redeem steps, every time. Deals default to 15% off. Expiry is required so nobody chases a dead code."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ol", {
					className: "mt-12 flex list-none flex-col gap-8 p-0",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Step, {
							n: "01",
							title: "Copy it from the jar",
							body: "Open the jar, find a deal, copy the code. It also lands in My clips on this device."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Step, {
							n: "02",
							title: "Build your order",
							body: "Use the Pizza Hut app or website. Add the pizzas, sides, and drinks you want, then go to checkout."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Step, {
							n: "03",
							title: "Paste at checkout",
							body: "Look for Promo code, Offers, or Deals. Paste the code and apply it. If the total does not change, the code is spent or expired — mark it no good in the jar."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Step, {
							n: "04",
							title: "Close the loop",
							body: "One-use codes: tap I used it so the next person is not wasting a trip. If it worked, say thanks. If it failed, mark it no good."
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "mt-14 rounded-xl bg-card p-5 shadow-ticket sm:p-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-xl font-semibold tracking-tight",
						children: "Dropping a spare"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm leading-relaxed text-muted-foreground",
						children: "Only Pizza Hut codes. The deal starts at 15% off — change it if yours is different. You must set an expiry. Do not add names, emails, account logins, or payment details."
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-10",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "text-sm font-medium text-foreground underline-offset-4 hover:underline",
						children: "Back to the jar"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteFooter, {})
			]
		})]
	});
}
function Step({ n, title, body }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
		className: "flex gap-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "w-8 shrink-0 font-mono text-xs tracking-widest text-primary",
			children: n
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "font-display text-xl font-semibold tracking-tight",
			children: title
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 text-sm leading-relaxed text-muted-foreground",
			children: body
		})] })]
	});
}
//#endregion
export { HowToPage as component };
