import { getStore } from "@netlify/blobs";
import crypto from "node:crypto";

// One store holds everything. Key layout:
//   attempts/<id>        candidate details + result (what the admin sees)
//   papers/<id>          the question paper WITH correct answers (deleted after submit)
//   idx-mobile/<mobile>  -> id   (enforces one attempt per mobile number)
//   idx-email/<hash>     -> id   (enforces one attempt per email)
export const db = () => getStore({ name: "zoning-exam", consistency: "strong" });

export const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });

export const emailKey = (email) =>
  "idx-email/" + crypto.createHash("sha256").update(String(email).trim().toLowerCase()).digest("hex");

export const mobileKey = (mobile) => "idx-mobile/" + String(mobile).trim();


// Reserve a key only if nobody has used it before. Works on every @netlify/blobs version:
// older versions return nothing from setJSON, so we check with get() first.
export async function claim(store, key, value) {
  const existing = await store.get(key, { type: "json" });
  if (existing) return false;
  const r = await store.setJSON(key, value, { onlyIfNew: true });
  if (r && r.modified === false) return false; // newer versions tell us if it already existed
  return true;
}

// Wrap a function so any crash is logged (visible in Netlify > Functions > log)
// and returned as a clear JSON error instead of a blank failure.
export const safe = (fn) => async (req, ctx) => {
  try {
    return await fn(req, ctx);
  } catch (e) {
    console.error("FUNCTION ERROR:", (e && e.stack) || e);
    return json({ error: "Server error: " + ((e && e.message) || "unknown") }, 500);
  }
};

// ---------- admin login token (signed, expires after 8 hours) ----------
const b64 = (buf) => Buffer.from(buf).toString("base64url");

function secret() {
  const pw = process.env.ADMIN_PASSWORD;
  if (!pw) return null;
  return crypto.createHash("sha256").update("ism-zoning-admin:" + pw).digest();
}

export const adminConfigured = () => !!process.env.ADMIN_PASSWORD;

export function passwordMatches(input) {
  const pw = process.env.ADMIN_PASSWORD || "";
  const a = crypto.createHash("sha256").update(String(input || "")).digest();
  const b = crypto.createHash("sha256").update(pw).digest();
  return pw.length > 0 && crypto.timingSafeEqual(a, b);
}

export function signToken(ttlMs = 8 * 60 * 60 * 1000) {
  const key = secret();
  const payload = b64(JSON.stringify({ exp: Date.now() + ttlMs }));
  const sig = b64(crypto.createHmac("sha256", key).update(payload).digest());
  return payload + "." + sig;
}

export function tokenValid(token) {
  const key = secret();
  if (!key || !token || !token.includes(".")) return false;
  const [payload, sig] = token.split(".");
  const good = b64(crypto.createHmac("sha256", key).update(payload).digest());
  const a = Buffer.from(sig || "");
  const b = Buffer.from(good);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return false;
  try {
    return JSON.parse(Buffer.from(payload, "base64url").toString()).exp > Date.now();
  } catch {
    return false;
  }
}

export function isAdmin(req) {
  const h = req.headers.get("authorization") || "";
  return tokenValid(h.startsWith("Bearer ") ? h.slice(7) : "");
}
