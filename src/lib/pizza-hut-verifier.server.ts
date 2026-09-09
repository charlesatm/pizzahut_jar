/** Mirrors Pizza Hut Sri Lanka's public web checkout verification flow. */

const DEFAULT_API_BASE_URL = "https://phapis.pizzahut.lk";
const REQUEST_TIMEOUT_MS = 7000;
const TOKEN_EXPIRY_BUFFER_MS = 30_000;

type TokenResponse = {
  access_token?: unknown;
  expires_in?: unknown;
};

type VerificationResponse = { HttpCode?: unknown };

export type LoyaltyVerificationResult =
  { status: "valid" } | { status: "invalid" } | { status: "unavailable" };

let cachedToken: { value: string; expiresAt: number } | null = null;
let pendingToken: Promise<string> | null = null;

function requiredEnvironmentValue(name: string) {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Missing ${name}`);
  return value;
}

function apiUrl(path: string) {
  const baseUrl = process.env.PIZZA_HUT_API_BASE_URL?.trim() || DEFAULT_API_BASE_URL;
  return new URL(path, baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`);
}

async function requestAccessToken() {
  const response = await fetch(apiUrl("gettoken"), {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      username: requiredEnvironmentValue("PIZZA_HUT_API_USERNAME"),
      password: requiredEnvironmentValue("PIZZA_HUT_API_PASSWORD"),
      grant_type: "password",
      scope: requiredEnvironmentValue("PIZZA_HUT_API_SCOPE"),
    }),
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });
  if (!response.ok) throw new Error(`Pizza Hut token request failed (${response.status})`);

  const payload = (await response.json()) as TokenResponse;
  if (typeof payload.access_token !== "string" || !payload.access_token) {
    throw new Error("Pizza Hut token response was incomplete");
  }

  const parsedLifetimeSeconds = Number(payload.expires_in);
  const lifetimeSeconds =
    Number.isFinite(parsedLifetimeSeconds) && parsedLifetimeSeconds > 0
      ? parsedLifetimeSeconds
      : 300;
  cachedToken = {
    value: payload.access_token,
    expiresAt: Date.now() + Math.max(0, lifetimeSeconds * 1000 - TOKEN_EXPIRY_BUFFER_MS),
  };
  return cachedToken.value;
}

async function accessToken(forceRefresh = false) {
  if (forceRefresh) cachedToken = null;
  if (cachedToken && cachedToken.expiresAt > Date.now()) return cachedToken.value;

  pendingToken ??= requestAccessToken().finally(() => {
    pendingToken = null;
  });
  return pendingToken;
}

async function verifyOnce(code: string, forceRefresh = false) {
  const token = await accessToken(forceRefresh);
  const url = apiUrl("api/order/discountverify");
  url.searchParams.set("code", code);
  url.searchParams.set("surveyId", "");
  url.searchParams.set("cookieUuid", crypto.randomUUID());

  const response = await fetch(url, {
    method: "POST",
    headers: {
      accept: "application/json, text/plain, */*",
      authorization: `Bearer ${token}`,
      "content-type": "application/json",
      origin: "https://www.pizzahut.lk",
      referer: "https://www.pizzahut.lk/",
    },
    body: JSON.stringify([code, ""]),
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });

  let payload: VerificationResponse = {};
  try {
    payload = (await response.json()) as VerificationResponse;
  } catch {
    // Status remains authoritative when the upstream sends a non-JSON error page.
  }

  return { response, payload };
}

export async function verifyPizzaHutLoyaltyCode(code: string): Promise<LoyaltyVerificationResult> {
  try {
    let result = await verifyOnce(code);
    if (result.response.status === 401) result = await verifyOnce(code, true);

    if (
      result.response.status === 400 ||
      (typeof result.payload.HttpCode === "string" && result.payload.HttpCode.toUpperCase() === "E")
    ) {
      return { status: "invalid" };
    }
    if (!result.response.ok) return { status: "unavailable" };
    return { status: "valid" };
  } catch {
    return { status: "unavailable" };
  }
}
