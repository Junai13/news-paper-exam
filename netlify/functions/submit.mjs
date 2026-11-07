import { db, json } from "../lib/common.mjs";
import { CONFIG } from "../lib/questions.mjs";

export const config = { path: "/api/submit" };

const publicResult = (a) => ({
  score: a.score,
  total: a.total,
  percent: a.percent,
  result: a.result,
  reason: a.reason || "",
});

export default async (req) => {
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  let body;
  try {
    body = await req.json();
  } catch {
    return json({ error: "Bad request" }, 400);
  }

  const id = String(body.attemptId || "");
  if (!/^[0-9a-f-]{36}$/.test(id)) return json({ error: "Invalid attempt." }, 400);

  const store = db();
  const a = await store.get("attempts/" + id, { type: "json" });
  if (!a) return json({ error: "Attempt not found." }, 404);

  // Safe to retry: if already submitted, return the stored result again.
  if (a.status === "submitted") return json(publicResult(a));

  const paper = await store.get("papers/" + id, { type: "json" });
  if (!paper) return json({ error: "Question paper not found." }, 404);

  const now = Date.now();
  const late = now > a.endsAt + CONFIG.graceSec * 1000;

  // Violations (tab switch / window blur / fullscreen exit) sent by the browser
  const violations = (Array.isArray(body.violations) ? body.violations : [])
    .slice(0, 50)
    .map((v) => ({ t: Number(v && v.t) || 0, type: String((v && v.type) || "tab").slice(0, 20) }));
  const disqualified = violations.length >= CONFIG.maxViolations;

  // Score on the server
  const given = Array.isArray(body.answers) ? body.answers : [];
  const answerLog = paper.map((q, i) => {
    const g = given[i];
    const chosenIdx = Number.isInteger(g) && g >= 0 && g < q.opts.length ? g : null;
    return {
      tag: q.tag,
      q: q.q,
      img: q.img,
      chosen: chosenIdx === null ? null : q.opts[chosenIdx],
      correct: q.opts[q.correct],
      ok: chosenIdx === q.correct,
    };
  });

  const total = paper.length;
  const score = late ? 0 : answerLog.filter((x) => x.ok).length;
  const percent = Math.round((score / total) * 100);

  let result, reason = "";
  if (disqualified) {
    result = "DISQUALIFIED";
    reason = "Tab / window switching (" + violations.length + " times)";
  } else if (late) {
    result = "FAIL";
    reason = "Submitted after the time limit";
  } else {
    result = percent >= CONFIG.passPct ? "PASS" : "FAIL";
  }

  const autoMode = ["time", "violations"].includes(body.auto) ? body.auto : "";
  const finishedAt = Math.min(now, a.endsAt);

  const saved = {
    ...a,
    status: "submitted",
    submittedAt: now,
    score,
    total,
    percent,
    result,
    reason,
    auto: autoMode, // "", "time" or "violations"
    late,
    tabSwitches: violations.length,
    violations,
    timeTakenSec: Math.max(0, Math.round((finishedAt - a.startedAt) / 1000)),
    answerLog,
  };

  await store.setJSON("attempts/" + id, saved);
  await store.delete("papers/" + id); // answers no longer needed

  return json(publicResult(saved));
};
