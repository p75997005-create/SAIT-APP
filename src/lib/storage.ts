import type { ExamState } from "../types";
import { MAX_SCORE } from "../data/questions";

const STORAGE_KEYS = [
  "ekde_state_v1",
  "ekde_state_backup_v1",
  "__ekde_data__",
] as const;

const COOKIE_NAME = "ekde_state_v1";
const IDB_NAME = "ekde_db";
const IDB_STORE = "state";
const IDB_KEY = "ekde_state";
const CACHE_NAME = "ekde_state_cache_v1";
const CACHE_URL = "/__ekde_state__.json";

export const INITIAL_STATE: ExamState = {
  status: "fresh",
  nickname: "",
  startedAt: null,
  finishedAt: null,
  durationMs: 0,
  answers: [],
  currentIndex: 0,
  score: 0,
  maxScore: MAX_SCORE,
};

const STATUS_PRIORITY: Record<ExamState["status"], number> = {
  fresh: 0,
  registered: 1,
  in_progress: 2,
  completed: 3,
  annulled: 4,
};

function safeParse(raw: string | null | undefined): ExamState | null {
  if (!raw) return null;
  try {
    const data = JSON.parse(raw) as Partial<ExamState>;
    if (!data || typeof data !== "object") return null;
    if (!data.status || !(data.status in STATUS_PRIORITY)) return null;
    return {
      ...INITIAL_STATE,
      ...data,
    } as ExamState;
  } catch {
    return null;
  }
}

function readLocalStorage(): ExamState | null {
  if (typeof window === "undefined") return null;
  for (const key of STORAGE_KEYS) {
    const candidate = safeParse(window.localStorage.getItem(key));
    if (candidate) return candidate;
  }
  return null;
}

function writeLocalStorage(state: ExamState): void {
  if (typeof window === "undefined") return;
  const payload = JSON.stringify(state);
  for (const key of STORAGE_KEYS) {
    try {
      window.localStorage.setItem(key, payload);
    } catch {
      // ignore quota errors
    }
  }
}

function readSessionStorage(): ExamState | null {
  if (typeof window === "undefined") return null;
  return safeParse(window.sessionStorage.getItem(STORAGE_KEYS[0]));
}

function writeSessionStorage(state: ExamState): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(STORAGE_KEYS[0], JSON.stringify(state));
  } catch {
    // ignore
  }
}

function readCookie(): ExamState | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${COOKIE_NAME}=`));
  if (!match) return null;
  const value = match.slice(COOKIE_NAME.length + 1);
  try {
    return safeParse(decodeURIComponent(value));
  } catch {
    return null;
  }
}

function writeCookie(state: ExamState): void {
  if (typeof document === "undefined") return;
  // Only persist the most important fields in the cookie to keep it small.
  const compact = {
    status: state.status,
    nickname: state.nickname,
    score: state.score,
    maxScore: state.maxScore,
  };
  const value = encodeURIComponent(JSON.stringify(compact));
  // 10 years
  const maxAge = 60 * 60 * 24 * 365 * 10;
  document.cookie = `${COOKIE_NAME}=${value}; path=/; max-age=${maxAge}; samesite=strict`;
}

function openIdb(): Promise<IDBDatabase | null> {
  if (typeof indexedDB === "undefined") return Promise.resolve(null);
  return new Promise((resolve) => {
    try {
      const request = indexedDB.open(IDB_NAME, 1);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(IDB_STORE)) {
          db.createObjectStore(IDB_STORE);
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => resolve(null);
      request.onblocked = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
}

async function readIdb(): Promise<ExamState | null> {
  const db = await openIdb();
  if (!db) return null;
  return new Promise((resolve) => {
    try {
      const tx = db.transaction(IDB_STORE, "readonly");
      const store = tx.objectStore(IDB_STORE);
      const req = store.get(IDB_KEY);
      req.onsuccess = () => {
        const value = req.result;
        if (typeof value === "string") {
          resolve(safeParse(value));
        } else if (value && typeof value === "object") {
          resolve(safeParse(JSON.stringify(value)));
        } else {
          resolve(null);
        }
      };
      req.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
}

async function writeIdb(state: ExamState): Promise<void> {
  const db = await openIdb();
  if (!db) return;
  return new Promise((resolve) => {
    try {
      const tx = db.transaction(IDB_STORE, "readwrite");
      const store = tx.objectStore(IDB_STORE);
      store.put(JSON.stringify(state), IDB_KEY);
      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
      tx.onabort = () => resolve();
    } catch {
      resolve();
    }
  });
}

async function readCache(): Promise<ExamState | null> {
  if (typeof caches === "undefined") return null;
  try {
    const cache = await caches.open(CACHE_NAME);
    const response = await cache.match(CACHE_URL);
    if (!response) return null;
    const text = await response.text();
    return safeParse(text);
  } catch {
    return null;
  }
}

async function writeCache(state: ExamState): Promise<void> {
  if (typeof caches === "undefined") return;
  try {
    const cache = await caches.open(CACHE_NAME);
    const response = new Response(JSON.stringify(state), {
      headers: { "Content-Type": "application/json" },
    });
    await cache.put(CACHE_URL, response);
  } catch {
    // ignore
  }
}

function mergeStates(states: Array<ExamState | null>): ExamState {
  const valid = states.filter((s): s is ExamState => Boolean(s));
  if (valid.length === 0) return { ...INITIAL_STATE };

  // Pick the state with the highest priority status. Annulled and completed
  // are sticky — once any storage layer reports them, the user is locked in.
  let best = valid[0];
  for (const candidate of valid) {
    if (STATUS_PRIORITY[candidate.status] > STATUS_PRIORITY[best.status]) {
      best = candidate;
    }
  }

  // If we have an annulled or completed record anywhere, force that status.
  const annulled = valid.find((s) => s.status === "annulled");
  if (annulled) return { ...best, status: "annulled" };
  const completed = valid.find((s) => s.status === "completed");
  if (completed) return { ...completed };

  return best;
}

export async function loadState(): Promise<ExamState> {
  const [idb, cache] = await Promise.all([readIdb(), readCache()]);
  const ls = readLocalStorage();
  const ss = readSessionStorage();
  const cookie = readCookie();
  return mergeStates([ls, ss, cookie, idb, cache]);
}

export function saveStateSync(state: ExamState): void {
  writeLocalStorage(state);
  writeSessionStorage(state);
  writeCookie(state);
}

export async function saveState(state: ExamState): Promise<void> {
  saveStateSync(state);
  await Promise.all([writeIdb(state), writeCache(state)]);
}
