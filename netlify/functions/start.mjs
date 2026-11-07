import crypto from "node:crypto";
import { db, json, emailKey, mobileKey, claim, safe } from "../lib/common.mjs";
import { CONFIG, buildPaper } from "../lib/questions.mjs";

export const config = { path: "/api/start" };

const clip = (v, n) => String(v ?? "").trim().slice(0, n);

export default safe(async (req) => {
  // GET = public exam settings (used to show the rules on the start page)
  if (req.method === "GET") {
    return json({
      total: CONFIG.total,
      durationSec: CONFIG.durationSec,
      passPct: CONFIG.passPct,
      maxViolations: CONFIG.maxViolations,
    });
  }
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  let body;
  try {
    body = await req.json();
  } catch {
    return json({ error: "Bad request" }, 400);
  }

  const c = {
    name: clip(body.name, 100),
    mobile: clip(body.mobile, 10),
    email: clip(body.email, 150),
    vendor: clip(body.vendor, 120),
    city: clip(body.city, 80),
  };
  if (Object.values(c).some((x) => !x)) return json({ error: "Please fill all fields." }, 400);
  if (!/^[6-9]\d{9}$/.test(c.mobile)) return json({ error: "Enter a valid 10-digit mobile number." }, 400);
  if (!/^\S+@\S+\.\S+$/.test(c.email)) return json({ error: "Enter a valid email." }, 400);

  const store = db();
  const id = crypto.randomUUID();

  // Claim the mobile number and the email (fails if either was used before).
  if (!(await claim(store, mobileKey(c.mobile), { id }))) {
    return json({ error: "This mobile number has already attempted the exam." }, 409);
  }
  if (!(await claim(store, emailKey(c.email), { id }))) {
    await store.delete(mobileKey(c.mobile)); // release the claim we just made
    return json({ error: "This email has already attempted the exam." }, 409);
  }

  const paper = buildPaper();
  const now = Date.now();
  const endsAt = now + CONFIG.durationSec * 1000;

  await store.setJSON("papers/" + id, paper);
  await store.setJSON("attempts/" + id, {
    id,
    candidate: c,
    startedAt: now,
    endsAt,
    status: "started",
    total: paper.length,
  });

  return json({
    attemptId: id,
    serverNow: now,
    endsAt,
    maxViolations: CONFIG.maxViolations,
    // correct answers are NOT sent
    questions: paper.map(({ correct, ...q }) => q),
  });
});
