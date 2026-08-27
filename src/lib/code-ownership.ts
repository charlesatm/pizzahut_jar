const STORAGE_KEY = "share-a-slice:ownership:v1";
const TOKEN_PATTERN = /^[a-f0-9]{64}$/;

type OwnershipStore = {
  version: 1;
  tokens: Record<string, string>;
};

const EMPTY_STORE: OwnershipStore = { version: 1, tokens: {} };

function readStore(): OwnershipStore {
  if (typeof window === "undefined") return EMPTY_STORE;
  try {
    const parsed = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "null") as unknown;
    if (!parsed || typeof parsed !== "object") return EMPTY_STORE;
    const candidate = parsed as Partial<OwnershipStore>;
    if (candidate.version !== 1 || !candidate.tokens || typeof candidate.tokens !== "object") {
      return EMPTY_STORE;
    }
    const tokens = Object.fromEntries(
      Object.entries(candidate.tokens).filter(
        ([id, token]) => /^\d+$/.test(id) && typeof token === "string" && TOKEN_PATTERN.test(token),
      ),
    );
    return { version: 1, tokens };
  } catch {
    return EMPTY_STORE;
  }
}

function writeStore(store: OwnershipStore) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
    return true;
  } catch {
    return false;
  }
}

export function createOwnerToken() {
  const bytes = new Uint8Array(32);
  window.crypto.getRandomValues(bytes);
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export function getOwnerToken(codeId: number) {
  return readStore().tokens[String(codeId)] ?? null;
}

export function saveOwnerToken(codeId: number, token: string) {
  if (!TOKEN_PATTERN.test(token)) return false;
  const store = readStore();
  return writeStore({ ...store, tokens: { ...store.tokens, [String(codeId)]: token } });
}

export function removeOwnerToken(codeId: number) {
  const store = readStore();
  const tokens = { ...store.tokens };
  delete tokens[String(codeId)];
  writeStore({ ...store, tokens });
}
