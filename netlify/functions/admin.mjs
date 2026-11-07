import { db, json, emailKey, mobileKey, isAdmin, signToken, passwordMatches, adminConfigured } from "../lib/common.mjs";
import { CONFIG } from "../lib/questions.mjs";

export const config = { path: "/api/admin/*" };

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export default async (req) => {
  const url = new URL(req.url);
  const route = url.pathname.replace(/\/+$/, "").replace(/^\/api\/admin\//, "");

  // ---- login (only route that does not need a token) ----
  if (route === "login") {
    if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);
    if (!adminConfigured()) {
      return json({ error: "ADMIN_PASSWORD is not set on the server. Add it in Netlify > Environment variables." }, 500);
    }
    let b = {};
    try {
      b = await req.json();
    } catch {}
    if (!passwordMatches(b.password)) {
      await sleep(1000); // slows down password guessing
      return json({ error: "Wrong password." }, 401);
    }
    return json({ token: signToken() });
  }

  if (!isAdmin(req)) return json({ error: "Not logged in." }, 401);
  const store = db();

  // ---- list all candidates ----
  if (route === "results" && req.method === "GET") {
    const { blobs } = await store.list({ prefix: "attempts/" });
    const rows = [];
    for (let i = 0; i < blobs.length; i += 40) {
      const chunk = await Promise.all(blobs.slice(i, i + 40).map((b) => store.get(b.key, { type: "json" })));
      rows.push(...chunk.filter(Boolean));
    }
    const now = Date.now();
    const list = rows
      .map((a) => ({
        id: a.id,
        name: a.candidate.name,
        mobile: a.candidate.mobile,
        email: a.candidate.email,
        vendor: a.candidate.vendor,
        city: a.candidate.city,
        startedAt: a.startedAt,
        submittedAt: a.submittedAt || null,
        // submitted | in_progress | not_submitted (time is over but no result received)
        state: a.status === "submitted" ? "submitted" : now < a.endsAt + CONFIG.graceSec * 1000 ? "in_progress" : "not_submitted",
        score: a.score ?? null,
        total: a.total,
        percent: a.percent ?? null,
        result: a.result || null,
        reason: a.reason || "",
        tabSwitches: a.tabSwitches ?? 0,
        timeTakenSec: a.timeTakenSec ?? null,
      }))
      .sort((x, y) => y.startedAt - x.startedAt);
    return json({ passPct: CONFIG.passPct, list });
  }

  // ---- one candidate in full detail ----
  if (route === "result" && req.method === "GET") {
    const id = String(url.searchParams.get("id") || "");
    if (!/^[0-9a-f-]{36}$/.test(id)) return json({ error: "Invalid id" }, 400);
    const a = await store.get("attempts/" + id, { type: "json" });
    if (!a) return json({ error: "Not found" }, 404);
    return json(a);
  }

  // ---- reset: delete a candidate so they can attempt again ----
  if (route === "reset" && req.method === "POST") {
    let b = {};
    try {
      b = await req.json();
    } catch {}
    const id = String(b.id || "");
    if (!/^[0-9a-f-]{36}$/.test(id)) return json({ error: "Invalid id" }, 400);
    const a = await store.get("attempts/" + id, { type: "json" });
    if (!a) return json({ error: "Not found" }, 404);
    await store.delete("attempts/" + id);
    await store.delete("papers/" + id);
    await store.delete(mobileKey(a.candidate.mobile));
    await store.delete(emailKey(a.candidate.email));
    return json({ ok: true });
  }

  return json({ error: "Not found" }, 404);
};
