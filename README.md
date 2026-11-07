# ISM Newspaper Zoning Exam – v2

## What changed
1. **Tab switching** – exam runs in full-screen. Leaving the exam (other tab, other window, exiting full-screen)
   shows a warning. At warning 3 the exam ends automatically and the candidate is DISQUALIFIED.
   (Change the limit: `maxViolations` in `netlify/lib/questions.mjs`.)
2. **Admin login** – open `https://YOUR-SITE.netlify.app/admin` (password = `ADMIN_PASSWORD`, see below).
   Search, filter, view every answer, tab-switch log, download CSV, Reset a candidate to allow a retake.
3. **Result storage** – results are saved in Netlify Blobs (built into Netlify, nothing to install or pay separately).
4. **Also fixed:** correct answers and scoring are now on the server (nobody can read them in View Source),
   one attempt per mobile number AND email is enforced on the server, refreshing no longer gives a new attempt,
   and the timer uses the server clock.

## Deploy (important)
This version has server functions, so **drag-and-drop of the folder will NOT work**. Use one of:
- **GitHub (easiest):** upload this folder to a GitHub repo -> Netlify > Add new site > Import from Git.
- **Netlify CLI:** `npm i -g netlify-cli`, then `netlify deploy --prod` in this folder.

Then, in Netlify: **Site configuration > Environment variables > Add variable**
- Key: `ADMIN_PASSWORD`   Value: a strong password only you know
and **redeploy** (Deploys > Trigger deploy). Without this variable the admin login cannot work.

## Where to change things
| What | File |
|---|---|
| Questions, number of questions, time, pass %, tab-switch limit | `netlify/lib/questions.mjs` |
| Exam page look / wording | `public/index.html` |
| Admin page | `public/admin.html` |

Question images go in `public/img/` and are used as `img/q_name.jpg`.
In the question bank, the **first option is always the correct one** (the server shuffles them).

## Notes
- Browsers cannot physically block tab switching; this system detects it, warns, records it, and ends the exam.
- iPhone/iPad Safari has no full-screen mode, so there only tab/app switches are detected.
- A candidate who refreshes or closes the page mid-exam cannot restart: use **Reset** in admin to allow a new attempt.
- Old results saved in Netlify Forms (v1) stay there; v2 does not use Netlify Forms.
